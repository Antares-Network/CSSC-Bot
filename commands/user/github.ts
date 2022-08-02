import { MessageEmbed, TextChannel } from "discord.js";
import { ICommand } from "wokcommands";

export default {
	name: "github",
	category: "user",
	description: "Sends an embed with a link to the github repo for the bot.",
	slash: true,
	testOnly: false,
	guildOnly: true,
	requiredPermissions: ["SEND_MESSAGES"],

	callback: async ({ client, interaction }) => {
		// Command information
		const id = interaction.user.id;
		const chan = interaction.channel as TextChannel;

		// Embed values
		const color = "#0099ff";
		const thumbnail = "https://playantares.com/resources/CSSC-bot/cssc-server-icon.png";
		const title = "Github";
		const description = "Click here to go to the CSSC-bot repo: \n https://github.com/llisaeva/CSSC-Bot";
		const footer = `Delivered in: ${client.ws.ping}ms | CSSC-bot | ${process.env.VERSION}`;
		const footerIcon = "https://playantares.com/resources/CSSC-bot/icon.jpg";

		// Embed construction
		const Embed = new MessageEmbed()
			.setColor(color)
			.setTitle(title)
			.setThumbnail(thumbnail)
			.setDescription(description)
			.setFooter({ text: footer, iconURL: footerIcon });

		interaction.reply({ embeds: [Embed] });
	},
} as ICommand;
