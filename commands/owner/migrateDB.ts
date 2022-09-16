import chalk from "chalk";
import { ICommand } from "wokcommands";
import { classModel, IClass } from "../../models/classModel";
import { create_default_embed, sleep } from "../../utils/util";
import { Schema, Types, Document } from "mongoose";
import { getCourseName, cleanChannelString } from "../../utils/channelUtils";
import { cleanRoleString } from "../../utils/roleUtils";
import { Role, TextChannel } from "discord.js";
import Bottleneck from "bottleneck";

function cleanCompSciString(s: string): string {
  return s.toLowerCase().replace("compsci ", "cs");
}
function cleanCompSciTitle(s: string): string {
  return s
    .toLowerCase()
    .replace(/(advanced )?topics in computer science:/gim, "");
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
      ROLE_NAME: string;
    }
    const courses = (await classModel.find({})) as (Document<
      unknown,
      any,
      IOldClass
    > &
      IOldClass & { _id: Types.ObjectId })[];

    // Add old fields here
    const oldSchema = new Schema({
      CODE: { type: String, required: true },
      UUID: { type: Boolean, require: true },
      ROLE_NAME: { type: String, require: true },
    });
    classModel.schema.add(oldSchema);

    // Bottleneck to 50 calls per second to the discord api
    const limiter = new Bottleneck({ minTime: 1000 / 50 });

    const promises: (Promise<TextChannel> | Promise<Role>)[] = [];
    for (let index = 0; index < courses.length; index++) {
      const course = courses[index];
      // Remove CODE and replace with NAME
      const code = course.get("CODE");
      if (code != undefined) {
        let new_name = code;
        console.log(`Name: ${code}`);
        const is_dupe = isDupe(new_name);
        // Add field determining if it is a duplicate
        if (is_dupe == -1) {
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

      //Remove ROLE_NAME
      if (course.get("ROLE_NAME") != undefined) {
        course.set("ROLE_NAME", undefined);
      }
      // REMOVE UUID
      if (course.get("UUID") != undefined) {
        course.set("UUID", undefined);
      }

      //UPDATE CHANNEL
      if (course.CHANNEL_ID) {
        const channel = msgInt.guild.channels.cache.get(course.CHANNEL_ID);
        if (channel != undefined && channel.type == "GUILD_TEXT") {
          console.log(chalk.blue(`Old channel name: ${channel.name}`));
          const course_name = getCourseName(course);
          const new_name = cleanChannelString(getCourseName(course));
          if (new_name != channel.name) {
            console.log(chalk.yellow(`Course name: ${course_name}`));
            console.log(chalk.yellow(`Channel name: ${new_name}`));
            promises.push(limiter.schedule(() => channel.setName(new_name)));
            // await channel.setName(new_name);
            console.log(chalk.yellow(`Updated channel: ${channel.name}`));
          }
          if (channel.topic != course.TITLE) {
            promises.push(
              limiter.schedule(() => channel.setTopic(course.TITLE))
            );
            // await channel.setTopic(course.TITLE);
            console.log(
              chalk.yellow(`Updated channel topic: ${channel.topic}`)
            );
          }
        }
      }

      //UPDATE ROLE
      if (course.ROLE_ID) {
        const role = msgInt.guild.roles.cache.get(course.ROLE_ID);
        if (role != undefined) {
          const new_name = cleanRoleString(getCourseName(course));
          if (role.name != new_name) {
            promises.push(limiter.schedule(() => role.setName(new_name)));
          }
          // await role.setName(new_name);
          console.log(chalk.yellow(`Updated role: ${role.name}`));
        }
      }
    }

    console.log("Running all promises");
    // limiter.on("debug", function (message, data) {
    //   console.log(message);
    //   console.log(data);
    // });

    // Run all promises
    await Promise.all(promises);

    // // Update all channels
    // await Promise.all(channel_promises);
    // // Update all roles
    // await Promise.all(role_promises);

    // Turn off validation to delete paths
    classModel.schema.set("validateBeforeSave", false);
    // Turn off strict to add field
    classModel.schema.set("strict", false);
    // Save all the docs
    console.log("Saving DB");
    await classModel.bulkSave(courses);

    const title = "Migrate Database";
    let description = "Migrated Database";

    const embed = create_default_embed(client, title, description);
    await msgInt.editReply({ embeds: [embed] });

    console.log(chalk.yellow(description));

    // Log the command usage
    console.log(
      chalk.blue(
        `${chalk.green(`[COMMAND]`)} ${chalk.yellow(
          msgInt.user.tag
        )} used the ${chalk.green(
          `/csCreateChannels`
        )} command in ${chalk.yellow(msgInt.guild?.name)}`
      )
    );
  },
} as ICommand;
