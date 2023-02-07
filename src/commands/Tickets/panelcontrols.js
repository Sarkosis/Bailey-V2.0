const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("panels")
    .setDescription("Create a ticket panel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommandGroup((subg) =>
      subg
        .setName("add")
        .setDescription("Add panel")
        .addSubcommand((sub) =>
          sub.setName("button").setDescription("Create a button panel")
        )
        .addSubcommand((sub) =>
          sub.setName("menu").setDescription("Create a dropdown menu panel")
        )
    )
    .addSubcommandGroup((subg) =>
      subg
        .setName("delete")
        .setDescription("Delete panel")
        .addSubcommand((sub) =>
          sub
            .setName("button")
            .setDescription("Delete a button panel")
            .addNumberOption((o) =>
              o
                .setName("id")
                .setDescription("Input the panelID")
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("menu")
            .setDescription("Delete a dropdown menu panel")
            .addNumberOption((o) =>
              o
                .setName("id")
                .setDescription("Input the panelID")
                .setRequired(true)
            )
        )
    ),

  async execute(interaction, client) {
    let { guild, member, options } = interaction;
    let subg = options.getSubcommandGroup();
    let sub = options.getSubcommand();
    let id = options.getNumber("id");

    switch (subg) {
      case "add":
        {
          switch (sub) {
            case "button":
              {
                await client.con.query(
                  `SELECT COUNT(*) as total FROM btnpanels WHERE GuildID = '${guild.id}'`,
                  async (e, res) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    let panelid = res[0].total + 1;
                    await client.con.query(
                      `SELECT * FROM btnpanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                      async (e, row) => {
                        if (e) {
                          if (client.config.debugmode) {
                            console.log(e.stack);
                          }
                        }
                        if (row[0]) {
                          panelid++;
                          await client.con.query(
                            `INSERT INTO btnpanels (GuildID, PanelID, LogChannelID, CategoryID, Title, Description) VALUES ("${guild.id}", "${panelid}", "none", "none", "none", "none")`,
                            async (e) => {
                              if (e) {
                                if (client.config.debugmode) {
                                  console.log(e.stack);
                                }
                              }

                              let embed = new EmbedBuilder()
                                .setColor(client.config.color)
                                .setTitle("Create Button Panel")
                                .setDescription(
                                  ">>> **Logging Channel:** - None Selected\n**Category:** - None Selected\n**Title:** - Not Created\n**Description:** - Not Created"
                                )
                                .addFields({
                                  name: "**Added Roles**",
                                  value: "None Added",
                                  inline: true,
                                })
                                .setFooter({ text: `${panelid}` });

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

                              await interaction.reply({
                                embeds: [embed],
                                components: [btn, btns],
                                ephemeral: true,
                              });
                            }
                          );
                        } else if (!row[0]) {
                          await client.con.query(
                            `INSERT INTO btnpanels (GuildID, PanelID, LogChannelID, CategoryID, Title, Description) VALUES ("${guild.id}", "${panelid}", "none", "none", "none", "none")`,
                            async (e) => {
                              if (e) {
                                if (client.config.debugmode) {
                                  console.log(e.stack);
                                }
                              }

                              let embed = new EmbedBuilder()
                                .setColor(client.config.color)
                                .setTitle("Create Button Panel")
                                .setDescription(
                                  ">>> **Logging Channel:** - None Selected\n**Category:** - None Selected\n**Title:** - Not Created\n**Description:** - Not Created"
                                )
                                .addFields({
                                  name: "**Added Roles**",
                                  value: "None Added",
                                  inline: true,
                                })
                                .setFooter({ text: `${panelid}` });

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

                              await interaction.reply({
                                embeds: [embed],
                                components: [btn, btns],
                                ephemeral: true,
                              });
                            }
                          );
                        }
                      }
                    );
                  }
                );
              }

              break;
            case "menu":
              {
                await client.con.query(
                  `SELECT COUNT(*) as total FROM drppanels WHERE GuildID = '${guild.id}'`,
                  async (e, res) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    let panelid = res[0].total + 1;
                    await client.con.query(
                      `SELECT * FROM drppanels WHERE PanelID = '${panelid}' AND GuildID = '${guild.id}'`,
                      async (e, row) => {
                        if (e) {
                          if (client.config.debugmode) {
                            console.log(e.stack);
                          }
                        }
                        if (row[0]) {
                          console.log("hi");
                          panelid++;
                          await client.con.query(
                            `INSERT INTO drppanels (GuildID, PanelID, LogChannelID, CategoryID) VALUES ("${guild.id}", "${panelid}", "none", "none")`,
                            async (e) => {
                              if (e) {
                                if (client.config.debugmode) {
                                  console.log(e.stack);
                                }
                              }

                              let embed = new EmbedBuilder()
                                .setColor(client.config.color)
                                .setTitle("Create Dropdown Panel")
                                .setDescription(
                                  ">>> **Logging Channel:** - None Selected\n**Category:** - None Selected"
                                )
                                .addFields(
                                  {
                                    name: "**Added Tickets**",
                                    value: "None Added",
                                    inline: true,
                                  },
                                  {
                                    name: "**Added Roles**",
                                    value: "None Added",
                                    inline: true,
                                  }
                                )
                                .setFooter({ text: `${panelid}` });

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

                              await interaction.reply({
                                embeds: [embed],
                                components: [btn, btns],
                                ephemeral: true,
                              });
                            }
                          );
                        } else if (!row[0]) {
                          console.log("hi");
                          await client.con.query(
                            `INSERT INTO drppanels (GuildID, PanelID, LogChannelID, CategoryID) VALUES ("${guild.id}", "${panelid}", "none", "none")`,
                            async (e) => {
                              if (e) {
                                if (client.config.debugmode) {
                                  console.log(e.stack);
                                }
                              }

                              let embed = new EmbedBuilder()
                                .setColor(client.config.color)
                                .setTitle("Create Dropdown Panel")
                                .setDescription(
                                  ">>> **Logging Channel:** - None Selected\n**Category:** - None Selected"
                                )
                                .addFields(
                                  {
                                    name: "**Added Tickets**",
                                    value: "None Added",
                                    inline: true,
                                  },
                                  {
                                    name: "**Added Roles**",
                                    value: "None Added",
                                    inline: true,
                                  }
                                )
                                .setFooter({ text: `${panelid}` });

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

                              await interaction.reply({
                                embeds: [embed],
                                components: [btn, btns],
                                ephemeral: true,
                              });
                            }
                          );
                        }
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

        break;

      case "delete":
        {
          switch (sub) {
            case "button":
              {
                await client.con.query(
                  `SELECT * FROM btnpanels WHERE PanelID = '${id}' AND GuildID = '${guild.id}'`,
                  async (e, row) => {
                    if (e) {
                      if (client.config.client.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    if (row[0]) {
                      await client.con.query(
                        `DELETE FROM btnpanels WHERE PanelID = '${id}' AND GuildID = '${guild.id}'`,
                        async (e) => {
                          if (e) {
                            if (client.config.client.debugmode) {
                              console.log(e.stack);
                            }
                          }
                          await client.con.query(
                            `DELETE FROM btnroles WHERE GuildID = '${guild.id}' AND PanelID = '${id}'`,
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
                                .setDescription(`Panel #${id} deleted!`),
                            ],
                            ephemeral: true,
                          });
                        }
                      );
                    } else if (!row[0]) {
                      return interaction.reply({
                        embeds: [
                          new EmbedBuilder()
                            .setColor(client.config.color)
                            .setDescription(`Panel #${id} not found!`),
                        ],
                        ephemeral: true,
                      });
                    }
                  }
                );
              }

              break;
            case "menu":
              {
                await client.con.query(
                  `SELECT * FROM drppanels WHERE PanelID = '${id}' AND GuildID = '${guild.id}'`,
                  async (e, row) => {
                    if (e) {
                      if (client.config.client.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    if (row[0]) {
                      await client.con.query(
                        `DELETE FROM drppanels WHERE PanelID = '${id}' AND GuildID = '${guild.id}'`,
                        async (e) => {
                          if (e) {
                            if (client.config.client.debugmode) {
                              console.log(e.stack);
                            }
                          }
                          await client.con.query(
                            `DELETE FROM drproles WHERE GuildID = '${guild.id}' AND PanelID = '${id}'`,
                            async (e) => {
                              if (e) {
                                if (client.config.debugmode) {
                                  console.log(e.stack);
                                }
                              }
                            }
                          );
                          await client.con.query(
                            `DELETE FROM drptickets WHERE PanelID = '${id}' AND GuildID = '${guild.id}'`,
                            async (e) => {
                              if (e) {
                                if (client.config.client.debugmode) {
                                  console.log(e.stack);
                                }
                              }
                            }
                          );

                          return interaction.reply({
                            embeds: [
                              new EmbedBuilder()
                                .setColor(client.config.color)
                                .setDescription(
                                  `All tickets for Panel #${id}, along with the panel, were deleted!`
                                ),
                            ],
                            ephemeral: true,
                          });
                        }
                      );
                    } else if (!row[0]) {
                      return interaction.reply({
                        embeds: [
                          new EmbedBuilder()
                            .setColor(client.config.color)
                            .setDescription(`Panel #${id} not found!`),
                        ],
                        ephemeral: true,
                      });
                    }
                  }
                );
              }

              break;
            default:
              break;
          }
        }

        break;
      default:
        break;
    }
  },
};
