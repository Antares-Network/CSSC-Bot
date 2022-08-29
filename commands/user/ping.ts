import { MessageEmbed, TextChannel } from "discord.js";
import { ICommand } from "wokcommands";
import chalk from "chalk";

export default {
  name: "ping",
  category: "user",
  description: "Sends the ping time of the bot.",
  slash: true,
  testOnly: false,
  guildOnly: true,
  requiredPermissions: ["SEND_MESSAGES"],

  callback: async ({ client, interaction }) => {
    // Embed values
    const color = "#0099ff";
    const title = "Bot/API Ping";
    const description = `Ping: 🏓 | Latency is: **${client.ws.ping}**ms.`;
    const footer = `Delivered in: ${client.ws.ping}ms | CSSC-bot | ${process.env.VERSION}`;
    const footerIcon = "https://playantares.com/resources/CSSC-bot/icon.jpg";

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
        )} used the ${chalk.green(`/ping`)} command in ${chalk.yellow(
          interaction.guild?.name
        )}`
      )
    );
  },
} as ICommand;
