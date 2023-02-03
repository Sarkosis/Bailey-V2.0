const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get a user's avatar")
    .addUserOption((option) =>
      option.setName("user").setDescription("The user").setRequired(false)
    ),
  async execute(interaction, client) {
    const { user, options } = interaction;
    let selectedUser = options.getUser("user") || user;
    let embed = new EmbedBuilder()
      .setColor(client.config.theme.color)
      .setImage(selectedUser.displayAvatarURL({ dynamic: true }))
      .setTitle("Requested by " + user.tag);
    return interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
