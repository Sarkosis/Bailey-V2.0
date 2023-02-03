const {
  ChannelType,
  Collection,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  OverwriteType,
  PermissionFlagsBits,
} = require("discord.js");
let voiceManager = new Collection();

module.exports = {
  name: "voiceStateUpdate",
  async execute(oldState, newState, client) {
    let { member, guild } = oldState;
    let newChannel = newState.channel;
    let oldChannel = oldState.channel;
    await client.connection.query(
      `SELECT * FROM jointocreate WHERE GuildID = '${guild.id}'`,
      async (e, row) => {
        if (e) {
          if (client.config.bot.debugMode) {
            console.log(e);
          }
        }
        if (row[0]?.GuildID) {
          let channel = await guild.channels.cache.get(row[0]?.ChannelID);
          if (
            oldChannel !== newChannel &&
            newChannel &&
            newChannel.id === channel.id
          ) {
            const vc = await guild.channels.create({
              name: `🔊 | ${member.user.username}`,
              type: ChannelType.GuildVoice,
              parent: newChannel.parent,
              permissionOverwrites: [
                {
                  id: member.id,
                  allow: [
                    PermissionFlagsBits.Connect,
                    PermissionFlagsBits.Stream,
                    PermissionFlagsBits.Speak,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.ReadMessageHistory,
                  ],
                  type: OverwriteType.Member,
                },
                {
                  id: guild.id,
                  deny: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.Connect,
                  ],
                  type: OverwriteType.Role,
                },
              ],
              userLimit: Number(row[0]?.UserLimit),
            });
            voiceManager.set(member.id, vc.id);
            await newChannel.permissionOverwrites.edit(member, {
              Connect: false,
            });
            setTimeout(() => {
              newChannel.permissionOverwrites.delete(member);
            }, 10000);
            setTimeout(() => {
              member.voice.setChannel(vc);
            }, 500);
            let controlembed = new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setDescription(`Use these buttons for controls!`);
            let controls = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("add-member")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Add Member"),
              new ButtonBuilder()
                .setCustomId("remove-member")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Remove Member")
            );
            return vc.send({
              content: `<@${member.id}>`,
              embeds: [controlembed],
              components: [controls],
            });
          }
          let jtc = voiceManager.get(member.id);
          let members = oldChannel?.members
            .filter((m) => !m.user.bot)
            .map((m) => m.id);
          if (
            jtc &&
            oldChannel?.id === jtc &&
            (!newChannel || newChannel.id !== jtc)
          ) {
            if (members.length > 0) {
              let rID = members[Math.floor(Math.random(members.length))];
              let rMember = await guild.members.cache.get(rID);
              rMember.voice.setChannel(oldChannel).then((v) => {
                oldChannel?.setName(rMember.user.username).catch(() => {});
                oldChannel.permissionOverwrites.edit(rMember, {
                  Connect: true,
                });
              });
              voiceManager.set(member.id, null);
              voiceManager.set(rMember.id, oldChannel.id);
            } else {
              voiceManager.set(member.id, null);
              oldChannel.delete().catch(() => {});
            }
          }
        } else return;
      }
    );
  },
};
