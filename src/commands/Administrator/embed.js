const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Create an embed")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    let embed = new EmbedBuilder()
      .setColor(client.config.theme.color)
      .setDescription("Build an embed here")
      .setTitle("Embed Creator");

    let row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("dummy1")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Embed Settings:"),
      new ButtonBuilder()
        .setCustomId("embed-title")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Title"),
      new ButtonBuilder()
        .setCustomId("embed-description")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Description"),
      new ButtonBuilder()
        .setCustomId("embed-thumbnail")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Thumbnail")
    );
    let row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("dummy2")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Embed Settings:"),
      new ButtonBuilder()
        .setCustomId("embed-color")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Color"),
      new ButtonBuilder()
        .setCustomId("embed-image")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Image"),
      new ButtonBuilder()
        .setCustomId("embed-footer")
        .setStyle(ButtonStyle.Primary)
        .setLabel("Footer")
    );
    let row3 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("dummy3")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel("Extra:"),
      new ButtonBuilder()
        .setCustomId("embed-send-channel")
        .setStyle(ButtonStyle.Success)
        .setLabel("Send to Channel"),
      new ButtonBuilder()
        .setCustomId("embed-delete")
        .setStyle(ButtonStyle.Danger)
        .setLabel("Delete Embed")
    );
    return interaction.reply({
      embeds: [embed],
      components: [row1, row2, row3],
      ephemeral: true,
    });
  },
};
