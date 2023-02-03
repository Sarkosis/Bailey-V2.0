const chalk = require("chalk");
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

async function error(client, content) {
  if (client.config.bot.debugMode) {
    console.log(
      chalk.red("DEBUG MODE ERROR: ", content, `\n ${content.stack}`)
    );
  }
}

function permsCheck(roleID, member) {
  if (!member.roles.cache.some((role) => role.id === roleID)) {
    return false;
  } else return true;
}
async function giveawaysManager(client) {
  await client.connection.query(
    `SELECT * FROM giveaways WHERE Active = '1'`,
    async (e, rows) => {
      if (e) throw e;
      for (let data of rows) {
        if (Date.now() >= data?.Duration) {
          return;
        }
        try {
          let guild = await client.guilds.cache.get(data?.GuildID);
          console.log("test");
          if (guild) {
            try {
              let channel = await client.channels.cache.get(data?.ChannelID);
              console.log("test");
              if (channel) {
                try {
                  let message = await channel.messages.fetch(data?.MessageID);
                  console.log("test");
                  if (message) {
                    if (Date.now() >= data?.Duration) {
                      await client.connection.query(
                        `UPDATE giveaways SET Active = '0' WHERE GuildID = '${guild.id}' AND MessageID = '${message.id}' AND ChannelID = '${channel.id}'`,
                        async (er) => {
                          if (er) throw er;
                          if (data?.Entries < 1) {
                            let newEmbed = new EmbedBuilder()
                              .setTitle(data?.Prize)
                              .setColor(client.config.theme.color)
                              .addFields({
                                name: "Giveaway Information",
                                value: `**Ended:** <t:${parseInt(
                                  data?.Duration / 1000
                                )}:R>\n**Hosted By:** <@${
                                  data?.HostedBy
                                }>\n**Entries:** ${
                                  data?.Entries
                                }\n**Winners:** Nobody Entered This Giveaway.`,
                              })
                              .setDescription(data?.GDescription)
                              .setThumbnail(guild.iconURL({ dynamic: true }))
                              .setFooter({
                                text: "Giveaway Ended ",
                                iconURL: guild.iconURL({ dynamic: true }),
                              })
                              .setTimestamp();
                            await message.edit({ embeds: [newEmbed] });
                            return message.reply({
                              content: `**Nobody entered the giveaway.**\n${message.url}`,
                            });
                          }
                          if (data?.Entries >= 1) {
                            let entries = [];
                            let winners = [];
                            let test = [];
                            let winnerCount = Number(data?.WinnerCount);
                            if (!winnerCount) {
                              return console.log(
                                "The selected winner count isn't a number"
                              );
                            }
                            if (data?.GuildID) {
                              await client.connection.query(
                                `SELECT * FROM giveawayentries WHERE GiveawayID = '${data?.GiveawayID}' AND GuildID ='${guild.id}' AND ChannelID = '${channel.id}' AND MessageID = '${message.id}'`,
                                async (err, erow) => {
                                  if (err) throw err;
                                  if (erow[0]?.GuildID) {
                                    await erow.forEach((r) => {
                                      entries.push(r.UserID);
                                    });
                                    setTimeout(async () => {
                                      if (winners.length < winnerCount) {
                                        let choosewinner = await entries[
                                          Math.floor(
                                            entries.length * Math.random()
                                          )
                                        ];
                                        if (winners.length < winnerCount) {
                                          if (!winners.includes(choosewinner)) {
                                            winners.push(choosewinner);
                                          }
                                        }
                                      }
                                      giveawayStuff(
                                        entries,
                                        winners,
                                        winnerCount
                                      );
                                      setTimeout(async () => {
                                        winners.forEach(async (w) => {
                                          if (winners.length > winnerCount) {
                                            console.log(
                                              "Winner count too high, taking away count!"
                                            );
                                            winners.pop();
                                          } else {
                                            let winner =
                                              await client.users.fetch(w);
                                            test.push(`<@${winner.id}>`);
                                          }
                                        });
                                        setTimeout(async () => {
                                          let newEmbed = new EmbedBuilder()
                                            .setTitle(data?.Prize)
                                            .setColor(client.config.theme.color)
                                            .addFields({
                                              name: "Giveaway Information",
                                              value: `**Ended:** <t:${parseInt(
                                                data?.Duration / 1000
                                              )}:R>\n**Hosted By:** <@${
                                                data?.HostedBy
                                              }>\n**Entries:** ${
                                                data?.Entries
                                              }\n**Winners:** ${test.join(
                                                ", "
                                              )}`,
                                            })
                                            .setDescription(data?.GDescription)
                                            .setThumbnail(
                                              guild.iconURL({ dynamic: true })
                                            )
                                            .setFooter({
                                              text: "Giveaway Ended ",
                                              iconURL: guild.iconURL({
                                                dynamic: true,
                                              }),
                                            })
                                            .setTimestamp();
                                          let button =
                                            new ActionRowBuilder().addComponents(
                                              new ButtonBuilder()
                                                .setLabel("Jump to Giveaway")
                                                .setStyle(ButtonStyle.Link)
                                                .setURL(message.url)
                                            );
                                          await message.edit({
                                            embeds: [newEmbed],
                                            components: [button],
                                          });
                                          await message
                                            .reply({
                                              embeds: [
                                                new EmbedBuilder()
                                                  .setColor(
                                                    client.config.theme.color
                                                  )
                                                  .setTitle(
                                                    "Giveaway Notification"
                                                  )
                                                  .setDescription(
                                                    `**GiveawayID:** ${
                                                      data?.GiveawayID
                                                    }\n**Entries:** ${
                                                      data?.Entries
                                                    }\n**Winners:** ${test.join(
                                                      ", "
                                                    )}`
                                                  )
                                                  .setThumbnail(
                                                    guild.iconURL({
                                                      dynamic: true,
                                                    })
                                                  )
                                                  .setFooter({
                                                    text: `Giveaway #${data?.GiveawayID}`,
                                                    iconURL: guild.iconURL({
                                                      dynamic: true,
                                                    }),
                                                  }),
                                              ],
                                            })
                                            .then(() => {
                                              entries = [];
                                              winners = [];
                                              test = [];
                                            })
                                            .catch((error) => {
                                              console.log(error);
                                            });
                                        }, 4000);
                                      }, 6000);
                                    }, 5000);
                                  }
                                }
                              );
                            }
                          }
                        }
                      );
                    }
                  }
                } catch (error) {
                  console.log("Giveaway Error Occured");
                  console.log(error);
                }
              }
            } catch (error) {
              console.log("Giveaway Error Occured");
              console.log(error);
            }
          }
        } catch (error) {
          console.log("Giveaway Error Occured");
          console.log(error);
        }
      }
    }
  );
}
async function giveawayStuff(entries, winners, winnerCount) {
  if (winners.length !== winnerCount) {
    entries.forEach(async () => {
      if (winners.length < winnerCount) {
        let choosewinner = await entries[
          Math.floor(entries.length * Math.random())
        ];
        if (winners.length < winnerCount) {
          if (!winners.includes(choosewinner)) {
            winners.push(choosewinner);
          }
        }
      }
    });
  }
}
async function end(interaction, client) {
  await client.connection.query(
    `SELECT * FROM giveaways WHERE Active = '1'`,
    async (e, rows) => {
      if (e) throw e;
      for (let data of rows) {
        try {
          let guild = await client.guilds.cache.find(
            (g) => g.id === data?.GuildID
          );
          if (guild) {
            try {
              let channel = await client.channels.cache.find(
                (c) => c.id === data?.ChannelID
              );
              if (channel) {
                try {
                  let message = await channel.messages.fetch(data?.MessageID);
                  if (message) {
                    await client.connection.query(
                      `UPDATE giveaways SET Active = '0' WHERE GuildID = '${guild.id}' AND MessageID = '${message.id}' AND ChannelID = '${channel.id}'`,
                      async (er) => {
                        if (er) throw er;
                        if (data?.Entries < 1) {
                          let newEmbed = new EmbedBuilder()
                            .setTitle(data?.Prize)
                            .setColor(client.config.theme.color)
                            .addFields({
                              name: "Giveaway Information",
                              value: `**Ended:** <t:${parseInt(
                                interaction.createdTimestamp / 1000
                              )}:R>\n**Hosted By:** <@${
                                data?.HostedBy
                              }>\n**Entries:** ${
                                data?.Entries
                              }\n**Winners:** Nobody Entered This Giveaway.`,
                            })
                            .setDescription(data?.GDescription)
                            .setThumbnail(guild.iconURL({ dynamic: true }))
                            .setFooter({
                              text: "Giveaway Ended ",
                              iconURL: guild.iconURL({ dynamic: true }),
                            })
                            .setTimestamp();
                          await message.edit({ embeds: [newEmbed] });
                          return message
                            .reply({
                              embeds: [
                                new EmbedBuilder()
                                  .setColor(client.config.theme.color)
                                  .setDescription(
                                    `**Giveaway #${data?.GiveawayID} has ended!**\n**Nobody joined the giveaway!**`
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
                            .catch(() => {});
                        }
                        if (data?.Entries >= 1) {
                          let entries = [];
                          let winners = [];
                          let test = [];
                          let winnerCount = Number(data?.WinnerCount);
                          if (!winnerCount) {
                            return console.log(
                              "The selected winner count isn't a number"
                            );
                          }
                          if (data?.GuildID) {
                            await client.connection.query(
                              `SELECT * FROM giveawayentries WHERE GiveawayID = '${data?.GiveawayID}' AND GuildID ='${guild.id}' AND ChannelID = '${channel.id}' AND MessageID = '${message.id}'`,
                              async (err, erow) => {
                                if (err) throw err;
                                if (erow[0]?.GuildID) {
                                  await erow.forEach((r) => {
                                    entries.push(r.UserID);
                                  });
                                  setTimeout(async () => {
                                    if (winners.length < winnerCount) {
                                      let choosewinner = await entries[
                                        Math.floor(
                                          entries.length * Math.random()
                                        )
                                      ];
                                      if (winners.length < winnerCount) {
                                        if (!winners.includes(choosewinner)) {
                                          winners.push(choosewinner);
                                        }
                                      }
                                    }
                                    giveawayStuff(
                                      entries,
                                      winners,
                                      winnerCount
                                    );
                                    setTimeout(async () => {
                                      winners.forEach(async (w) => {
                                        if (winners.length > winnerCount) {
                                          console.log(
                                            "Winner count too high, taking away count!"
                                          );
                                          winners.pop();
                                        } else {
                                          let winner = await client.users.fetch(
                                            w
                                          );
                                          test.push(`<@${winner.id}>`);
                                        }
                                      });
                                      setTimeout(async () => {
                                        let newEmbed = new EmbedBuilder()
                                          .setTitle(data?.Prize)
                                          .setColor(client.config.theme.color)
                                          .addFields({
                                            name: "Giveaway Information",
                                            value: `**Ended:** <t:${parseInt(
                                              interaction.createdTimestamp /
                                                1000
                                            )}:R>\n**Hosted By:** <@${
                                              data?.HostedBy
                                            }>\n**Entries:** ${
                                              data?.Entries
                                            }\n**Winners:** ${test.join(", ")}`,
                                          })
                                          .setDescription(data?.GDescription)
                                          .setThumbnail(
                                            guild.iconURL({ dynamic: true })
                                          )
                                          .setFooter({
                                            text: "Giveaway Ended ",
                                            iconURL: guild.iconURL({
                                              dynamic: true,
                                            }),
                                          })
                                          .setTimestamp();
                                        await message.edit({
                                          embeds: [newEmbed],
                                        });
                                        await message
                                          .reply({
                                            embeds: [
                                              new EmbedBuilder()
                                                .setColor(
                                                  client.config.theme.color
                                                )
                                                .setDescription(
                                                  `**Giveaway #${
                                                    data?.GiveawayID
                                                  } has ended!**\n**Winners:** ${test.join(
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
                                            test = [];
                                          })
                                          .catch((error) => {
                                            console.log(error);
                                          });
                                      }, 4000);
                                    }, 6000);
                                  }, 5000);
                                }
                              }
                            );
                          }
                        }
                      }
                    );
                  }
                } catch (error) {
                  console.log("Giveaway Error Occured");
                  console.log(error);
                }
              }
            } catch (error) {
              console.log("Giveaway Error Occured");
              console.log(error);
            }
          }
        } catch (error) {
          console.log("Giveaway Error Occured");
          console.log(error);
        }
      }
    }
  );
}

async function reminder(client) {
  await client.connection.query(`SELECT * FROM reminders`, async (e, rows) => {
    if (e) {
      if (client.config.bot.debugMode) {
        console.log(e.stack);
      }
    }
    for (let data of rows) {
      if (data?.Active === "0") return;
      if (Date.now() >= data?.Timer) {
        try {
          let guild = await client.guilds.cache.get(data?.GuildID);
          let member = await guild.members.fetch(data?.UserID);
          if (member) {
            await member.send({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.theme.color)
                  .setTitle("Reminder")
                  .setDescription(`**Reminder:** ${data?.Reminder}`),
              ],
              ephemeral: true,
            });
            await client.connection.query(
              `DELETE FROM reminders WHERE ReminderID = '${data?.ReminderID}'`,
              async (er) => {
                if (er) {
                  if (client.config.bot.debugMode) {
                    console.log(er.stack);
                  }
                }
              }
            );
          }
        } catch (error) {
          console.log(error.stack);
        }
      }
    }
  });
}
exports.reminders = reminder;
exports.error = error;
exports.giveawaysManager = giveawaysManager;
exports.giveawaysEnd = end;
exports.giveawayStuff = giveawayStuff;
exports.permsCheck = permsCheck;
