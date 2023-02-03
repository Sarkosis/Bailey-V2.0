const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sticky-add")
    .setDescription("Create a sticky message for a channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("The sticky message")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription(
          "The channel for the sticky message or the current channel!"
        )
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),
  async execute(interaction, client) {
    let { guild, options } = interaction;
    let channel = options.getChannel("channel") || interaction.channel;
    let message = options.getString("message");
    await client.connection.query(
      `INSERT INTO stickymessages (GuildID, ChannelID, StickyMessage) VALUES ('${guild.id}', '${channel.id}', "${message}")`,
      async (e) => {
        if (e) {
          if (client.config.bot.debugMode) {
            console.log(e);
          }
          return interaction.reply({
            content: "`Database Error occured.`",
            ephemeral: true,
          });
        }
        return interaction.reply({
          content: "Sticky message added to database.",
          ephemeral: true,
        });
      }
    );
  },
};
