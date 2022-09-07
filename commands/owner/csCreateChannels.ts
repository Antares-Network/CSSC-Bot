import { MessageEmbed } from "discord.js";

import chalk from "chalk";
import { ICommand } from "wokcommands";
import { classModel } from "../../models/classModel";
import { checkForChannel, createTextChannel } from "../../utils/channelUtils";

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

    const classes = await classModel.find({}).sort({ CODE: 1 });

    for (let index = 0; index < classes.length; index++) {
      const channel = await checkForChannel(msgInt.guild, classes[index].CODE);

      if (channel === undefined) {
        const new_channel = await createTextChannel(
          msgInt.guild,
          classes[index].CODE,
          classes[index].INFO
        );
      } else {
      }
    }

    const infoEmbed = new MessageEmbed()
      .setTitle("Created Classes")
      .setColor("#0099ff")
      .setDescription(`Populated ${msgInt.guild.name} with COMPSCI classes.`)
      .setFooter({
        text: `Delivered in: ${client.ws.ping}ms | CSSC-Bot | ${process.env.VERSION}`,
        iconURL: "https://playantares.com/resources/CSSC-bot/icon.jpg",
      });

    msgInt.reply({ embeds: [infoEmbed] });

    // Log the command usage
    console.log(
      chalk.blue(
        `${chalk.green(`[COMMAND]`)} ${chalk.yellow(
          msgInt.user.tag
        )} used the ${chalk.green(`/csclasspoll`)} command in ${chalk.yellow(
          msgInt.guild?.name
        )}`
      )
    );
  },
} as ICommand;
