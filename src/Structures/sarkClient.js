const { Client, Collection } = require("discord.js");
class SarkClient extends Client {
  constructor(options = {}) {
    super(options);
    this.config = require("../../Settings/config");
    this.utils = require("./utils");
    this.giveaways = require("./Module Handlers/giveaways");
    this.tickets = require("./Module Handlers/tickets");
    this.commands = new Collection();
    this.commandArray = [];
  }
}

exports.SarkClient = SarkClient;
