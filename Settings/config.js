const config = {
  bot: {
    clientID: "1047288679179231322", // Bot ID.
    token:
      "MTA0ODA3Mjg0ODAxMjQ3NjQ1Ng.GASxK1.6RQqW5_rWMAqftIkYr2LNpu6ChkAnkCnCB1Tb8", // Bot Token,
    debugMode: true, // Enable/Disable debug mode
  },
  theme: {
    color: "#152238", // Color theme usng HEX code.
  },
  stats: {
    presence: "bed", // custom presnce.
    activity: "Competing in", // activity type; Competing in, Playing, Watching, Listening to, Streaming.
    status: "dnd", // idle, dnd, online, invisible.
  },
  tickets: {
    ticketlimit: 1,
  },
  database: {
    host: "dev.c9ajfzgmntyu.us-east-1.rds.amazonaws.com", // Database host
    user: "admin", // Database user
    password: "EVjAjVuaHVmXvbQlxxUA", // Database password
    name: "project-bailey", // The mysql ban database
  },
  modules: {
    tickets: true, // Should the tickets module be enabled?
    music: true, // Should the music module be enabled?
  },
  owners: ["828427080500379649"], // An array of owner IDs that own the bot.
};
module.exports = config;
