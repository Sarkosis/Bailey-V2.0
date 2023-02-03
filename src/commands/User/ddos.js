const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ddos")
    .setDescription("Create a ddos."),

  async execute(interaction) {
    await interaction.reply({
      content: "Creating attack.",
      ephemeral: true,
    });
    setTimeout(async () => {
      await interaction.editReply({
        content: "Creating attack..",
        ephemeral: true,
      });
    }, 250);
    setTimeout(async () => {
      await interaction.editReply({
        content: "Creating attack...",
        ephemeral: true,
      });
    }, 500);
    setTimeout(async () => {
      await interaction.editReply({
        content: "Finding Target.",
        ephemeral: true,
      });
    }, 750);
    setTimeout(async () => {
      await interaction.editReply({
        content: "Finding Target..",
        ephemeral: true,
      });
    }, 1000);
    setTimeout(async () => {
      await interaction.editReply({
        content: "Finding Target...",
        ephemeral: true,
      });
    }, 1250);
    setTimeout(async () => {
      await interaction.editReply({
        content: "Sending Attack.",
        ephemeral: true,
      });
    }, 1500);
    setTimeout(async () => {
      await interaction.editReply({
        content: "Sending Attack..",
        ephemeral: true,
      });
    }, 1750);
    setTimeout(async () => {
      await interaction.editReply({
        content: "Sending Attack...",
        ephemeral: true,
      });
    }, 2000);
    setTimeout(async () => {
      await interaction.editReply({
        content: "Attack was sent!",
        ephemeral: true,
      });
    }, 2250);
  },
};
