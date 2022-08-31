import { MessageEmbed, MessageActionRow, MessageSelectMenu } from "discord.js";
import chalk from "chalk";
import { ICommand } from "wokcommands";
import classModel from "../../models/classModel";
import { checkForRoles } from "../../rolesOps";

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
		  msgInt.reply("Please run the `/ createRoles` command in this server to create the necessary roles for this poll!");
		  return
		}

		const classes = await classModel.find({});

		console.log(`Number of classes ${classes.length}`);

		const row = new MessageActionRow();
		const row2 = new MessageActionRow();
		let menu = new MessageSelectMenu(); //! this might need to be a `let`
		let menu2 = new MessageSelectMenu();
		row.addComponents(menu);
		row2.addComponents(menu2);
		menu.setCustomId(`csClassPoll+0`);
		menu2.setCustomId(`csClassPoll+1`);
		menu.setPlaceholder("Select an option");
		menu2.setPlaceholder("Select an option");

		while (menu.options.length <= 25) {
			console.log(menu.options.length);
			const label = classes[menu.options.length].CODE as string;
			const value = classes[menu.options.length].UUID as string;
			const description = classes[menu.options.length].TITLE as string;
			menu.addOptions({
				label: label,
				value: value,
				description: description,
			});
		}
		if (menu.options.length >= 25) {
			while (menu2.options.length < 25 && classes.length > menu2.options.length) {
				console.log(menu2.options.length);
				const label = classes[menu2.options.length + 24].CODE as string;
				const value = classes[menu2.options.length + 24].UUID as string;
				const description = classes[menu2.options.length + 24].TITLE as string;
				menu2.addOptions({
					label: label,
					value: value,
					description: description,
				});
			}
		}
		// Define embeds used in this command
		const infoEmbed = new MessageEmbed()
			.setTitle("Choose a role")
			.setColor("#0099ff")
			.setDescription("Select the option(s) with your current COMPSCI classes.")
			.setFooter({
				text: `Delivered in: ${client.ws.ping}ms | CSSC-Bot | ${process.env.VERSION}`,
				iconURL: "https://playantares.com/resources/CSSC-bot/icon.jpg",
			});

		if (menu2.options.length > 1) {
			msgInt.channel?.send({ embeds: [infoEmbed], components: [row] });
			msgInt.channel?.send({ content: "test", components: [row2] });
		} else {
			msgInt.channel?.send({ embeds: [infoEmbed], components: [row] });

			// Log the command usage
			console.log(
				chalk.blue(
					`${chalk.green(`[COMMAND]`)} ${chalk.yellow(msgInt.user.tag)} used the ${chalk.green(
						`/csclasspoll`
					)} command in ${chalk.yellow(msgInt.guild?.name)}`
				)
			);
		}
	},
} as ICommand;
