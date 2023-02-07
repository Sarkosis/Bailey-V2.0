const {
  EmbedBuilder,
  PermissionFlagsBits,
  OverwriteType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isButton()) {
      let { customId, member, guild, channel } = interaction;
      let panelid = interaction?.message?.embeds[0]?.footer?.text;
      switch (customId) {
        case "create-ticket-btn":
          {
            await client.con.query(
              `SELECT * FROM btnpanels WHERE GuildID = "${guild.id}" AND PanelID = '${panelid}'`,
              async (e, row) => {
                if (e) {
                  if (client.config.debugmode) {
                    console.log(e.stack);
                  }
                }
                if (!row[0]) {
                  return interaction.reply({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.color)
                        .setDescription("The ticket panel couldn't be found!"),
                    ],
                    ephemeral: true,
                  });
                }
                await client.con.query(
                  `SELECT COUNT(*) as total FROM logs`,
                  async (e, res) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    let total = res[0]?.total + 1;
                    await guild.channels
                      .create({
                        parent: row[0]?.CategoryID,
                        name: "ticket-" + client.utils.ider(total),
                        type: 0,
                        topic: `${member.user.username} has opened a ${row[0]?.Title}`,
                        nsfw: false,
                        permissionOverwrites: [
                          {
                            allow: [
                              PermissionFlagsBits.ViewChannel,
                              PermissionFlagsBits.ReadMessageHistory,
                              PermissionFlagsBits.SendMessages,
                              PermissionFlagsBits.AddReactions,
                              PermissionFlagsBits.AttachFiles,
                              PermissionFlagsBits.EmbedLinks,
                              PermissionFlagsBits.SendMessagesInThreads,
                              PermissionFlagsBits.UseApplicationCommands,
                              PermissionFlagsBits.UseExternalEmojis,
                              PermissionFlagsBits.UseExternalStickers,
                            ],
                            id: member.id,
                            type: OverwriteType.Member,
                          },
                          {
                            deny: [
                              PermissionFlagsBits.ViewChannel,
                              PermissionFlagsBits.ReadMessageHistory,
                              PermissionFlagsBits.SendMessages,
                            ],
                            id: guild.id,
                            type: OverwriteType.Role,
                          },
                        ],
                      })
                      .then(async (c) => {
                        await client.con.query(
                          `INSERT INTO logs (GuildID, PanelID, PanelType, OpeningMemberID, ClosingMemberID, ClaimingMemberID, ChannelID, Locked, Closed, TicketID, Archived) VALUES ("${guild.id}", "${panelid}", "Button", "${member.id}", "none", "none", "${c.id}", "false", "false", "${total}", "false")`,
                          async (e) => {
                            if (e) {
                              if (client.config.debugmode) {
                                console.log(e.stack);
                              }
                            }
                            await client.con.query(
                              `SELECT * FROM btnroles WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                              async (e, rows) => {
                                if (e) {
                                  if (client.config.debugmode) {
                                    console.log(e.stack);
                                  }
                                }
                                await client.utils.ticketPerms(rows, c);
                                let embed = new EmbedBuilder()
                                  .setColor(client.config.color)
                                  .setTitle(`New ${row[0]?.Title}`)
                                  .setDescription(
                                    `<@${member.id}> has created a new ${row[0]?.Title}`
                                  )
                                  .setThumbnail(
                                    member.user.displayAvatarURL({
                                      dynamic: true,
                                    })
                                  );
                                let manage =
                                  new ActionRowBuilder().addComponents(
                                    new ButtonBuilder()
                                      .setCustomId("manage-ticket")
                                      .setStyle(ButtonStyle?.Primary)
                                      .setEmoji("⚙️")
                                      .setLabel("Manage"),
                                    new ButtonBuilder()
                                      .setCustomId("manage-ticket-roles")
                                      .setStyle(ButtonStyle?.Primary)
                                      .setEmoji("⚙️")
                                      .setLabel("Manage Roles"),
                                    new ButtonBuilder()
                                      .setCustomId("manage-ticket-users")
                                      .setStyle(ButtonStyle?.Primary)
                                      .setEmoji("⚙️")
                                      .setLabel("Manage Users")
                                  );
                                await c.send({
                                  content: "@everyone",
                                  embeds: [embed],
                                  components: [manage],
                                });
                                return interaction.reply({
                                  embeds: [
                                    new EmbedBuilder()
                                      .setColor(client.config.color)
                                      .setTitle("Ticket Created")
                                      .setDescription(
                                        `Head to <#${c.id}> to view your ticket`
                                      ),
                                  ],
                                  ephemeral: true,
                                });
                              }
                            );
                          }
                        );
                      });
                  }
                );
              }
            );
          }

          break;

        default:
          break;
      }
    }
  },
};
