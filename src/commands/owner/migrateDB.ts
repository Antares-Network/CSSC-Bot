import chalk from "chalk";
import { ICommand } from "wokcommands";
import { classModel, IClass } from "../../models/classModel";
import { create_default_embed } from "../../../utils/embeds";
import { Schema, Types, Document } from "mongoose";
import {
  getCourseName,
  cleanChannelString,
  getTopic,
} from "../../utils/channels";
import { cleanRoleString } from "../../utils/roles";
import Bottleneck from "bottleneck";

function cleanCompSciString(s: string): string {
  return s.toLowerCase().replace("compsci ", "cs").trim();
}
function cleanCompSciTitle(s: string): string {
  return s.replace(/(?<>advanced )?topics in computer science:/gim, "").trim();
}
function isDupe(name: string): number {
  return name.search(/\(\d\)/);
}
export default {
  name: "migrateDb",
  category: "owner",
  description: "Migrate Database from an old format to a new format",
  slash: true,
  testOnly: false,
  guildOnly: true,
  requiredPermissions: ["MANAGE_GUILD", "MANAGE_ROLES"],
  ownerOnly: true,

  callback: async ({ client, interaction: msgInt }) => {
    if (msgInt.guild === null) {
      console.log(chalk.red("No guild"));
      return;
    }

    await msgInt.deferReply({ ephemeral: true });

    interface IOldClass extends IClass {
      CODE: string;
      UUID: string;
    }
    const courses = (await classModel.find({})) as (Document<IOldClass> &
      IOldClass & { _id: Types.ObjectId })[];

    // Add old fields here
    const oldSchema = new Schema({
      CODE: { type: String, required: true },
      UUID: { type: Boolean, require: true },
    });
    classModel.schema.add(oldSchema);

    // Bottleneck to 50 calls per second to the discord api
    const limiter = new Bottleneck({ minTime: 1000 / 50 });

    for (let index = 0; index < courses.length; index++) {
      const course = courses[index];
      // Remove CODE and replace with NAME
      const code = course.get("CODE");
      if (code !== undefined) {
        let new_name = code;
        console.log(`Name: ${code}`);
        const is_dupe = isDupe(new_name);
        // Add field determining if it is a duplicate
        if (is_dupe === -1) {
          // Not a dupe
          course.set("DUPE", "false");
        } else {
          // A dupe
          course.set("DUPE", "true");
          // Remove the number
          new_name = new_name.slice(0, is_dupe);
        }
        new_name = cleanCompSciString(new_name);
        course.set("NAME", new_name);
        // Remove UUID
        console.log(chalk.yellow(`${code}\t${new_name}`));
        // Remove CODE
        course.set("CODE", undefined);
        //TODO: revise else
      }
      //Clean TITLE
      course.TITLE = cleanCompSciTitle(course.TITLE);

      // Udate ROLE_NAME
      course.ROLE_NAME = cleanRoleString(getCourseName(course));

      // REMOVE UUID
      if (course.get("UUID") !== undefined) {
        course.set("UUID", undefined);
      }

      //UPDATE CHANNEL
      if (course.CHANNEL_ID) {
        const channel = msgInt.guild.channels.cache.get(course.CHANNEL_ID);
        if (channel !== undefined && channel.type === "GUILD_TEXT") {
          const new_name = cleanChannelString(getCourseName(course));
          //Update Channel Name
          if (new_name !== channel.name) {
            console.log(chalk.yellow(`Old channel name: ${channel.name}`));
            await limiter
              .schedule(() => channel.setName(new_name))
              .then((newChannel) =>
                console.log(
                  chalk.blue(`Channel's new name: ${newChannel.name}`)
                )
              )
              .catch(console.error);
          }
          //Update Channel Topic
          const new_topic = getTopic(courses[index]);
          if (`${channel.topic}` !== new_topic) {
            console.log(chalk.yellow(`Channel's old topic: ${channel.topic}`));
            await limiter
              .schedule(() => channel.setTopic(new_topic))
              .then((print_channel) => {
                console.log(
                  chalk.blue(`Channel's new topic: ${print_channel.topic}`)
                );
              })
              .catch(console.error);
          }
        }
      }

      //UPDATE ROLE
      if (course.ROLE_ID) {
        const role = msgInt.guild.roles.cache.get(course.ROLE_ID);
        if (role !== undefined) {
          const new_name = cleanRoleString(getCourseName(course));
          if (role.name !== new_name) {
            console.log(chalk.yellow(`Role's old name: ${role.name}`));
            await limiter
              .schedule(() => role.setName(new_name))
              .then((print_role) => {
                console.log(chalk.blue(`Role's new name: ${print_role.name}`));
              })
              .catch(console.error);
            await role.setName(new_name);
          }
        }
      }
    }

    // Turn off validation to delete paths
    classModel.schema.set("validateBeforeSave", false);
    // Turn off strict to add field
    classModel.schema.set("strict", false);
    // Save all the docs
    console.log("Saving DB");
    await classModel.bulkSave(courses);

    const title = "Migrate Database";
    const description = "Migrated Database";

    const embed = create_default_embed(client, title, description);
    await msgInt.editReply({ embeds: [embed] });

    console.log(chalk.yellow(description));

    // Log the command usage
    console.log(
      chalk.blue(
        `${chalk.green(`[COMMAND]`)} ${chalk.yellow(
          msgInt.user.tag
        )} used the ${chalk.green(`/migrateDB`)} command in ${chalk.yellow(
          msgInt.guild?.name
        )}`
      )
    );
  },
} as ICommand;
