const figlet = require("figlet");
const chalk = require("chalk");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    let activity = 0;
    if (client.config.stats.activity === "Playing") {
      activity = 0;
    } else if (client.config.stats.activity === "Streaming") {
      activity = 1;
    } else if (client.config.stats.activity === "Listening to") {
      activity = 2;
    } else if (client.config.stats.activity === "Watching") {
      activity = 3;
    } else if (client.config.stats.activity === "Competing in") {
      activity = 5;
    }
    client.user.setPresence({
      activities: [
        {
          name: client.config.stats.presence,
          type: activity,
        },
      ],
    });
    client.user.setStatus(client.config.stats.status);
    figlet("New Era Gaming Network", function (err, data) {
      if (err) throw err;
      console.log(chalk.blue.dim(data));
    });
    setTimeout(() => {
      console.log(
        `${chalk.blue.dim(
          "[INVITE]:"
        )} https://discord.com/api/oauth2/authorize?client_id=${
          client.user.id
        }&scope=bot%20applications.commands`
      );
    }, 1000);
    setTimeout(() => {
      console.log(
        `${chalk.blue(`Loaded ${client.commands.size} Application Commands`)}`
      );
    }, 1500);
  },
};
