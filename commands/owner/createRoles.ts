import { ICommand } from "wokcommands";
import { createRoles } from "../../rolesOps";
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

  callback: async ({ interaction }) => {
    console.log(chalk.green("Creating roles..."));
    console.log(
      chalk.red("------------------------------------------------------")
    );
    // Create the roles
    createRoles(interaction.guild!, classModel);
    createRoles(interaction.guild!, staffModel);
    createRoles(interaction.guild!, yearModel);
    interaction.reply({
      content: "Roles created!",
      ephemeral: true,
    });

    // Log the command usage
    console.log(
      chalk.blue(
        `${chalk.green(`[COMMAND]`)} ${chalk.yellow(
          interaction.user.tag
        )} used the ${chalk.green(`/yearPoll`)} command in ${chalk.yellow(
          interaction.guild?.name
        )}`
      )
    );
  },
} as ICommand;
