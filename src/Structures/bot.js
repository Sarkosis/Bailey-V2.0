const { GatewayIntentBits, Partials } = require("discord.js");
const fs = require("fs");
const mysql = require("mysql");
const chalk = require("chalk");
const { Player } = require("discord-player");
const { SarkClient } = require("./sarkClient");
const client = new SarkClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [
    Partials.GuildMember,
    Partials.Message,
    Partials.Channel,
    Partials.User,
  ],
});

// Handlers

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionsFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionsFiles)
    require(`../functions/${folder}/${file}`)(client);
}

// Video Player

client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25,
  },
});

// Sniping Feature
client.snipes = new Map();
client.on("messageDelete", (message) => {
  client.snipes.set(message.channel.id, {
    content: message.content,
  });
});

client.setMaxListeners(0);
client.handleEvents(client);
client.handleCommands();

try {
  const sqlstuff = {
    connectionLimit: 10,
    queueLimit: 5000,
    host: client.config.database.host,
    user: client.config.database.user,
    password: client.config.database.password,
    database: client.config.database.name,
  };
  const con = mysql.createPool(sqlstuff);
  setTimeout(() => {
    console.log(`${chalk.yellow("[SQL SERVER]")} Successfully Connected`);
  }, 4000);
  con.on("enqueue", function () {
    if (client.config.bot.debugMode) {
      console.log(
        `${chalk.yellow("[SQL SERVER]")} Waiting for available connection slot`
      );
    }
  });
  con.on("release", function (connection) {
    if (client.config.bot.debugMode) {
      console.log(
        `${chalk.yellow("[SQL SERVER]")} Connection %d released`,
        connection.threadId
      );
    }
  });
  client.connection = con;
} catch (err) {
  if (client.config.bot.debugMode) {
    client.utils.error(client, err);
  }
  return process.exit(1);
}
try {
  client.login(client.config.bot.token);
} catch (err) {
  if (client.config.bot.debugMode) {
    console.log(err);
  }
  return process.exit(1);
}
process.on("unhandledRejection", (err) => {
  if (err !== "DiscordAPIError: Unknown Message") {
    console.log(chalk.red(`\nFatal Error Occured: \n\n`, err.stack));
  }
});

setInterval(() => {
  client.utils.giveawaysManager(client);
  client.utils.reminders(client);
}, 15000);
