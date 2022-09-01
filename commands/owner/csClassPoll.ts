import {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";
import chalk from "chalk";
import { ICommand } from "wokcommands";
import classModel from "../../models/classModel";
import { checkForRoles } from "../../rolesOps";

export interface Class {
  CODE: string;
  TITLE: string;
  INFO: string;
  ROLE_NAME: string;
  ROLE_ID: string;
  UUID: string;
}

export default {
  name: "csClassPoll",
  category: "owner",
  description: "Posts the CS Class Poll",
  slash: true,
  testOnly: false,
  guildOnly: true,
  requiredPermissions: ["MANAGE_GUILD", "MANAGE_ROLES"],
  ownerOnly: true,

  callback: async ({ client, interaction: msgInt }) => {
    if (!checkForRoles(msgInt.guild!)) {
      msgInt.reply(
        "Please run the `/ createRoles` command in this server to create the necessary roles for this poll!"
      );
      return;
    }

    let classes: Class[] = await classModel.find({}).sort({ CODE: 1 });
    const class_chunks = split_list(classes, 25);

    let rows: MessageActionRow[] = [];
    for (let index = 0; index < class_chunks.length; index++) {
      const menu = new MessageSelectMenu();
      menu.setCustomId(`csClassPoll+${index}`);
      // menu.setMinValues(1); //!Add this later when the bot is able to handle multiple selections at once
      // menu.setMaxValues(10);
      menu.setPlaceholder("Select an option");
      // create a new list of options from the classes and add to menu
      menu.addOptions(class_chunks[index].map(create_option_from_class));

      // Add single message to action row
      const row = new MessageActionRow();
      row.addComponents(menu);
      rows.push(row);
    }

    const row_chunks = split_list(rows, 5);
    for (let index = 0; index < row_chunks.length; index++) {
      if (index == 0) {
        // Define embeds used in this command
        const infoEmbed = new MessageEmbed()
          .setTitle("Choose a role")
          .setColor("#0099ff")
          .setDescription(
            "Select the option(s) with your current COMPSCI classes."
          )
          .setFooter({
            text: `Delivered in: ${client.ws.ping}ms | CSSC-Bot | ${process.env.VERSION}`,
            iconURL: "https://playantares.com/resources/CSSC-bot/icon.jpg",
          });

        msgInt.reply({ embeds: [infoEmbed], components: row_chunks[index] });
      } else {
        msgInt.channel!.send({ components: row_chunks[index] });
      }
      // await on a new promise that resolves itself after a delay of 200 ms
      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
    }

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

// Splits any size list into lists of at most `max_list_len`
function split_list(list: Array<any>, max_list_len: number) {
  let class_chunks = [];
  for (let i = 0; i < list.length; i += max_list_len) {
    class_chunks.push(list.slice(i, i + max_list_len));
  }
  return class_chunks;
}

// consumes a Class and returns Message Selec tOption data
function create_option_from_class(_class: Class): MessageSelectOptionData {
  return {
    label: _class.CODE,
    value: _class.CODE,
    description: _class.TITLE,
  };
}
