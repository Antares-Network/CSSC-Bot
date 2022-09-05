import chalk from "chalk";
import { GuildMember } from "discord.js";
import { ICommand } from "wokcommands";
import { classModel } from "../../models/classModel";
import { staffModel } from "../../models/staffModel";
import { yearModel } from "../../models/yearModel";
import { removeRole } from "../../rolesOps";

export default {
  name: "clear",
  category: "user",
  description: "removes all roles the bot has assigned to a user",
  slash: true,
  testOnly: false,
  guildOnly: true,
  requiredPermissions: ["SEND_MESSAGES"],

  callback: async ({ interaction }) => {
    // Remove roles from user
    if (!interaction.member) return;
    const member = interaction.member as GuildMember;
    removeRole(member, classModel);
    removeRole(member, yearModel);
    removeRole(member, staffModel);
    // Reply to the user
    interaction.reply({
      content: "Cleared all roles that I have assigned to you.",
      ephemeral: true,
    });

    // Log the command usage
    console.log(
      chalk.blue(
        `${chalk.green(`[COMMAND]`)} ${chalk.yellow(
          interaction.user.tag
        )} used the ${chalk.green(`/clear`)} command in ${chalk.yellow(
          interaction.guild?.name
        )}`
      )
    );
  },
} as ICommand;
