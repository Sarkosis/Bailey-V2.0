const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("botinfo")
    .setDescription("Return My info"),
  async execute(interaction, client) {
    await client.connection.query(
      `SELECT COUNT(*) as total FROM Giveaways`,
      async (e, row) => {
        if (e) throw e;
        const embed = new EmbedBuilder()
          .setTitle("Bot Information")
          .setColor(client.config.theme.color)
          .setFields(
            {
              name: "**Server Count:**",
              value: `${client.guilds.cache.size}`,
              inline: false,
            },
            {
              name: "**Total Giveaways Created:**",
              value: `${row[0]?.total}`,
            }
          )
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }));
        return interaction.reply({
          embeds: [embed],
          ephemeral: true,
        });
      }
    );
  },
};
