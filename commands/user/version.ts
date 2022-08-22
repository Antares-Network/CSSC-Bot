import { MessageEmbed, TextChannel } from "discord.js";
import { ICommand } from "wokcommands";
import chalk from "chalk";

export default {
	name: "version",
	category: "user",
	description: "Sends the version number of the bot",
	slash: true,
	guildOnly: true,
	requiredPermissions: ["SEND_MESSAGES"],

	callback: async ({ client, interaction }) => {
		// Embed values
		const color = "#0099ff";
		const title = "Bot Version:";
		const description = `I am running version: ${process.env.VERSION}`;
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
				`${chalk.green(`[COMMAND]`)} ${chalk.yellow(interaction.user.tag)} used the ${chalk.green(`/version`)} command in ${chalk.yellow(
					interaction.guild?.name
				)}`
			)
		);
	},
} as ICommand;
