const { createTranscript } = require("discord-html-transcripts");
const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
  OverwriteType,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    let { customId, member, guild, channel } = interaction;
    switch (customId) {
      case "manage-ticket":
        {
          await client.con.query(
            `SELECT * FROM logs WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}'`,
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
                      .setDescription("Ticket not found!"),
                  ],
                  ephemeral: true,
                });
              }
              let panelid = row[0]?.PanelID;
              await client.con.query(
                `SELECT * FROM btnroles WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                async (e, rows) => {
                  if (e) {
                    if (client.config.debugmode) {
                      console.log(e.stack);
                    }
                  }
                  let checkroles = [];
                  rows.forEach((r) => {
                    checkroles.push(r.RoleID);
                  });
                  let memberroles = [];
                  member.roles.cache.forEach((role) => {
                    memberroles.push(role.id);
                  });
                  let result = client.utils.hasRoles(checkroles, memberroles);
                  if (result == false) {
                    return interaction.reply({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.color)
                          .setDescription(
                            "You don't have any of the staff roles for this ticket!\nYou **cannot** use this feature."
                          ),
                      ],
                      ephemeral: true,
                    });
                  }
                  let a = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("a")
                      .setStyle(ButtonStyle.Secondary)
                      .setDisabled(true)
                      .setEmoji("⚙️")
                      .setLabel("Main Controls:"),
                    new ButtonBuilder()
                      .setCustomId("close-ticket-btn")
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("Close"),
                    new ButtonBuilder()
                      .setCustomId("lock-ticket-btn")
                      .setStyle(ButtonStyle.Danger)
                      .setEmoji("🔒")
                      .setLabel("Lock"),
                    new ButtonBuilder()
                      .setCustomId("unlock-ticket-btn")
                      .setStyle(ButtonStyle.Primary)
                      .setEmoji("🔓")
                      .setLabel("Unlock")
                  );
                  let b = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("b")
                      .setStyle(ButtonStyle.Secondary)
                      .setDisabled(true)
                      .setEmoji("⚙️")
                      .setLabel("Archive Controls:"),
                    new ButtonBuilder()
                      .setCustomId("archive-ticket-btn")
                      .setStyle(ButtonStyle.Danger)
                      .setEmoji("🗃️")
                      .setLabel("Archive"),
                    new ButtonBuilder()
                      .setCustomId("unarchive-ticket-btn")
                      .setStyle(ButtonStyle.Success)
                      .setEmoji("📁")
                      .setLabel("Unarchive")
                  );
                  let c = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("c")
                      .setStyle(ButtonStyle.Secondary)
                      .setDisabled(true)
                      .setEmoji("⚙️")
                      .setLabel("Claim Controls:"),
                    new ButtonBuilder()
                      .setCustomId("claim-ticket-btn")
                      .setStyle(ButtonStyle.Success)
                      .setEmoji("👋")
                      .setLabel("Claim"),
                    new ButtonBuilder()
                      .setCustomId("unclaim-ticket-btn")
                      .setStyle(ButtonStyle.Danger)
                      .setEmoji("💨")
                      .setLabel("Unclaim"),
                    new ButtonBuilder()
                      .setCustomId("trnclm-ticket-btn")
                      .setStyle(ButtonStyle.Primary)
                      .setEmoji("🤝")
                      .setLabel("Transfer Claim")
                  );

                  let f = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("f")
                      .setStyle(ButtonStyle.Secondary)
                      .setDisabled(true)
                      .setEmoji("⚙️")
                      .setLabel("Logging Controls:"),
                    new ButtonBuilder()
                      .setCustomId("htmltran-ticket-btn")
                      .setStyle(ButtonStyle.Primary)
                      .setEmoji("📂")
                      .setLabel("Transcript & Close")
                  );
                  let embed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTitle("Manager Actions")
                    .setDescription("Useful ticket buttons");
                  await interaction.reply({
                    embeds: [embed],
                    components: [a, b, c, f],
                    ephemeral: true,
                  });
                }
              );
            }
          );
        }

        break;
      case "manage-ticket-users":
        {
          await client.con.query(
            `SELECT * FROM logs WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}'`,
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
                      .setDescription("Ticket not found!"),
                  ],
                  ephemeral: true,
                });
              }
              let panelid = row[0]?.PanelID;
              await client.con.query(
                `SELECT * FROM btnroles WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                async (e, rows) => {
                  if (e) {
                    if (client.config.debugmode) {
                      console.log(e.stack);
                    }
                  }
                  let checkroles = [];
                  rows.forEach((r) => {
                    checkroles.push(r.RoleID);
                  });
                  let memberroles = [];
                  member.roles.cache.forEach((role) => {
                    memberroles.push(role.id);
                  });
                  let result = client.utils.hasRoles(checkroles, memberroles);
                  if (result == false) {
                    return interaction.reply({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.color)
                          .setDescription(
                            "You don't have any of the staff roles for this ticket!\nYou **cannot** use this feature."
                          ),
                      ],
                      ephemeral: true,
                    });
                  }
                  let embed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTitle("Manager Actions")
                    .setDescription("Useful ticket buttons");
                  let bt = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("e")
                      .setStyle(ButtonStyle.Secondary)
                      .setDisabled(true)
                      .setEmoji("⚙️")
                      .setLabel("User Permission Controls:"),
                    new ButtonBuilder()
                      .setCustomId("adduser-ticket-btn")
                      .setStyle(ButtonStyle.Success)
                      .setLabel("Add user"),
                    new ButtonBuilder()
                      .setCustomId("removeuser-ticket-btn")
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("Remove User")
                  );

                  await interaction.reply({
                    embeds: [embed],
                    components: [bt],
                    ephemeral: true,
                  });
                }
              );
            }
          );
        }
        break;
      case "manage-ticket-roles":
        {
          await client.con.query(
            `SELECT * FROM logs WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}'`,
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
                      .setDescription("Ticket not found!"),
                  ],
                  ephemeral: true,
                });
              }
              let panelid = row[0]?.PanelID;
              await client.con.query(
                `SELECT * FROM btnroles WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                async (e, rows) => {
                  if (e) {
                    if (client.config.debugmode) {
                      console.log(e.stack);
                    }
                  }
                  let checkroles = [];
                  rows.forEach((r) => {
                    checkroles.push(r.RoleID);
                  });
                  let memberroles = [];
                  member.roles.cache.forEach((role) => {
                    memberroles.push(role.id);
                  });
                  let result = client.utils.hasRoles(checkroles, memberroles);
                  if (result == false) {
                    return interaction.reply({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.color)
                          .setDescription(
                            "You don't have any of the staff roles for this ticket!\nYou **cannot** use this feature."
                          ),
                      ],
                      ephemeral: true,
                    });
                  }

                  let embed = new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTitle("Manager Actions")
                    .setDescription("Useful ticket buttons");
                  let d = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("d")
                      .setStyle(ButtonStyle.Secondary)
                      .setDisabled(true)
                      .setEmoji("⚙️")
                      .setLabel("Role Permission Controls"),
                    new ButtonBuilder()
                      .setCustomId("addrole-ticket-btn")
                      .setStyle(ButtonStyle.Success)
                      .setLabel("Add role"),
                    new ButtonBuilder()
                      .setCustomId("removerole-ticket-btn")
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("Remove Role")
                  );

                  await interaction.reply({
                    embeds: [embed],
                    components: [d],
                    ephemeral: true,
                  });
                }
              );
            }
          );
        }
        break;
      case "close-ticket-btn":
        {
          await client.con.query(
            `SELECT * FROM logs WHERE GuildID = "${guild.id}" AND ChannelID = '${channel.id}'`,
            async (e, row) => {
              if (e) {
                if (client.config.debugmode) {
                  console.log(e.stack);
                }
              }
              if (!row[0]) {
                return interaction.reply({
                  content: "Ticket not found!",
                  ephemeral: true,
                });
              }
              if (row[0]?.Closed === "true") {
                return interaction.reply({
                  content: "Ticket is already closed!",
                  ephemeral: true,
                });
              }
              try {
                let them = await guild.members.fetch(row[0]?.OpeningMemberID);
                await channel.permissionOverwrites.edit(them?.id, {
                  SendMessages: false,
                  ViewChannel: false,
                  ReadMessageHistory: false,
                });
              } catch (error) {
                return interaction.reply({
                  content:
                    "Ticket failed to close!\n**Notice: This could be because the member who created this ticket has left the server, or couldn't be found.**",
                  ephemeral: true,
                });
              }
              await client.con.query(
                `UPDATE logs SET Closed = "true" WHERE GuildID = "${guild.id}" AND ChannelID = '${channel.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.debugmode) {
                      console.log(e.stack);
                    }
                  }
                }
              );
              return interaction.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.color)
                    .setTitle("Ticket Closed")
                    .setDescription(
                      `<#${channel.id}> was closed by ${member.user.tag}`
                    ),
                ],
              });
            }
          );
        }
        break;
      case "lock-ticket-btn":
        {
          await client.con.query(
            `SELECT * FROM logs WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}' AND Locked = "false"`,
            async (e, row) => {
              if (e) {
                if (client.config.debugmode) {
                  console.log(e.stack);
                }
              }
              if (row[0]) {
                let them = await guild.members.fetch(row[0]?.OpeningMemberID);
                try {
                  await channel.permissionOverwrites.edit(them?.id, {
                    SendMessages: false,
                    ViewChannel: false,
                    ReadMessageHistory: false,
                  });
                  interaction.reply({
                    content: "Ticket locked!",
                    ephemeral: true,
                  });
                } catch (abcs) {
                  console.log(abcs);
                  return interaction.reply({
                    content: "I couldn't lock this ticket!",
                    ephemeral: true,
                  });
                }
                await client.con.query(
                  `UPDATE logs SET Locked = "true" WHERE GuildID = "${guild.id}" AND ChannelID = "${channel.id}"`,
                  async (e) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                  }
                );
                them
                  ?.send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.color)
                        .setTitle("🔒 Ticket Locked")
                        .setDescription(
                          `Ticket #${row[0]?.TicketID} was locked, thus removing your access to view the ticket. Please contact the staff team if you believe this was a mistake.`
                        ),
                    ],
                    ephemeral: true,
                  })
                  .catch(() => {});
              } else if (!row[0]) {
                return interaction.reply({
                  content:
                    "Ticket not found!\n**Notice: This might be because the ticket is locked**",
                  ephemeral: true,
                });
              }
            }
          );
        }
        break;
      case "unlock-ticket-btn":
        {
          await client.con.query(
            `SELECT * FROM logs WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}' AND Locked = "true"`,
            async (e, row) => {
              if (e) {
                if (client.config.debugmode) {
                  console.log(e.stack);
                }
              }
              if (row[0]) {
                let them = await guild.members.fetch(row[0]?.OpeningMemberID);
                try {
                  await channel.permissionOverwrites.edit(them?.id, {
                    SendMessages: true,
                    ViewChannel: true,
                    ReadMessageHistory: true,
                  });
                  interaction.reply({
                    content: "Ticket unlocked!",
                    ephemeral: true,
                  });
                } catch (abcs) {
                  return interaction.reply({
                    content: "I couldn't unlock this ticket!",
                    ephemeral: true,
                  });
                }
                await client.con.query(
                  `UPDATE logs SET Locked = "false" WHERE GuildID = "${guild.id}" AND ChannelID = "${channel.id}"`,
                  async (e) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                  }
                );
                them
                  ?.send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.color)
                        .setTitle("🔒 Ticket Unlocked")
                        .setDescription(
                          `Ticket #${row[0]?.TicketID} was unlocked, and you can now view your ticket again.\n\n**Click [here](https://discord.com/channels/${guild.id}/${channel.id}) to view your ticket.**`
                        ),
                    ],
                    ephemeral: true,
                  })
                  .catch(() => {});
              } else if (!row[0]) {
                return interaction.reply({
                  content:
                    "Ticket not found!\n**Notice: This might be because the ticket isn't locked**",
                  ephemeral: true,
                });
              }
            }
          );
        }
        break;
      case "archive-ticket-btn":
        {
          await client.con.query(
            `SELECT * FROM logs WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}' AND Archived = "false"`,
            async (er, erow) => {
              if (er) {
                if (client.config.debugmode) {
                  console.log(er);
                }
              }
              if (!erow[0]) {
                return interaction.reply({
                  content:
                    "Ticket not found!\n**Notice: The ticket might be archived**",
                  ephemeral: true,
                });
              }
              if (erow[0]) {
                let thecat = await guild.channels.cache.find(
                  (c) => c.name === "Ticket Archives"
                );

                if (!thecat?.id) {
                  await guild.channels
                    .create({
                      name: "Ticket Archives",
                      type: ChannelType.GuildCategory,
                      permissionOverwrites: [
                        {
                          deny: [PermissionFlagsBits.ViewChannel],
                          id: guild.id,
                          type: OverwriteType.Role,
                        },
                      ],
                    })
                    .then(async (c) => {
                      channel.edit({
                        parent: c.id,
                      });
                      await client.con.query(
                        `UPDATE logs SET Archived = "true" WHERE ChannelID = "${channel.id}" AND GuildID = '${guild.id}'`,
                        async (e) => {
                          if (e) {
                            if (client.config.debugmode) {
                              console.log(e.stack);
                            }
                          }
                          await client.con.query(
                            `SELECT * FROM logs WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}'`,
                            async (e, row) => {
                              if (e) {
                                if (client.config.debugmode) {
                                  console.log(e.stack);
                                }
                              }
                              if (row[0]) {
                                await client.con.query(
                                  `SELECT * FROM btnroles WHERE GuildID = '${guild.id}' AND PanelID = '${row[0]?.PanelID}'`,
                                  async (e, rows) => {
                                    if (e) {
                                      if (client.config.debugmode) {
                                        console.log(e.stack);
                                      }
                                    }
                                    await client.utils.ticketPerms(rows, c);
                                    await interaction.reply({
                                      embeds: [
                                        new EmbedBuilder()
                                          .setColor(client.config.color)
                                          .setTitle("🗃️ Ticket Archived")
                                          .setDescription(
                                            `<#${channel.id}> was archived`
                                          ),
                                      ],
                                    });
                                    let them = await guild.members.fetch(
                                      row[0]?.OpeningMemberID
                                    );
                                    try {
                                      await channel.permissionOverwrites.edit(
                                        them?.id,
                                        {
                                          ViewChannel: false,
                                          ReadMessageHistory: false,
                                          SendMessages: false,
                                        }
                                      );
                                    } catch (abpiq) {}
                                  }
                                );
                              } else if (!row[0]) {
                                return channel
                                  .send("I couldn't find this ticket!")
                                  .then((m) =>
                                    setTimeout(() => {
                                      m.delete();
                                    }, 4000)
                                  );
                              }
                            }
                          );
                        }
                      );
                    })
                    .catch(() => {
                      return interaction.reply({
                        content: "I couldn't archive this ticket!",
                        ephemeral: true,
                      });
                    });
                } else if (thecat?.id) {
                  channel.edit({
                    parent: thecat.id,
                  });
                  await client.con.query(
                    `UPDATE logs SET Archived = "true" WHERE ChannelID = "${channel.id}" AND GuildID = '${guild.id}'`,
                    async (e) => {
                      if (e) {
                        if (client.config.debugmode) {
                          console.log(e.stack);
                        }
                      }
                      await client.con.query(
                        `SELECT * FROM logs WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}'`,
                        async (e, row) => {
                          if (e) {
                            if (client.config.debugmode) {
                              console.log(e.stack);
                            }
                          }
                          if (row[0]) {
                            await client.con.query(
                              `SELECT * FROM btnroles WHERE GuildID = '${guild.id}' AND PanelID = '${row[0]?.PanelID}'`,
                              async (e, rows) => {
                                if (e) {
                                  if (client.config.debugmode) {
                                    console.log(e.stack);
                                  }
                                }
                                await client.utils.ticketPerms(rows, thecat);
                                await interaction.reply({
                                  embeds: [
                                    new EmbedBuilder()
                                      .setColor(client.config.color)
                                      .setTitle("🗃️ Ticket Archived")
                                      .setDescription(
                                        `<#${channel.id}> was archived`
                                      ),
                                  ],
                                });
                                let them = await guild.members.fetch(
                                  row[0]?.OpeningMemberID
                                );
                                try {
                                  await channel.permissionOverwrites.edit(
                                    them?.id,
                                    {
                                      ViewChannel: false,
                                      ReadMessageHistory: false,
                                      SendMessages: false,
                                    }
                                  );
                                } catch (abpiq) {}
                              }
                            );
                          } else if (!row[0]) {
                            return channel
                              .send("I couldn't find this ticket!")
                              .then((m) =>
                                setTimeout(() => {
                                  m.delete();
                                }, 4000)
                              );
                          }
                        }
                      );
                    }
                  );
                }
              }
            }
          );
        }
        break;
      case "unarchive-ticket-btn":
        {
          await client.con.query(
            `SELECT * FROM logs WHERE GuildID = "${guild.id}" AND ChannelID = "${channel.id}" AND Archived = "true"`,
            async (e, row) => {
              if (e) {
                if (client.config.debugmode) {
                  console.log(e.stack);
                }
              }
              if (!row[0]) {
                return interaction.reply({
                  content:
                    "Ticket not found!\n**Notice: This could be because the ticket is not archived.**",
                  ephemeral: true,
                });
              }
              await client.con.query(
                `SELECT * FROM btnpanels WHERE GuildID = "${guild.id}" AND PanelID = "${row[0]?.PanelID}"`,
                async (e, p) => {
                  if (e) {
                    if (client.config.debugmode) {
                      console.log(e.stack);
                    }
                  }
                  if (!p[0]) {
                    return interaction.reply({
                      content:
                        "The associated panel with this ticket wasn't found!",
                      ephemeral: true,
                    });
                  }
                  let thecat = await guild.channels.fetch(p[0]?.CategoryID);
                  if (!thecat) {
                    return channel.send({
                      content: "I cannot unarchive this channel!",
                      ephemeral: true,
                    });
                  }
                  channel
                    .edit({
                      parent: thecat.id,
                    })
                    .catch(() => {});
                  await client.con.query(
                    `UPDATE logs SET Archived = "false" WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}'`,
                    async (e) => {
                      if (e) {
                        if (client.config.debugmode) {
                          console.log(e.stack);
                        }
                      }
                    }
                  );
                  try {
                    let them = await guild.members.fetch(
                      row[0]?.OpeningMemberID
                    );
                    await channel.permissionOverwrites.edit(them?.id, {
                      SendMessages: true,
                      ViewChannel: true,
                      ReadMessageHistory: true,
                    });
                    await interaction.reply({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.color)
                          .setTitle("📁 Ticket Unarchived")
                          .setDescription(`<#${channel.id}> was unarchived.`),
                      ],
                    });
                  } catch (bc) {
                    return channel.send({
                      content:
                        "The opening member of this ticket couldn't be granted access.",
                    });
                  }
                }
              );
            }
          );
        }
        break;
      case "claim-ticket-btn":
        {
          await client.con.query(
            `SELECT * FROM logs WHERE GuildID = '${guild.id}' AND ChannelID = "${channel.id}" AND ClaimingMemberID = "none"`,
            async (e, row) => {
              if (e) {
                if (client.config.debugmode) {
                  console.log(e.stack);
                }
              }
              if (!row[0]) {
                return interaction.reply({
                  content: "This ticket is already claimed!",
                  ephemeral: true,
                });
              }
              await client.con.query(
                `UPDATE logs SET ClaimingMemberID = "${member.id}" WHERE GuildID = "${guild.id}" AND ChannelID = "${channel.id}"`,
                async (e) => {
                  if (e) {
                    if (client.config.debugmode) {
                      console.log(e.stack);
                    }
                  }
                  return interaction.reply({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.color)
                        .setTitle("✏️ Claimed Ticket")
                        .setDescription(
                          `${member.user.tag} has claimed this ticket!`
                        ),
                    ],
                  });
                }
              );
            }
          );
        }
        break;
      case "unclaim-ticket-btn":
        {
          await client.con.query(
            `SELECT * FROM logs WHERE GuildID = '${guild.id}' AND ChannelID = "${channel.id}" AND ClaimingMemberID = "${member.id}"`,
            async (e, row) => {
              if (e) {
                if (client.config.debugmode) {
                  console.log(e.stack);
                }
              }
              if (!row[0]) {
                return interaction.reply({
                  content: "You haven't claimed this ticket!",
                  ephemeral: true,
                });
              }
              await client.con.query(
                `UPDATE logs SET ClaimingMemberID = "none" WHERE GuildID = "${guild.id}" AND ChannelID = "${channel.id}"`,
                async (e) => {
                  if (e) {
                    if (client.config.debugmode) {
                      console.log(e.stack);
                    }
                  }
                  return interaction.reply({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.color)
                        .setTitle("🏳️ Unclaimed Ticket")
                        .setDescription(
                          `${member.user.tag} has unclaimed this ticket!`
                        ),
                    ],
                  });
                }
              );
            }
          );
        }
        break;
      case "trnclm-ticket-btn":
        {
          await client.con.query(
            `SELECT * FROM logs WHERE GuildID = "${guild.id}" AND ChannelID = "${channel.id}" AND ClaimingMemberID = '${member.id}'`,
            async (e, row) => {
              if (e) {
                if (client.config.debugmode) {
                  console.log(e.stack);
                }
              }
              if (!row[0]) {
                return interaction.reply({
                  content: "You haven't claimed this ticket!",
                  ephemeral: true,
                });
              }
              interaction.reply({
                content: "Mention a member to transfer this ticket to!",
                ephemeral: true,
              });
              channel
                .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
                .then(async (col) => {
                  if (!col.first().mentions.members.first()) {
                    return channel
                      .send("No member was mentioned!")
                      .catch(() => {});
                  }
                  let them = await guild.members.fetch(
                    col.first().mentions.members.first()
                  );
                  if (!them) {
                    return channel
                      .send("The member couldn't be found")
                      .catch(() => {});
                  }
                  if (them == member) {
                    return interaction.editReply({
                      content:
                        "Nope, you cannot try to tranfer the claim to yourself.",
                      ephemeral: true,
                    });
                  }
                  if (them?.id === row[0]?.OpeningMemberID) {
                    return interaction.editReply({
                      content:
                        "Nope, you cannot try to tranfer the claim to the member who created the transfer",
                      ephemeral: true,
                    });
                  }
                  let panelid = row[0]?.PanelID;
                  await client.con.query(
                    `SELECT * FROM btnroles WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                    async (e, rows) => {
                      if (e) {
                        if (client.config.debugmode) {
                          console.log(e.stack);
                        }
                      }
                      let checkroles = [];
                      rows.forEach((r) => {
                        checkroles.push(r.RoleID);
                      });
                      let memberroles = [];
                      them.roles.cache.forEach((role) => {
                        memberroles.push(role.id);
                      });
                      let result = client.utils.hasRoles(
                        checkroles,
                        memberroles
                      );
                      if (result == false) {
                        return interaction.editReply({
                          content:
                            "The mentioned user isn't staff!\n**They cannot claim this ticket!**",
                          ephemeral: true,
                        });
                      }
                      let btns = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("accept-claim-btn")
                          .setStyle(ButtonStyle.Success)
                          .setLabel("Accept"),
                        new ButtonBuilder()
                          .setCustomId("deny-claim-btn")
                          .setStyle(ButtonStyle.Danger)
                          .setLabel("Deny")
                      );
                      let embed = new EmbedBuilder()
                        .setColor(client.config.color)
                        .setTitle("👋 Claim Transfer")
                        .setDescription(
                          `Hello, ${member.user.tag} has sent a ticket claim transfer request to you!\nYou can accept or deny this request below, aswell as view the ticket information.\n\n> **Notice: You are not required to accept this request and were selected by ${member.user.tag}.**\n> **[View Ticket](https://discord.com/channels/${guild.id}/${channel.id})**`
                        )
                        .addFields({
                          name: "Ticket Information",
                          value: `Ticket #${row[0]?.TicketID}\nMember: <@${row[0]?.OpeningMemberID}>`,
                          inline: true,
                        })
                        .setFooter({ text: `${channel.id}` });
                      await interaction.editReply({
                        content:
                          "You will be notified if and when the member claims this ticket, or if they don't claim it.\n**Notice: Please keep your direct messages private to recieve this info.**",
                        ephemeral: true,
                      });
                      await col.first().delete();
                      await them
                        ?.send({ embeds: [embed], components: [btns] })
                        .catch(() => {
                          channel.send(
                            "The member couldn't recieve the claim transfer request!"
                          );
                        });
                    }
                  );
                });
            }
          );
        }
        break;
      case "deny-claim-btn":
        {
          let searchid = interaction.message.embeds[0].footer.text;
          await client.con.query(
            `SELECT * FROM logs WHERE ChannelID = "${searchid}"`,
            async (e, row) => {
              if (e) {
                if (client.config.debugmode) {
                  console.log(e.stack);
                }
              }
              if (!row[0]) {
                return interaction.reply({
                  content: "The ticket couldn't be found!",
                  ephemeral: true,
                });
              }
              await interaction.reply({
                content:
                  "You have **denied** this request!\n**Thank you for your response.**",
                ephemeral: true,
              });
              let theg = await client.guilds.cache.get(row[0]?.GuildID);
              if (!theg) {
                return channel
                  .send("I couldn't find the guild of the ticket")
                  .catch(() => {});
              }
              let them = await theg?.members?.fetch(row[0]?.ClaimingMemberID);
              let thec = await theg?.channels?.fetch(row[0]?.ChannelID);
              let embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setTitle("Claim Transfer Denied")
                .setDescription(
                  `${interaction.user.tag} has denied ${them.user.tag}'s ticket claim transfer request.`
                );
              await thec
                ?.send({
                  embeds: [embed],
                })
                .catch(() => {});
              await them
                ?.send({
                  embeds: [embed],
                })
                .catch(() => {});
            }
          );
        }
        break;
      case "accept-claim-btn":
        {
          let searchid = interaction.message.embeds[0].footer.text;
          await client.con.query(
            `SELECT * FROM logs WHERE ChannelID = "${searchid}"`,
            async (e, row) => {
              if (e) {
                if (client.config.debugmode) {
                  console.log(e.stack);
                }
              }
              if (!row[0]) {
                return interaction.reply({
                  content: "The ticket couldn't be found!",
                  ephemeral: true,
                });
              }
              await interaction.reply({
                content:
                  "You have **accepted** this request!\n**Thank you for your response.**",
                ephemeral: true,
              });
              let theg = await client.guilds.cache.get(row[0]?.GuildID);
              if (!theg) {
                return channel
                  .send("I couldn't find the guild of the ticket")
                  .catch(() => {});
              }
              let them = await theg?.members?.fetch(row[0]?.ClaimingMemberID);
              let thec = await theg?.channels?.fetch(row[0]?.ChannelID);
              await client.con.query(
                `UPDATE Logs SET ClaimingMemberID = "${interaction.user.id}" WHERE GuildID = "${theg.id}" AND ChannelID = "${searchid}"`,
                async (e) => {
                  if (e) {
                    if (client.config.debugmode) {
                      console.log(e.stack);
                    }
                  }
                }
              );
              let embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setTitle("Claim Transfer Accepted")
                .setDescription(
                  `${interaction.user.tag} has accepted ${them.user.tag}'s ticket claim transfer request.`
                );
              await thec
                ?.send({
                  embeds: [embed],
                })
                .catch(() => {});
              await them
                ?.send({
                  embeds: [embed],
                })
                .catch(() => {});
            }
          );
        }
        break;
      case "htmltran-ticket-btn":
        {
          await client.con.query(
            `SELECT * FROM logs WHERE GuildID = "${guild.id}" AND ChannelID = "${channel.id}"`,
            async (e, row) => {
              if (e) {
                if (client.config.debugmode) {
                  console.log(e.stack);
                }
              }
              if (!row[0]) {
                return interaction.reply({
                  content: "Ticket not found",
                  ephemeral: true,
                });
              }
              await client.con.query(
                `SELECT * FROM btnpanels WHERE GuildID = '${guild.id}' AND PanelID = "${row[0]?.PanelID}"`,
                async (e, prow) => {
                  if (e) {
                    if (client.config.debugmode) {
                      console.log(e.stack);
                    }
                  }
                  if (!prow[0]) {
                    return interaction.reply({
                      content: "Panel associated with this ticket not found",
                      ephemeral: true,
                    });
                  }
                  let thelog = await guild.channels.cache.get(
                    prow[0]?.LogChannelID
                  );
                  if (!thelog) {
                    return interaction.reply({
                      content: "Log channel not found!",
                      ephemeral: true,
                    });
                  }
                  await client.con.query(
                    `UPDATE logs SET Closed = "true" AND ClosingMemberID = "${member.id}" WHERE GuildID = "${guild.id}" AND ChannelID = "${channel.id}"`,
                    async (e) => {
                      if (e) {
                        if (client.config.debugmode) {
                          console.log(e.stack);
                        }
                      }
                      let them = await guild.members.fetch(
                        row[0]?.OpeningMemberID
                      );
                      let theclaim = await guild.members.fetch(
                        row[0]?.ClaimingMemberID.endsWith("e")
                          ? null
                          : row[0]?.ClaimingMemberID
                      );
                      const channelMessages = await channel.messages.fetch();
                      let members = channelMessages.map((m) => m.author.tag);
                      let dups = (arr) =>
                        arr.filter(
                          (item, index) => arr.indexOf(item) !== index
                        );
                      const finalMembers = [...new Set(dups(members))];
                      let embed = new EmbedBuilder()
                        .setColor(client.config.color)
                        .setAuthor({
                          name: `Ticket #${row[0]?.TicketID}`,
                          iconURL: guild.iconURL({ dynamic: true }),
                        })
                        .setTitle(`📝 Transcript #${row[0]?.TicketID}`)
                        .addFields(
                          {
                            name: "**Ticket Information**",
                            value: `Channel - ${channel.id}\nCreated By - ${
                              them?.user?.tag
                            }\nLocked - ${
                              row[0]?.Locked || "unknown"
                            }\nClosed - true\nArchived - ${
                              row[0]?.Archived || "unknown"
                            }\nClaimed By: ${
                              theclaim?.user?.tag || "Not Claimed#0000"
                            }`,
                            inline: true,
                          },
                          {
                            name: "Members in Ticket",
                            value: `Total Messages: ${channel.messages.cache.size}\n${finalMembers.join("\n") || "unknown"}`,
                            inline: false,
                          }
                        );
                      await interaction.reply({
                        content: "Ticket closed!",
                        ephemeral: true,
                      });
                      let transcript = await createTranscript(channel, {
                        limit: -1,
                        returnType: "attachment",
                        poweredBy: false,
                        filename: `transcript-${row[0]?.TicketID}.html`,
                      });
                      await thelog?.send({
                        embeds: [embed],
                        files: [transcript],
                      });
                      setTimeout(() => {
                        channel.delete();
                      }, 5000);
                    }
                  );
                }
              );
            }
          );
        }
        break;
      case "adduser-ticket-btn":
        {
          await interaction.reply({
            content: "Mention the user in chat.",
            ephemeral: true,
          });
          channel
            .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
            .then(async (col) => {
              let theu = col.first().mentions.members.first();
              if (!theu) {
                return channel
                  .send({ content: "The user wasn't mentioned in chat!" })
                  .then(async (m) => {
                    await col.first().delete();
                    setTimeout(() => {
                      m.delete();
                    }, 4000);
                  })
                  .catch(() => {});
              }

              if (theu?.partial) {
                await guild.members.fetch(theu?.id || theu);
              }

              try {
                channel.permissionOverwrites.edit(theu?.id, {
                  SendMessages: true,
                  ViewChannel: true,
                  ReadMessageHistory: true,
                });
                await channel
                  .send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.color)
                        .setDescription(
                          `<@${theu?.id}> was added to <#${channel.id}>`
                        ),
                    ],
                  })
                  .then(() => col.first().delete());
              } catch (e) {
                await channel
                  .send({ content: "I couldn't add that user to this ticket!" })
                  .then((m) =>
                    setTimeout(() => {
                      m.delete();
                    }, 2000)
                  )
                  .catch(() => {});
              }
            });
        }
        break;
      case "removeuser-ticket-btn":
        {
          await interaction.reply({
            content: "Mention the user in chat.",
            ephemeral: true,
          });
          channel
            .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
            .then(async (col) => {
              let theu = col.first().mentions.members.first();
              if (!theu) {
                return channel
                  .send({ content: "The user wasn't mentioned in chat!" })
                  .then(async (m) => {
                    await col.first().delete();
                    setTimeout(() => {
                      m.delete();
                    }, 4000);
                  })
                  .catch(() => {});
              }

              if (theu?.partial) {
                await guild.members.fetch(theu?.id || theu);
              }

              try {
                channel.permissionOverwrites.edit(theu?.id, {
                  SendMessages: false,
                  ViewChannel: false,
                  ReadMessageHistory: false,
                });
                await channel
                  .send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.color)
                        .setDescription(
                          `<@${theu?.id}> was removed from <#${channel.id}>`
                        ),
                    ],
                  })
                  .then(() => col.first().delete());
              } catch (e) {
                await channel
                  .send({
                    content: "I couldn't remove that user from this ticket!",
                  })
                  .then((m) =>
                    setTimeout(() => {
                      m.delete();
                    }, 2000)
                  )
                  .catch(() => {});
              }
            });
        }
        break;
      case "addrole-ticket-btn":
        {
          await interaction.reply({
            content: "Mention the role in chat.",
            ephemeral: true,
          });
          channel
            .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
            .then(async (col) => {
              let therole = col.first().mentions.roles.first();
              if (!therole) {
                return channel
                  .send({ content: "The role wasn't mentioned in chat!" })
                  .then(async (m) => {
                    await col.first().delete();
                    setTimeout(() => {
                      m.delete();
                    }, 4000);
                  })
                  .catch(() => {});
              }

              try {
                channel.permissionOverwrites.edit(therole.id, {
                  SendMessages: true,
                  ViewChannel: true,
                  ReadMessageHistory: true,
                });
                await channel
                  .send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.color)
                        .setDescription(
                          `<@&${therole.id}> was added to <#${channel.id}>`
                        ),
                    ],
                  })
                  .then(() => col.first().delete());
              } catch (e) {
                await channel
                  .send({ content: "I couldn't add that role to this ticket!" })
                  .then((m) =>
                    setTimeout(() => {
                      m.delete();
                    }, 2000)
                  )
                  .catch(() => {});
              }
            });
        }
        break;
      case "removerole-ticket-btn":
        {
          await interaction.reply({
            content: "Mention the role in chat.",
            ephemeral: true,
          });
          channel
            .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
            .then(async (col) => {
              let therole = col.first().mentions.roles.first();
              if (!therole) {
                return channel
                  .send({ content: "The role wasn't mentioned in chat!" })
                  .then(async (m) => {
                    await col.first().delete();
                    setTimeout(() => {
                      m.delete();
                    }, 4000);
                  })
                  .catch(() => {});
              }

              try {
                channel.permissionOverwrites.edit(therole.id, {
                  SendMessages: false,
                  ViewChannel: false,
                  ReadMessageHistory: false,
                });
                await channel
                  .send({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.color)
                        .setDescription(
                          `<@&${therole.id}> was removed from <#${channel.id}>`
                        ),
                    ],
                  })
                  .then(() => col.first().delete());
              } catch (e) {
                await channel
                  .send({
                    content: "I couldn't remove that role from this ticket!",
                  })
                  .then((m) =>
                    setTimeout(() => {
                      m.delete();
                    }, 2000)
                  )
                  .catch(() => {});
              }
            });
        }
        break;

      default:
        break;
    }
  },
};
