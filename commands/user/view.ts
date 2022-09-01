import chalk from "chalk";
import { GuildMember } from "discord.js";
import { ICommand } from "wokcommands";
import { getUsersRoles } from "../../rolesOps";

export default {
  name: "view",
  category: "user",
  description: "Shows a list of all roles that I have assigned to you",
  slash: true,
  testOnly: false,
  guildOnly: true,
  requiredPermissions: ["SEND_MESSAGES"],

  callback: async ({ interaction }) => {
    // Remove roles from user
    if (!interaction.member) return;
    const list = await getUsersRoles(interaction.member as GuildMember);

    // Reply to the user
    if (list === "") {
      interaction.reply({
        content: "You don't have any College roles assigned to you.",
        ephemeral: true,
      });
    } else {
      interaction.reply({
        content: "**Your roles:**\n" + list,
        ephemeral: true,
      });
    }

    // Log the command usage
    console.log(
      chalk.blue(
        `${chalk.green(`[COMMAND]`)} ${chalk.yellow(
          interaction.user.tag
        )} used the ${chalk.green(`/view`)} command in ${chalk.yellow(
          interaction.guild?.name
        )}`
      )
    );
  },
} as ICommand;
