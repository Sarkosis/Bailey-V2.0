const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get some help"),
  async execute(interaction, client) {
    let embed = new EmbedBuilder()
      .setColor(client.config.theme.color)
      .setTitle("User Commands")
      .setDescription(
        "`/Avatar`: **Get a user's avatar.**\n`/info`: **Get information about the bot.**\n`/credits`: **Get credits about the creator.**\n`/help`: **Get some help.**\n`/ping`: **Get the Discord API and Bot latency.**\n`/user`: **Find out basic information about a user.**"
      )
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: "Page 1 of 3",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();
    let button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("page-2")
        .setEmoji("⏩")
        .setStyle(ButtonStyle.Primary)
    );
    return interaction.reply({ embeds: [embed], components: [button] });
  },
};
