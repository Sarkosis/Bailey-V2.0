const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn Options")
    .addSubcommandGroup((subg) =>
      subg
        .setName("add")
        .setDescription("Add a warning")
        .addSubcommand((sub) =>
          sub
            .setName("member")
            .setDescription("Warn a guild member")
            .addUserOption((o) =>
              o
                .setName("member")
                .setDescription("Select a member")
                .setRequired(true)
            )
            .addStringOption((o) =>
              o
                .setName("reason")
                .setDescription("Reason for warn")
                .setRequired(false)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("user")
            .setDescription("Warn a user")
            .addStringOption((o) =>
              o
                .setName("user_id")
                .setDescription("Input the user ID")
                .setRequired(true)
            )
            .addStringOption((o) =>
              o
                .setName("reason")
                .setDescription("Reason for warn")
                .setRequired(false)
            )
        )
    )
    .addSubcommandGroup((subg) =>
      subg
        .setName("remove")
        .setDescription("Remove a warning")
        .addSubcommand((sub) =>
          sub
            .setName("member")
            .setDescription("Unwarn a guild member")
            .addNumberOption((o) =>
              o
                .setName("case_id")
                .setDescription("Input the Case ID")
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("user")
            .setDescription("Unwarn a user")
            .addNumberOption((o) =>
              o
                .setName("case_id")
                .setDescription("Input the Case ID")
                .setRequired(true)
            )
        )
    ),
  async execute(interaction, client) {
    let { guild, member, options } = interaction;
    let subcgroup = options.getSubcommandGroup();
    let subc = options.getSubcommand();
    let wmember = options.getMember("member");
    let user = options.getString("user_id");
    let reason = options.getString("reason") || "No reason provided.";
    let cid = options.getNumber("case_id");
    await client.connection.query(
      `SELECT * FROM modperms WHERE GuildID = '${guild.id}'`,
      async (e, rows) => {
        if (e) {
          if (client.config.bot.debugMode) {
            console.log(e.stack);
          }
        }
        let roles = [];
        for (let data of rows) {
          roles.push(data?.RoleID);
        }
        if (roles.length === 0)
          return interaction.reply({
            content: "No moderation roles found!",
            ephemeral: true,
          });
        let result = false;
        await member.roles.cache.each((r) => {
          let rolecheck = roles.includes(r.id);
          if (rolecheck == true) {
            result = true;
          }
        });
        if (result == false)
          return interaction.reply({
            content: "You don't have permissions to do this!",
            ephemeral: true,
          });

        switch (subcgroup) {
          case "add":
            {
              switch (subc) {
                case "member":
                  {
                    await client.connection.query(
                      `SELECT COUNT(*) as total FROM warns`,
                      async (er, results) => {
                        if (er) {
                          if (client.config.bot.debugMode) {
                            console.log(er.stack);
                          }
                        }
                        let caseid = results[0]?.total + 1;

                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle("Action Logs - Member Warned")
                          .setDescription(
                            `**Staff Member:** <@${member.id}> - (${member.id})\n**Warned Member:** <@${wmember.id}> - (${wmember.id})\n**Reason:** ${reason}`
                          )
                          .setThumbnail(guild.iconURL({ dyanmic: true }))
                          .setFooter({
                            text: `Case #${caseid}`,
                            iconURL: client.user.displayAvatarURL({
                              dyanmic: true,
                            }),
                          })
                          .setTimestamp();
                        await interaction.reply({
                          content: "Warned successfully!",
                          ephemeral: true,
                        });
                        let m = await interaction.channel
                          .send({ embeds: [embed] })
                          .catch(() => {});
                        setTimeout(async () => {
                          await m.delete();
                        }, 10000);
                        await client.connection.query(
                          `INSERT INTO warns (GuildID, CaseID, StaffID, UserID, Reason) VALUES ('${guild.id}', '${caseid}', '${member.id}', '${member.id}', "${reason}")`,
                          async (er) => {
                            if (er) {
                              if (client.config.bot.debugMode) {
                                console.log(er.stack);
                              }
                            }
                          }
                        );
                        await client.connection.query(
                          `SELECT * FROM guildlogging WHERE GuildID = '${guild.id}'`,
                          async (er, row) => {
                            if (er) {
                              if (client.config.bot.debugMode) {
                                console.log(er.stack);
                              }
                            }
                            if (row[0]?.GuildID) {
                              let thechan = await guild.channels.cache.get(
                                row[0]?.ModLogs
                              );
                              await thechan
                                ?.send({ embeds: [embed] })
                                .catch(() => {});
                            }
                          }
                        );
                      }
                    );
                  }
                  break;
                case "user":
                  {
                    await client.connection.query(
                      `SELECT COUNT(*) as total FROM warns`,
                      async (er, results) => {
                        if (er) {
                          if (client.config.bot.debugMode) {
                            console.log(er.stack);
                          }
                        }
                        let caseid = results[0]?.total + 1;
                        console.log(user);
                        let theuser = await client.users.fetch(user, {
                          force: true,
                        });
                        if (!theuser?.id || !theuser)
                          return interaction
                            .reply({
                              content: "I couldn't find that user!",
                              ephemeral: true,
                            })
                            .catch(() => {});
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle("Action Logs - User Warned")
                          .setDescription(
                            `**Staff Member:** <@${member.id}> - (${member.id})\n**Warned User:** <@${theuser.id}> - (${theuser.id})\n**Reason:** ${reason}`
                          )
                          .setThumbnail(guild.iconURL({ dyanmic: true }))
                          .setFooter({
                            text: `Case #${caseid}`,
                            iconURL: client.user.displayAvatarURL({
                              dyanmic: true,
                            }),
                          })
                          .setTimestamp();
                        await interaction.reply({
                          content: "Warned successfully!",
                          ephemeral: true,
                        });
                        let m = await interaction.channel
                          .send({ embeds: [embed] })
                          .catch(() => {});
                        setTimeout(async () => {
                          await m.delete();
                        }, 10000);
                        await client.connection.query(
                          `INSERT INTO warns (GuildID, CaseID, StaffID, UserID, Reason) VALUES ('${guild.id}', '${caseid}', '${theuser.id}', '${theuser.id}', "${reason}")`,
                          async (er) => {
                            if (er) {
                              if (client.config.bot.debugMode) {
                                console.log(er.stack);
                              }
                            }
                          }
                        );
                        await client.connection.query(
                          `SELECT * FROM guildlogging WHERE GuildID = '${guild.id}'`,
                          async (er, row) => {
                            if (er) {
                              if (client.config.bot.debugMode) {
                                console.log(er.stack);
                              }
                            }
                            if (row[0]?.GuildID) {
                              let thechan = await guild.channels.cache.get(
                                row[0]?.ModLogs
                              );
                              await thechan
                                ?.send({ embeds: [embed] })
                                .catch(() => {});
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
          case "remove":
            {
              switch (subc) {
                case "member":
                  {
                    await client.connection.query(
                      `SELECT * FROM warns WHERE CaseID = '${cid}'`,
                      async (er, row) => {
                        if (er) {
                          if (client.config.bot.debugMode) {
                            console.log(er.stack);
                          }
                        }
                        if (row[0]?.GuildID) {
                          await client.connection.query(
                            `DELETE FROM warns WHERE CaseID = '${cid}'`,
                            async (err) => {
                              if (err) {
                                if (client.config.bot.debugMode) {
                                  console.log(err.stack);
                                }
                              }
                              return interaction.reply({
                                content: `Case ID #${cid} removed!`,
                                ephemeral: true,
                              });
                            }
                          );
                        } else
                          return interaction.reply({
                            content: "No case found!",
                            ephemeral: true,
                          });
                      }
                    );
                  }
                  break;
                case "user":
                  {
                    await client.connection.query(
                      `SELECT * FROM warns WHERE CaseID = '${cid}'`,
                      async (er, row) => {
                        if (er) {
                          if (client.config.bot.debugMode) {
                            console.log(er.stack);
                          }
                        }
                        if (row[0]?.GuildID) {
                          await client.connection.query(
                            `DELETE FROM warns WHERE CaseID = '${cid}'`,
                            async (err) => {
                              if (err) {
                                if (client.config.bot.debugMode) {
                                  console.log(err.stack);
                                }
                              }
                              return interaction.reply({
                                content: `Case ID #${cid} removed!`,
                                ephemeral: true,
                              });
                            }
                          );
                        } else
                          return interaction.reply({
                            content: "No case found!",
                            ephemeral: true,
                          });
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
      }
    );
  },
};
