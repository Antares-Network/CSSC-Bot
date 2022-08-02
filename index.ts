// Import packages from NPM
import DiscordJs, { GuildMember, Intents, MessageEmbed } from "discord.js";
import WOKCommands from "wokcommands";
import path from "path";
import dotenv from "dotenv";
import chalk from "chalk";

// Import custom packages
import { returnRoles as roleDictionary } from "./definitions";

// import all environment variables from .env file
dotenv.config();

// Create a new Discord client
const client = new DiscordJs.Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
	],
});

// Once the bot has started and emits the ready event, we can start setting up our commands and features.
client.on("ready", () => {
	if (client.user) {
		console.log(chalk.green(`Logged in as ${client.user.tag}!`));
		if (process.env.debugMode === "true") {
			console.log(chalk.red.bold("Debug mode is enabled!\nTesting Server roles are loaded!"));
		} else if (process.env.debugMode === "false") {
			console.log(chalk.red.bold("Debug mode is disabled!\nProduction Server roles are loaded!"));
		}
	}

	const dbOptions = {
		// These are the default values
		keepAlive: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
	};

	// Set up the WOKCommands instance
	const wok = new WOKCommands(client, {
		commandDir: path.join(__dirname, "commands"),
		featureDir: path.join(__dirname, "features"),
		dbOptions,
		typeScript: true,
		mongoUri: String(process.env.MONGODB_URI),
		disabledDefaultCommands: ["help", "language"],
		botOwners: ["603629606154666024", "680813135556378634"],
	}).setDefaultPrefix(String(process.env.BOT_DEFAULT_PREFIX));

	// Set up the connection to the database
	wok.on("databaseConnected", async () => {
		console.log(chalk.green("Connected to the database!"));

		//! Here we will check our connection and load information about the bot, servers, and users into memory.
	});
});

// Listen for button clicks on any message sent by the bot
client.on("interactionCreate", async (interaction) => {
	// Make sure the interaction is from a select menu
	if (!interaction.isSelectMenu()) return;

	// Get the select menu by it's custom ID
	if (interaction.customId === "collegeYearPoll") {
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("College Year Poll")
					.setColor("#0099ff")
					.setDescription(`You selected the ${interaction.values[0]} role.`)
					.setFooter({
						text: `Delivered in: ${client.ws.ping}ms | CSSC-Bot | ${process.env.VERSION}`,
						iconURL: "https://playantares.com/resources/CSSC-bot/icon.jpg",
					}),
			],
			ephemeral: true,
		});

		// Remove any previous roles in the dictionary from the user
		const member = interaction.member as GuildMember;
		for (const role of Object.values(roleDictionary())) {
			if (member.roles.cache.has(role)) {
				await member.roles.remove(role);
			}
		}
		// Assign the new role to the user
		member.roles.add(roleDictionary()[interaction.values[0]]);
	}
});

// Catch all errors that are not handled well and just dump to the console. THis will be changed later but for now it's fine.
client.on("error", console.error);
client.on("warn", (e) => console.warn(e));
process.on("unhandledRejection", (promise, reason) => {
	console.error("Unhandled promise rejection:", promise, "\nreason", reason);
});

// Login to Discord with the bot token and display an error if it fails.
client.login(process.env.BOT_TOKEN).catch((error) => {
	console.log(chalk.red.bold(`There was an error connecting to the Discord API`));
	console.error(error);
	process.exit(1);
});

// Exit gracefully and print the exit code.
process.on("exit", (code) => {
	console.log("Now exiting...");
	console.log(`Exited with status code: ${code}`);
});
