module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isButton()) {
      const { customId, member, message, guild } = interaction;
      client.tickets.ticketButtons(interaction, client, interaction.guild);
      if (["close-approve"].includes(customId)) {
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
              content: "No ticket settings found for this guild.",
              ephemeral: true,
            });
          }
          if (rows[0]?.GuildID) {
            if (client.utils.permsCheck(rows[0]?.StaffRole, member) == false) {
              return interaction.reply({
                content: "These buttons are for staff only",
                ephemeral: true,
              });
            }
            const moreSql = `SELECT * FROM ticketdata WHERE GuildID = '${guild.id}' AND ChannelID = '${interaction.channel.id}'`;
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
              if (!rowss[0]?.GuildID) {
                return interaction.reply({
                  content: "No ticket data found.",
                  ephemeral: true,
                });
              }
              if (rowss[0]?.GuildID) {
                await interaction.reply({
                  content: "Approving Close request.",
                  ephemeral: true,
                });
                setTimeout(async () => {
                  await interaction.editReply({
                    content: "Approving Close request..",
                    ephemeral: true,
                  });
                }, 500);
                setTimeout(async () => {
                  await interaction.editReply({
                    content: "Approving Close request...",
                    ephemeral: true,
                  });
                }, 750);

                const ticketUser = await guild.members.cache.get(
                  rowss[0].OpenMember
                );
                if (!ticketUser) {
                  return interaction.editReply({
                    content:
                      "I couldn't find the original user who created this ticket within the guild.",
                    ephemeral: true,
                  });
                }
                if (ticketUser) {
                  await ticketUser
                    ?.send({
                      content: `<#${interaction.channel.id}>'s close request was approved!`,
                    })
                    .catch(() => {});
                  const messageEmbed = EmbedBuilder.from(
                    message.embeds[0]
                  ).setDescription(
                    `Close request was approved by <@${member.id}>`
                  );
                  const buttons = ActionRowBuilder.from(
                    message.components[0]
                  ).setComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy")
                      .setDisabled(true)
                      .setLabel("Close Request Approved")
                      .setStyle(ButtonStyle.Secondary),
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
                  message.components.pop();
                  message.edit({
                    embeds: [messageEmbed],
                    components: [buttons],
                  });
                  setTimeout(() => {
                    interaction.editReply({
                      content:
                        "The user was notified and the close process begins.",
                      ephemeral: true,
                    });
                  }, 2000);
                }
              }
            });
          }
        });
      } else if (["close-deny"].includes(customId)) {
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
              content: "No ticket settings found for this guild.",
              ephemeral: true,
            });
          }
          if (rows[0]?.GuildID) {
            if (client.utils.permsCheck(rows[0]?.StaffRole, member) == false) {
              return interaction.reply({
                content: "These buttons are for staff only",
                ephemeral: true,
              });
            }
            const moreSql = `SELECT * FROM ticketdata WHERE GuildID = '${guild.id}' AND ChannelID = '${interaction.channel.id}'`;
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
              if (!rowss[0]?.GuildID) {
                return interaction.reply({
                  content: "No ticket data found.",
                  ephemeral: true,
                });
              }
              if (rowss[0]?.GuildID) {
                await interaction.reply({
                  content: "Denying Close request.",
                  ephemeral: true,
                });
                setTimeout(async () => {
                  await interaction.editReply({
                    content: "Denying Close request..",
                    ephemeral: true,
                  });
                }, 500);
                setTimeout(async () => {
                  await interaction.editReply({
                    content: "Denying Close request...",
                    ephemeral: true,
                  });
                }, 750);
                const ticketUser = await guild.members.cache.get(
                  rowss[0].OpenMember
                );
                if (!ticketUser) {
                  return interaction.editReply({
                    content:
                      "I couldn't find the original user who created this ticket within the guild.",
                    ephemeral: true,
                  });
                }
                if (ticketUser) {
                  await ticketUser
                    ?.send({
                      content: `<#${interaction.channel.id}>'s close request was denied!`,
                    })
                    .catch(() => {});
                  const messageEmbed = EmbedBuilder.from(
                    message.embeds[0]
                  ).setDescription(
                    `Close request was denied by <@${member.id}>`
                  );
                  const buttons = ActionRowBuilder.from(
                    message.components[0]
                  ).setComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy")
                      .setDisabled(true)
                      .setLabel("Close Request Denied")
                      .setStyle(ButtonStyle.Secondary)
                  );
                  message.components.pop();
                  message.edit({
                    embeds: [messageEmbed],
                    components: [buttons],
                  });
                  setTimeout(() => {
                    interaction.editReply({
                      content:
                        "The user was notified and the ticket remains open.",
                      ephemeral: true,
                    });
                  }, 2000);
                }
              }
            });
          }
        });
      } else if (["close-cancel"].includes(customId)) {
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
              content: "No ticket settings found for this guild.",
              ephemeral: true,
            });
          }
          if (rows[0]?.GuildID) {
            const moreSql = `SELECT * FROM ticketdata WHERE GuildID = '${guild.id}' AND ChannelID = '${interaction.channel.id}'`;
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
              if (!rowss[0]?.GuildID) {
                return interaction.reply({
                  content: "No ticket data found.",
                  ephemeral: true,
                });
              }
              if (rowss[0]?.GuildID) {
                if (member.id !== rowss[0].OpenMember) {
                  return interaction.reply({
                    content: `Only <@${rowss[0].OpenMember}> can cancel the request.`,
                    ephemeral: true,
                  });
                }
                await interaction.reply({
                  content: "Cancelling Close request.",
                  ephemeral: true,
                });
                setTimeout(async () => {
                  await interaction.editReply({
                    content: "Cancelling Close request..",
                    ephemeral: true,
                  });
                }, 500);
                setTimeout(async () => {
                  await interaction.editReply({
                    content: "Cancelling Close request...",
                    ephemeral: true,
                  });
                }, 750);
                const ticketUser = await guild.members.cache.get(
                  rowss[0].OpenMember
                );
                if (!ticketUser) {
                  return interaction.editReply({
                    content:
                      "I couldn't find the original user who created this ticket within the guild.",
                    ephemeral: true,
                  });
                }
                if (ticketUser) {
                  await ticketUser
                    ?.send({
                      content: `<#${interaction.channel.id}>'s close request was cancelled!`,
                    })
                    .catch(() => {});
                  const messageEmbed = EmbedBuilder.from(
                    message.embeds[0]
                  ).setDescription(
                    `Close request was cancelled by <@${member.id}>`
                  );
                  const buttons = ActionRowBuilder.from(
                    message.components[0]
                  ).setComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy")
                      .setDisabled(true)
                      .setLabel("Close Request Cancelled")
                      .setStyle(ButtonStyle.Secondary)
                  );
                  message.components.pop();
                  message.edit({
                    embeds: [messageEmbed],
                    components: [buttons],
                  });
                  setTimeout(() => {
                    interaction.editReply({
                      content: "The request was cancelled.",
                      ephemeral: true,
                    });
                  }, 2000);
                }
              }
            });
          }
        });
      }
    }
  },
};
