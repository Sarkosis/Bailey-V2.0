const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("snipe")
    .setDescription("Find the most recently deleted message in this channel!"),

  async execute(interaction, client) {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.theme.color)
          .setDescription("Find message..."),
      ],
      ephemeral: true,
    });
    let message = client.snipes.get(interaction.channel.id);
    if (!message)
      return interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.theme.color)
            .setDescription("No deleted messages found for this channel!"),
        ],
        ephemeral: true,
      });
    return interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.theme.color)
          .setDescription(`||${message.content}||`),
      ],
      ephemeral: true,
    });
  },
};
