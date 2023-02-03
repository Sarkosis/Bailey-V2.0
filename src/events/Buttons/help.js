const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isButton()) {
      if (["page-2"].includes(interaction.customId)) {
        let embed = new EmbedBuilder()
          .setColor(client.config.theme.color)
          .setTitle("Owner Commands")
          .setDescription(
            "`/restart`: **Restart the bot from discord.**\n`/stop`: **Stop the bot from discord.**\n`/giveaway fetch message`: **Find a giveaway's information using the message ID.**\n`/giveaway fetch giveaway_id`: **Find a giveaway's information using the giveaway ID.\n`/giveaway fetch all`: **Find all the giveaway from this guild.**\n`/giveaway fetch active`: **Find all currently active giveaways from this guild.**\n`/giveaway create`: **Create a giveaway**\n`/giveaway delete`: **Delete a giveaway via messageID.**"
          )
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setFooter({
            text: "Page 2 of 3",
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();
        let button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("page-1")
            .setEmoji("⏪")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("page-3")
            .setEmoji("⏩")
            .setStyle(ButtonStyle.Primary)
        );
        await interaction.reply({
          content: "**Showing page 2**",
          ephemeral: true,
        });
        return interaction.message.edit({
          embeds: [embed],
          components: [button],
        });
      } else if (["page-3"].includes(interaction.customId)) {
        let embed = new EmbedBuilder()
          .setColor(client.config.theme.color)
          .setTitle("Sticky Commands")
          .setDescription(
            "`/sticky-add`: **Add a sticky message to a channel.**\n`/sticky-delete`: **Delete a sticky message.**"
          )
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setFooter({
            text: "Page 3 of 3",
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();
        let button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("page-2")
            .setEmoji("⏪")
            .setStyle(ButtonStyle.Primary)
        );
        await interaction.reply({
          content: "**Showing page 3**",
          ephemeral: true,
        });
        return interaction.message.edit({
          embeds: [embed],
          components: [button],
        });
      } else if (["page-1"].includes(interaction.customId)) {
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
        await interaction.reply({
          content: "**Showing page 1**",
          ephemeral: true,
        });
        return interaction.message.edit({
          embeds: [embed],
          components: [button],
        });
      }
    }
  },
};
