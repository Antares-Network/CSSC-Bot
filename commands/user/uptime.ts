import chalk from "chalk";
import { MessageEmbed, TextChannel } from "discord.js";
import { ICommand } from "wokcommands";

export default {
  name: "uptime",
  category: "user",
  description: "Checks how long the bot has been online.",
  slash: true,
  testOnly: false,
  guildOnly: true,
  requiredPermissions: ["SEND_MESSAGES"],

  callback: ({ client, interaction }) => {
    // Command information
    const id = interaction.user.id;
    const chan = interaction.channel as TextChannel;

    // Computed values
    const time = client.uptime!;
    const days = Math.floor(time / 86400000);
    const hours = Math.floor(time / 3600000) % 24;
    const minutes = Math.floor(time / 60000) % 60;
    const seconds = Math.floor(time / 1000) % 60;

    // Embed values
    const color = "#0099ff";
    const title = "Bot Uptime";
    const description = `I have been online for ${days}d ${hours}h ${minutes}m ${seconds}s`;
    const footer = `Delivered in: ${client.ws.ping}ms | CSSC-bot | ${process.env.VERSION}`;
    const footerIcon = "https://playantares.com/resources/CSSC-bot/icon.jpg";

    // Embed construction
    const Embed = new MessageEmbed()
      .setColor(color)
      .setTitle(title)
      .setDescription(description)
      .setFooter({ text: footer, iconURL: footerIcon });

    // Return the embed
    interaction.reply({ embeds: [Embed] });

    // Log the command usage
    console.log(
      chalk.blue(
        `${chalk.green(`[COMMAND]`)} ${chalk.yellow(
          interaction.user.tag
        )} used the ${chalk.green(`/uptime`)} command in ${chalk.yellow(
          interaction.guild?.name
        )}`
      )
    );
  },
} as ICommand;
