const { SlashCommandBuilder } = require("discord.js");
const answers = ["Heads", "Tails"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coin")
    .setDescription("Flip the coin"),

  async execute(interaction, client) {
    return interaction.reply({
      content: `:coin: ${answers[Math.floor(Math.random() * answers.length)]}`,
      ephemeral: true,
    });
  },
};
