const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("dm")
    .setDescription("Direct Message a user as the bot")
    .addStringOption((option) =>
      option.setName("id").setDescription("User ID").setRequired(true)
    )
    .addStringOption((o) =>
      o.setName("message").setDescription("Create a message").setRequired(true)
    ),

  async execute(interaction, client) {
    let userid = interaction.options.getString("id");
    let m = interaction.options.getString("message");
    let user = await interaction.guild.members.fetch(userid);
    if (!user)
      return interaction.reply({
        content: "`Couldn't find user!`",
        ephemeral: true,
      });
    await interaction.reply({ content: "Sent to user!", ephemeral: true });
    return user?.send(m).catch(() => {});
  },
};
