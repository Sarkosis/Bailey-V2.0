const { SlashCommandBuilder, codeBlock } = require("discord.js");
const figlet = require("figlet");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ascii")
    .setDescription("Create some art from text")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("text to turn into ")
        .setRequired(true)
    ),
  async execute(interaction) {
    const text = interaction.options.getString("text");

    figlet(text, function (err, data) {
      if (err) {
        console.log("Something went wrong...");
        console.dir(err);
        return;
      }
      interaction.reply(codeBlock(data));
    });
  },
};
