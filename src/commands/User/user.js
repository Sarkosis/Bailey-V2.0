const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Find out information from a guild user.")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user").setRequired(false)
    ),
  async execute(interaction, client) {
    let member = interaction.options.getMember("user") || interaction.member;
    let embed = new EmbedBuilder()
      .setTitle("User Information")
      .setColor(client.config.theme.color)
      .setFields({
        name: "**Member Information**",
        value: `
                **Joined Server:** <t:${parseInt(
                  member.joinedTimestamp / 1000
                )}:R>
                **User Name:** ${member.user.username}
                **User Tag:** ${member.user.tag}
                **User ID:** ${member.user.id}
                **Account Created:** <t:${parseInt(
                  member.user.createdTimestamp / 1000
                )}:R>
                **Is Bot:** ${member.user.bot}
               `,
      })
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: `Requested By ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();
    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
