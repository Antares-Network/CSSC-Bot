import chalk from "chalk";
import { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageSelectOptionData } from "discord.js";
import { ICommand } from "wokcommands";
import { checkForRoles } from "../../rolesOps";
import classes from "../../data/COMPSCI-Fall-Class-List.json"
import { generate } from 'short-uuid';
export interface Class {
  code: string,
  title: string,
  info: string
}

export default {
  name: "csClassPoll",
  category: "owner",
  description: "Posts the Cs Class Poll",
  slash: true,
  testOnly: false,
  guildOnly: true,
  requiredPermissions: ["MANAGE_GUILD", "MANAGE_ROLES"],
  ownerOnly: true,

  callback: async ({ client, interaction: msgInt }) => {
    // Log the command usage
    console.log(
      chalk.blue(
        `${chalk.green(`[COMMAND]`)} ${chalk.yellow(msgInt.user.tag)} used the ${chalk.green(`/csclasspoll`)} command in ${chalk.yellow(
          msgInt.guild?.name
        )
        }`
      )
    );

    // Crashes the call
    // if (!checkForRoles(msgInt.guild!, 2)) {
    //   msgInt.reply("Please run the `/ createRoles` command in this server to create the necessary roles for this poll!");
    //   return
    // }

    console.log(`Number of classes ${classes.length}`)

    // split classes into chunks of 25
    let class_chunks: Class[][] = split_list(classes, 25)

    //TODO: remove logging
    console.log(`Number of chunks: ${class_chunks.length}`)
    //TODO: remove logging
    class_chunks.forEach(
      (class_chunk, index) => {
        console.log(`Chunk#: ${index},\nChunk length: ${class_chunk.length}`)
      }
    )

    // Create menus from chunks
    let menus: MessageSelectMenu[] = []
    class_chunks.forEach(
      (class_chunk, index) => {
        let menu = new MessageSelectMenu()
        menu.setCustomId(`csClassPoll+${index}`)
        menu.setPlaceholder("Select an option")
        // create a new list of options from the classes and add to menu
        menu.addOptions(class_chunk.map(create_option_from_class))
        menus.push(menu)
      }
    )

    menus.forEach(
      (menu_chunk, index) => {
        let row = new MessageActionRow()
        row.addComponents(menu_chunk)

        console.log(`Row: ${row.components}`)
        console.log(`Index: ${index}`)

        // Define embeds used in this command
        const infoEmbed = new MessageEmbed()
          .setTitle("Choose a role")
          .setColor("#0099ff")
          .setDescription("Select the option(s) with your current COMPSCI classes.")
          .setFooter({
            text: `Delivered in: ${client.ws.ping}ms | CSSC-Bot | ${process.env.VERSION}`,
            iconURL: "https://playantares.com/resources/CSSC-bot/icon.jpg",
          });

        if (index == 0) {
          msgInt.reply({ embeds: [infoEmbed], components: [row] });
        }
        else {
          msgInt.channel!.send({ components: [row] });
        }
      }
    )

  },
} as ICommand;

function split_list(list: Array<any>, max_list_len: number) {
  // Should split any size list into lists of at most `max_list_len`
  let class_chunks = []
  for (let i = 0; i < list.length; i += max_list_len) {
    class_chunks.push(list.slice(i, i + max_list_len))

  }
  return class_chunks
}

function create_option_from_class(_class: Class): MessageSelectOptionData {
  if (_class.code.length > 100) {
    console.log("\n")
    console.log("TOO_LONG: class code")
    console.log(_class)
    console.log("\n")

  }

  return {
    label: _class.code,
    value: generate(),
    description: _class.title,
  }
}

