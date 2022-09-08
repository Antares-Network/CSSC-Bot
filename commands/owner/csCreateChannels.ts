import { MessageEmbed } from "discord.js";

import chalk from "chalk";
import { ICommand } from "wokcommands";
import { classModel } from "../../models/classModel";
import {
  checkForChannel,
  createTextChannel,
  moveChannel,
} from "../../utils/channelUtils";

export default {
  name: "csCreateChannels",
  category: "owner",
  description: "Update CS class channels",
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
    const thumbnail =
      "https://playantares.com/resources/CSSC-bot/cssc-server-icon.png";
    const title = "Create Classes";
    const description = `Populated ${msgInt.guild.name} with COMPSCI classes.`;
    const footer = `Delivered in: ${client.ws.ping}ms | CSSC-bot | ${process.env.VERSION}`;
    const footerIcon = "https://playantares.com/resources/CSSC-bot/icon.jpg";

    // Embed construction
    const embed = new MessageEmbed()
      .setColor(color)
      .setTitle(title)
      .setThumbnail(thumbnail)
      .setDescription(description)
      .setFooter({ text: footer, iconURL: footerIcon });

    const classes = await classModel.find({}).sort({ CODE: 1 });

    for (let index = 0; index < classes.length; index++) {
      const channel = await checkForChannel(msgInt.guild, classes[index].CODE);

      if (channel === undefined || channel.type !== "GUILD_TEXT") {
        const new_channel = await createTextChannel(
          msgInt.guild,
          classes[index].CODE,
          classes[index].INFO
        );

        console.log(
          chalk.yellow(
            `Created channel: ${new_channel.name} in guild ${msgInt.guild.name}`
          )
        );

        moveChannel(msgInt.guild, new_channel, "COMP SCI CLASSES");
        //TODO: Write channel id to db
      } else {
        moveChannel(msgInt.guild, channel, "COMP SCI CLASSES");
        //Confirm channel ID is in db
      }
    }

    await msgInt.reply({ embeds: [embed], ephemeral: true });

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
