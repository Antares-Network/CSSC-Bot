import chalk from "chalk";
import { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageActionRowComponent } from "discord.js";
import { ICommand } from "wokcommands";
import { checkForRoles } from "../../rolesOps";
import csClassOptions from "../../csClasses";

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
		// Define embeds used in this command
		const infoEmbed = new MessageEmbed()
			.setTitle("Choose a role")
			.setColor("#0099ff")
			.setDescription("Select the option(s) with your current COMPSCI classes.")
			.setFooter({
				text: `Delivered in: ${client.ws.ping}ms | CSSC-Bot | ${process.env.VERSION}`,
				iconURL: "https://playantares.com/resources/CSSC-bot/icon.jpg",
			});


			// Create some vars
			let csClassOptionsChunks = [];
			let lessThan25Row = new MessageActionRow()
			let greaterThan25RowList: MessageActionRowComponent[] = [];

			// Check if csClassOptions is larger than 25 items
			if (csClassOptions.length > 25) {
				// Split csClassOptions into chunks of 25
				for (let i = 0; i < csClassOptions.length; i += 25) {
					csClassOptionsChunks.push(csClassOptions.slice(i, i + 25));
					console.log(csClassOptions.slice(i, i + 25)) //! DEBUG
					console.log("got here")  //! DEBUG
				}
			}
			// Loop through csClassOptionsChunks
			for (let i = 0; i < csClassOptionsChunks.length; i++) {
				// Loop through csClassOptionsChunks[i]
				let menu = new MessageSelectMenu()
				menu.setCustomId(`csClassPoll+${i}`)
				console.log(`csClassPoll+${i}`) //! DEBUG
				menu.setPlaceholder("Select an option")
				lessThan25Row.addComponents(menu);
				for (let j = 0; j < csClassOptionsChunks[i].length; j++) {
					// Create row one of the buttons for the poll
					menu.addOptions(
						{
							label: csClassOptionsChunks[i][j].label,
							value: csClassOptionsChunks[i][j].label,
							description: csClassOptionsChunks[i][j].description,
						}
					)
				}
				greaterThan25RowList.push(menu);
			}


			// Check if greaterThan25RowList contains any items, and if it does, loop through greaterThan25RowList
			if (greaterThan25RowList.length > 0) {

				// console.log(greaterThan25RowList) //! DEBUG
				
				for (let i = 0; i < greaterThan25RowList.length; i++) {
					// Loop through greaterThan25RowList[i]
					let row = new MessageActionRow()
					row.addComponents(greaterThan25RowList[i])
					msgInt.channel!.send({ embeds: [infoEmbed], components: [row]  });
				}
			} else {
				msgInt.reply({ embeds: [infoEmbed], components: [lessThan25Row] });
			}



		
	

		// Send the embed and message component rows
		// rows.forEach((row) => {
		// 	msgInt.reply({ embeds: [infoEmbed], components: [row] });
		// });


		// if (!checkForRoles(msgInt.guild!, 2)) {
		// 	msgInt.reply("Please run the `/createRoles` command in this server to create the necessary roles for this poll!");
		// } else {
		// 	rows.forEach((row) => {
		// 		msgInt.reply({ embeds: [infoEmbed], components: [row] });
		// 	});
		// }

		// Log the command usage
		console.log(
			chalk.blue(
				`${chalk.green(`[COMMAND]`)} ${chalk.yellow(msgInt.user.tag)} used the ${chalk.green(`/csclasspoll`)} command in ${chalk.yellow(
					msgInt.guild?.name
				)}`
			)
		);
	},
} as ICommand;
