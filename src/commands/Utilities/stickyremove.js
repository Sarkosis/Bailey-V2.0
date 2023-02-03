const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sticky-remove")
    .setDescription("Remove a sticky message for a channel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel the sticky message is for.")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),
  async execute(interaction, client) {
    let { guild, options } = interaction;
    let channel = options.getChannel("channel") || interaction.channel;
    await client.connection.query(
      `SELECT * FROM stickymessages WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}'`,
      async (e, row) => {
        if (e) {
          if (client.config.bot.debugMode) {
            console.log(e);
          }
          return interaction.reply({
            content: "`Database Error occured.`",
            ephemeral: true,
          });
        }
        if (row[0]?.GuildID) {
          await client.connection.query(
            `DELETE FROM stickymessages WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}'`,
            async (er) => {
              if (er) {
                if (client.config.bot.debugMode) {
                  console.log(e);
                }
                return interaction.reply({
                  content: "`Database Error occured.`",
                  ephemeral: true,
                });
              }
              return interaction.reply({
                content: "Sticky message removed from database.",
                ephemeral: true,
              });
            }
          );
        } else
          return interaction.reply({
            content: "No sticky messages found for that channel!",
            ephemeral: true,
          });
      }
    );
  },
};
