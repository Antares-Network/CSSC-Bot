import chalk from "chalk";
import { ICommand } from "wokcommands";
import { classModel, IClass } from "../../models/classModel";
import { create_default_embed } from "../../utils/util";
import { Schema, Types, Document } from "mongoose";

function cleanCompSciString(s: string): string {
  return s.toLowerCase().replace("compsci ", "cs");
}
export function isDupe(name: string): number {
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
      ROLE_NAME: { type: Boolean, require: true },
    });
    classModel.schema.add(oldSchema);

    for (let index = 0; index < courses.length; index++) {
      if (courses[index].get("CODE") != undefined) {
        let new_name = courses[index].CODE;
        const is_dupe = isDupe(new_name);
        // Add field determining if it is a duplicate
        if (is_dupe == -1) {
          // Not a dupe
          courses[index].set("DUPE", "false");
        } else {
          // A dupe
          courses[index].set("DUPE", "true");
          // Remove the number
          new_name = new_name.slice(0, is_dupe);
        }
        new_name = cleanCompSciString(new_name);
        courses[index].set("NAME", new_name);
        // Remove UUID
        console.log(chalk.yellow(`${courses[index].CODE}\t${new_name}`));
        // Remove CODE
        courses[index].set("CODE", undefined);
        //TODO: revise else
      }
      //Remove ROLE_NAME
      if (courses[index].get("ROLE_NAME") != undefined) {
        courses[index].set("ROLE_NAME", undefined);
      }
      // REMOVE UUID
      if (courses[index].get("UUID") != undefined) {
        courses[index].set("UUID", undefined);
      }
    }
    // Turn off validation to delete paths
    classModel.schema.set("validateBeforeSave", false);
    // Turn off strict to add field
    classModel.schema.set("strict", false);
    // Save all the docs
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
