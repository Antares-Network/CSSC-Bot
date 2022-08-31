import { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageSelectOptionData } from "discord.js";
import chalk from "chalk";
import { ICommand } from "wokcommands";
import classModel from "../../models/classModel";
import { checkForRoles } from "../../rolesOps";

export interface Class {
  CODE: string,
  TITLE: string,
  INFO: string,
  ROLE_NAME: string,
  ROLE_ID: string,
  UUID: string,
}

export default {
  name: "csclasstest",
  category: "owner",
  description: "Posts the Cs Class Poll",
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

    let classes: Class[] = await classModel.find({});
		// TODO: See if sorting can be done by mongodb
    classes = classes.sort((a, b) => {
      const codeA = a.CODE.toUpperCase();
      const codeB = b.CODE.toUpperCase();
      if (codeA < codeB) {
        return -1;
      }
      if (codeB < codeA) {
        return 1;
      }
      return 0;
    });

    console.log(`Number of classes ${classes.length}`);

    const class_chunks = split_list(classes, 25);

    //TODO: remove logging
    console.log(`Number of chunks: ${class_chunks.length}`);
    //TODO: remove logging
    class_chunks.forEach((class_chunk, index) => {
      console.log(`Chunk: ${index + 1},\t length: ${class_chunk.length}`);
    });
    class_chunks.forEach((class_chunk, index) => {
      const menu = new MessageSelectMenu();
      menu.setCustomId(`csClassPoll+${index}`);
      menu.setPlaceholder("Select an option");
      // create a new list of options from the classes and add to menu
      menu.addOptions(class_chunk.map(create_option_from_class));

      // Add single message to action row
      const row = new MessageActionRow();
      row.addComponents(menu);

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

        msgInt.reply({ embeds: [infoEmbed], components: [row] });
      } else {
        msgInt.channel!.send({ components: [row] });
      }
    });

    // const row = new MessageActionRow();
    // const row2 = new MessageActionRow();
    // let menu = new MessageSelectMenu(); //! this might need to be a `let`
    // let menu2 = new MessageSelectMenu();
    // row.addComponents(menu);
    // row2.addComponents(menu2);
    // menu.setCustomId(`csClassPoll+0`);
    // menu2.setCustomId(`csClassPoll+1`);
    // menu.setPlaceholder("Select an option");
    // menu2.setPlaceholder("Select an option");

    // while (menu.options.length <= 25) {
    // 	console.log(menu.options.length);
    // 	const label = classes[menu.options.length].CODE as string;
    // 	const value = classes[menu.options.length].UUID as string;
    // 	const description = classes[menu.options.length].TITLE as string;
    // 	menu.addOptions({
    // 		label: label,
    // 		value: value,
    // 		description: description,
    // 	});
    // }
    // if (menu.options.length >= 25) {
    // 	while (menu2.options.length < 25 && classes.length > menu2.options.length) {
    // 		console.log(menu2.options.length);
    // 		const label = classes[menu2.options.length + 24].CODE as string;
    // 		const value = classes[menu2.options.length + 24].UUID as string;
    // 		const description = classes[menu2.options.length + 24].TITLE as string;
    // 		menu2.addOptions({
    // 			label: label,
    // 			value: value,
    // 			description: description,
    // 		});
    // 	}
    // }
    // // Define embeds used in this command
    // const infoEmbed = new MessageEmbed()
    // 	.setTitle("Choose a role")
    // 	.setColor("#0099ff")
    // 	.setDescription("Select the option(s) with your current COMPSCI classes.")
    // 	.setFooter({
    // 		text: `Delivered in: ${client.ws.ping}ms | CSSC-Bot | ${process.env.VERSION}`,
    // 		iconURL: "https://playantares.com/resources/CSSC-bot/icon.jpg",
    // 	});

    // if (menu2.options.length > 1) {
    // 	msgInt.channel?.send({ embeds: [infoEmbed], components: [row] });
    // 	msgInt.channel?.send({ content: "test", components: [row2] });
    // } else {
    // 	msgInt.channel?.send({ embeds: [infoEmbed], components: [row] });
    // }

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
  let class_chunks = []
  for (let i = 0; i < list.length; i += max_list_len) {
    class_chunks.push(list.slice(i, i + max_list_len))

  }
  return class_chunks
}

// consumes a Class and returns Message Selec tOption data
function create_option_from_class(_class: Class): MessageSelectOptionData {
  return {
    label: _class.CODE,
    value: _class.UUID,
    description: _class.TITLE,
  }
}

