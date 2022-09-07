import chalk from "chalk";
import { MessageEmbed, MessageActionRow, MessageSelectMenu } from "discord.js";
import { ICommand } from "wokcommands";
import { checkForRoles } from "../../utils/roleUtils";

export default {
  name: "yearPoll",
  category: "owner",
  description: "Posts the College Year Poll",
  slash: true,
  testOnly: false,
  guildOnly: true,
  requiredPermissions: ["MANAGE_GUILD", "MANAGE_ROLES"],
  ownerOnly: true,

  callback: async ({ client, interaction: msgInt }) => {
    // Define embeds used in this command
    const infoEmbed = new MessageEmbed()
      .setTitle("Choose a role")
      .setColor("#0099ff")
      .setDescription("Select the button with your current college year.")
      .setFooter({
        text: `Delivered in: ${client.ws.ping}ms | CSSC-Bot | ${process.env.VERSION}`,
        iconURL: "https://playantares.com/resources/CSSC-bot/icon.jpg",
      });

    // Create row one of the buttons for the poll
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("collegeYearPoll")
        .setPlaceholder("Select an option.")
        .addOptions(
          {
            label: "Prefrosh",
            value: "Prefrosh",
          },
          {
            label: "Freshman",
            value: "Freshman",
          },
          {
            label: "Sophomore",
            value: "Sophomore",
          },
          {
            label: "Junior",
            value: "Junior",
          },
          {
            label: "Senior",
            value: "Senior",
          },
          {
            label: "Grad Student",
            value: "Graduatestudent",
          },
          {
            label: "Alumni",
            value: "Alumni",
          },
          {
            label: "None",
            value: "None",
            description: "Clear all year roles",
          }
        )
    );

    if (msgInt.guild === null) {
      console.log(chalk.red("No guild"));
      return;
    }
    // Send the embed and message component rows
    if (!(await checkForRoles(msgInt.guild))) {
      await msgInt.reply({
        content:
          "Please run the /createRoles command in this server to create the necessary roles for this poll!",
        ephemeral: true,
      });
    } else {
      await msgInt.reply({ embeds: [infoEmbed], components: [row] });
    }

    // Log the command usage
    console.log(
      chalk.blue(
        `${chalk.green(`[COMMAND]`)} ${chalk.yellow(
          msgInt.user.tag
        )} used the ${chalk.green(`/yearPoll`)} command in ${chalk.yellow(
          msgInt.guild?.name
        )}`
      )
    );
  },
} as ICommand;
