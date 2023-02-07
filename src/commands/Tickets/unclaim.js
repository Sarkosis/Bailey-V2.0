const {
    SlashCommandBuilder,
    ChannelType,
    EmbedBuilder,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("unclaim")
      .setDescription("Unclaim a ticket")
      .addChannelOption((o) =>
        o
          .setName("ticket")
          .setDescription("Input the ticket channel")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true)
      ),
  
    async execute(interaction, client) {
      let { member, options, guild } = interaction;
      let ticket = options.getChannel("ticket");
      await client.con.query(
        `SELECT * FROM drproles WHERE GuildID = "${guild.id}"`,
        async (e, mrows) => {
          if (e) {
            if (client.config.debugmode) {
              console.log(e.stack);
            }
          }
          await client.con.query(
            `SELECT * FROM btnroles WHERE GuildID = "${guild.id}"`,
            async (e, brows) => {
              if (e) {
                if (client.config.debugmode) {
                  console.log(e.stack);
                }
              }
              let checkroles = [];
              mrows.forEach((r) => {
                checkroles.push(r.RoleID);
              });
              brows.forEach((r) => {
                checkroles.push(r.RoleID);
              });
              let memberroles = [];
              member.roles.cache.forEach((role) => {
                memberroles.push(role.id);
              });
              let result = client.utils.hasRoles(checkroles, memberroles);
              if (result == false) {
                return interaction.reply({
                  content:
                    "You aren't staff in this server!\nYou **cannot** use this action.",
                  ephemeral: true,
                });
              }
              await client.con.query(
                `SELECT * FROM logs WHERE GuildID = '${guild.id}' AND ChannelID = "${ticket.id}" AND ClaimingMemberID  = "${member.id}"`,
                async (e, row) => {
                  if (e) {
                    if (client.config.debugmode) {
                      console.log(e.stack);
                    }
                  }
                  if (!row[0]) {
                    return interaction.reply({
                      content: "Ticket not found!\n**Notice: This could be because you haven't claimed this ticket.**",
                      ephemeral: true,
                    });
                  }
                  await client.con.query(
                    `UPDATE logs SET ClaimingMemberID = "none" WHERE GuildID = '${guild.id}' AND ChannelID = "${ticket.id}"`,
                    async (e) => {
                      if (e) {
                        if (client.config.debugmode) {
                          console.log(e.stack);
                        }
                      }
                      let thechan = await guild.channels.resolve(ticket);
                      if (!thechan?.id) {
                        return interaction.reply({
                          content: "Channel not found!",
                          ephemeral: true,
                        });
                      }
                      await interaction.reply({
                        content: "Ticket unclaimed!",
                        ephemeral: true,
                      });
                      return thechan.send({
                        embeds: [
                          new EmbedBuilder()
                            .setColor(client.config.color)
                            .setTitle("Ticket Unclaimed")
                            .setDescription(
                              `${member.user.tag} has unclaimed <#${thechan.id}>`
                            ),
                        ],
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    },
  };
  