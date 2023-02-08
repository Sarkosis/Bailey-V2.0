const { Client, Collection } = require("discord.js");
class BaileyClient extends Client {
  constructor(options = {}) {
    super(options);
    this.config = require("../../Settings/config");
    this.utils = require("./utils");
    this.giveaways = require("./Module Handlers/giveaways");
    this.commands = new Collection();
    this.commandArray = [];
  }
}

exports.BaileyClient = BaileyClient;
