const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("restart")
    .setDescription("Restart the bot from discord"),
  async execute(interaction, client) {
    if (!client.config.owners.includes(interaction.member.id)) {
      return interaction.reply({
        content: "Only the bot owners can use this command!",
        ephemeral: true,
      });
    }
    await interaction.reply({
      content: "Restarting...",
      ephemeral: true,
    });
    client.destroy();
    await client.login(client.config.bot.token);
  },
};
