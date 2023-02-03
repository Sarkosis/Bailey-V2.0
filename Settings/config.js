const config = {
  bot: {
    clientID: "1047288679179231322", // Bot ID.
    token:
      "MTA0NzI4ODY3OTE3OTIzMTMyMg.GxljKu.GwkCdML0lH6z9pzvFjFKqIMxXgMonpTn6yT3xI", // Bot Token,
    debugMode: true, // Enable/Disable debug mode
  },
  theme: {
    color: "#152238", // Color theme usng HEX code.
  },
  stats: {
    presence: "over the server", // custom presnce.
    activity: "Watching", // activity type; Competing in, Playing, Watching, Listening to, Streaming.
    status: "dnd", // idle, dnd, online, invisible.
  },
  tickets: {
    ticketlimit: 1,
  },
  database: {
    host: "localhost", // Database host
    user: "root", // Database user
    password: "", // Database password
    name: "negnbot", // The mysql ban database
  },
  modules: {
    tickets: true, // Should the tickets module be enabled?
    music: true, // Should the music module be enabled?
  },
  owners: ["828427080500379649"], // An array of owner IDs that own the bot.
};
module.exports = config;
