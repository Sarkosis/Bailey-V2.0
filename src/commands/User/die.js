const { SlashCommandBuilder } = require("discord.js");
const answers = ["1", "2", "3", "4", "5", "6"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Flip the coin"),

  async execute(interaction, client) {
    return interaction.reply({
      content: `:game_die: ${answers[Math.floor(Math.random() * answers.length)]}`,
      ephemeral: true,
    });
  },
};
