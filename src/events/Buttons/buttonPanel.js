const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isButton()) {
      let { customId, guild, channel } = interaction;
      let panelid = interaction?.message?.embeds[0]?.footer?.text;
      let btn = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("set-logs-btn")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Set Logs"),
        new ButtonBuilder()
          .setCustomId("set-cat-btn")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Set Category"),
        new ButtonBuilder()
          .setCustomId("set-title-btn")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Set Title"),
        new ButtonBuilder()
          .setCustomId("set-desc-btn")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Set Description")
      );
      let btns = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("add-role-btn")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Add Role"),
        new ButtonBuilder()
          .setCustomId("remove-role-btn")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Remove Role"),
        new ButtonBuilder()
          .setCustomId("send-btn")
          .setStyle(ButtonStyle.Success)
          .setLabel("Send Panel")
      );
      switch (customId) {
        case "set-logs-btn":
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
                  `UPDATE btnpanels SET LogChannelID = "${thechan.id}"  WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                  async (e) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    await client.con.query(
                      `SELECT * FROM btnpanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                      async (e, row) => {
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
                            let data = row[0];
                            let roles = [];
                            rows.forEach((r) => {
                              roles.push(`<@&${r.RoleID}>`);
                            });
                            if (roles.length == 0) {
                              roles.push("None Added");
                            }
                            let embed = new EmbedBuilder()
                              .setColor(client.config.color)
                              .setTitle("Create Button Panel")
                              .setDescription(
                                `>>> **Logging Channel:** - <#${data.LogChannelID}>\n**Category:** - <#${data.CategoryID}>\n**Title:** - ${data.Title} \n**Description:** - ${data.Description}`
                              )
                              .addFields({
                                name: "Added Roles",
                                value: `${roles.join("\n")}`,
                                inline: true,
                              })
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
              });
          }

          break;
        case "set-cat-btn":
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
                  `UPDATE btnpanels SET CategoryID = "${thecat.id}"  WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                  async (e) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                  }
                );
                await client.con.query(
                  `SELECT * FROM btnpanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                  async (e, row) => {
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
                        let data = row[0];
                        let roles = [];
                        rows.forEach((r) => {
                          roles.push(`<@&${r.RoleID}>`);
                        });
                        if (roles.length == 0) {
                          roles.push("None Added");
                        }
                        let embed = new EmbedBuilder()
                          .setColor(client.config.color)
                          .setTitle("Create Button Panel")
                          .setDescription(
                            `>>> **Logging Channel:** - <#${data.LogChannelID}>\n**Category:** - <#${data.CategoryID}>\n**Title:** - ${data.Title} \n**Description:** - ${data.Description}`
                          )
                          .addFields({
                            name: "Added Roles",
                            value: `${roles.join("\n")}`,
                            inline: true,
                          })
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
              });
          }

          break;
        case "set-title-btn":
          {
            let question = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("dummy")
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary)
                .setLabel("State the Title")
            );
            await interaction.update({
              components: [question],
              ephemeral: true,
            });
            channel
              .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
              .then(async (col) => {
                let thetit = col.first();
                if (!thetit) {
                  await interaction.editReply({
                    components: [btn, btns],
                    ephemeral: true,
                  });
                  return channel.send("There was no title sent").then((m) =>
                    setTimeout(() => {
                      m.delete();
                    }, 4000)
                  );
                }

                await client.con.query(
                  `UPDATE btnpanels SET Title = "${thetit}"  WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                  async (e) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    await client.con.query(
                      `SELECT * FROM btnpanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                      async (e, row) => {
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
                            let data = row[0];
                            let roles = [];
                            rows.forEach((r) => {
                              roles.push(`<@&${r.RoleID}>`);
                            });
                            if (roles.length == 0) {
                              roles.push("None Added");
                            }
                            let embed = new EmbedBuilder()
                              .setColor(client.config.color)
                              .setTitle("Create Button Panel")
                              .setDescription(
                                `>>> **Logging Channel:** - <#${data.LogChannelID}>\n**Category:** - <#${data.CategoryID}>\n**Title:** - ${data.Title} \n**Description:** - ${data.Description}`
                              )
                              .addFields({
                                name: "Added Roles",
                                value: `${roles.join("\n")}`,
                                inline: true,
                              })
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
              });
          }

          break;
        case "set-desc-btn":
          {
            let question = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("dummy")
                .setDisabled(true)
                .setStyle(ButtonStyle.Primary)
                .setLabel("State the Description")
            );
            await interaction.update({
              components: [question],
              ephemeral: true,
            });
            channel
              .awaitMessages({ max: 1, time: 60000, errors: ["time"] })
              .then(async (col) => {
                let thedesc = col.first();
                if (!thedesc) {
                  await interaction.editReply({
                    components: [btn, btns],
                    ephemeral: true,
                  });
                  return channel
                    .send("There was no description sent")
                    .then((m) =>
                      setTimeout(() => {
                        m.delete();
                      }, 4000)
                    );
                }

                await client.con.query(
                  `UPDATE btnpanels SET Description = "${thedesc}"  WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                  async (e) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    await client.con.query(
                      `SELECT * FROM btnpanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                      async (e, row) => {
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
                            let data = row[0];
                            let roles = [];
                            rows.forEach((r) => {
                              roles.push(`<@&${r.RoleID}>`);
                            });
                            if (roles.length == 0) {
                              roles.push("None Added");
                            }
                            let embed = new EmbedBuilder()
                              .setColor(client.config.color)
                              .setTitle("Create Button Panel")
                              .setDescription(
                                `>>> **Logging Channel:** - <#${data.LogChannelID}>\n**Category:** - <#${data.CategoryID}>\n**Title:** - ${data.Title} \n**Description:** - ${data.Description}`
                              )
                              .addFields({
                                name: "Added Roles",
                                value: `${roles.join("\n")}`,
                                inline: true,
                              })
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
              });
          }

          break;
        case "add-role-btn":
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
                  `INSERT INTO btnroles (GuildID, PanelID, RoleID) VALUES ("${guild.id}", "${panelid}", "${therole.id}")`,
                  async (e) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    await client.con.query(
                      `SELECT * FROM btnpanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                      async (e, row) => {
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
                            let data = row[0];
                            let roles = [];
                            rows.forEach((r) => {
                              roles.push(`<@&${r.RoleID}>`);
                            });
                            if (roles.length == 0) {
                              roles.push("None Added");
                            }
                            let embed = new EmbedBuilder()
                              .setColor(client.config.color)
                              .setTitle("Create Button Panel")
                              .setDescription(
                                `>>> **Logging Channel:** - <#${data.LogChannelID}>\n**Category:** - <#${data.CategoryID}>\n**Title:** - ${data.Title} \n**Description:** - ${data.Description}`
                              )
                              .addFields({
                                name: "Added Roles",
                                value: `${roles.join("\n")}`,
                                inline: true,
                              })
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
              });
          }

          break;
        case "remove-role-btn":
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
                  `SELECT * FROM btnroles WHERE GuildID = "${guild.id}" AND PanelID = "${panelid}" AND RoleID = "${therole.id}"`,
                  async (e, row) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    if (row[0]) {
                      await client.con.query(
                        `DELETE FROM btnroles WHERE GuildID = "${guild.id}" AND PanelID = "${panelid}" AND RoleID = "${therole.id}"`,
                        async (e) => {
                          if (e) {
                            if (client.config.debugmode) {
                              console.log(e.stack);
                            }
                          }

                          await client.con.query(
                            `SELECT * FROM btnpanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                            async (e, row) => {
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
                                  let data = row[0];
                                  let roles = [];
                                  rows.forEach((r) => {
                                    roles.push(`<@&${r.RoleID}>`);
                                  });
                                  if (roles.length == 0) {
                                    roles.push("None Added");
                                  }
                                  let embed = new EmbedBuilder()
                                    .setColor(client.config.color)
                                    .setTitle("Create Button Panel")
                                    .setDescription(
                                      `>>> **Logging Channel:** - <#${data.LogChannelID}>\n**Category:** - <#${data.CategoryID}>\n**Title:** - ${data.Title} \n**Description:** - ${data.Description}`
                                    )
                                    .addFields({
                                      name: "Added Roles",
                                      value: `${roles.join("\n")}`,
                                      inline: true,
                                    })
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
        case "send-btn":
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
                    .send("There was no channels mentions")
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
                  `SELECT * FROM btnpanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                  async (e, row) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    let button = new ActionRowBuilder().addComponents(
                      new ButtonBuilder()
                        .setCustomId("create-ticket-btn")
                        .setStyle(ButtonStyle.Secondary)
                        .setLabel("Create Ticket")
                        .setEmoji("🎫")
                    );
                    let embed = new EmbedBuilder()
                      .setColor(client.config.color)
                      .setTitle(row[0]?.Title)
                      .setDescription(row[0]?.Description)
                      .setFooter({ text: `${row[0]?.PanelID}` });

                    await thechan
                      ?.send({
                        embeds: [embed],
                        components: [button],
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
                      }).catch(async () => {
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
                      })
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
