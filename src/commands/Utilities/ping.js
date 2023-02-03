const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Find my ping!"),
  async execute(interaction, client) {
    const message = await interaction.deferReply({
      fetchReply: true,
      ephemeral: true,
    });
    const embed = new EmbedBuilder()
      .setColor(client.config.theme.color)
      .setDescription(
        `**API Latency:** ${client.ws.ping}\n**Client Ping:** ${
          message.createdTimestamp - interaction.createdTimestamp
        }`
      );
    return interaction.editReply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
