const { createTranscript } = require("discord-html-transcripts");
const {
  EmbedBuilder,
  ActionRowBuilder,
  SelectMenuBuilder,
  ChannelType,
  PermissionFlagsBits,
  OverwriteType,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const embed = new EmbedBuilder();
async function addTicket(interaction, client, guild, name, description) {
  const initSql = `SELECT * FROM panels WHERE GuildID = '${guild.id}' AND TicketName = '${name}'`;
  client.connection.query(initSql, function (err, rows) {
    if (err) {
      if (client.config.bot.debugMode) {
        console.log(err);
        return interaction.reply({
          content: "`Database error occured.`",
          ephemeral: true,
        });
      } else
        return interaction.reply({
          content: "`Database error occured.`",
          ephemeral: true,
        });
    }
    if (rows[0]) {
      return interaction.reply({
        content: "`This ticket name already exist in this guild.`",
        ephemeral: true,
      });
    }
    if (!rows[0]?.length) {
      const moreSql = `INSERT INTO panels (GuildID, TicketName, TicketDescription) VALUES ('${guild.id}', '${name}', '${description}')`;
      client.connection.query(moreSql, function (err) {
        if (err) {
          if (client.config.bot.debugMode) {
            console.log(err);
            return interaction.reply({
              content: "`Database error occured.`",
              ephemeral: true,
            });
          } else
            return interaction.reply({
              content: "`Database error occured.`",
              ephemeral: true,
            });
        }
        return interaction.reply({
          content: "Ticket Panel Created",
          ephemeral: true,
        });
      });
    }
  });
}
async function removeTicket(interaction, client, guild, name) {
  const initSql = `SELECT * FROM panels WHERE GuildID = '${guild.id}' AND TicketName = '${name}'`;
  client.connection.query(initSql, function (err, rows) {
    if (err) {
      if (client.config.bot.debugMode) {
        console.log(err);
        return interaction.reply({
          content: "`Database error occured.`",
          ephemeral: true,
        });
      } else
        return interaction.reply({
          content: "`Database error occured.`",
          ephemeral: true,
        });
    }
    if (rows[0]?.GuildID) {
      const moreSql = `DELETE FROM panels WHERE GuildID = '${guild.id}' AND TicketName = '${name}'`;
      client.connection.query(moreSql, function (err) {
        if (err) {
          if (client.config.bot.debugMode) {
            console.log(err);
            return interaction.reply({
              content: "`Database error occured.`",
              ephemeral: true,
            });
          } else
            return interaction.reply({
              content: "`Database error occured.`",
              ephemeral: true,
            });
        }
        return interaction.reply({
          content: "`Ticket Deleted from guild.`",
          ephemeral: true,
        });
      });
    }
    if (!rows[0]?.GuildID) {
      return interaction.reply({
        content: "`Ticket not found in this guild.`",
        ephemeral: true,
      });
    }
  });
}
async function sendTickets(interaction, client, guild, channel) {
  const initSql = `SELECT * FROM panels WHERE GuildID = '${guild.id}'`;
  client.connection.query(initSql, function (err, rows) {
    if (err) {
      if (client.config.bot.debugMode) {
        console.log(err);
        return interaction.reply({
          content: "`Database error occured.`",
          ephemeral: true,
        });
      } else
        return interaction.reply({
          content: "`Database error occured.`",
          ephemeral: true,
        });
    }
    if (!rows?.length) {
      return interaction.reply({
        content: "`No ticket categories created.`",
        ephemeral: true,
      });
    }
    let tickets = [];
    if (rows?.length) {
      for (const row of rows) {
        tickets.push({
          label: row.TicketName,
          value: row.TicketName,
          description: row.TicketDescription,
          emoji: "🎫",
        });
      }
      console.log(tickets);
      embed
        .setTitle("Ticket Categories")
        .setColor(client.config.theme.color)
        .setDescription(
          "Here are the current ticket categories for the guild. Select one of the options in order to open a ticket."
        )
        .setFooter({
          text: guild.name + " Ticket System",
          iconURL: client.user.displayAvatarURL(),
        })
        .setTimestamp();
      const menu = new ActionRowBuilder().setComponents(
        new SelectMenuBuilder()
          .setPlaceholder("Select a category")
          .setCustomId("ticket-categories")
          .setMaxValues(tickets.length)
          .setOptions(tickets)
      );
      channel.send({
        embeds: [embed],
        components: [menu],
      });
      return interaction.reply({
        content: "Ticket panel sent.",
        ephemeral: true,
      });
    }
  });
}
async function createTicket(interaction, client, guild) {
  const { member } = interaction;
  if (client.config.modules.tickets == false) {
    return interaction.reply({
      content: "Ticket module is disabled.",
      ephemeral: true,
    });
  }
  const initSql = `SELECT * FROM panels WHERE GuildID = '${guild.id}'`;
  client.connection.query(initSql, async function (err, rows) {
    if (err) {
      if (client.config.bot.debugMode) {
        console.log(err);
        return interaction.reply({
          content: "`Database error occured.`",
          ephemeral: true,
        });
      } else
        return interaction.reply({
          content: "`Database error occured.`",
          ephemeral: true,
        });
    }
    if (!rows?.length) {
      return interaction.reply({
        content: "`No ticket categories`",
        ephemeral: true,
      });
    }
    if (rows?.length) {
      const moreSql = `SELECT * FROM ticketsettings WHERE GuildID = '${guild.id}'`;
      client.connection.query(moreSql, async function (err, rowss) {
        if (err) {
          if (client.config.bot.debugMode) {
            console.log(err);
            return interaction.reply({
              content: "`Database error occured.`",
              ephemeral: true,
            });
          } else
            return interaction.reply({
              content: "`Database error occured.`",
              ephemeral: true,
            });
        }
        if (!rowss[0]?.GuildID == null) {
          return interaction.reply({
            content: "`No Ticket Settings`",
            ephemeral: true,
          });
        }
        if (rowss[0]?.GuildID) {
          const somuchSql = `SELECT * FROM ticketdata WHERE GuildID = '${guild.id}' AND OpenMember = '${member.id}' AND Closed = '0'`;
          client.connection.query(somuchSql, async function (err, rowsone) {
            if (err) {
              if (client.config.bot.debugMode) {
                console.log(err);
                return interaction.reply({
                  content: "`Database error occured.`",
                  ephemeral: true,
                });
              } else
                return interaction.reply({
                  content: "`Database error occured.`",
                  ephemeral: true,
                });
            }
            if (rowsone.length >= client.config.tickets.ticketlimit) {
              return interaction.reply({
                content: `You cannot have more than ${client.config.tickets.ticketlimit} ticket(s) open at more than one time.`,
                ephemeral: true,
              });
            }
            if (rowsone.length <= client.config.tickets.ticketlimit) {
              await guild.channels
                .create({
                  parent: rowss[0]?.Category,
                  name: "ticket-" + member.user.username,
                  type: ChannelType.GuildText,
                  permissionOverwrites: [
                    {
                      id: member.id,
                      allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.AttachFiles,
                      ],
                      type: OverwriteType.Member,
                    },
                    {
                      id: guild.roles.everyone.id,
                      deny: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.AttachFiles,
                      ],
                      type: OverwriteType.Role,
                    },
                    {
                      id: rowss[0].StaffRole,
                      allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.AttachFiles,
                      ],
                      type: OverwriteType.Role,
                    },
                  ],
                })
                .then(async (channel) => {
                  const againSql = `INSERT INTO ticketdata (GuildID, OpenMember, CreatedTimeStamp, TicketType, ChannelID, Locked, Closed) VALUES ('${guild.id}', '${member.id}', '${interaction.createdTimestamp}', '${interaction.values}', '${channel.id}', '0', '0')`;
                  client.connection.query(againSql, async function (err, rows) {
                    if (err) {
                      if (client.config.bot.debugMode) {
                        console.log(err);
                        return interaction.reply({
                          content: "`Database error occured.`",
                          ephemeral: true,
                        });
                      } else
                        return interaction.reply({
                          content: "`Database error occured.`",
                          ephemeral: true,
                        });
                    }
                    embed
                      .setTitle("Ticket " + member.user.username)
                      .setDescription(
                        "`Please start by describing your reason for creating a ticket.`"
                      )
                      .setThumbnail(client.user.displayAvatarURL())
                      .setFooter({
                        text: guild.name + " Ticket System",
                        iconURL: guild.iconURL(),
                      })
                      .setTimestamp();
                    const buttons = new ActionRowBuilder().setComponents(
                      new ButtonBuilder()
                        .setCustomId("dummy")
                        .setLabel("Close Controls:")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                      new ButtonBuilder()
                        .setCustomId("close-transcript")
                        .setLabel("Close & Transcript")
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji("🔑"),
                      new ButtonBuilder()
                        .setCustomId("close-no-transcript")
                        .setLabel("Close Without Transcript")
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji("🔑")
                    );
                    const moreButtons = new ActionRowBuilder().setComponents(
                      new ButtonBuilder()
                        .setCustomId("dummytwo")
                        .setLabel("Staff Controls:")
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true),
                      new ButtonBuilder()
                        .setCustomId("lock")
                        .setLabel("Lock Ticket")
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji("🔐"),
                      new ButtonBuilder()
                        .setCustomId("unlock")
                        .setLabel("Unlock Ticket")
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji("🔓")
                    );
                    const evenMoreButtons =
                      new ActionRowBuilder().setComponents(
                        new ButtonBuilder()
                          .setCustomId("dummythree")
                          .setLabel("User Controls:")
                          .setStyle(ButtonStyle.Secondary)
                          .setDisabled(true),
                        new ButtonBuilder()
                          .setCustomId("req-close")
                          .setLabel("Request Close")
                          .setStyle(ButtonStyle.Success)
                          .setEmoji("👋")
                      );
                    await channel.send({
                      content: "@everyone",
                      embeds: [embed],
                      components: [buttons, moreButtons, evenMoreButtons],
                    });
                    return interaction.reply({
                      content: "Ticket created",
                      ephemeral: true,
                    });
                  });
                });
            }
          });
        }
      });
    }
  });
}
async function ticketButtons(interaction, client, guild) {
  const { customId, member } = interaction;
  if (["lock"].includes(customId)) {
    if (client.config.modules.tickets == false) {
      return interaction.reply({
        content: "Ticket module is disabled.",
        ephemeral: true,
      });
    }
    const initSql = `SELECT * FROM ticketsettings WHERE GuildID = '${guild.id}'`;
    client.connection.query(initSql, function (err, rows) {
      if (err) {
        if (client.config.bot.debugMode) {
          console.log(err);
          return interaction.reply({
            content: "`Database error occured.`",
            ephemeral: true,
          });
        } else
          return interaction.reply({
            content: "`Database error occured.`",
            ephemeral: true,
          });
      }
      if (!rows[0]?.GuildID) {
        return interaction.reply({
          content: "No ticket settings found",
          ephemeral: true,
        });
      }
      if (rows[0]?.GuildID) {
        if (client.utils.permsCheck(rows[0].StaffRole, member) == false) {
          return interaction.reply({
            content: "These buttons are for staff only",
            ephemeral: true,
          });
        }
        const againSql = `SELECT * FROM ticketdata WHERE GuildID = '${guild.id}' AND ChannelID = '${interaction.channel.id}' AND Locked = '0'`;
        client.connection.query(againSql, function (err, rowsss) {
          if (err) {
            if (client.config.bot.debugMode) {
              console.log(err);
              return interaction.reply({
                content: "`Database error occured.`",
                ephemeral: true,
              });
            } else
              return interaction.reply({
                content: "`Database error occured.`",
                ephemeral: true,
              });
          }
          if (!rowsss[0]?.GuildID) {
            return interaction.reply({
              content:
                "No ticket data found\nThe ticket might be locked already.",
              ephemeral: true,
            });
          }
          if (rowsss[0]?.GuildID) {
            const lotsSql = `UPDATE ticketdata SET Locked = '1' WHERE GuildID = '${guild.id}' AND ChannelID = '${interaction.channel.id}' AND Locked = '0'`;
            client.connection.query(lotsSql, async function (err, results) {
              if (err) {
                if (client.config.bot.debugMode) {
                  console.log(err);
                  return interaction.reply({
                    content: "`Database error occured.`",
                    ephemeral: true,
                  });
                } else
                  return interaction.reply({
                    content: "`Database error occured.`",
                    ephemeral: true,
                  });
              }
              if (results.affectedRows == 0) {
                return interaction.reply({
                  content: "This ticket couldn't be locked!",
                  ephemeral: true,
                });
              }
              if (!results.affectedRows == 0) {
                await interaction.channel.permissionOverwrites.edit(
                  rowsss[0].OpenMember,
                  {
                    SendMessages: false,
                  }
                );
                await interaction.reply({
                  content: "Ticket was locked!",
                  ephemeral: true,
                });
                embed
                  .setColor(client.config.theme.color)
                  .setDescription(interaction.channel.name + " Locked");
                return interaction.channel?.send({ embeds: [embed] });
              }
            });
          }
        });
      }
    });
  } else if (["unlock"].includes(customId)) {
    if (client.config.modules.tickets == false) {
      return interaction.reply({
        content: "Ticket module is disabled.",
        ephemeral: true,
      });
    }
    const initSql = `SELECT * FROM ticketsettings WHERE GuildID = '${guild.id}'`;
    client.connection.query(initSql, function (err, rows) {
      if (err) {
        if (client.config.bot.debugMode) {
          console.log(err);
          return interaction.reply({
            content: "`Database error occured.`",
            ephemeral: true,
          });
        } else
          return interaction.reply({
            content: "`Database error occured.`",
            ephemeral: true,
          });
      }
      if (!rows[0]?.GuildID) {
        return interaction.reply({
          content: "No ticket settings found",
          ephemeral: true,
        });
      }
      if (rows[0]?.GuildID) {
        if (client.utils.permsCheck(rows[0].StaffRole, member) == false) {
          return interaction.reply({
            content: "These buttons are for staff only",
            ephemeral: true,
          });
        }
        const againSql = `SELECT * FROM ticketdata WHERE GuildID = '${guild.id}' AND ChannelID = '${interaction.channel.id}' AND Locked = '1'`;
        client.connection.query(againSql, function (err, rowsss) {
          if (err) {
            if (client.config.bot.debugMode) {
              console.log(err);
              return interaction.reply({
                content: "`Database error occured.`",
                ephemeral: true,
              });
            } else
              return interaction.reply({
                content: "`Database error occured.`",
                ephemeral: true,
              });
          }
          if (!rowsss[0]?.GuildID) {
            return interaction.reply({
              content:
                "No ticket data found\nThis ticket may be currently unlocked.",
              ephemeral: true,
            });
          }
          if (rowsss[0]?.GuildID) {
            const lotsSql = `UPDATE ticketdata SET Locked = '0' WHERE GuildID = '${guild.id}' AND ChannelID = '${interaction.channel.id}' AND Locked = '1'`;
            client.connection.query(lotsSql, async function (err, results) {
              if (err) {
                if (client.config.bot.debugMode) {
                  console.log(err);
                  return interaction.reply({
                    content: "`Database error occured.`",
                    ephemeral: true,
                  });
                } else
                  return interaction.reply({
                    content: "`Database error occured.`",
                    ephemeral: true,
                  });
              }
              if (results.affectedRows == 0) {
                return interaction.reply({
                  content: "This ticket couldn't be unlocked!",
                  ephemeral: true,
                });
              }
              if (!results.affectedRows == 0) {
                await interaction.channel.permissionOverwrites.edit(
                  rowsss[0].OpenMember,
                  {
                    SendMessages: true,
                  }
                );
                await interaction.reply({
                  content: "Ticket was unlocked!",
                  ephemeral: true,
                });
                embed
                  .setColor(client.config.theme.color)
                  .setDescription(interaction.channel.name + " Unlocked");
                return interaction.channel?.send({ embeds: [embed] });
              }
            });
          }
        });
      }
    });
  } else if (["req-close"].includes(customId)) {
    if (client.config.modules.tickets == false) {
      return interaction.reply({
        content: "Ticket module is disabled.",
        ephemeral: true,
      });
    }
    const initSql = `SELECT * FROM ticketdata WHERE GuildID = '${guild.id}' AND ChannelID = '${interaction.channel.id}'`;
    client.connection.query(initSql, async function (err, rows) {
      if (err) {
        if (client.config.bot.debugMode) {
          console.log(err);
          return interaction.reply({
            content: "`Database error occured.`",
            ephemeral: true,
          });
        } else
          return interaction.reply({
            content: "`Database error occured.`",
            ephemeral: true,
          });
      }
      if (!rows[0]?.GuildID) {
        return interaction.reply({
          content: "No ticket data found.",
          ephemeral: true,
        });
      }
      if (rows[0]?.GuildID) {
        if (member.id !== rows[0]?.OpenMember) {
          return interaction.reply({
            content: `Only <@${rows[0].OpenMember}> can request to close the ticket!`,
            ephemeral: true,
          });
        }
        embed
          .setTitle("Ticket Close Request")
          .setDescription(`A close requested was initiated.`)
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setFooter({
            text: `Requested By ${member.user.tag} | ${member.id}`,
            iconURL: member.user.displayAvatarURL({ dynamic: true, size: 128 }),
          });
        const closeButtons = new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId("dummyone")
            .setLabel("Staff Controls:")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("close-approve")
            .setLabel("Approve Request")
            .setStyle(ButtonStyle.Success)
            .setEmoji("👍")
            .setDisabled(false),
          new ButtonBuilder()
            .setCustomId("close-deny")
            .setLabel("Deny Request")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("👎")
            .setDisabled(false)
        );
        const closeButtonsUser = new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId("dummytwo")
            .setLabel("User Controls:")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true),
          new ButtonBuilder()
            .setCustomId("close-cancel")
            .setLabel("Cancel Request")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(false)
        );
        await interaction.reply({
          content: "A close request was created for your ticket.",
          ephemeral: true,
        });
        return interaction.channel?.send({
          embeds: [embed],
          components: [closeButtons, closeButtonsUser],
        });
      }
    });
  } else if (["close-transcript"].includes(customId)) {
    if (client.config.modules.tickets == false) {
      return interaction.reply({
        content: "Ticket module is disabled.",
        ephemeral: true,
      });
    }
    const initSql = `SELECT * FROM ticketsettings WHERE GuildID = '${guild.id}'`;
    client.connection.query(initSql, function (err, rows) {
      if (err) {
        if (client.config.bot.debugMode) {
          console.log(err);
          return interaction.reply({
            content: "`Database error occured.`",
            ephemeral: true,
          });
        } else
          return interaction.reply({
            content: "`Database error occured.`",
            ephemeral: true,
          });
      }
      if (!rows[0]?.GuildID) {
        return interaction.reply({
          content: "No ticket settings found",
          ephemeral: true,
        });
      }
      if (rows[0]?.GuildID) {
        if (client.utils.permsCheck(rows[0].StaffRole, member) == false) {
          return interaction.reply({
            content: "These buttons are for staff only",
            ephemeral: true,
          });
        }
        const againSql = `SELECT * FROM ticketdata WHERE GuildID = '${guild.id}' AND ChannelID = '${interaction.channel.id}' AND Closed = '0'`;
        client.connection.query(againSql, function (err, rowsss) {
          if (err) {
            if (client.config.bot.debugMode) {
              console.log(err);
              return interaction.reply({
                content: "`Database error occured.`",
                ephemeral: true,
              });
            } else
              return interaction.reply({
                content: "`Database error occured.`",
                ephemeral: true,
              });
          }
          if (!rowsss[0]?.GuildID) {
            return interaction.reply({
              content:
                "No ticket data found\nThis ticket may be currently showing closed.",
              ephemeral: true,
            });
          }
          if (rowsss[0]?.GuildID) {
            const lotsSql = `UPDATE ticketdata SET Closed = '1', CloseMember = '${member.id}', ClosedTimeStamp = '${interaction.createdTimestamp}' WHERE GuildID = '${guild.id}' AND ChannelID = '${interaction.channel.id}' AND Closed = '0'`;
            client.connection.query(lotsSql, async function (err, results) {
              if (err) {
                if (client.config.bot.debugMode) {
                  console.log(err);
                  return interaction.reply({
                    content: "`Database error occured.`",
                    ephemeral: true,
                  });
                } else
                  return interaction.reply({
                    content: "`Database error occured.`",
                    ephemeral: true,
                  });
              }
              if (results.affectedRows == 0) {
                return interaction.reply({
                  content: "This ticket couldn't be closed!",
                  ephemeral: true,
                });
              }
              if (!results.affectedRows == 0) {
                await interaction.channel.permissionOverwrites.edit(
                  rowsss[0].OpenMember,
                  {
                    SendMessages: false,
                    ViewChannel: false,
                    ReadMessageHistory: false,
                    AttachFiles: false,
                  }
                );
                await interaction.reply({
                  content: "Ticket was closed!",
                  ephemeral: true,
                });
                embed
                  .setColor(client.config.theme.color)
                  .setDescription(interaction.channel.name + " Closed");
                await interaction.channel?.send({ embeds: [embed] });
                const transcriptChannel = await guild.channels.cache.get(
                  rows[0]?.TranscriptChannel
                );
                if (!transcriptChannel) {
                  return interaction.channel?.send({
                    embeds: [
                      embed
                        .setColor(client.config.theme.color)
                        .setDescription(
                          "Failed to transcript due to no log channel."
                        ),
                    ],
                  });
                }
                if (transcriptChannel) {
                  let locked = rowsss[0].Locked;
                  let lockedStatus = "";
                  if (locked === 0) {
                    lockedStatus = "No";
                  }
                  if (locked === 1) {
                    lockedStatus = "Yes";
                  }
                  let closed = rowsss[0].Closed;
                  let closedStatus = "";
                  if (closed === 0) {
                    closedStatus = "No";
                  }
                  if (closed === 1) {
                    closedStatus = "Yes";
                  }
                  const channelMessage =
                    await interaction.channel.messages.fetch();
                  let members = channelMessage.map((m) => m.author.tag);
                  let dups = (arr) =>
                    arr.filter((item, index) => arr.indexOf(item) !== index);
                  const finalMembers = [...new Set(dups(members))];
                  const transcriptEmbed = new EmbedBuilder()
                    .setColor(client.config.theme.color)
                    .setTitle(`Transcript ` + rowsss[0].TicketID)
                    .setFields(
                      {
                        name: "`Ticket Information`",
                        value: `
                        **Ticket Guild:** ${guild.name} (${guild.id})
                        **Ticket Name:** ${interaction.channel.name} (${
                          interaction.channel.id
                        })
                        **Ticket Type:** ${rowsss[0].TicketType}
                        **Ticket ID:** ${rowsss[0].TicketID}
                        **Locked:** ${lockedStatus}
                        **Closed:** ${closedStatus}
                        **Created At:** <t:${parseInt(
                          rowsss[0].CreatedTimestamp / 1000
                        )}:R>
                        **Closed At:** <t:${parseInt(
                          interaction.createdTimestamp / 1000
                        )}:R>
                        **Opened By:** <@${rowsss[0].OpenMember}> (${
                          rowsss[0].OpenMember
                        })
                        **Closed By:** <@${member.id}> (${member.id})
                        `,
                        inline: true,
                      },
                      {
                        name: "`Members in Ticket`",
                        value: `Total Messages: ${
                          interaction.channel.messages.cache.size
                        }\n${finalMembers.join("\n")}`,
                        inline: true,
                      }
                    )
                    .setThumbnail(guild.iconURL({ dynamic: true, size: 128 }))
                    .setFooter({ text: "Transcripted " })
                    .setTimestamp();
                  const ticketUser = await guild.members.cache.get(
                    rowsss[0].OpenMember
                  );
                  const transcriptFile = await createTranscript(
                    interaction.channel,
                    {
                      limit: -1,
                      returnType: "attachment",
                      poweredBy: false,
                      filename: `transcript-${ticketUser.user.username}.html`,
                    }
                  );
                  await transcriptChannel?.send({
                    embeds: [transcriptEmbed],
                    files: [transcriptFile],
                  });
                  setTimeout(() => {
                    return interaction.channel.delete("Ticket Closed");
                  }, 5000);
                }
              }
            });
          }
        });
      }
    });
  } else if (["close-no-transcript"].includes(customId)) {
    if (client.config.modules.tickets == false) {
      return interaction.reply({
        content: "Ticket module is disabled.",
        ephemeral: true,
      });
    }
    const initSql = `SELECT * FROM ticketsettings WHERE GuildID = '${guild.id}'`;
    client.connection.query(initSql, function (err, rows) {
      if (err) {
        if (client.config.bot.debugMode) {
          console.log(err);
          return interaction.reply({
            content: "`Database error occured.`",
            ephemeral: true,
          });
        } else
          return interaction.reply({
            content: "`Database error occured.`",
            ephemeral: true,
          });
      }
      if (!rows[0]?.GuildID) {
        return interaction.reply({
          content: "No ticket settings found",
          ephemeral: true,
        });
      }
      if (rows[0]?.GuildID) {
        if (client.utils.permsCheck(rows[0].StaffRole, member) == false) {
          return interaction.reply({
            content: "These buttons are for staff only",
            ephemeral: true,
          });
        }
        const againSql = `SELECT * FROM ticketdata WHERE GuildID = '${guild.id}' AND ChannelID = '${interaction.channel.id}' AND Closed = '0'`;
        client.connection.query(againSql, function (err, rowsss) {
          if (err) {
            if (client.config.bot.debugMode) {
              console.log(err);
              return interaction.reply({
                content: "`Database error occured.`",
                ephemeral: true,
              });
            } else
              return interaction.reply({
                content: "`Database error occured.`",
                ephemeral: true,
              });
          }
          if (!rowsss[0]?.GuildID) {
            return interaction.reply({
              content:
                "No ticket data found\nThis ticket may be currently showing closed.",
              ephemeral: true,
            });
          }
          if (rowsss[0]?.GuildID) {
            const lotsSql = `UPDATE ticketdata SET Closed = '1', CloseMember = '${member.id}', ClosedTimeStamp = '${interaction.createdTimestamp}' WHERE GuildID = '${guild.id}' AND ChannelID = '${interaction.channel.id}' AND Closed = '0'`;
            client.connection.query(lotsSql, async function (err, results) {
              if (err) {
                if (client.config.bot.debugMode) {
                  console.log(err);
                  return interaction.reply({
                    content: "`Database error occured.`",
                    ephemeral: true,
                  });
                } else
                  return interaction.reply({
                    content: "`Database error occured.`",
                    ephemeral: true,
                  });
              }
              if (results.affectedRows == 0) {
                return interaction.reply({
                  content: "This ticket couldn't be closed!",
                  ephemeral: true,
                });
              }
              if (!results.affectedRows == 0) {
                await interaction.channel.permissionOverwrites.edit(
                  rowsss[0].OpenMember,
                  {
                    SendMessages: false,
                    ViewChannel: false,
                    ReadMessageHistory: false,
                    AttachFiles: false,
                  }
                );
                await interaction.reply({
                  content: "Ticket was closed!",
                  ephemeral: true,
                });
                embed
                  .setColor(client.config.theme.color)
                  .setDescription(interaction.channel.name + " Closed");
                await interaction.channel?.send({ embeds: [embed] });
                setTimeout(() => {
                  return interaction.channel.delete("Ticket Closed");
                }, 5000);
              }
            });
          }
        });
      }
    });
  }
}
exports.addTicket = addTicket;
exports.removeTicket = removeTicket;
exports.sendTickets = sendTickets;
exports.createTicket = createTicket;
exports.ticketButtons = ticketButtons;
