const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType,
  SelectMenuBuilder,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isButton()) {
      let { customId, guild, channel } = interaction;
      let panelid = interaction?.message?.embeds[0]?.footer?.text;
      let tid = interaction?.message?.embeds[0]?.fields[1]?.value;
      let btn = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("set-logs-drp")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Set Logs"),
        new ButtonBuilder()
          .setCustomId("set-cat-drp")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Set Category"),
        new ButtonBuilder()
          .setCustomId("add-ticket-drp")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Add Ticket")
      );
      let btns = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("add-role-drp")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Add Role"),
        new ButtonBuilder()
          .setCustomId("remove-role-drp")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Remove Role"),
        new ButtonBuilder()
          .setCustomId("send-drp")
          .setStyle(ButtonStyle.Success)
          .setLabel("Send Panel")
      );
      let buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("drp-ticket-name")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Set Name"),
        new ButtonBuilder()
          .setCustomId("drp-ticket-desc")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Set Description"),
        new ButtonBuilder()
          .setCustomId("drp-ticket-home")
          .setStyle(ButtonStyle.Danger)
          .setLabel("Back to Panel Builder"),
        new ButtonBuilder()
          .setCustomId("drp-ticket-delete")
          .setStyle(ButtonStyle.Danger)
          .setLabel("Delete")
      );
      switch (customId) {
        case "set-logs-drp":
          {
            let question = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("dummy")
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary)
                .setLabel("Mention the log channel!")
            );
            await interaction.update({
              components: [question],
              ephemeral: true,
            });
            channel
              .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
              .then(async (col) => {
                let thechan = col.first().mentions.channels.first();
                if (!thechan) {
                  await interaction.editReply({
                    components: [btn, btns],
                    ephemeral: true,
                  });
                  return channel
                    .send("There was no mentioned channel.")
                    .then((m) =>
                      setTimeout(() => {
                        m.delete();
                      }, 4000)
                    );
                }
                if (thechan.type !== ChannelType.GuildText) {
                  await interaction.editReply({
                    components: [btn, btns],
                    ephemeral: true,
                  });
                  return channel
                    .send(
                      "The mentioned channel wasn't a text channel from this guild!"
                    )
                    .then((m) =>
                      setTimeout(() => {
                        m.delete();
                      }, 4000)
                    );
                }

                await client.con.query(
                  `UPDATE drppanels SET LogChannelID = "${thechan.id}"  WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                  async (e) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    await client.con.query(
                      `SELECT * FROM drppanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                      async (e, row) => {
                        if (e) {
                          if (client.config.debugmode) {
                            console.log(e.stack);
                          }
                        }
                        await client.con.query(
                          `SELECT * FROM drproles WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                          async (e, rows) => {
                            if (e) {
                              if (client.config.debugmode) {
                                console.log(e.stack);
                              }
                            }
                            await client.con.query(
                              `SELECT * FROM drptickets WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                              async (e, trows) => {
                                if (e) {
                                  if (client.config.debugmode) {
                                    console.log(e.stack);
                                  }
                                }
                                let data = row[0];
                                let tickets = [];
                                let roles = [];
                                rows.forEach((r) => {
                                  roles.push(`<@&${r.RoleID}>`);
                                });
                                if (roles.length == 0) {
                                  roles.push("None Added");
                                }
                                trows.forEach((t) => {
                                  tickets.push(`${t.TicketID}. ${t.Name}`);
                                });
                                if (tickets.length == 0) {
                                  tickets.push("None Added");
                                }
                                let embed = new EmbedBuilder()
                                  .setColor(client.config.color)
                                  .setTitle("Create Dropdown Panel")
                                  .setDescription(
                                    `>>> **Logging Channel:** - <#${data?.LogChannelID}>\n**Category:** - <#${data?.CategoryID}>`
                                  )
                                  .addFields(
                                    {
                                      name: "**Added Tickets**",
                                      value: `${tickets.join("\n")}`,
                                      inline: true,
                                    },
                                    {
                                      name: "Added Roles",
                                      value: `${roles.join("\n")}`,
                                      inline: true,
                                    }
                                  )
                                  .setFooter({ text: `${data.PanelID}` });

                                await interaction
                                  .editReply({
                                    embeds: [embed],
                                    components: [btn, btns],
                                    ephemeral: true,
                                  })
                                  .then(() => col.first().delete());
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              });
          }

          break;
        case "set-cat-drp":
          {
            let question = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("dummy")
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary)
                .setLabel("Mention the category; <#cat_id>!")
            );
            await interaction.update({
              components: [question],
              ephemeral: true,
            });
            channel
              .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
              .then(async (col) => {
                let thecat = col.first().mentions.channels.first();
                if (!thecat) {
                  await interaction.editReply({
                    components: [btn, btns],
                    ephemeral: true,
                  });
                  return channel
                    .send("There was no mentioned channel.")
                    .then((m) =>
                      setTimeout(() => {
                        m.delete();
                      }, 4000)
                    );
                }
                if (thecat.type !== ChannelType.GuildCategory) {
                  await interaction.editReply({
                    components: [btn, btns],
                    ephemeral: true,
                  });
                  return channel
                    .send(
                      "The mentioned channel wasn't a category from this guild!"
                    )
                    .then((m) =>
                      setTimeout(() => {
                        m.delete();
                      }, 4000)
                    );
                }

                await client.con.query(
                  `UPDATE drppanels SET CategoryID = "${thecat.id}"  WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                  async (e) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    await client.con.query(
                      `SELECT * FROM drppanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                      async (e, row) => {
                        if (e) {
                          if (client.config.debugmode) {
                            console.log(e.stack);
                          }
                        }
                        await client.con.query(
                          `SELECT * FROM drproles WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                          async (e, rows) => {
                            if (e) {
                              if (client.config.debugmode) {
                                console.log(e.stack);
                              }
                            }
                            await client.con.query(
                              `SELECT * FROM drptickets WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                              async (e, trows) => {
                                if (e) {
                                  if (client.config.debugmode) {
                                    console.log(e.stack);
                                  }
                                }
                                let data = row[0];
                                let tickets = [];
                                let roles = [];
                                rows.forEach((r) => {
                                  roles.push(`<@&${r.RoleID}>`);
                                });
                                if (roles.length == 0) {
                                  roles.push("None Added");
                                }
                                trows.forEach((t) => {
                                  tickets.push(`${t.TicketID}. ${t.Name}`);
                                });
                                if (tickets.length == 0) {
                                  tickets.push("None Added");
                                }
                                let embed = new EmbedBuilder()
                                  .setColor(client.config.color)
                                  .setTitle("Create Dropdown Panel")
                                  .setDescription(
                                    `>>> **Logging Channel:** - <#${data?.LogChannelID}>\n**Category:** - <#${data?.CategoryID}>`
                                  )
                                  .addFields(
                                    {
                                      name: "**Added Tickets**",
                                      value: `${tickets.join("\n")}`,
                                      inline: true,
                                    },
                                    {
                                      name: "Added Roles",
                                      value: `${roles.join("\n")}`,
                                      inline: true,
                                    }
                                  )
                                  .setFooter({ text: `${data.PanelID}` });

                                await interaction
                                  .editReply({
                                    embeds: [embed],
                                    components: [btn, btns],
                                    ephemeral: true,
                                  })
                                  .then(() => col.first().delete());
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              });
          }

          break;
        case "add-ticket-drp":
          {
            await client.con.query(
              `SELECT COUNT(*) as total FROM drptickets`,
              async (e, res) => {
                if (e) {
                  if (client.config.debugmode) {
                    console.log(e.stack);
                  }
                }
                let ticketid = res[0]?.total + 1;
                await client.con.query(
                  `SELECT * FROM drptickets WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}' AND TicketID = '${ticketid}'`,
                  async (e, row) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    if (row[0]) {
                      ticketid++;
                    }
                    await client.con.query(
                      `INSERT INTO drptickets (GuildID, PanelID, TicketID, Name, Description) VALUES ("${guild.id}", "${panelid}", "${ticketid}", "none", "none")`,
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
                      .setTitle("Create Ticket")
                      .setDescription(
                        ">>> **Ticket Name:** - Not Created\n**Ticket Description:** Not Created"
                      )
                      .addFields(
                        {
                          name: "Rules",
                          value:
                            "Please keep the description short and sweet. It should not be longer than 50 characters, due to discord limits.\n**Example:** `Use this for support`.",
                          inline: true,
                        },
                        {
                          name: "Ticket ID",
                          value: `${ticketid}`,
                          inline: false,
                        }
                      )
                      .setFooter({ text: `${panelid}` });
                    let buttons = new ActionRowBuilder().addComponents(
                      new ButtonBuilder()
                        .setCustomId("drp-ticket-name")
                        .setStyle(ButtonStyle.Primary)
                        .setLabel("Set Name"),
                      new ButtonBuilder()
                        .setCustomId("drp-ticket-desc")
                        .setStyle(ButtonStyle.Primary)
                        .setLabel("Set Description"),
                      new ButtonBuilder()
                        .setCustomId("drp-ticket-home")
                        .setStyle(ButtonStyle.Danger)
                        .setLabel("Back to Panel Builder"),
                      new ButtonBuilder()
                        .setCustomId("drp-ticket-delete")
                        .setStyle(ButtonStyle.Danger)
                        .setLabel("Delete")
                    );
                    await interaction.update({
                      embeds: [embed],
                      components: [buttons],
                      ephemeral: true,
                    });
                  }
                );
              }
            );
          }

          break;
        case "add-role-drp":
          {
            let question = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("dummy")
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary)
                .setLabel("Mention a role that can view this ticket type")
            );
            await interaction.update({
              components: [question],
              ephemeral: true,
            });
            channel
              .awaitMessages({ max: 1, time: 60000, errors: ["time"] })
              .then(async (col) => {
                let therole = col.first().mentions.roles.first();
                if (!therole) {
                  await interaction.editReply({
                    components: [btn, btns],
                    ephemeral: true,
                  });
                  return channel.send("There was no role mentions").then((m) =>
                    setTimeout(() => {
                      m.delete();
                    }, 4000)
                  );
                }
                await client.con.query(
                  `INSERT INTO drproles (GuildID, PanelID, RoleID) VALUES ("${guild.id}", "${panelid}", "${therole.id}")`,
                  async (e) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    await client.con.query(
                      `SELECT * FROM drppanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                      async (e, row) => {
                        if (e) {
                          if (client.config.debugmode) {
                            console.log(e.stack);
                          }
                        }
                        await client.con.query(
                          `SELECT * FROM drproles WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                          async (e, rows) => {
                            if (e) {
                              if (client.config.debugmode) {
                                console.log(e.stack);
                              }
                            }
                            await client.con.query(
                              `SELECT * FROM drptickets WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                              async (e, trows) => {
                                if (e) {
                                  if (client.config.debugmode) {
                                    console.log(e.stack);
                                  }
                                }
                                let data = row[0];
                                let tickets = [];
                                let roles = [];
                                rows.forEach((r) => {
                                  roles.push(`<@&${r.RoleID}>`);
                                });
                                if (roles.length == 0) {
                                  roles.push("None Added");
                                }
                                trows.forEach((t) => {
                                  tickets.push(`${t.TicketID}. ${t.Name}`);
                                });
                                if (tickets.length == 0) {
                                  tickets.push("None Added");
                                }
                                let embed = new EmbedBuilder()
                                  .setColor(client.config.color)
                                  .setTitle("Create Dropdown Panel")
                                  .setDescription(
                                    `>>> **Logging Channel:** - <#${data?.LogChannelID}>\n**Category:** - <#${data?.CategoryID}>`
                                  )
                                  .addFields(
                                    {
                                      name: "**Added Tickets**",
                                      value: `${tickets.join("\n")}`,
                                      inline: true,
                                    },
                                    {
                                      name: "Added Roles",
                                      value: `${roles.join("\n")}`,
                                      inline: true,
                                    }
                                  )
                                  .setFooter({ text: `${data.PanelID}` });

                                await interaction
                                  .editReply({
                                    embeds: [embed],
                                    components: [btn, btns],
                                    ephemeral: true,
                                  })
                                  .then(() => col.first().delete());
                              }
                            );
                          }
                        );
                      }
                    );
                  }
                );
              });
          }

          break;
        case "remove-role-drp":
          {
            let question = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("dummy")
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary)
                .setLabel("Remove one of the added roles from this panel")
            );
            await interaction.update({
              components: [question],
              ephemeral: true,
            });
            channel
              .awaitMessages({ max: 1, time: 60000, errors: ["time"] })
              .then(async (col) => {
                let therole = col.first().mentions.roles.first();
                if (!therole) {
                  await interaction.editReply({
                    components: [btn, btns],
                    ephemeral: true,
                  });
                  return channel.send("There was no role mentions").then((m) =>
                    setTimeout(() => {
                      m.delete();
                    }, 4000)
                  );
                }
                await client.con.query(
                  `SELECT * FROM drproles WHERE GuildID = "${guild.id}" AND PanelID = "${panelid}" AND RoleID = "${therole.id}"`,
                  async (e, row) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    if (row[0]) {
                      await client.con.query(
                        `DELETE FROM drproles WHERE GuildID = "${guild.id}" AND PanelID = "${panelid}" AND RoleID = "${therole.id}"`,
                        async (e) => {
                          if (e) {
                            if (client.config.debugmode) {
                              console.log(e.stack);
                            }
                          }
                          await client.con.query(
                            `SELECT * FROM drppanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                            async (e, row) => {
                              if (e) {
                                if (client.config.debugmode) {
                                  console.log(e.stack);
                                }
                              }
                              await client.con.query(
                                `SELECT * FROM drproles WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                                async (e, rows) => {
                                  if (e) {
                                    if (client.config.debugmode) {
                                      console.log(e.stack);
                                    }
                                  }
                                  await client.con.query(
                                    `SELECT * FROM drptickets WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                                    async (e, trows) => {
                                      if (e) {
                                        if (client.config.debugmode) {
                                          console.log(e.stack);
                                        }
                                      }
                                      let data = row[0];
                                      let tickets = [];
                                      let roles = [];
                                      rows.forEach((r) => {
                                        roles.push(`<@&${r.RoleID}>`);
                                      });
                                      if (roles.length == 0) {
                                        roles.push("None Added");
                                      }
                                      trows.forEach((t) => {
                                        tickets.push(
                                          `${t.TicketID}. ${t.Name}`
                                        );
                                      });
                                      if (tickets.length == 0) {
                                        tickets.push("None Added");
                                      }
                                      let embed = new EmbedBuilder()
                                        .setColor(client.config.color)
                                        .setTitle("Create Dropdown Panel")
                                        .setDescription(
                                          `>>> **Logging Channel:** - <#${data?.LogChannelID}>\n**Category:** - <#${data?.CategoryID}>`
                                        )
                                        .addFields(
                                          {
                                            name: "**Added Tickets**",
                                            value: `${tickets.join("\n")}`,
                                            inline: true,
                                          },
                                          {
                                            name: "Added Roles",
                                            value: `${roles.join("\n")}`,
                                            inline: true,
                                          }
                                        )
                                        .setFooter({
                                          text: `${data.PanelID}`,
                                        });

                                      await interaction
                                        .editReply({
                                          embeds: [embed],
                                          components: [btn, btns],
                                          ephemeral: true,
                                        })
                                        .then(() => col.first().delete());
                                    }
                                  );
                                }
                              );
                            }
                          );
                        }
                      );
                    } else if (!row[0]) {
                      await interaction.editReply({
                        components: [btn, btns],
                        ephemeral: true,
                      });
                      return channel
                        .send("There was no role found for that panel!")
                        .then((m) =>
                          setTimeout(() => {
                            m.delete();
                          }, 4000)
                        );
                    }
                  }
                );
              });
          }
          break;
        case "drp-ticket-name":
          {
            let question = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("dummy")
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary)
                .setLabel("The ticket name")
            );

            await interaction.update({
              components: [question],
              ephemeral: true,
            });
            channel
              .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
              .then(async (col) => {
                let thename = col.first();
                if (!thename) {
                  await interaction.editReply({
                    components: [buttons],
                    ephemeral: true,
                  });
                  return channel
                    .send("There was no title sent to the channel!")
                    .then((m) =>
                      setTimeout(() => {
                        m.delete();
                      }, 4000)
                    );
                }
                await client.con.query(
                  `UPDATE drptickets SET Name = "${thename}" WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}' AND TicketID = '${tid}'`,
                  async (e) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    await client.con.query(
                      `SELECT * FROM drptickets WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}' AND TicketID = '${tid}'`,
                      async (e, row) => {
                        if (e) {
                          if (client.config.debugmode) {
                            console.log(e.stack);
                          }
                        }

                        let embed = new EmbedBuilder()
                          .setColor(client.config.color)
                          .setTitle("Create Ticket")
                          .setDescription(
                            `>>> **Ticket Name:** - ${row[0]?.Name}\n**Ticket Description:** ${row[0]?.Description}`
                          )
                          .addFields(
                            {
                              name: "Rules",
                              value:
                                "Please keep the description short and sweet. It should not be longer than 50 characters, due to discord limits.\n**Example:** `Use this for support`.",
                              inline: true,
                            },
                            {
                              name: "Ticket ID",
                              value: `${tid}`,
                              inline: false,
                            }
                          )
                          .setFooter({ text: `${panelid}` });
                        await interaction
                          .editReply({
                            embeds: [embed],
                            components: [buttons],
                            ephemeral: true,
                          })
                          .then(async () => {
                            await col.first().delete();
                          });
                      }
                    );
                  }
                );
              });
          }

          break;
        case "drp-ticket-desc":
          {
            let question = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("dummy")
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary)
                .setLabel("The ticket description (50 Characters MAX)!")
            );

            await interaction.update({
              components: [question],
              ephemeral: true,
            });
            channel
              .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
              .then(async (col) => {
                let thedesc = col.first();
                if (!thedesc) {
                  await interaction.editReply({
                    components: [buttons],
                    ephemeral: true,
                  });
                  return channel
                    .send("There was no description sent to the channel!")
                    .then((m) =>
                      setTimeout(() => {
                        m.delete();
                      }, 4000)
                    );
                }
                await client.con.query(
                  `UPDATE drptickets SET Description = "${thedesc}" WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}' AND TicketID = '${tid}'`,
                  async (e) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    await client.con.query(
                      `SELECT * FROM drptickets WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}' AND TicketID = '${tid}'`,
                      async (e, row) => {
                        if (e) {
                          if (client.config.debugmode) {
                            console.log(e.stack);
                          }
                        }

                        let embed = new EmbedBuilder()
                          .setColor(client.config.color)
                          .setTitle("Create Ticket")
                          .setDescription(
                            `>>> **Ticket Name:** - ${row[0]?.Name}\n**Ticket Description:** ${row[0]?.Description}`
                          )
                          .addFields(
                            {
                              name: "Rules",
                              value:
                                "Please keep the description short and sweet. It should not be longer than 50 characters, due to discord limits.\n**Example:** `Use this for support`.",
                              inline: true,
                            },
                            {
                              name: "Ticket ID",
                              value: `${tid}`,
                              inline: false,
                            }
                          )
                          .setFooter({ text: `${panelid}` });
                        await interaction
                          .editReply({
                            embeds: [embed],
                            components: [buttons],
                            ephemeral: true,
                          })
                          .then(async () => {
                            await col.first().delete();
                          });
                      }
                    );
                  }
                );
              });
          }

          break;
        case "drp-ticket-home":
          {
            await client.con.query(
              `SELECT * FROM drppanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
              async (e, row) => {
                if (e) {
                  if (client.config.debugmode) {
                    console.log(e.stack);
                  }
                }
                await client.con.query(
                  `SELECT * FROM drproles WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                  async (e, rows) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    await client.con.query(
                      `SELECT * FROM drptickets WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                      async (e, trows) => {
                        if (e) {
                          if (client.config.debugmode) {
                            console.log(e.stack);
                          }
                        }
                        let data = row[0];
                        let tickets = [];
                        let roles = [];
                        rows.forEach((r) => {
                          roles.push(`<@&${r.RoleID}>`);
                        });
                        if (roles.length == 0) {
                          roles.push("None Added");
                        }
                        trows.forEach((t) => {
                          tickets.push(`${t.TicketID}. ${t.Name}`);
                        });
                        if (tickets.length == 0) {
                          tickets.push("None Added");
                        }
                        let embed = new EmbedBuilder()
                          .setColor(client.config.color)
                          .setTitle("Create Dropdown Panel")
                          .setDescription(
                            `>>> **Logging Channel:** - <#${data?.LogChannelID}>\n**Category:** - <#${data?.CategoryID}>`
                          )
                          .addFields(
                            {
                              name: "**Added Tickets**",
                              value: `${tickets.join("\n")}`,
                              inline: true,
                            },
                            {
                              name: "Added Roles",
                              value: `${roles.join("\n")}`,
                              inline: true,
                            }
                          )
                          .setFooter({ text: `${data.PanelID}` });

                        await interaction.update({
                          embeds: [embed],
                          components: [btn, btns],
                          ephemeral: true,
                        });
                      }
                    );
                  }
                );
              }
            );
          }

          break;
        case "drp-ticket-delete":
          {
            await client.con.query(
              `DELETE FROM drptickets WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}' AND TicketID = '${tid}'`,
              async (e) => {
                if (e) {
                  if (client.config.debugmode) {
                    console.log(e.stack);
                  }
                }
                await interaction.update({
                  components: [
                    new ActionRowBuilder().addComponents(
                      new ButtonBuilder()
                        .setCustomId("dummy")
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Success)
                        .setLabel("Ticket Deleted... Redirecting")
                    ),
                  ],
                });

                setTimeout(async () => {
                  await client.con.query(
                    `SELECT * FROM drppanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                    async (e, row) => {
                      if (e) {
                        if (client.config.debugmode) {
                          console.log(e.stack);
                        }
                      }
                      await client.con.query(
                        `SELECT * FROM drproles WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                        async (e, rows) => {
                          if (e) {
                            if (client.config.debugmode) {
                              console.log(e.stack);
                            }
                          }
                          await client.con.query(
                            `SELECT * FROM drptickets WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                            async (e, trows) => {
                              if (e) {
                                if (client.config.debugmode) {
                                  console.log(e.stack);
                                }
                              }
                              let data = row[0];
                              let tickets = [];
                              let roles = [];
                              rows.forEach((r) => {
                                roles.push(`<@&${r.RoleID}>`);
                              });
                              if (roles.length == 0) {
                                roles.push("None Added");
                              }
                              trows.forEach((t) => {
                                tickets.push(`${t.TicketID}. ${t.Name}`);
                              });
                              if (tickets.length == 0) {
                                tickets.push("None Added");
                              }
                              let embed = new EmbedBuilder()
                                .setColor(client.config.color)
                                .setTitle("Create Dropdown Panel")
                                .setDescription(
                                  `>>> **Logging Channel:** - <#${data?.LogChannelID}>\n**Category:** - <#${data?.CategoryID}>`
                                )
                                .addFields(
                                  {
                                    name: "**Added Tickets**",
                                    value: `${tickets.join("\n")}`,
                                    inline: true,
                                  },
                                  {
                                    name: "Added Roles",
                                    value: `${roles.join("\n")}`,
                                    inline: true,
                                  }
                                )
                                .setFooter({ text: `${data.PanelID}` });

                              await interaction.editReply({
                                embeds: [embed],
                                components: [btn, btns],
                                ephemeral: true,
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                }, 5000);
              }
            );
          }

          break;
        case "send-drp":
          {
            let question = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("dummy")
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary)
                .setLabel("Mention the channel to send the panel to!")
            );
            await interaction.update({
              components: [question],
              ephemeral: true,
            });
            channel
              .awaitMessages({ max: 1, time: 60000, errors: ["time"] })
              .then(async (col) => {
                let thechan = col.first().mentions.channels.first();
                if (!thechan) {
                  await interaction.editReply({
                    components: [btn, btns],
                    ephemeral: true,
                  });
                  return channel
                    .send("There was no channel mentions")
                    .then((m) =>
                      setTimeout(() => {
                        m.delete();
                      }, 4000)
                    );
                }

                if (thechan.type !== ChannelType.GuildText) {
                  await interaction.editReply({
                    components: [btn, btns],
                    ephemeral: true,
                  });
                  return channel
                    .send(
                      "The mentioned channel wasn't a text channel from this guild!"
                    )
                    .then((m) =>
                      setTimeout(() => {
                        m.delete();
                      }, 4000)
                    );
                }

                await client.con.query(
                  `SELECT * FROM drppanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                  async (e, row) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    await client.con.query(
                      `SELECT * FROM drptickets WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                      async (e, rows) => {
                        if (e) {
                          if (client.config.debugmode) {
                            console.log(e.stack);
                          }
                        }
                        let tickets = [];
                        rows.forEach((r) => {
                          tickets.push({
                            label: r.Name,
                            description: r.Description,
                            value: r.Name,
                            emoji: "🎫"
                          });
                        });
                        if (tickets.length === 0) {
                          await interaction.editReply({
                            components: [
                              new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                  .setCustomId("dummy")
                                  .setDisabled(true)
                                  .setStyle(ButtonStyle.Danger)
                                  .setLabel(
                                    "You need to add tickets to this panel!"
                                  )
                              ),
                            ],
                          });
                          setTimeout(async () => {
                            await client.con.query(
                              `SELECT * FROM drproles WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                              async (e, rows) => {
                                if (e) {
                                  if (client.config.debugmode) {
                                    console.log(e.stack);
                                  }
                                }
                                await client.con.query(
                                  `SELECT * FROM drptickets WHERE GuildID = '${guild.id}' AND PanelID = '${panelid}'`,
                                  async (e, trows) => {
                                    if (e) {
                                      if (client.config.debugmode) {
                                        console.log(e.stack);
                                      }
                                    }
                                    let data = row[0];
                                    let tickets = [];
                                    let roles = [];
                                    rows.forEach((r) => {
                                      roles.push(`<@&${r.RoleID}>`);
                                    });
                                    if (roles.length == 0) {
                                      roles.push("None Added");
                                    }
                                    trows.forEach((t) => {
                                      tickets.push(`${t.TicketID}. ${t.Name}`);
                                    });
                                    if (tickets.length == 0) {
                                      tickets.push("None Added");
                                    }
                                    let embed = new EmbedBuilder()
                                      .setColor(client.config.color)
                                      .setTitle("Create Dropdown Panel")
                                      .setDescription(
                                        `>>> **Logging Channel:** - <#${data?.LogChannelID}>\n**Category:** - <#${data?.CategoryID}>`
                                      )
                                      .addFields(
                                        {
                                          name: "**Added Tickets**",
                                          value: `${tickets.join("\n")}`,
                                          inline: true,
                                        },
                                        {
                                          name: "Added Roles",
                                          value: `${roles.join("\n")}`,
                                          inline: true,
                                        }
                                      )
                                      .setFooter({ text: `${data.PanelID}` });

                                    await interaction.editReply({
                                      embeds: [embed],
                                      components: [btn, btns],
                                      ephemeral: true,
                                    });
                                  }
                                );
                              }
                            );
                          }, 3000);
                        }
                        let menu = new ActionRowBuilder().addComponents(
                          new SelectMenuBuilder()
                            .setCustomId("create-ticket-drp")
                            .setMaxValues(tickets.length)
                            .setPlaceholder("Select a category")
                            .setOptions(tickets)
                        );
                        let embed = new EmbedBuilder()
                          .setColor(client.config.color)
                          .setTitle("Create a Ticket")
                          .setDescription(
                            "`Select one of the ticket categories for this guild`"
                          )
                          .setFooter({ text: `${row[0]?.PanelID}` });

                        await thechan
                          ?.send({
                            embeds: [embed],
                            components: [menu],
                          })
                          .then(async () => {
                            let Success = new ActionRowBuilder().addComponents(
                              new ButtonBuilder()
                                .setCustomId("dummy")
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Success)
                                .setLabel("Sent Successfully!")
                            );
                            await interaction.editReply({
                              components: [Success],
                              ephemeral: true,
                            });
                            col.first().delete();
                          })
                          .catch(async () => {
                            let Failure = new ActionRowBuilder().addComponents(
                              new ButtonBuilder()
                                .setCustomId("dummy")
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Danger)
                                .setLabel("Error while sending!")
                            );
                            await interaction.editReply({
                              components: [Failure],
                              ephemeral: true,
                            });
                          });
                      }
                    );
                  }
                );
              });
          }

          break;

        default:
          break;
      }
    }
  },
};
