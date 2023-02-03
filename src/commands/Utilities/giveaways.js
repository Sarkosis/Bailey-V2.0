const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Giveaway commands")
    .addSubcommandGroup((subg) =>
      subg
        .setName("fetch")
        .setDescription("Fetch guild giveaways!")
        .addSubcommand((sub) =>
          sub
            .setName("message")
            .setDescription("Fetch a giveaway by the message ID.")
            .addStringOption((option) =>
              option
                .setName("message_id")
                .setDescription("The giveaway message ID.")
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("giveaway_id")
            .setDescription("Fetch a giveaway it's ID")
            .addStringOption((option) =>
              option
                .setName("id")
                .setDescription("The giveaway ID.")
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("all")
            .setDescription("Fetch all giveaways within the guild")
        )
        .addSubcommand((sub) =>
          sub
            .setName("active")
            .setDescription("Fetch all active giveaways within the guild")
        )
    )
    .addSubcommand((sub) =>
      sub.setName("create").setDescription("Create a giveaway for this guild!")
    )
    .addSubcommand((sub) =>
      sub
        .setName("delete")
        .setDescription("Delete a giveaway")
        .addStringOption((option) =>
          option
            .setName("message_id")
            .setDescription("The giveaway message ID.")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    if (!client.config.owners.includes(interaction.member.id))
      return interaction.reply({
        content: "You cannot use this command",
        ephemeral: true,
      });
    let sub = interaction.options.getSubcommand();
    let subg = interaction.options.getSubcommandGroup();
    switch (sub) {
      case "create": {
        let modal = new ModalBuilder()
          .setCustomId("gcreate-modal")
          .setTitle("Create a Giveaway")
          .addComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("gcreate-time")
                .setLabel("Time Duration")
                .setPlaceholder("1 day (1d)")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("gcreate-winners")
                .setLabel("Winner Amount")
                .setPlaceholder("5")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("gcreate-prize")
                .setLabel("Prize")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
            ),
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("gcreate-description")
                .setLabel("Description")
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(true)
            )
          );
        return interaction.showModal(modal);
      }
      case "delete":
        {
          let messageID = interaction.options.getString("message_id");
          await client.connection.query(
            `SELECT * FROM giveaways WHERE MessageID = '${messageID}' AND GuildID = '${interaction.guild.id}'`,
            async (e, row) => {
              if (e) throw e;
              if (row[0]?.GuildID) {
                try {
                  let channel = await client.channels.cache.find(
                    (c) => c.id === row[0]?.ChannelID
                  );
                  if (channel) {
                    let message = await channel?.messages?.fetch(messageID);
                    if (message) {
                      await client.connection.query(
                        `UPDATE giveaways SET Active = '0' WHERE GiveawayID = '${row[0]?.GiveawayID}' AND GuildID = '${interaction.guild.id}' AND ChannelID = '${channel.id}' AND MessageID = '${message.id}'`,
                        async (er) => {
                          if (er) throw er;
                          return interaction
                            .reply({
                              embeds: [
                                new EmbedBuilder()
                                  .setColor(client.config.theme.color)
                                  .setDescription(
                                    `**Giveaway #${row[0]?.GiveawayID} deleted!**`
                                  ),
                              ],
                              ephemeral: true,
                            })
                            .then(async () => {
                              await message.delete();
                            })
                            .catch(() => {});
                        }
                      );
                    }
                  }
                } catch (e) {
                  return interaction.reply({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.theme.color)
                        .setDescription(
                          "**Unknown Giveaway Message or Channel!**"
                        ),
                    ],
                    ephemeral: true,
                  });
                }
              }
            }
          );
        }
        break;

      default:
        break;
    }
    switch (subg) {
      case "fetch":
        {
          switch (sub) {
            case "message":
              {
                let messageID = interaction.options.getString("message_id");
                await client.connection.query(
                  `SELECT * FROM giveaways WHERE MessageID = '${messageID}' AND GuildID = '${interaction.guild.id}'`,
                  async (e, row) => {
                    if (e) throw e;
                    if (row[0]?.GuildID) {
                      try {
                        let channel = await client.channels.cache.find(
                          (c) => c.id === row[0]?.ChannelID
                        );
                        if (channel) {
                          let message = await channel?.messages?.fetch(
                            messageID
                          );
                          if (message) {
                            let active = "";
                            if (row[0]?.Active === "0") {
                              active = "False";
                            } else if (row[0]?.Active === "1") {
                              active = "True";
                            }
                            let embed = new EmbedBuilder()
                              .setColor(client.config.theme.color)
                              .setTitle("Giveaway Information")
                              .addFields(
                                {
                                  name: "**Giveaway Guild Information:**",
                                  value: `
                                  **Guild Name:**\`${interaction.guild.name}\`
                                  **Guild ID:**\`${interaction.guild.id}\`
                                  **Channel Name:**\`${channel.name}\`
                                  **Channel ID:**\`${channel.id}\`
                                  **Giveaway:** [message](${message.url})`,
                                  inline: true,
                                },
                                {
                                  name: "**Giveaway Information:**",
                                  value: `
                                  **Giveaway ID:** \`${row[0]?.GiveawayID}\`
                                  **Giveaway Host:** <@${
                                    row[0]?.HostedBy
                                  }> - (${row[0]?.HostedBy})
                                  **Giveaway Winner Count:** \`${
                                    row[0]?.WinnerCount
                                  }\`
                                  **Giveaway Entries:** \`${row[0]?.Entries}\`
                                  **Giveaway Duration:** <t:${parseInt(
                                    row[0]?.Duration / 1000
                                  )}:R>
                                  **Is Active:** ${active}`,
                                  inline: true,
                                },
                                {
                                  name: "**Giveaway Description**",
                                  value: `${row[0]?.GDescription}`,
                                  inline: false,
                                }
                              )
                              .setThumbnail(
                                interaction.guild.iconURL({ dynamic: true })
                              )
                              .setFooter({
                                text: "Giveaway Found!",
                                iconURL: interaction.guild.iconURL({
                                  dynamic: true,
                                }),
                              });
                            let button = new ActionRowBuilder().addComponents(
                              new ButtonBuilder()
                                .setLabel("Jump to Giveaway")
                                .setStyle(ButtonStyle.Link)
                                .setURL(message.url)
                            );
                            return interaction.reply({
                              embeds: [embed],
                              components: [button],
                              ephemeral: true,
                            });
                          }
                        }
                      } catch (e) {
                        return interaction.reply({
                          embeds: [
                            new EmbedBuilder()
                              .setColor(client.config.theme.color)
                              .setDescription(
                                "**Unknown Giveaway Message or Channel!**"
                              ),
                          ],
                          ephemeral: true,
                        });
                      }
                    }
                  }
                );
              }
              break;
            case "giveaway_id":
              {
                let giveawayID = interaction.options.getString("id");
                await client.connection.query(
                  `SELECT * FROM giveaways WHERE GiveawayID = '${giveawayID}' AND GuildID = '${interaction.guild.id}'`,
                  async (e, row) => {
                    if (e) throw e;
                    if (row[0]?.GuildID) {
                      try {
                        let channel = await client.channels.cache.find(
                          (c) => c.id === row[0]?.ChannelID
                        );
                        if (channel) {
                          let message = await channel?.messages?.fetch(
                            row[0]?.MessageID
                          );
                          if (message) {
                            let active = "";
                            if (row[0]?.Active === "0") {
                              active = "False";
                            } else if (row[0]?.Active === "1") {
                              active = "True";
                            }
                            let embed = new EmbedBuilder()
                              .setColor(client.config.theme.color)
                              .setTitle("Giveaway Information")
                              .addFields(
                                {
                                  name: "**Giveaway Guild Information:**",
                                  value: `
                                  **Guild Name:**\`${interaction.guild.name}\`
                                  **Guild ID:**\`${interaction.guild.id}\`
                                  **Channel Name:**\`${channel.name}\`
                                  **Channel ID:**\`${channel.id}\`
                                  **Giveaway:** [message](${message.url})`,
                                  inline: true,
                                },
                                {
                                  name: "**Giveaway Information:**",
                                  value: `
                                  **Giveaway ID:** \`${row[0]?.GiveawayID}\`
                                  **Giveaway Host:** <@${
                                    row[0]?.HostedBy
                                  }> - (${row[0]?.HostedBy})
                                  **Giveaway Winner Count:** \`${
                                    row[0]?.WinnerCount
                                  }\`
                                  **Giveaway Entries:** \`${row[0]?.Entries}\`
                                  **Giveaway Duration:** <t:${parseInt(
                                    row[0]?.Duration / 1000
                                  )}:R>
                                  **Is Active:** ${active}`,
                                  inline: true,
                                },
                                {
                                  name: "**Giveaway Description**",
                                  value: `${row[0]?.GDescription}`,
                                  inline: false,
                                }
                              )
                              .setThumbnail(
                                interaction.guild.iconURL({ dynamic: true })
                              )
                              .setFooter({
                                text: "Giveaway Found!",
                                iconURL: interaction.guild.iconURL({
                                  dynamic: true,
                                }),
                              })
                              .setTimestamp();
                            let button = new ActionRowBuilder().addComponents(
                              new ButtonBuilder()
                                .setLabel("Jump to Giveaway")
                                .setStyle(ButtonStyle.Link)
                                .setURL(message.url)
                            );
                            return interaction.reply({
                              embeds: [embed],
                              components: [button],
                              ephemeral: true,
                            });
                          }
                        }
                      } catch (e) {
                        return interaction.reply({
                          embeds: [
                            new EmbedBuilder()
                              .setColor(client.config.theme.color)
                              .setDescription(
                                "**Unknown Giveaway Message or Channel!**"
                              ),
                          ],
                          ephemeral: true,
                        });
                      }
                    }
                  }
                );
              }
              break;
            case "all":
              {
                await client.connection.query(
                  `SELECT * FROM giveaways WHERE GuildID = '${interaction.guild.id}'`,
                  async (e, rows) => {
                    if (e) throw e;
                    await interaction.reply({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setDescription("**Giveaways Displayed!**"),
                      ],
                      ephemeral: true,
                    });
                    for (let data of rows) {
                      try {
                        let channel = interaction.guild.channels.cache.find(
                          (c) => c.id === data?.ChannelID
                        );
                        let message = await channel.messages.fetch(
                          data?.MessageID
                        );
                        let active = "";
                        if (data?.Active === "0") {
                          active = "False";
                        } else if (data?.Active === "1") {
                          active = "True";
                        }
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle(`Giveaway #${data?.GiveawayID}`)
                          .addFields(
                            {
                              name: "**Giveaway Guild Information:**",
                              value: `
                              **Guild Name:**\`${interaction.guild.name}\`
                              **Guild ID:**\`${interaction.guild.id}\`
                              **Channel Name:**\`${channel.name}\`
                              **Channel ID:**\`${channel.id}\`
                              **Giveaway:** [message](${message.url})`,
                              inline: true,
                            },
                            {
                              name: "**Giveaway Information:**",
                              value: `
                              **Giveaway ID:** \`${data?.GiveawayID}\`
                              **Giveaway Host:** <@${data?.HostedBy}> - (${
                                data?.HostedBy
                              })
                              **Giveaway Winner Count:** \`${
                                data?.WinnerCount
                              }\`
                              **Giveaway Entries:** \`${data?.Entries}\`
                              **Giveaway Duration:** <t:${parseInt(
                                data?.Duration / 1000
                              )}:R>
                              **Is Active:** ${active}`,
                              inline: true,
                            },
                            {
                              name: "**Giveaway Description**",
                              value: `${data?.GDescription}`,
                              inline: false,
                            }
                          )
                          .setThumbnail(
                            interaction.guild.iconURL({ dynamic: true })
                          )
                          .setFooter({
                            text: `Giveaway #${data?.GiveawayID}`,
                            iconURL: interaction.guild.iconURL({
                              dynamic: true,
                            }),
                          })
                          .setTimestamp();
                        await interaction.channel.send({ embeds: [embed] });
                      } catch (e) {
                        console.log(e);
                        return interaction.editReply({
                          embeds: [
                            new EmbedBuilder()
                              .setColor(client.config.theme.color)
                              .setDescription(
                                "**Error occured while getting all giveaway data!**"
                              ),
                          ],
                          ephemeral: true,
                        });
                      }
                    }
                  }
                );
              }
              break;
            case "active":
              {
                await client.connection.query(
                  `SELECT * FROM giveaways WHERE GuildID = '${interaction.guild.id}' AND Active = '1'`,
                  async (e, rows) => {
                    if (e) throw e;
                    await interaction.reply({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setDescription("**Giveaways Displayed!**"),
                      ],
                      ephemeral: true,
                    });
                    for (let data of rows) {
                      try {
                        let channel = interaction.guild.channels.cache.find(
                          (c) => c.id === data?.ChannelID
                        );
                        let message = channel.messages.fetch(data?.MessageID);
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle(`Giveaway #${data?.GiveawayID}`)
                          .addFields(
                            {
                              name: "**Giveaway Guild Information:**",
                              value: `
                              **Guild Name:**\`${interaction.guild.name}\`
                              **Guild ID:**\`${interaction.guild.id}\`
                              **Channel Name:**\`${channel.name}\`
                              **Channel ID:**\`${channel.id}\`
                              **Giveaway:** [message](${message.url})`,
                              inline: true,
                            },
                            {
                              name: "**Giveaway Information:**",
                              value: `
                              **Giveaway ID:** \`${data?.GiveawayID}\`
                              **Giveaway Host:** <@${data?.HostedBy}> - (${
                                data?.HostedBy
                              })
                              **Giveaway Winner Count:** \`${
                                data?.WinnerCount
                              }\`
                              **Giveaway Entries:** \`${data?.Entries}\`
                              **Giveaway Duration:** <t:${parseInt(
                                data?.Duration / 1000
                              )}:R>`,
                              inline: true,
                            },
                            {
                              name: "**Giveaway Description**",
                              value: `${data?.GDescription}`,
                              inline: false,
                            }
                          )
                          .setThumbnail(
                            interaction.guild.iconURL({ dynamic: true })
                          )
                          .setFooter({
                            text: `Giveaway #${data?.GiveawayID}`,
                            iconURL: interaction.guild.iconURL({
                              dynamic: true,
                            }),
                          })
                          .setTimestamp();
                        await interaction.channel.send({ embeds: [embed] });
                      } catch (e) {
                        console.log(e);
                        return interaction.reply({
                          embeds: [
                            new EmbedBuilder()
                              .setColor(client.config.theme.color)
                              .setDescription(
                                "**Error occured while getting all giveaway data!**"
                              ),
                          ],
                          ephemeral: true,
                        });
                      }
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
