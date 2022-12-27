import { ICommand } from "wokcommands";
import { createRoles } from "../../utils/roles";
import chalk from "chalk";
import { classModel } from "../../models/classModel";
import { staffModel } from "../../models/staffModel";
import { yearModel } from "../../models/yearModel";

export default {
  name: "createRoles",
  category: "owner",
  description: "Creates roles if they do not exist in the server",
  slash: true,
  testOnly: false,
  guildOnly: true,
  requiredPermissions: ["MANAGE_GUILD", "MANAGE_ROLES"],
  ownerOnly: true,

  callback: async ({ client, interaction: msgInt }) => {
    console.log(chalk.green("Creating roles..."));
    console.log(
      chalk.red("------------------------------------------------------")
    );
    if (msgInt.guild === null) {
      return;
    }
    await msgInt.deferReply({ ephemeral: true });

    // Create the roles
    await createRoles(msgInt.guild, classModel);
    await createRoles(msgInt.guild, staffModel);
    await createRoles(msgInt.guild, yearModel);
    msgInt.editReply({
      content: "Roles created!",
    });

    // Log the command usage
    console.log(
      chalk.blue(
        `${chalk.green(`[COMMAND]`)} ${chalk.yellow(
          msgInt.user.tag
        )} used the ${chalk.green(`/createRoles`)} command in ${chalk.yellow(
          msgInt.guild?.name
        )}`
      )
    );
  },
} as ICommand;
