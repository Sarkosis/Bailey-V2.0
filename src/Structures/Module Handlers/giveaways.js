const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const ms = require("ms");

async function create(interaction, client) {
  let prize = interaction.fields.getTextInputValue("gcreate-prize");
  let duration = interaction.fields.getTextInputValue("gcreate-time");
  let winneramount = interaction.fields.getTextInputValue("gcreate-winners");
  let description = interaction.fields.getTextInputValue("gcreate-description");
  let { guild, member, channel } = interaction;

  // Checking if modal values are correct
  if (ms(duration) === undefined) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.theme.color)
          .setDescription(
            `The currently selected duration is not a number.\nPlease try again using a valid number.\n**Examples:** 1 Day and 1d.\n\n**Current Duration:** ${duration}`
          ),
      ],
      ephemeral: true,
    });
  }
  let regex = /[A-Z]/gi;
  let regexedamount = winneramount.match(regex);
  if (winneramount <= 0 || regexedamount) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setColor(client.config.theme.color)
          .setDescription(
            `The currently selected winner count is not a number.\nPlease try again using a valid number.\n**Examples:** 1 and 34.\n**Current Winner Count:** ${winneramount}`
          ),
      ],
      ephemeral: true,
    });
  }

  let parseTS = parseInt(interaction.createdTimestamp / 1000);
  let parseMS = parseInt(ms(duration) / 1000);
  let gembed = new EmbedBuilder()
    .setColor(client.config.theme.color)
    .setTitle(prize)
    .setDescription(description)
    .addFields({
      name: "Giveaway Information",
      value: `**Ends:** <t:${parseTS + parseMS}:R>\n**Hosted By:** <@${
        member.id
      }>\n**Entries:** 0\n**Winners:** ${winneramount}`,
    })
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .setFooter({ text: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
    .setTimestamp();
  let gbuttons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("g-enter")
      .setLabel("Enter Giveaway")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("🎉"),
    new ButtonBuilder()
      .setCustomId("g-reroll")
      .setLabel("Reroll Giveaway")
      .setEmoji("🎲")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("g-end")
      .setLabel("End Giveaway")
      .setStyle(ButtonStyle.Danger)
  );
  let message = await channel.send({
    embeds: [gembed],
    components: [gbuttons],
  });
  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(client.config.theme.color)
        .setDescription("Giveaway started!"),
    ],
    ephemeral: true,
  }),
    await client.connection.query(
      `INSERT INTO giveaways (GuildID, HostedBy, MessageID, ChannelID, Prize, Duration, GDescription, WinnerCount, Active, Entries) VALUES ('${
        guild.id
      }', '${member.id}', '${message.id}', '${channel.id}', "${prize}", '${
        interaction.createdTimestamp + ms(duration)
      }', "${description}", '${winneramount}', '1', '0')`,
      async (e) => {
        if (e) {
          if (client.config.bot.debugMode) {
            console.log(e);
          }
        }
      }
    );
}
async function enter(interaction, client) {
  let { guild, member, channel, message } = interaction;
  await client.connection.query(
    `SELECT * FROM giveaways WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}' AND MessageID = '${message.id}'`,
    async (e, row) => {
      if (e) throw e;
      if (row[0]?.Active === "0")
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setDescription("This giveaway has already ended!"),
          ],
          ephemeral: true,
        });
      if (row[0]?.GuildID) {
        await client.connection.query(
          `SELECT * FROM giveawayentries WHERE UserID = '${member.id}' AND GuildID = '${guild.id}' AND ChannelID = '${channel.id}' AND MessageID = '${message.id}' AND GiveawayID = '${row[0].GiveawayID}'`,
          async (er, erow) => {
            if (er) throw er;
            if (erow[0]?.UserID) {
              return interaction.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.theme.color)
                    .setDescription(`You have already enter this giveaway!`),
                ],
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("g-leave")
                      .setLabel("Leave Giveaway")
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
                ephemeral: true,
              });
            } else if (!erow[0]?.UserID) {
              await client.connection.query(
                `INSERT INTO giveawayentries (GiveawayID, GuildID, ChannelID, MessageID, UserID) VALUES ('${row[0]?.GiveawayID}', '${guild.id}', '${channel.id}', '${message.id}', '${member.id}')`,
                async (err) => {
                  if (err) throw err;
                  await client.connection.query(
                    `SELECT COUNT(*) as total FROM giveawayentries WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}' AND MessageID = '${message.id}' AND GiveawayID = '${row[0]?.GiveawayID}'`,
                    async (errr, res) => {
                      if (errr) throw errr;
                      await client.connection.query(
                        `UPDATE giveaways SET Entries = '${res[0]?.total}' WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}' AND MessageID = '${message.id}' AND GiveawayID = '${row[0]?.GiveawayID}'`,
                        async (error) => {
                          if (error) throw error;
                          await interaction.reply({
                            embeds: [
                              new EmbedBuilder()
                                .setColor(client.config.theme.color)
                                .setDescription(
                                  `You have entered the giveaway!\nWe now have **${res[0]?.total} entrie(s)**!`
                                ),
                            ],
                            ephemeral: true,
                          });
                          let newEmbed = new EmbedBuilder()
                            .setColor(client.config.theme.color)
                            .setTitle(row[0]?.Prize)
                            .setDescription(row[0]?.GDescription)
                            .addFields({
                              name: "Giveaway Information",
                              value: `**Ends:** <t:${parseInt(
                                row[0]?.Duration / 1000
                              )}:R>\n**Hosted By:** <@${
                                row[0]?.HostedBy
                              }>\n**Entries:** ${res[0]?.total}\n**Winners:** ${
                                row[0]?.WinnerCount
                              }`,
                            })
                            .setThumbnail(guild.iconURL({ dynamic: true }))
                            .setFooter({
                              text: guild.name,
                              iconURL: guild.iconURL({ dynamic: true }),
                            })
                            .setTimestamp();
                          return message.edit({ embeds: [newEmbed] });
                        }
                      );
                    }
                  );
                }
              );
            }
          }
        );
      } else
        return interaction.reply({
          content:
            "I couldn't find any database information about this giveaway!",
          ephemeral: true,
        });
    }
  );
}
async function leave(interaction, client) {
  let { guild, member, channel, message } = interaction;
  await client.connection.query(
    `SELECT * FROM giveawayentries WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}' AND UserID = '${member.id}' AND MessageID = '${message.reference.messageId}'`,
    async (e, row) => {
      if (e) throw e;
      if (!row[0]?.GuildID) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setDescription(
                "You haven't entered this giveaway!\nWell, I couldn't find your giveaway entry at least..."
              ),
          ],
          ephemeral: true,
        });
      }
      if (row[0]?.GuildID) {
        await client.connection.query(
          `SELECT * FROM giveaways WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}' AND GiveawayID = '${row[0]?.GiveawayID}'`,
          async (er, row2) => {
            if (er) throw er;
            if (!row2[0]?.GuildID) {
              return interaction.reply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.theme.color)
                    .setDescription("I couldn't find this giveaway!"),
                ],
                ephemeral: true,
              });
            }
            if (row2[0]?.GuildID) {
              if (row2[0]?.Active === "0") {
                return interaction.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setColor(client.config.theme.color)
                      .setDescription("This giveaway isn't active!"),
                  ],
                  ephemeral: true,
                });
              }
              await client.connection.query(
                `DELETE FROM giveawayentries WHERE GiveawayID = '${row[0]?.GiveawayID}' AND GuildID = '${guild.id}' AND ChannelID = '${channel.id}' AND UserID = '${member.id}'`,
                async (er) => {
                  if (er) throw er;
                  await client.connection.query(
                    `SELECT COUNT(*) as total FROM giveawayentries WHERE GiveawayID = '${row[0]?.GiveawayID}' AND GuildID = '${guild.id}' AND ChannelID = '${channel.id}'`,
                    async (err, res) => {
                      if (err) throw err;
                      let newentries = res[0]?.total;
                      let newEmbed = new EmbedBuilder()
                        .setColor(client.config.theme.color)
                        .setTitle(row2[0]?.Prize)
                        .setDescription(row2[0]?.GDescription)
                        .addFields({
                          name: "Giveaway Information",
                          value: `**Ends:** <t:${parseInt(
                            row2[0]?.Duration / 1000
                          )}:R>\n**Hosted By:** <@${
                            row2[0]?.HostedBy
                          }>\n**Entries:** ${newentries}\n**Winners:** ${
                            row2[0]?.WinnerCount
                          }`,
                        })
                        .setThumbnail(guild.iconURL({ dynamic: true }))
                        .setFooter({
                          text: guild.name,
                          iconURL: guild.iconURL({ dynamic: true }),
                        })
                        .setTimestamp();
                      let gmessage = await channel.messages.fetch(
                        row2[0]?.MessageID
                      );
                      await gmessage.edit({ embeds: [newEmbed] });
                      return interaction.reply({
                        embeds: [
                          new EmbedBuilder()
                            .setColor(client.config.theme.color)
                            .setDescription(
                              `You have left the giveaway!\nWe now have **${newentries} entrie(s)**!`
                            ),
                        ],
                        ephemeral: true,
                      });
                    }
                  );
                }
              );
            }
          }
        );
      }
    }
  );
}
async function end(interaction, client) {
  let { guild, channel, message, member } = interaction;
  await client.connection.query(
    `SELECT * FROM giveaways WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}' AND MessageID = '${message.id}' AND Active = '1'`,
    async (e, row) => {
      if (e) throw e;
      if (row[0]?.GuildID) {
        if (member.id === row[0]?.HostedBy) {
          client.utils.giveawaysEnd(interaction, client);
          await interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription(
                  `Ending Giveaway **#${row[0]?.GiveawayID}**.\n**Giveaway ID:** ${row[0]?.GiveawayID}\n**Entries:** ${row[0]?.Entries}\n**Prize:** ${row[0]?.Prize}`
                ),
            ],
            ephemeral: true,
          });
          await client.connection.query(
            `UPDATE giveaways SET Active = '0' WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}' AND MessageID = '${message.id}' AND GiveawayID = '${row[0]?.GiveawayID}'`,
            async (er) => {
              if (er) throw er;
              return;
            }
          );
        } else
          return interaction.reply({
            content: "This button isn't for you!",
            ephemeral: true,
          });
      }
    }
  );
}
async function reroll(interaction, client) {
  let { guild, channel, message, member } = interaction;
  await client.connection.query(
    `SELECT * FROM giveaways WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}' AND MessageID = '${message.id}' AND Active = '0'`,
    async (e, row) => {
      if (e) throw e;
      if (row[0]?.GuildID) {
        if (member.id === row[0]?.HostedBy) {
          await interaction
            .reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.theme.color)
                  .setDescription(
                    `**Rerolling Giveaway #${row[0]?.GiveawayID}!**`
                  ),
              ],
              ephemeral: true,
            })
            .catch(() => {});
          let entries = [];
          let winners = [];
          let finalwinners = [];
          let winnercount = Number(row[0]?.WinnerCount);
          await client.connection.query(
            `SELECT * FROM giveawayentries WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}' AND MessageID = '${message.id}' AND GiveawayID = '${row[0]?.GiveawayID}'`,
            async (er, rows) => {
              if (er) throw er;
              rows.forEach((r) => {
                entries.push(r.UserID);
              });
              setTimeout(async () => {
                entries.forEach(async (e) => {
                  if (winners.length < winnercount) {
                    let choosewinners = await entries[
                      Math.floor(entries.length * Math.random())
                    ];
                    if (winners.length < winnercount) {
                      if (!winners.includes(choosewinners)) {
                        winners.push(choosewinners);
                      }
                    }
                  }
                });
                client.utils.giveawayStuff(entries, winners, winnercount);
                setTimeout(() => {
                  winners.forEach(async (w) => {
                    if (winners.length > winnercount) {
                      winners.pop();
                    } else {
                      let winner = await client.users.fetch(w);
                      finalwinners.push(`<@${winner.id}>`);
                    }
                  });
                  setTimeout(async () => {
                    let rerrollembed = new EmbedBuilder()
                      .setColor(client.config.theme.color)
                      .setTitle(row[0]?.Prize)
                      .setDescription(row[0]?.GDescription)
                      .addFields({
                        name: "**Giveaway Information**",
                        value: `**Ended:**  <t:${parseInt(
                          row[0]?.Duration / 1000
                        )}:R>\n**Hosted By:** <@${
                          row[0]?.HostedBy
                        }>\n**Entries:** ${
                          row[0]?.Entries
                        }\n**Winners:** ${finalwinners.join(", ")}`,
                      })
                      .setThumbnail(guild.iconURL({ dynamic: true }))
                      .setFooter({
                        text: "Giveaway Rerolled ",
                        iconURL: guild.iconURL({ dynamic: true }),
                      })
                      .setTimestamp();
                    await message.edit({ embeds: [rerrollembed] });
                    await message
                      .reply({
                        embeds: [
                          new EmbedBuilder()
                            .setColor(client.config.theme.color)
                            .setDescription(
                              `**Giveaway #${
                                row[0]?.GiveawayID
                              } has been rerolled!**\n**Winners:** ${finalwinners.join(
                                ", "
                              )}`
                            ),
                        ],
                        components: [
                          new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                              .setLabel("Go to Giveaway")
                              .setStyle(ButtonStyle.Link)
                              .setURL(message.url)
                          ),
                        ],
                      })
                      .then(() => {
                        entries = [];
                        winners = [];
                        finalwinners = [];
                      })
                      .catch(() => {});
                  }, 4000);
                }, 6000);
              }, 5000);
            }
          );
        } else
          return interaction.reply({
            content: "This button isn't for you!",
            ephemeral: true,
          });
      } else {
        await client.connection.query(
          `SELECT * FROM giveaways WHERE GuildID = '${guild.id}' AND ChannelID = '${channel.id}' AND MessageID = '${message.id}' AND Active = '1'`,
          async (er, roww) => {
            if (er) throw er;
            if (roww) {
              if (member.id === roww[0]?.HostedBy) {
                return interaction
                  .reply({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.theme.color)
                        .setDescription("**The giveaway hasn't ended yet!**"),
                    ],
                    ephemeral: true,
                  })
                  .catch(() => {});
              } else
                return interaction
                  .reply({
                    content: "This button isn't for you!",
                    ephemeral: true,
                  })
                  .catch(() => {});
            }
          }
        );
      }
    }
  );
}
exports.create = create;
exports.enter = enter;
exports.leave = leave;
exports.end = end;
exports.reroll = reroll;
