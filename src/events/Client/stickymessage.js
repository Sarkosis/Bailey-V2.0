const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.channel.type === "DM") return;
    if (message.author.bot) return;
    if (!message.guild) return;
    let { channel, guild, author } = message;
    await client.connection.query(
      `SELECT * FROM stickymessages WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}'`,
      async (e, row) => {
        if (e) {
          if (client.config.bot.debugMode) {
            console.log(e);
          }
          return;
        }
        if (row[0]?.GuildID) {
          let stickyEmbed = new EmbedBuilder()
            .setTitle("Sticky Message")
            .setColor(client.config.theme.color)
            .setDescription(row[0]?.StickyMessage)
            .setFooter({
              text: "Sticky Message",
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp();
          const msg = await channel?.send({ embeds: [stickyEmbed] });
          setTimeout(() => {
            msg.delete();
          }, 30000);
        } else return;
      }
    );
  },
};
