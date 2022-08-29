import chalk from "chalk";
import { MessageEmbed } from "discord.js";
import { ICommand } from "wokcommands";

export default {
  name: "help",
  category: "user",
  description: "Shows the help embed",
  slash: true,
  testOnly: false,
  guildOnly: true,
  requiredPermissions: ["SEND_MESSAGES"],

  callback: async ({ client, interaction }) => {
    const color = "#0099ff";
    const thumbnail =
      "https://playantares.com/resources/CSSC-bot/cssc-server-icon.png";
    const title = "Github";
    const description =
      "Welcome to CSSC-Bot! My purpose in this server is to make sure you have the correct roles for this server. My purpose mey evolve over time. You can always use this command to see my latest features.";
    const fields = [
      {
        name: "User Commands",
        value:
          "**/help** - Shows this help embed\n" +
          "**/github** - Shows the official GitHub repository for this bot.\n" +
          "**/view** - Shows a list of all roles that I have assigned to you\n" +
          "**/clear** - Removes all roles that I have assigned to you\n" +
          "**/uptime** - Shows how long I have been online\n" +
          "**/status** - Shows the status of the bot",
      },
      {
        name: "Admin Commands",
        value:
          "**/createRoles** - Creates the roles that will be used in the server and in polls\n" +
          "**/staffpoll** - Creates a poll for staff role choosing\n" +
          "**/yearpoll** - Creates a poll for year role choosing\n",
      },
      {
        name: "Features",
        value:
          "**College Student Roles** - Assigns the correct role for your year in school.\n" +
          "**College Employee Roles** - Assigns the correct role for your job title.",
      },
    ];
    const footer = `Delivered in: ${client.ws.ping}ms | CSSC-bot | ${process.env.VERSION}`;
    const footerIcon = "https://playantares.com/resources/CSSC-bot/icon.jpg";

    const Embed = new MessageEmbed()
      .setColor(color)
      .setTitle(title)
      .setThumbnail(thumbnail)
      .setDescription(description)
      .addFields(fields)
      .setFooter({ text: footer, iconURL: footerIcon });
    interaction.reply({ embeds: [Embed] });

    // Log the command usage
    console.log(
      chalk.blue(
        `${chalk.green(`[COMMAND]`)} ${chalk.yellow(
          interaction.user.tag
        )} used the ${chalk.green(`/help`)} command in ${chalk.yellow(
          interaction.guild?.name
        )}`
      )
    );
  },
} as ICommand;
