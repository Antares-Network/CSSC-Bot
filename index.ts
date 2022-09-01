// Import packages from NPM
import DiscordJs, { Intents } from "discord.js";
import WOKCommands from "wokcommands";
import path from "path";
import chalk from "chalk";
import dotenv from "dotenv";

// import custom modules
import { checkForRoles } from "./rolesOps";

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

client.on("ready", () => {
  if (client.user) {
    console.log(chalk.green(`Logged in as ${client.user.tag}!`));
    console.log(
      chalk.yellow.bold(`I am running version: ${process.env.VERSION}`)
    );
    // Check to make sure the roles exist in all servers
    console.log("Checking if all roles exist in servers.");
    client.guilds.cache.forEach(async (guild) => {
      checkForRoles(guild);
    });
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
    botOwners: [
      "603629606154666024",
      "680813135556378634",
      "451761128704573440",
    ],
  }).setDefaultPrefix(String(process.env.BOT_DEFAULT_PREFIX));

  // Set up the connection to the database
  wok.on("databaseConnected", async () => {
    console.log(chalk.green("Connected to the database"));
  });
});

// Catch all errors that are not handled well and just dump to the console. THis will be changed later but for now it's fine.
client.on("error", console.error);
client.on("warn", (e) => console.warn(e));
process.on("unhandledRejection", (promise, reason) => {
  console.error("Unhandled promise rejection:", promise, "\nreason", reason);
});

// Login to Discord with the bot token and display an error if it fails.
client.login(process.env.BOT_TOKEN).catch((error) => {
  console.log(
    chalk.red.bold(`There was an error connecting to the Discord API`)
  );
  console.error(error);
  process.exit(1);
});

// Exit gracefully and print the exit code.
process.on("exit", (code) => {
  console.log("Now exiting...");
  console.log(`Exited with status code: ${code}`);
});
