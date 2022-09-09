import { MessageEmbed } from "discord.js";

import chalk from "chalk";
import { ICommand } from "wokcommands";

export default {
  name: "deleteAllChannels",
  category: "owner",
  description: "Delete all channels not named general or banshee",
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

    const color = "#0099ff";
    const thumbnail = "";
    const title = "Delete all channels";
    const description = `deleted channels`;
    const footer = `Delivered in: ${client.ws.ping}ms | CSSC-bot | ${process.env.VERSION}`;
    const footerIcon = "";

    // Embed construction
    const embed = new MessageEmbed()
      .setColor(color)
      .setTitle(title)
      .setThumbnail(thumbnail)
      .setDescription(description)
      .setFooter({ text: footer, iconURL: footerIcon });

    await msgInt.deferReply({ ephemeral: true });

    msgInt.guild.channels.cache.forEach((channel) => {
      if (
        !(
          channel == undefined ||
          channel?.name == "general" || // Channels and categories to keep
          channel?.name == "banshee"
        )
      ) {
        console.log(`Deleted channel: ${channel?.name}`);
        channel.delete();
      }
    });

    await msgInt.editReply({ embeds: [embed] });

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
