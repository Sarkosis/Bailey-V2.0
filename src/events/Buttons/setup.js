const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isButton()) {
      let { guild, channel } = interaction;
      // Start of Settings
      if (["start-setup"].includes(interaction.customId)) {
        await client.connection.query(
          `SELECT * FROM guildlogging where GuildID = '${interaction.guild.id}'`,
          async (e, row) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
              return interaction.reply({
                content: "`Error occured.`",
                ephemeral: true,
              });
            }
            if (row[0]?.GuildID) {
              let embed = new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setTitle("Guild Logging")
                .setDescription(
                  `>>> **Mod Logs:** ${row[0]?.ModLogs}\n**Role Logs:** ${row[0]?.RoleLogs}\n**Channel Logs:** ${row[0]?.ChannelLogs}\n**Message Logs:** ${row[0]?.MessageLogs}\n**Member Logs:** ${row[0]?.MemberLogs}\n**Welcome Logs:** ${row[0]?.WelcomeLogs}\n**Leave Logs:** ${row[0]?.LeaveLogs}`
                )
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setFooter({
                  text: `${interaction.guild.name} Logging Settings`,
                  iconURL: interaction.guild.iconURL({ dynamic: true }),
                })
                .setTimestamp();
              let buttonsone = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("mod-logs")
                  .setLabel("Mod Logs")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("role-logs")
                  .setLabel("Role Logs")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("channel-logs")
                  .setLabel("Channel Logs")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("message-logs")
                  .setLabel("Message Logs")
                  .setStyle(ButtonStyle.Primary)
              );
              let buttonstwo = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("member-logs")
                  .setLabel("Member Logs")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("welcome-logs")
                  .setLabel("Welcome Logs")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("leave-logs")
                  .setLabel("Leave Logs")
                  .setStyle(ButtonStyle.Primary)
              );
              let buttonsthree = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("setup-continue-one")
                  .setLabel("Continue")
                  .setStyle(ButtonStyle.Danger)
              );
              await interaction.update({
                embeds: [embed],
                components: [buttonsone, buttonstwo, buttonsthree],
                ephemeral: true,
              });
            } else
              return interaction.reply({
                content: "`No database was created...`",
                ephemeral: true,
              });
          }
        );
      } else if (["mod-logs"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel(
              "What Channel would you like the the moderation logs set to?"
            )
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-logs")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 20000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let collectedchan = collected.first().mentions.channels.first();
            if (!collectedchan)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            let thechan = await guild.channels.cache.find(
              (c) => c.id === collectedchan.id
            );

            if (!thechan)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            if (thechan) {
              await client.connection.query(
                `UPDATE guildlogging SET ModLogs = '${thechan.id}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  await client.connection.query(
                    `SELECT * FROM guildlogging WHERE GuildID = '${guild.id}'`,
                    async (er, row) => {
                      if (er) {
                        if (client.config.bot.debugMode) {
                          console.log(er.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }
                      if (row[0]?.GuildID) {
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle("Guild Logging")
                          .setDescription(
                            `>>> **Mod Logs:** <#${row[0]?.ModLogs}>\n**Role Logs:** <#${row[0]?.RoleLogs}>\n**Channel Logs:** <#${row[0]?.ChannelLogs}>\n**Message Logs:** <#${row[0]?.MessageLogs}>\n**Member Logs:** <#${row[0]?.MemberLogs}>\n**Welcome Logs:** <#${row[0]?.WelcomeLogs}>\n**Leave Logs:** <#${row[0]?.LeaveLogs}>`
                          )
                          .setThumbnail(
                            client.user.displayAvatarURL({ dynamic: true })
                          )
                          .setFooter({
                            text: `${guild.name} settings`,
                            iconURL: guild.iconURL({ dynamic: true }),
                          })
                          .setTimestamp();

                        let buttonsone = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("mod-logs")
                            .setLabel("Mod Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("role-logs")
                            .setLabel("Role Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("channel-logs")
                            .setLabel("Channel Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("message-logs")
                            .setLabel("Message Logs")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonstwo = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("member-logs")
                            .setLabel("Member Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("welcome-logs")
                            .setLabel("Welcome Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("leave-logs")
                            .setLabel("Leave Logs")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonsthree = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("setup-continue-one")
                            .setLabel("Continue")
                            .setStyle(ButtonStyle.Danger)
                        );
                        await interaction
                          .editReply({
                            embeds: [embed],
                            components: [buttonsone, buttonstwo, buttonsthree],
                            ephemeral: true,
                          })
                          .then(async () => {
                            let message = collected.first();
                            await message.delete();
                          });
                      }
                    }
                  );
                }
              );
            }
          });
      } else if (["role-logs"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel("What Channel would you like the the role logs set to?")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-logs")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 20000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let collectedchan = collected.first().mentions.channels.first();
            if (!collectedchan)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            let thechan = await guild.channels.cache.find(
              (c) => c.id === collectedchan.id
            );

            if (!thechan)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            if (thechan) {
              await client.connection.query(
                `UPDATE guildlogging SET RoleLogs = '${thechan.id}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  await client.connection.query(
                    `SELECT * FROM guildlogging WHERE GuildID = '${guild.id}'`,
                    async (er, row) => {
                      if (er) {
                        if (client.config.bot.debugMode) {
                          console.log(er.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }
                      if (row[0]?.GuildID) {
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle("Guild Logging")
                          .setDescription(
                            `>>> **Mod Logs:** <#${row[0]?.ModLogs}>\n**Role Logs:** <#${row[0]?.RoleLogs}>\n**Channel Logs:** <#${row[0]?.ChannelLogs}>\n**Message Logs:** <#${row[0]?.MessageLogs}>\n**Member Logs:** <#${row[0]?.MemberLogs}>\n**Welcome Logs:** <#${row[0]?.WelcomeLogs}>\n**Leave Logs:** <#${row[0]?.LeaveLogs}>`
                          )
                          .setThumbnail(
                            client.user.displayAvatarURL({ dynamic: true })
                          )
                          .setFooter({
                            text: `${guild.name} settings`,
                            iconURL: guild.iconURL({ dynamic: true }),
                          })
                          .setTimestamp();

                        let buttonsone = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("mod-logs")
                            .setLabel("Mod Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("role-logs")
                            .setLabel("Role Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("channel-logs")
                            .setLabel("Channel Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("message-logs")
                            .setLabel("Message Logs")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonstwo = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("member-logs")
                            .setLabel("Member Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("welcome-logs")
                            .setLabel("Welcome Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("leave-logs")
                            .setLabel("Leave Logs")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonsthree = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("setup-continue-one")
                            .setLabel("Continue")
                            .setStyle(ButtonStyle.Danger)
                        );
                        await interaction
                          .editReply({
                            embeds: [embed],
                            components: [buttonsone, buttonstwo, buttonsthree],
                            ephemeral: true,
                          })
                          .then(async () => {
                            let message = collected.first();
                            await message.delete();
                          });
                      }
                    }
                  );
                }
              );
            }
          });
      } else if (["channel-logs"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel(
              "What Channel would you like the the channel logs set to?"
            )
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-logs")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 20000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let collectedchan = collected.first().mentions.channels.first();
            if (!collectedchan)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            let thechan = await guild.channels.cache.find(
              (c) => c.id === collectedchan.id
            );

            if (!thechan)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            if (thechan) {
              await client.connection.query(
                `UPDATE guildlogging SET ChannelLogs = '${thechan.id}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  await client.connection.query(
                    `SELECT * FROM guildlogging WHERE GuildID = '${guild.id}'`,
                    async (er, row) => {
                      if (er) {
                        if (client.config.bot.debugMode) {
                          console.log(er.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }
                      if (row[0]?.GuildID) {
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle("Guild Logging")
                          .setDescription(
                            `>>> **Mod Logs:** <#${row[0]?.ModLogs}>\n**Role Logs:** <#${row[0]?.RoleLogs}>\n**Channel Logs:** <#${row[0]?.ChannelLogs}>\n**Message Logs:** <#${row[0]?.MessageLogs}>\n**Member Logs:** <#${row[0]?.MemberLogs}>\n**Welcome Logs:** <#${row[0]?.WelcomeLogs}>\n**Leave Logs:** <#${row[0]?.LeaveLogs}>`
                          )
                          .setThumbnail(
                            client.user.displayAvatarURL({ dynamic: true })
                          )
                          .setFooter({
                            text: `${guild.name} settings`,
                            iconURL: guild.iconURL({ dynamic: true }),
                          })
                          .setTimestamp();

                        let buttonsone = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("mod-logs")
                            .setLabel("Mod Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("role-logs")
                            .setLabel("Role Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("channel-logs")
                            .setLabel("Channel Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("message-logs")
                            .setLabel("Message Logs")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonstwo = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("member-logs")
                            .setLabel("Member Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("welcome-logs")
                            .setLabel("Welcome Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("leave-logs")
                            .setLabel("Leave Logs")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonsthree = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("setup-continue-one")
                            .setLabel("Continue")
                            .setStyle(ButtonStyle.Danger)
                        );
                        await interaction
                          .editReply({
                            embeds: [embed],
                            components: [buttonsone, buttonstwo, buttonsthree],
                            ephemeral: true,
                          })
                          .then(async () => {
                            let message = collected.first();
                            await message.delete();
                          });
                      }
                    }
                  );
                }
              );
            }
          });
      } else if (["message-logs"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel(
              "What Channel would you like the the message logs set to?"
            )
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-logs")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 20000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let collectedchan = collected.first().mentions.channels.first();
            if (!collectedchan)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            let thechan = await guild.channels.cache.find(
              (c) => c.id === collectedchan.id
            );

            if (!thechan)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            if (thechan) {
              await client.connection.query(
                `UPDATE guildlogging SET MessageLogs = '${thechan.id}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  await client.connection.query(
                    `SELECT * FROM guildlogging WHERE GuildID = '${guild.id}'`,
                    async (er, row) => {
                      if (er) {
                        if (client.config.bot.debugMode) {
                          console.log(er.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }
                      if (row[0]?.GuildID) {
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle("Guild Logging")
                          .setDescription(
                            `>>> **Mod Logs:** <#${row[0]?.ModLogs}>\n**Role Logs:** <#${row[0]?.RoleLogs}>\n**Channel Logs:** <#${row[0]?.ChannelLogs}>\n**Message Logs:** <#${row[0]?.MessageLogs}>\n**Member Logs:** <#${row[0]?.MemberLogs}>\n**Welcome Logs:** <#${row[0]?.WelcomeLogs}>\n**Leave Logs:** <#${row[0]?.LeaveLogs}>`
                          )
                          .setThumbnail(
                            client.user.displayAvatarURL({ dynamic: true })
                          )
                          .setFooter({
                            text: `${guild.name} settings`,
                            iconURL: guild.iconURL({ dynamic: true }),
                          })
                          .setTimestamp();

                        let buttonsone = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("mod-logs")
                            .setLabel("Mod Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("role-logs")
                            .setLabel("Role Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("channel-logs")
                            .setLabel("Channel Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("message-logs")
                            .setLabel("Message Logs")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonstwo = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("member-logs")
                            .setLabel("Member Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("welcome-logs")
                            .setLabel("Welcome Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("leave-logs")
                            .setLabel("Leave Logs")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonsthree = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("setup-continue-one")
                            .setLabel("Continue")
                            .setStyle(ButtonStyle.Danger)
                        );
                        await interaction
                          .editReply({
                            embeds: [embed],
                            components: [buttonsone, buttonstwo, buttonsthree],
                            ephemeral: true,
                          })
                          .then(async () => {
                            let message = collected.first();
                            await message.delete();
                          });
                      }
                    }
                  );
                }
              );
            }
          });
      } else if (["member-logs"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel("What Channel would you like the the member logs set to?")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-logs")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 20000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let collectedchan = collected.first().mentions.channels.first();
            if (!collectedchan)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            let thechan = await guild.channels.cache.find(
              (c) => c.id === collectedchan.id
            );

            if (!thechan)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            if (thechan) {
              await client.connection.query(
                `UPDATE guildlogging SET MemberLogs = '${thechan.id}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  await client.connection.query(
                    `SELECT * FROM guildlogging WHERE GuildID = '${guild.id}'`,
                    async (er, row) => {
                      if (er) {
                        if (client.config.bot.debugMode) {
                          console.log(er.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }
                      if (row[0]?.GuildID) {
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle("Guild Logging")
                          .setDescription(
                            `>>> **Mod Logs:** <#${row[0]?.ModLogs}>\n**Role Logs:** <#${row[0]?.RoleLogs}>\n**Channel Logs:** <#${row[0]?.ChannelLogs}>\n**Message Logs:** <#${row[0]?.MessageLogs}>\n**Member Logs:** <#${row[0]?.MemberLogs}>\n**Welcome Logs:** <#${row[0]?.WelcomeLogs}>\n**Leave Logs:** <#${row[0]?.LeaveLogs}>`
                          )
                          .setThumbnail(
                            client.user.displayAvatarURL({ dynamic: true })
                          )
                          .setFooter({
                            text: `${guild.name} settings`,
                            iconURL: guild.iconURL({ dynamic: true }),
                          })
                          .setTimestamp();

                        let buttonsone = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("mod-logs")
                            .setLabel("Mod Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("role-logs")
                            .setLabel("Role Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("channel-logs")
                            .setLabel("Channel Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("message-logs")
                            .setLabel("Message Logs")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonstwo = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("member-logs")
                            .setLabel("Member Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("welcome-logs")
                            .setLabel("Welcome Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("leave-logs")
                            .setLabel("Leave Logs")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonsthree = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("setup-continue-one")
                            .setLabel("Continue")
                            .setStyle(ButtonStyle.Danger)
                        );
                        await interaction
                          .editReply({
                            embeds: [embed],
                            components: [buttonsone, buttonstwo, buttonsthree],
                            ephemeral: true,
                          })
                          .then(async () => {
                            let message = collected.first();
                            await message.delete();
                          });
                      }
                    }
                  );
                }
              );
            }
          });
      } else if (["welcome-logs"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel(
              "What Channel would you like the the welcome logs set to?"
            )
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-logs")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 20000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let collectedchan = collected.first().mentions.channels.first();
            if (!collectedchan)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            let thechan = await guild.channels.cache.find(
              (c) => c.id === collectedchan.id
            );

            if (!thechan)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            if (thechan) {
              await client.connection.query(
                `UPDATE guildlogging SET WelcomeLogs = '${thechan.id}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  await client.connection.query(
                    `SELECT * FROM guildlogging WHERE GuildID = '${guild.id}'`,
                    async (er, row) => {
                      if (er) {
                        if (client.config.bot.debugMode) {
                          console.log(er.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }
                      if (row[0]?.GuildID) {
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle("Guild Logging")
                          .setDescription(
                            `>>> **Mod Logs:** <#${row[0]?.ModLogs}>\n**Role Logs:** <#${row[0]?.RoleLogs}>\n**Channel Logs:** <#${row[0]?.ChannelLogs}>\n**Message Logs:** <#${row[0]?.MessageLogs}>\n**Member Logs:** <#${row[0]?.MemberLogs}>\n**Welcome Logs:** <#${row[0]?.WelcomeLogs}>\n**Leave Logs:** <#${row[0]?.LeaveLogs}>`
                          )
                          .setThumbnail(
                            client.user.displayAvatarURL({ dynamic: true })
                          )
                          .setFooter({
                            text: `${guild.name} settings`,
                            iconURL: guild.iconURL({ dynamic: true }),
                          })
                          .setTimestamp();

                        let buttonsone = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("mod-logs")
                            .setLabel("Mod Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("role-logs")
                            .setLabel("Role Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("channel-logs")
                            .setLabel("Channel Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("message-logs")
                            .setLabel("Message Logs")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonstwo = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("member-logs")
                            .setLabel("Member Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("welcome-logs")
                            .setLabel("Welcome Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("leave-logs")
                            .setLabel("Leave Logs")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonsthree = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("setup-continue-one")
                            .setLabel("Continue")
                            .setStyle(ButtonStyle.Danger)
                        );
                        await interaction
                          .editReply({
                            embeds: [embed],
                            components: [buttonsone, buttonstwo, buttonsthree],
                            ephemeral: true,
                          })
                          .then(async () => {
                            let message = collected.first();
                            await message.delete();
                          });
                      }
                    }
                  );
                }
              );
            }
          });
      } else if (["leave-logs"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel("What Channel would you like the the leave logs set to?")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-logs")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 20000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let collectedchan = collected.first().mentions.channels.first();
            if (!collectedchan)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            let thechan = await guild.channels.cache.find(
              (c) => c.id === collectedchan.id
            );

            if (!thechan)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            if (thechan) {
              await client.connection.query(
                `UPDATE guildlogging SET LeaveLogs = '${thechan.id}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  await client.connection.query(
                    `SELECT * FROM guildlogging WHERE GuildID = '${guild.id}'`,
                    async (er, row) => {
                      if (er) {
                        if (client.config.bot.debugMode) {
                          console.log(er.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }
                      if (row[0]?.GuildID) {
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle("Guild Logging")
                          .setDescription(
                            `>>> **Mod Logs:** <#${row[0]?.ModLogs}>\n**Role Logs:** <#${row[0]?.RoleLogs}>\n**Channel Logs:** <#${row[0]?.ChannelLogs}>\n**Message Logs:** <#${row[0]?.MessageLogs}>\n**Member Logs:** <#${row[0]?.MemberLogs}>\n**Welcome Logs:** <#${row[0]?.WelcomeLogs}>\n**Leave Logs:** <#${row[0]?.LeaveLogs}>`
                          )
                          .setThumbnail(
                            client.user.displayAvatarURL({ dynamic: true })
                          )
                          .setFooter({
                            text: `${guild.name} settings`,
                            iconURL: guild.iconURL({ dynamic: true }),
                          })
                          .setTimestamp();

                        let buttonsone = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("mod-logs")
                            .setLabel("Mod Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("role-logs")
                            .setLabel("Role Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("channel-logs")
                            .setLabel("Channel Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("message-logs")
                            .setLabel("Message Logs")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonstwo = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("member-logs")
                            .setLabel("Member Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("welcome-logs")
                            .setLabel("Welcome Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("leave-logs")
                            .setLabel("Leave Logs")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonsthree = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("setup-continue-one")
                            .setLabel("Continue")
                            .setStyle(ButtonStyle.Danger)
                        );
                        await interaction
                          .editReply({
                            embeds: [embed],
                            components: [buttonsone, buttonstwo, buttonsthree],
                            ephemeral: true,
                          })
                          .then(async () => {
                            let message = collected.first();
                            await message.delete();
                          });
                      }
                    }
                  );
                }
              );
            }
          });
      } else if (["cancel-logs"].includes(interaction.customId)) {
        await client.connection.query(
          `SELECT * FROM guildlogging WHERE GuildID = '${guild.id}'`,
          async (e, row) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
              return channel.send("`Error Occured.`").then((m) => {
                m.delete();
              });
            } else if (row[0]?.GuildID) {
              let embed = new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setTitle("Guild Logging")
                .setDescription(
                  `>>> **Mod Logs:** <#${row[0]?.ModLogs}>\n**Role Logs:** <#${row[0]?.RoleLogs}>\n**Channel Logs:** <#${row[0]?.ChannelLogs}>\n**Message Logs:** <#${row[0]?.MessageLogs}>\n**Member Logs:** <#${row[0]?.MemberLogs}>\n**Welcome Logs:** <#${row[0]?.WelcomeLogs}>\n**Leave Logs:** <#${row[0]?.LeaveLogs}>`
                )
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setFooter({
                  text: `${guild.name} settings`,
                  iconURL: guild.iconURL({ dynamic: true }),
                })
                .setTimestamp();

              let buttonsone = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("mod-logs")
                  .setLabel("Mod Logs")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("role-logs")
                  .setLabel("Role Logs")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("channel-logs")
                  .setLabel("Channel Logs")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("message-logs")
                  .setLabel("Message Logs")
                  .setStyle(ButtonStyle.Primary)
              );
              let buttonstwo = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("member-logs")
                  .setLabel("Member Logs")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("welcome-logs")
                  .setLabel("Welcome Logs")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("leave-logs")
                  .setLabel("Leave Logs")
                  .setStyle(ButtonStyle.Primary)
              );
              let buttonsthree = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("setup-continue-one")
                  .setLabel("Continue")
                  .setStyle(ButtonStyle.Danger)
              );

              await interaction.update({
                embeds: [embed],
                components: [buttonsone, buttonstwo, buttonsthree],
                ephemeral: true,
              });
            }
          }
        );
      } else if (["setup-continue-one"].includes(interaction.customId)) {
        await client.connection.query(
          `SELECT * FROM modperms WHERE GuildID = '${guild.id}'`,
          async (er, rows) => {
            if (er) {
              if (client.config.bot.debugMode) {
                console.log(er.stack);
              }
              return interaction.reply({
                content: "`Error occured.`",
                ephemeral: true,
              });
            }
            let embed = new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setTitle("Moderation Permissions")
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setFooter({
                text: `${guild.name} Moderation Permissions`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setTimestamp();
            let i = 0;

            let buttons = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("modperms-add")
                .setDisabled(false)
                .setLabel("Add Moderation Role")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("modperms-remove")
                .setDisabled(false)
                .setLabel("Remove Moderation Role")
                .setStyle(ButtonStyle.Primary)
            );
            let buttonss = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("setup-continue-two")
                .setLabel("Continue")
                .setStyle(ButtonStyle.Danger)
            );
            for (let data of rows) {
              i++;
              embed.addFields({
                name: `Moderation Role ${i}`,
                value: `<@&${data?.RoleID}>`,
                inline: true,
              });
            }
            return interaction.update({
              embeds: [embed],
              components: [buttons, buttonss],
              ephemeral: true,
            });
          }
        );
      } else if (["modperms-add"].includes(interaction.customId)) {
        await client.connection.query(
          `INSERT INTO modperms (GuildID, RoleID) VALUES ('${guild.id}', '**None Selected**')`,
          async (error) => {
            if (error) {
              if (client.config.bot.debugMode) {
                console.log(error.stack);
              }
              return interaction.reply({
                content: "`Error Occured.`",
                ephemeral: true,
              });
            }
            let newbuttons = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("dummy1")
                .setDisabled(true)
                .setLabel(
                  "What Role Would you like to add to the moderation roles?"
                )
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("cancel-modperms")
                .setDisabled(false)
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Danger)
            );
            await interaction.update({ components: [newbuttons] });
            interaction.channel
              .awaitMessages({
                max: 1,
                time: 20000,
                errors: ["time"],
              })
              .then(async (collected) => {
                let collectedrole = collected.first().mentions.roles.first();
                if (!collectedrole)
                  return interaction.update({
                    components: [
                      new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("dummy2")
                          .setLabel("The message collected wasn't a role")
                          .setDisabled(true)
                          .setStyle(ButtonStyle.Danger)
                      ),
                    ],
                  });
                let therole = await guild.roles.cache.find(
                  (c) => c.id === collectedrole.id
                );

                if (!therole)
                  return interaction.update({
                    components: [
                      new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("dummy2")
                          .setLabel("The message collected wasn't a role")
                          .setDisabled(true)
                          .setStyle(ButtonStyle.Danger)
                      ),
                    ],
                  });
                if (therole) {
                  await client.connection.query(
                    `UPDATE modperms SET RoleID = '${therole.id}' WHERE GuildID = '${guild.id}' AND RoleID = '**None Selected**'`,
                    async (e) => {
                      if (e) {
                        if (client.config.bot.debugMode == true) {
                          console.log(e.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }
                      await client.connection.query(
                        `SELECT * FROM modperms WHERE GuildID = '${guild.id}'`,
                        async (er, rows) => {
                          if (er) {
                            if (client.config.bot.debugMode) {
                              console.log(er.stack);
                            }
                            return channel
                              .send("`Error occured.`")
                              .then((m) => m.delete());
                          }

                          let embed = new EmbedBuilder()
                            .setColor(client.config.theme.color)
                            .setTitle("Moderation Permissions")
                            .setThumbnail(
                              client.user.displayAvatarURL({ dynamic: true })
                            )
                            .setFooter({
                              text: `${guild.name} Moderation Permissions`,
                              iconURL: client.user.displayAvatarURL({
                                dynamic: true,
                              }),
                            })
                            .setTimestamp();
                          let i = 0;

                          let buttons = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                              .setCustomId("modperms-add")
                              .setDisabled(false)
                              .setLabel("Add Moderation Role")
                              .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                              .setCustomId("modperms-remove")
                              .setDisabled(false)
                              .setLabel("Remove Moderation Role")
                              .setStyle(ButtonStyle.Primary)
                          );
                          let buttonss = new ActionRowBuilder().addComponents(
                            new ButtonBuilder()
                              .setCustomId("setup-continue-two")
                              .setLabel("Continue")
                              .setStyle(ButtonStyle.Danger)
                          );
                          for (let data of rows) {
                            i++;
                            embed.addFields({
                              name: `Moderation Role ${i}`,
                              value: `<@&${data?.RoleID}>`,
                              inline: true,
                            });
                          }
                          await interaction
                            .editReply({
                              embeds: [embed],
                              components: [buttons, buttonss],
                              ephemeral: true,
                            })
                            .then(async () => {
                              let message = collected.first();
                              await message.delete();
                            });
                        }
                      );
                    }
                  );
                }
              });
          }
        );
      } else if (["modperms-remove"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel(
              "What Role Would you like to remove from the moderation roles?"
            )
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-modperms")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 20000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let collectedrole = collected.first().mentions.roles.first();
            if (!collectedrole)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a role")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            let therole = await guild.roles.cache.find(
              (c) => c.id === collectedrole.id
            );

            if (!therole)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a role")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            if (therole) {
              await client.connection.query(
                `SELECT * FROM modperms WHERE GuildID = '${guild.id}' AND RoleID = '${therole.id}'`,
                async (e, row) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  if (!row[0]?.GuildID)
                    return channel
                      .send("`No database entries found for that role!`")
                      .then((m) => m.delete());
                  if (row[0]?.GuildID) {
                    await client.connection.query(
                      `DELETE FROM modperms WHERE GuildID = '${guild.id}' AND RoleID = '${therole.id}'`,
                      async (er) => {
                        if (er) {
                          if (client.config.bot.debugMode) {
                            console.log(er.stack);
                          }
                          return channel
                            .send("`Error occured.`")
                            .then((m) => m.delete());
                        }
                        await client.connection.query(
                          `SELECT * FROM modperms WHERE GuildID = '${guild.ID}'`,
                          async (err, rows) => {
                            if (err) {
                              if (client.config.bot.debugMode) {
                                console.log(err.stack);
                              }
                              return channel
                                .send("`Error Occured.`")
                                .then((m) => {
                                  m.delete();
                                });
                            }
                            let embed = new EmbedBuilder()
                              .setColor(client.config.theme.color)
                              .setTitle("Moderation Permissions")
                              .setThumbnail(
                                client.user.displayAvatarURL({ dynamic: true })
                              )
                              .setFooter({
                                text: `${guild.name} Moderation Permissions`,
                                iconURL: client.user.displayAvatarURL({
                                  dynamic: true,
                                }),
                              })
                              .setTimestamp();
                            let i = 0;

                            let buttons = new ActionRowBuilder().addComponents(
                              new ButtonBuilder()
                                .setCustomId("modperms-add")
                                .setDisabled(false)
                                .setLabel("Add Moderation Role")
                                .setStyle(ButtonStyle.Primary),
                              new ButtonBuilder()
                                .setCustomId("modperms-remove")
                                .setDisabled(false)
                                .setLabel("Remove Moderation Role")
                                .setStyle(ButtonStyle.Primary)
                            );
                            let buttonss = new ActionRowBuilder().addComponents(
                              new ButtonBuilder()
                                .setCustomId("setup-continue-two")
                                .setLabel("Continue")
                                .setStyle(ButtonStyle.Danger)
                            );
                            for (let data of rows) {
                              i++;
                              embed.addFields({
                                name: `Moderation Role ${i}`,
                                value: `<@&${data?.RoleID}>`,
                                inline: true,
                              });
                            }
                            await interaction
                              .editReply({
                                embeds: [embed],
                                components: [buttons, buttonss],
                                ephemeral: true,
                              })
                              .then(async () => {
                                let message = collected.first();
                                await message.delete();
                              });
                          }
                        );
                      }
                    );
                  }
                }
              );
            }
          });
      } else if (["cancel-modperms"].includes(interaction.customId)) {
        await client.connection.query(
          `SELECT * FROM modperms WHERE GuildID = '${guild.id}'`,
          async (e, rows) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
              return channel.send("`Error Occured.`").then((m) => {
                m.delete();
              });
            }
            let embed = new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setTitle("Moderation Permissions")
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setFooter({
                text: `${guild.name} Moderation Permissions`,
                iconURL: client.user.displayAvatarURL({
                  dynamic: true,
                }),
              })
              .setTimestamp();
            let i = 0;

            let buttons = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("modperms-add")
                .setDisabled(false)
                .setLabel("Add Moderation Role")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("modperms-remove")
                .setDisabled(false)
                .setLabel("Remove Moderation Role")
                .setStyle(ButtonStyle.Primary)
            );
            let buttonss = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("setup-continue-two")
                .setLabel("Continue")
                .setStyle(ButtonStyle.Danger)
            );
            for (let data of rows) {
              i++;
              embed.addFields({
                name: `Moderation Role ${i}`,
                value: `<@&${data?.RoleID}>`,
                inline: true,
              });
            }
            await interaction.update({
              embeds: [embed],
              components: [buttons, buttonss],
              ephemeral: true,
            });
          }
        );
      } else if (["setup-continue-two"].includes(interaction.customId)) {
        await client.connection.query(
          `SELECT * FROM guildmembers WHERE GuildID = '${guild.id}'`,
          async (e, row) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
            }
            if (!row[0]?.GuildID) {
              await client.connection.query(
                `INSERT INTO guildmembers (GuildID, WelcomeMessage, LeaveMessage, MemberRole) VALUES ('${guild.id}', '**None Created**', '**None Created**', '**None Selected**')`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode) {
                      console.log(e.stack);
                    }
                  }
                }
              );
            }
          }
        );
        await client.connection.query(
          `SELECT * FROM guildmembers WHERE GuildID = '${guild.id}'`,
          async (e, row) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
              return interaction.channel
                .send({ content: "Database error occured" })
                .then((m) => m.delete());
            }
            let embed = new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setTitle("Guild Member Settings")
              .setDescription(
                `**Member Roles:** - <@&${
                  row[0]?.MemberRole || "**None Selected**"
                }>`
              )
              .addFields(
                {
                  name: "**Welcome Message:**",
                  value: `${row[0]?.WelcomeMessage || "**None Created**"}`,
                  inline: true,
                },
                {
                  name: "**Leave Message:**",
                  value: `${row[0]?.LeaveMessage || "**None Created**"}`,
                  inline: true,
                }
              )
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setFooter({
                text: `${guild.name} Settings`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setTimestamp();
            let buttonsone = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("welcome-message")
                .setLabel("Welcome Message")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("leave-message")
                .setLabel("Leave Messages")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("member-role")
                .setLabel("Member Role")
                .setStyle(ButtonStyle.Primary)
            );
            let buttonsthree = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("setup-continue-three")
                .setLabel("Continue")
                .setStyle(ButtonStyle.Danger)
            );

            await interaction.update({
              embeds: [embed],
              components: [buttonsone, buttonsthree],
              ephemeral: true,
            });
          }
        );
      } else if (["welcome-message"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel("What welcome message would you like?")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-messages")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 60000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let message = collected.first().content;
            if (message) {
              await client.connection.query(
                `UPDATE guildmembers SET WelcomeMessage = "${message}" WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  await client.connection.query(
                    `SELECT * FROM guildmembers WHERE GuildID = '${guild.id}'`,
                    async (er, row) => {
                      if (er) {
                        if (client.config.bot.debugMode) {
                          console.log(er.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }
                      if (row[0]?.GuildID) {
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle("Guild Member Settings")
                          .setDescription(
                            `**Member Roles:** - <@&${
                              row[0]?.MemberRole || "**None Selected**"
                            }>`
                          )
                          .addFields(
                            {
                              name: "**Welcome Message:**",
                              value: `${
                                row[0]?.WelcomeMessage || "**None Created**"
                              }`,
                              inline: true,
                            },
                            {
                              name: "**Leave Message:**",
                              value: `${
                                row[0]?.LeaveMessage || "**None Created**"
                              }`,
                              inline: true,
                            }
                          )
                          .setThumbnail(
                            client.user.displayAvatarURL({ dynamic: true })
                          )
                          .setFooter({
                            text: `${guild.name} Settings`,
                            iconURL: client.user.displayAvatarURL({
                              dynamic: true,
                            }),
                          })
                          .setTimestamp();
                        let buttonsone = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("welcome-message")
                            .setLabel("Welcome Message")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("leave-message")
                            .setLabel("Leave Messages")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("member-role")
                            .setLabel("Member Role")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonsthree = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("setup-continue-three")
                            .setLabel("Continue")
                            .setStyle(ButtonStyle.Danger)
                        );
                        await interaction
                          .editReply({
                            embeds: [embed],
                            components: [buttonsone, buttonsthree],
                            ephemeral: true,
                          })
                          .then(async () => {
                            await collected.first().delete();
                          });
                      }
                    }
                  );
                }
              );
            }
          });
      } else if (["leave-message"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel("What leave message would you like?")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-messages")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 60000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let message = collected.first().content;
            if (message) {
              await client.connection.query(
                `UPDATE guildmembers SET LeaveMessage = "${message}" WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  await client.connection.query(
                    `SELECT * FROM guildmembers WHERE GuildID = '${guild.id}'`,
                    async (er, row) => {
                      if (er) {
                        if (client.config.bot.debugMode) {
                          console.log(er.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }
                      if (row[0]?.GuildID) {
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle("Guild Member Settings")
                          .setDescription(
                            `**Member Roles:** - <@&${
                              row[0]?.MemberRole || "**None Selected**"
                            }>`
                          )
                          .addFields(
                            {
                              name: "**Welcome Message:**",
                              value: `${
                                row[0]?.WelcomeMessage || "**None Created**"
                              }`,
                              inline: true,
                            },
                            {
                              name: "**Leave Message:**",
                              value: `${
                                row[0]?.LeaveMessage || "**None Created**"
                              }`,
                              inline: true,
                            }
                          )
                          .setThumbnail(
                            client.user.displayAvatarURL({ dynamic: true })
                          )
                          .setFooter({
                            text: `${guild.name} Settings`,
                            iconURL: client.user.displayAvatarURL({
                              dynamic: true,
                            }),
                          })
                          .setTimestamp();
                        let buttonsone = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("welcome-message")
                            .setLabel("Welcome Message")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("leave-message")
                            .setLabel("Leave Messages")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("member-role")
                            .setLabel("Member Role")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonsthree = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("setup-continue-three")
                            .setLabel("Continue")
                            .setStyle(ButtonStyle.Danger)
                        );
                        await interaction
                          .editReply({
                            embeds: [embed],
                            components: [buttonsone, buttonsthree],
                            ephemeral: true,
                          })
                          .then(async () => {
                            await collected.first().delete();
                          });
                      }
                    }
                  );
                }
              );
            }
          });
      } else if (["member-role"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel("What Role Would you like to add as the member role?")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-messages")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 20000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let collectedrole = collected.first().mentions.roles.first();
            if (!collectedrole)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a role")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            let therole = await guild.roles.cache.find(
              (c) => c.id === collectedrole.id
            );

            if (!therole)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a role")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            if (therole) {
              await client.connection.query(
                `UPDATE guildmembers SET MemberRole = '${therole.id}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  await client.connection.query(
                    `SELECT * FROM guildmembers WHERE GuildID = '${guild.id}'`,
                    async (er, row) => {
                      if (er) {
                        if (client.config.bot.debugMode) {
                          console.log(er.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }
                      let embed = new EmbedBuilder()
                        .setColor(client.config.theme.color)
                        .setTitle("Guild Member Settings")
                        .setDescription(
                          `**Member Roles:** - <@&${
                            row[0]?.MemberRole || "**None Selected**"
                          }>`
                        )
                        .addFields(
                          {
                            name: "**Welcome Message:**",
                            value: `${
                              row[0]?.WelcomeMessage || "**None Created**"
                            }`,
                            inline: true,
                          },
                          {
                            name: "**Leave Message:**",
                            value: `${
                              row[0]?.LeaveMessage || "**None Created**"
                            }`,
                            inline: true,
                          }
                        )
                        .setThumbnail(
                          client.user.displayAvatarURL({ dynamic: true })
                        )
                        .setFooter({
                          text: `${guild.name} Settings`,
                          iconURL: client.user.displayAvatarURL({
                            dynamic: true,
                          }),
                        })
                        .setTimestamp();
                      let buttonsone = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("welcome-message")
                          .setLabel("Welcome Message")
                          .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                          .setCustomId("leave-message")
                          .setLabel("Leave Messages")
                          .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                          .setCustomId("member-role")
                          .setLabel("Member Role")
                          .setStyle(ButtonStyle.Primary)
                      );
                      let buttonsthree = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("setup-continue-three")
                          .setLabel("Continue")
                          .setStyle(ButtonStyle.Danger)
                      );

                      await interaction
                        .editReply({
                          embeds: [embed],
                          components: [buttonsone, buttonsthree],
                          ephemeral: true,
                        })
                        .then(async () => {
                          let message = collected.first();
                          await message.delete();
                        });
                    }
                  );
                }
              );
            }
          });
      } else if (["cancel-messages"].includes(interaction.customId)) {
        await client.connection.query(
          `SELECT * FROM guildmembers WHERE GuildID = '${guild.id}'`,
          async (e, row) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
              return interaction.channel
                .send({ content: "Database error occured" })
                .then((m) => m.delete());
            }
            let embed = new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setTitle("Guild Member Settings")
              .setDescription(
                `**Member Roles:** - <@&${
                  row[0]?.MemberRoles || "**None Selected**"
                }>`
              )
              .addFields(
                {
                  name: "**Welcome Message:**",
                  value: `${row[0]?.WelcomeMessage || "**None Created**"}`,
                  inline: true,
                },
                {
                  name: "**Leave Message:**",
                  value: `${row[0]?.LeaveMessage || "**None Created**"}`,
                  inline: true,
                }
              )
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setFooter({
                text: `${guild.name} Settings`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setTimestamp();
            let buttonsone = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("welcome-message")
                .setLabel("Welcome Message")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("leave-message")
                .setLabel("Leave Messages")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("member-role")
                .setLabel("Member Role")
                .setStyle(ButtonStyle.Primary)
            );
            let buttonsthree = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("setup-continue-three")
                .setLabel("Continue")
                .setStyle(ButtonStyle.Danger)
            );

            await interaction.update({
              embeds: [embed],
              components: [buttonsone, buttonsthree],
              ephemeral: true,
            });
          }
        );
      } else if (["setup-continue-three"].includes(interaction.customId)) {
        await client.connection.query(
          `SELECT * FROM jointocreate WHERE GuildID = '${guild.id}'`,
          async (e, row) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
              return channel
                .send("`Database Error Occured`")
                .then((m) => m.deleted());
            }
            if (!row[0]?.GuildID) {
              await client.connection.query(
                `INSERT INTO jointocreate (GuildID, ChannelID, ChannelUserLimit) VALUES ('${guild.id}', '**None Selected**', '1')`,
                async (er) => {
                  if (er) {
                    console.log(er);
                  }
                }
              );
            }
          }
        );
        await client.connection.query(
          `SELECT * FROM jointocreate WHERE GuildID = '${guild.id}'`,
          async (e, row) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
              return channel
                .send("`Database Error Occured`")
                .then((m) => m.deleted());
            }
            if (row[0]?.GuildID) {
              let embed = new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setTitle("Join to Create Settings")
                .setDescription(
                  `**Channel:** <#${row[0]?.ChannelID}>\n**Users per Channel:** ${row[0]?.ChannelUserLimit}`
                )
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setFooter({
                  text: `${guild.name} Settings`,
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

              let buttonsone = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("jtc-channel")
                  .setLabel("Channel")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("jtc-user-limit")
                  .setLabel("Users Per Channel")
                  .setStyle(ButtonStyle.Primary)
              );
              let buttonsthree = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("setup-continue-four")
                  .setLabel("Continue")
                  .setStyle(ButtonStyle.Danger)
              );
              return interaction.update({
                embeds: [embed],
                components: [buttonsone, buttonsthree],
                ephemeral: true,
              });
            }
          }
        );
      } else if (["jtc-channel"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel(
              "What Channel would you like as the Join to Create channel?"
            )
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-jtc")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 20000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let collectedchan = collected.first().mentions.channels.first();
            if (!collectedchan)
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            let thechan = await guild.channels.cache.find(
              (c) => c.id === collectedchan.id
            );

            if (!thechan)
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            if (thechan) {
              await client.connection.query(
                `UPDATE jointocreate SET ChannelID = '${thechan.id}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  await client.connection.query(
                    `SELECT * FROM jointocreate WHERE GuildID = '${guild.id}'`,
                    async (er, row) => {
                      if (er) {
                        if (client.config.bot.debugMode) {
                          console.log(er.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }
                      if (row[0]?.GuildID) {
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle("Join to Create Settings")
                          .setDescription(
                            `**Channel:** <#${row[0]?.ChannelID}>\n**Users per Channel:** ${row[0]?.ChannelUserLimit}`
                          )
                          .setThumbnail(
                            client.user.displayAvatarURL({ dynamic: true })
                          )
                          .setFooter({
                            text: `${guild.name} Settings`,
                            iconURL: client.user.displayAvatarURL({
                              dynamic: true,
                            }),
                          })
                          .setTimestamp();

                        let buttonsone = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("jtc-channel")
                            .setLabel("Channel")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("jtc-user-limit")
                            .setLabel("Users Per Channel")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonsthree = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("setup-continue-four")
                            .setLabel("Continue")
                            .setStyle(ButtonStyle.Danger)
                        );

                        await interaction
                          .editReply({
                            embeds: [embed],
                            components: [buttonsone, buttonsthree],
                            ephemeral: true,
                          })
                          .then(async () => {
                            let message = collected.first();
                            await message.delete();
                          });
                      }
                    }
                  );
                }
              );
            }
          });
      } else if (["jtc-user-limit"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel(
              "What would you like the maximum amount of users per channel to be?"
            )
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-jtc")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 20000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let number = collected.first().content;
            let realNumber = Number(number);
            if (!realNumber)
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a number")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            if (realNumber) {
              await client.connection.query(
                `UPDATE jointocreate SET ChannelUserLimit = '${realNumber}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  await client.connection.query(
                    `SELECT * FROM jointocreate WHERE GuildID = '${guild.id}'`,
                    async (er, row) => {
                      if (er) {
                        if (client.config.bot.debugMode) {
                          console.log(er.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }
                      if (row[0]?.GuildID) {
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle("Join to Create Settings")
                          .setDescription(
                            `**Channel:** <#${row[0]?.ChannelID}>\n**Users per Channel:** ${row[0]?.ChannelUserLimit}`
                          )
                          .setThumbnail(
                            client.user.displayAvatarURL({ dynamic: true })
                          )
                          .setFooter({
                            text: `${guild.name} Settings`,
                            iconURL: client.user.displayAvatarURL({
                              dynamic: true,
                            }),
                          })
                          .setTimestamp();

                        let buttonsone = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("jtc-channel")
                            .setLabel("Channel")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("jtc-user-limit")
                            .setLabel("Users Per Channel")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonsthree = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("setup-continue-four")
                            .setLabel("Continue")
                            .setStyle(ButtonStyle.Danger)
                        );

                        await interaction
                          .editReply({
                            embeds: [embed],
                            components: [buttonsone, buttonsthree],
                            ephemeral: true,
                          })
                          .then(async () => {
                            let message = collected.first();
                            await message.delete();
                          });
                      }
                    }
                  );
                }
              );
            }
          });
      } else if (["cancel-jtc"].includes(interaction.customId)) {
        await client.connection.query(
          `SELECT * FROM jointocreate WHERE GuildID = '${guild.id}'`,
          async (e, row) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
              return channel
                .send("`Database Error Occured`")
                .then((m) => m.deleted());
            }
            if (!row[0]?.GuildID) {
              await client.connection.query(
                `INSERT INTO jointocreate (GuildID, ChannelID, ChannelUserLimit) VALUES ('${guild.id}', '**None Selected**', '1')`,
                async (er) => {
                  if (er) {
                    console.log(er);
                  }
                }
              );
            }
          }
        );
        await client.connection.query(
          `SELECT * FROM jointocreate WHERE GuildID = '${guild.id}'`,
          async (e, row) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
              return channel
                .send("`Database Error Occured`")
                .then((m) => m.deleted());
            }
            if (row[0]?.GuildID) {
              let embed = new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setTitle("Join to Create Settings")
                .setDescription(
                  `**Channel:** <#${row[0]?.ChannelID}>\n**Users per Channel:** ${row[0]?.ChannelUserLimit}`
                )
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setFooter({
                  text: `${guild.name} Settings`,
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp();

              let buttonsone = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("jtc-channel")
                  .setLabel("Channel")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("jtc-user-limit")
                  .setLabel("Users Per Channel")
                  .setStyle(ButtonStyle.Primary)
              );
              let buttonsthree = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("setup-continue-four")
                  .setLabel("Continue")
                  .setStyle(ButtonStyle.Danger)
              );
              return interaction.update({
                embeds: [embed],
                components: [buttonsone, buttonsthree],
                ephemeral: true,
              });
            }
          }
        );
      } else if (["setup-continue-four"].includes(interaction.customId)) {
        await client.connection.query(
          `SELECT * FROM ticketsettings WHERE GuildID = '${guild.id}'`,
          async (e, row) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stak);
              }
            }
            if (!row[0]?.GuildID) {
              await client.connection.query(
                `INSERT INTO ticketsettings (GuildID, TranscriptChannel, Category, StaffRole) VALUES ('${guild.id}', '**None Selected**', '**None Selected**', '**None Selected**')`
              );
            }
          }
        );
        await client.connection.query(
          `SELECT * FROM ticketsettings WHERE GuildID = '${guild.id}'`,
          async (e, row) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
            }
            let embed = new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setTitle("Ticket Settings")
              .setDescription(
                `**Transcript Logs:** <#${row[0]?.TranscriptChannel}>\n**Ticket Category:** <#${row[0]?.Category}>\n**Ticket Staff:** <@&${row[0]?.StaffRole}>`
              )
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setFooter({
                text: `${guild.name} Settings`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setTimestamp();

            let buttonsone = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("ticket-logs")
                .setLabel("Ticket Logs")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("ticket-category")
                .setLabel("Ticket Category")
                .setStyle(ButtonStyle.Primary),
              new ButtonBuilder()
                .setCustomId("ticket-staff")
                .setLabel("Ticket Staff")
                .setStyle(ButtonStyle.Primary)
            );
            let buttonsthree = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("setup-continue-five")
                .setLabel("Continue")
                .setStyle(ButtonStyle.Danger)
            );
            return interaction.update({
              embeds: [embed],
              components: [buttonsone, buttonsthree],
              ephemeral: true,
            });
          }
        );
      } else if (["ticket-logs"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel("What Channel would you like as the Ticket Logs channel?")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-tickets")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 20000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let collectedchan = collected.first().mentions.channels.first();
            if (!collectedchan)
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            let thechan = await guild.channels.cache.find(
              (c) => c.id === collectedchan.id
            );

            if (!thechan)
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a channel")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            if (thechan) {
              await client.connection.query(
                `UPDATE ticketsettings SET TranscriptChannel = '${thechan.id}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  await client.connection.query(
                    `SELECT * FROM ticketsettings WHERE GuildID = '${guild.id}'`,
                    async (er, row) => {
                      if (er) {
                        if (client.config.bot.debugMode) {
                          console.log(er.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }
                      if (row[0]?.GuildID) {
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle("Ticket Settings")
                          .setDescription(
                            `**Transcript Logs:** <#${row[0]?.TranscriptChannel}>\n**Ticket Category:** <#${row[0]?.Category}>\n**Ticket Staff:** <@&${row[0]?.StaffRole}>`
                          )
                          .setThumbnail(
                            client.user.displayAvatarURL({ dynamic: true })
                          )
                          .setFooter({
                            text: `${guild.name} Settings`,
                            iconURL: client.user.displayAvatarURL({
                              dynamic: true,
                            }),
                          })
                          .setTimestamp();

                        let buttonsone = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("ticket-logs")
                            .setLabel("Ticket Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("ticket-category")
                            .setLabel("Ticket Category")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("ticket-staff")
                            .setLabel("Ticket Staff")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonsthree = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("setup-continue-five")
                            .setLabel("Continue")
                            .setStyle(ButtonStyle.Danger)
                        );

                        await interaction
                          .editReply({
                            embeds: [embed],
                            components: [buttonsone, buttonsthree],
                            ephemeral: true,
                          })
                          .then(async () => {
                            let message = collected.first();
                            await message.delete();
                          });
                      }
                    }
                  );
                }
              );
            }
          });
      } else if (["ticket-category"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel("What Channel would you like as the Ticket category?")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-tickets")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 20000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let collectedchan = collected.first().mentions.channels.first();
            if (!collectedchan)
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a category")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            let thechan = await guild.channels.cache.find(
              (c) => c.id === collectedchan.id
            );

            if (!thechan)
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a category")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            if (thechan) {
              await client.connection.query(
                `UPDATE ticketsettings SET Category = '${thechan.id}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  await client.connection.query(
                    `SELECT * FROM ticketsettings WHERE GuildID = '${guild.id}'`,
                    async (er, row) => {
                      if (er) {
                        if (client.config.bot.debugMode) {
                          console.log(er.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }
                      if (row[0]?.GuildID) {
                        let embed = new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setTitle("Ticket Settings")
                          .setDescription(
                            `**Transcript Logs:** <#${row[0]?.TranscriptChannel}>\n**Ticket Category:** <#${row[0]?.Category}>\n**Ticket Staff:** <@&${row[0]?.StaffRole}>`
                          )
                          .setThumbnail(
                            client.user.displayAvatarURL({ dynamic: true })
                          )
                          .setFooter({
                            text: `${guild.name} Settings`,
                            iconURL: client.user.displayAvatarURL({
                              dynamic: true,
                            }),
                          })
                          .setTimestamp();

                        let buttonsone = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("ticket-logs")
                            .setLabel("Ticket Logs")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("ticket-category")
                            .setLabel("Ticket Category")
                            .setStyle(ButtonStyle.Primary),
                          new ButtonBuilder()
                            .setCustomId("ticket-staff")
                            .setLabel("Ticket Staff")
                            .setStyle(ButtonStyle.Primary)
                        );
                        let buttonsthree = new ActionRowBuilder().addComponents(
                          new ButtonBuilder()
                            .setCustomId("setup-continue-five")
                            .setLabel("Continue")
                            .setStyle(ButtonStyle.Danger)
                        );

                        await interaction
                          .editReply({
                            embeds: [embed],
                            components: [buttonsone, buttonsthree],
                            ephemeral: true,
                          })
                          .then(async () => {
                            let message = collected.first();
                            await message.delete();
                          });
                      }
                    }
                  );
                }
              );
            }
          });
      } else if (["ticket-staff"].includes(interaction.customId)) {
        let newbuttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setLabel("What Role Would you like to be the ticket staff?")
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId("cancel-tickets")
            .setDisabled(false)
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );
        await interaction.update({ components: [newbuttons] });
        interaction.channel
          .awaitMessages({
            max: 1,
            time: 20000,
            errors: ["time"],
          })
          .then(async (collected) => {
            let collectedrole = collected.first().mentions.roles.first();
            if (!collectedrole)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a role")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            let therole = await guild.roles.cache.find(
              (c) => c.id === collectedrole.id
            );

            if (!therole)
              return interaction.update({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setLabel("The message collected wasn't a role")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                  ),
                ],
              });
            if (therole) {
              await client.connection.query(
                `UPDATE ticketsettings SET StaffRole = '${therole.id}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode == true) {
                      console.log(e.stack);
                    }
                    return channel
                      .send("`Error occured.`")
                      .then((m) => m.delete());
                  }
                  await client.connection.query(
                    `SELECT * FROM ticketsettings WHERE GuildID = '${guild.id}'`,
                    async (er, row) => {
                      if (er) {
                        if (client.config.bot.debugMode) {
                          console.log(er.stack);
                        }
                        return channel
                          .send("`Error occured.`")
                          .then((m) => m.delete());
                      }

                      let embed = new EmbedBuilder()
                        .setColor(client.config.theme.color)
                        .setTitle("Ticket Settings")
                        .setDescription(
                          `**Transcript Logs:** <#${row[0]?.TranscriptChannel}>\n**Ticket Category:** <#${row[0]?.Category}>\n**Ticket Staff:** <@&${row[0]?.StaffRole}>`
                        )
                        .setThumbnail(
                          client.user.displayAvatarURL({ dynamic: true })
                        )
                        .setFooter({
                          text: `${guild.name} Settings`,
                          iconURL: client.user.displayAvatarURL({
                            dynamic: true,
                          }),
                        })
                        .setTimestamp();

                      let buttonsone = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("ticket-logs")
                          .setLabel("Ticket Logs")
                          .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                          .setCustomId("ticket-category")
                          .setLabel("Ticket Category")
                          .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                          .setCustomId("ticket-staff")
                          .setLabel("Ticket Staff")
                          .setStyle(ButtonStyle.Primary)
                      );
                      let buttonsthree = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("setup-continue-five")
                          .setLabel("Continue")
                          .setStyle(ButtonStyle.Danger)
                      );

                      await interaction
                        .editReply({
                          embeds: [embed],
                          components: [buttonsone, buttonsthree],
                          ephemeral: true,
                        })
                        .then(async () => {
                          let message = collected.first();
                          await message.delete();
                        });
                    }
                  );
                }
              );
            }
          });
      } else if (["setup-continue-five"].includes(interaction.customId)) {
        await client.connection.query(
          `SELECT * FROM automod WHERE GuildID = '${guild.id}'`,
          async (e, row) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
            }
            if (!row[0]?.GuildID) {
              await client.connection.query(
                `INSERT INTO automod (GuildID, AntiInvite, PingPrev, AltAccount, AltAccountDay) VALUES ('${guild.id}', 'True', 'True', 'True', '7')`,
                async (er) => {
                  if (er) {
                    if (client.config.bot.debugMode) {
                      console.log(er.stack);
                    }
                  }
                }
              );
            }
          }
        );
        await client.connection.query(
          `SELECT * FROM automod WHERE GuildID = '${guild.id}'`,
          async (e, row) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
            }
            let embed = new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setTitle("Auto Moderation")
              .setDescription(
                `>>> **Invite Prevention:** ${row[0]?.AntiInvite}\n**Ping Prevention:** ${row[0]?.PingPrev}\n**Alternative Acccount Detecting:** ${row[0]?.AltAccount}\n**Alt Account Days:** ${row[0]?.AltAccountDay}`
              )
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setFooter({
                text: `${guild.name} Settings`,
                iconURL: guild.iconURL({ dynamic: true }),
              })
              .setTimestamp();
            let controlButtons = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("anti-invite")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Invites"),
              new ButtonBuilder()
                .setCustomId("anti-pings")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Pings"),
              new ButtonBuilder()
                .setCustomId("anti-alt-acc")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Alt Account"),
              new ButtonBuilder()
                .setCustomId("alt-acc-days")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Alt Account Days")
            );
            let controlButton = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("setup-continue-six")
                .setStyle(ButtonStyle.Danger)
                .setLabel("Continue")
            );
            await interaction.update({
              embeds: [embed],
              components: [controlButtons, controlButton],
              ephemeral: true,
            });
          }
        );
      } else if (["anti-invite"].includes(interaction.customId)) {
        let newComponents = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setLabel("Please enter Yes or No for Invite Prevention"),
          new ButtonBuilder()
            .setCustomId("automod-cancel")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Cancel")
        );
        await interaction.update({
          components: [newComponents],
          ephemeral: true,
        });
        channel
          .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
          .then(async (col) => {
            let answer = col.first().content.toLowerCase();
            if (answer == "yes" || answer == "no") {
              let realanswer = "";
              if (answer == "no") {
                realanswer = "False";
              } else if (answer == "yes") {
                realanswer = "True";
              }
              await client.connection.query(
                `UPDATE automod SET AntiInvite = '${realanswer}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode) {
                      console.log(e.stack);
                    }
                  }
                  await client.connection.query(
                    `SELECT * FROM automod WHERE GuildID = '${guild.id}'`,
                    async (e, row) => {
                      if (e) {
                        if (client.config.bot.debugMode) {
                          console.log(e.stack);
                        }
                      }
                      let embed = new EmbedBuilder()
                        .setColor(client.config.theme.color)
                        .setTitle("Auto Moderation")
                        .setDescription(
                          `>>> **Invite Prevention:** ${row[0]?.AntiInvite}\n**Ping Prevention:** ${row[0]?.PingPrev}\n**Alternative Acccount Detecting:** ${row[0]?.AltAccount}\n**Alt Account Days:** ${row[0]?.AltAccountDay}`
                        )
                        .setThumbnail(
                          client.user.displayAvatarURL({ dynamic: true })
                        )
                        .setFooter({
                          text: `${guild.name} Settings`,
                          iconURL: guild.iconURL({ dynamic: true }),
                        })
                        .setTimestamp();
                      let controlButtons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("anti-invite")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Invites"),
                        new ButtonBuilder()
                          .setCustomId("anti-pings")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Pings"),
                        new ButtonBuilder()
                          .setCustomId("anti-alt-acc")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Alt Account"),
                        new ButtonBuilder()
                          .setCustomId("alt-acc-days")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Alt Account Days")
                      );
                      let controlButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("setup-continue-six")
                          .setStyle(ButtonStyle.Danger)
                          .setLabel("Continue")
                      );
                      await interaction
                        .editReply({
                          embeds: [embed],
                          components: [controlButtons, controlButton],
                          ephemeral: true,
                        })
                        .then(async () => {
                          await col.first().delete();
                        });
                    }
                  );
                }
              );
            } else {
              let newComponents = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("dummy")
                  .setDisabled(true)
                  .setStyle(ButtonStyle.Primary)
                  .setLabel("You didn't answer with Yes or No"),
                new ButtonBuilder()
                  .setCustomId("automod-cancel")
                  .setStyle(ButtonStyle.Danger)
                  .setLabel("Cancel")
              );
              return interaction
                .editReply({ components: [newComponents], ephemeral: true })
                .catch(() => {});
            }
          });
      } else if (["anti-pings"].includes(interaction.customId)) {
        let newComponents = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setLabel("Please enter Yes or No for Ping Prevention"),
          new ButtonBuilder()
            .setCustomId("automod-cancel")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Cancel")
        );
        await interaction.update({
          components: [newComponents],
          ephemeral: true,
        });
        channel
          .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
          .then(async (col) => {
            let answer = col.first().content.toLowerCase();
            if (answer == "yes" || answer == "no") {
              let realanswer = "";
              if (answer == "no") {
                realanswer = "False";
              } else if (answer == "yes") {
                realanswer = "True";
              }
              await client.connection.query(
                `UPDATE automod SET PingPrev = '${realanswer}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode) {
                      console.log(e.stack);
                    }
                  }
                  await client.connection.query(
                    `SELECT * FROM automod WHERE GuildID = '${guild.id}'`,
                    async (e, row) => {
                      if (e) {
                        if (client.config.bot.debugMode) {
                          console.log(e.stack);
                        }
                      }
                      let embed = new EmbedBuilder()
                        .setColor(client.config.theme.color)
                        .setTitle("Auto Moderation")
                        .setDescription(
                          `>>> **Invite Prevention:** ${row[0]?.AntiInvite}\n**Ping Prevention:** ${row[0]?.PingPrev}\n**Alternative Acccount Detecting:** ${row[0]?.AltAccount}\n**Alt Account Days:** ${row[0]?.AltAccountDay}`
                        )
                        .setThumbnail(
                          client.user.displayAvatarURL({ dynamic: true })
                        )
                        .setFooter({
                          text: `${guild.name} Settings`,
                          iconURL: guild.iconURL({ dynamic: true }),
                        })
                        .setTimestamp();
                      let controlButtons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("anti-invite")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Invites"),
                        new ButtonBuilder()
                          .setCustomId("anti-pings")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Pings"),
                        new ButtonBuilder()
                          .setCustomId("anti-alt-acc")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Alt Account"),
                        new ButtonBuilder()
                          .setCustomId("alt-acc-days")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Alt Account Days")
                      );
                      let controlButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("setup-continue-six")
                          .setStyle(ButtonStyle.Danger)
                          .setLabel("Continue")
                      );
                      await interaction
                        .editReply({
                          embeds: [embed],
                          components: [controlButtons, controlButton],
                          ephemeral: true,
                        })
                        .then(async () => {
                          await col.first().delete();
                        });
                    }
                  );
                }
              );
            } else {
              let newComponents = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("dummy")
                  .setDisabled(true)
                  .setStyle(ButtonStyle.Primary)
                  .setLabel("You didn't answer with Yes or No"),
                new ButtonBuilder()
                  .setCustomId("automod-cancel")
                  .setStyle(ButtonStyle.Danger)
                  .setLabel("Cancel")
              );
              return interaction
                .editReply({ components: [newComponents], ephemeral: true })
                .catch(() => {});
            }
          });
      } else if (["anti-alt-acc"].includes(interaction.customId)) {
        let newComponents = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setLabel("Please enter Yes or No for Alt Account Prevention"),
          new ButtonBuilder()
            .setCustomId("automod-cancel")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Cancel")
        );
        await interaction.update({
          components: [newComponents],
          ephemeral: true,
        });
        channel
          .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
          .then(async (col) => {
            let answer = col.first().content.toLowerCase();
            if (answer == "yes" || answer == "no") {
              let realanswer = "";
              if (answer == "no") {
                realanswer = "False";
              } else if (answer == "yes") {
                realanswer = "True";
              }
              await client.connection.query(
                `UPDATE automod SET AltAccount = '${realanswer}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode) {
                      console.log(e.stack);
                    }
                  }
                  await client.connection.query(
                    `SELECT * FROM automod WHERE GuildID = '${guild.id}'`,
                    async (e, row) => {
                      if (e) {
                        if (client.config.bot.debugMode) {
                          console.log(e.stack);
                        }
                      }
                      let embed = new EmbedBuilder()
                        .setColor(client.config.theme.color)
                        .setTitle("Auto Moderation")
                        .setDescription(
                          `>>> **Invite Prevention:** ${row[0]?.AntiInvite}\n**Ping Prevention:** ${row[0]?.PingPrev}\n**Alternative Acccount Detecting:** ${row[0]?.AltAccount}\n**Alt Account Days:** ${row[0]?.AltAccountDay}`
                        )
                        .setThumbnail(
                          client.user.displayAvatarURL({ dynamic: true })
                        )
                        .setFooter({
                          text: `${guild.name} Settings`,
                          iconURL: guild.iconURL({ dynamic: true }),
                        })
                        .setTimestamp();
                      let controlButtons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("anti-invite")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Invites"),
                        new ButtonBuilder()
                          .setCustomId("anti-pings")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Pings"),
                        new ButtonBuilder()
                          .setCustomId("anti-alt-acc")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Alt Account"),
                        new ButtonBuilder()
                          .setCustomId("alt-acc-days")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Alt Account Days")
                      );
                      let controlButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("setup-continue-six")
                          .setStyle(ButtonStyle.Danger)
                          .setLabel("Continue")
                      );
                      await interaction
                        .editReply({
                          embeds: [embed],
                          components: [controlButtons, controlButton],
                          ephemeral: true,
                        })
                        .then(async () => {
                          await col.first().delete();
                        });
                    }
                  );
                }
              );
            } else {
              let newComponents = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("dummy")
                  .setDisabled(true)
                  .setStyle(ButtonStyle.Primary)
                  .setLabel("You didn't answer with Yes or No"),
                new ButtonBuilder()
                  .setCustomId("automod-cancel")
                  .setStyle(ButtonStyle.Danger)
                  .setLabel("Cancel")
              );
              return interaction
                .editReply({ components: [newComponents], ephemeral: true })
                .catch(() => {});
            }
          });
      } else if (["alt-acc-days"].includes(interaction.customId)) {
        let newComponents = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setLabel(
              "Enter the number of days old an account should be to join; Ex: 2"
            ),
          new ButtonBuilder()
            .setCustomId("automod-cancel")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Cancel")
        );
        await interaction.update({
          components: [newComponents],
          ephemeral: true,
        });
        channel
          .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
          .then(async (col) => {
            let answer = col.first().content.toLowerCase();
            let realnum = Number(answer);
            if (realnum >= 1) {
              await client.connection.query(
                `UPDATE automod SET AltAccountDay = '${realnum}' WHERE GuildID = '${guild.id}'`,
                async (e) => {
                  if (e) {
                    if (client.config.bot.debugMode) {
                      console.log(e.stack);
                    }
                  }
                  await client.connection.query(
                    `SELECT * FROM automod WHERE GuildID = '${guild.id}'`,
                    async (e, row) => {
                      if (e) {
                        if (client.config.bot.debugMode) {
                          console.log(e.stack);
                        }
                      }
                      let embed = new EmbedBuilder()
                        .setColor(client.config.theme.color)
                        .setTitle("Auto Moderation")
                        .setDescription(
                          `>>> **Invite Prevention:** ${row[0]?.AntiInvite}\n**Ping Prevention:** ${row[0]?.PingPrev}\n**Alternative Acccount Detecting:** ${row[0]?.AltAccount}\n**Alt Account Days:** ${row[0]?.AltAccountDay}`
                        )
                        .setThumbnail(
                          client.user.displayAvatarURL({ dynamic: true })
                        )
                        .setFooter({
                          text: `${guild.name} Settings`,
                          iconURL: guild.iconURL({ dynamic: true }),
                        })
                        .setTimestamp();
                      let controlButtons = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("anti-invite")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Invites"),
                        new ButtonBuilder()
                          .setCustomId("anti-pings")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Pings"),
                        new ButtonBuilder()
                          .setCustomId("anti-alt-acc")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Alt Account"),
                        new ButtonBuilder()
                          .setCustomId("alt-acc-days")
                          .setStyle(ButtonStyle.Primary)
                          .setLabel("Alt Account Days")
                      );
                      let controlButton = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                          .setCustomId("setup-continue-six")
                          .setStyle(ButtonStyle.Danger)
                          .setLabel("Continue")
                      );
                      await interaction
                        .editReply({
                          embeds: [embed],
                          components: [controlButtons, controlButton],
                          ephemeral: true,
                        })
                        .then(async () => {
                          await col.first().delete();
                        });
                    }
                  );
                }
              );
            } else {
              let newComponents = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("dummy")
                  .setDisabled(true)
                  .setStyle(ButtonStyle.Primary)
                  .setLabel(
                    "You didn't answer with a number greater than / equal to 1"
                  ),
                new ButtonBuilder()
                  .setCustomId("automod-cancel")
                  .setStyle(ButtonStyle.Danger)
                  .setLabel("Cancel")
              );
              return interaction
                .editReply({ components: [newComponents], ephemeral: true })
                .catch(() => {});
            }
          });
      } else if (["automod-cancel"].includes(interaction.customId)) {
        await client.connection.query(
          `SELECT * FROM automod WHERE GuildID = '${guild.id}'`,
          async (e, row) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
            }
            if (!row[0]?.GuildID) {
              await client.connection.query(
                `INSERT INTO automod (GuildID, AntiInvite, PingPrev, AltAccount, AltAccountDay) VALUES ('${guild.id}', 'True', 'True', 'True', '7')`,
                async (er) => {
                  if (er) {
                    if (client.config.bot.debugMode) {
                      console.log(er.stack);
                    }
                  }
                }
              );
            }
          }
        );
        await client.connection.query(
          `SELECT * FROM automod WHERE GuildID = '${guild.id}'`,
          async (e, row) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
            }
            let embed = new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setTitle("Auto Moderation")
              .setDescription(
                `>>> **Invite Prevention:** ${row[0]?.AntiInvite}\n**Ping Prevention:** ${row[0]?.PingPrev}\n**Alternative Acccount Detecting:** ${row[0]?.AltAccount}\n**Alt Account Days:** ${row[0]?.AltAccountDay}`
              )
              .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
              .setFooter({
                text: `${guild.name} Settings`,
                iconURL: guild.iconURL({ dynamic: true }),
              })
              .setTimestamp();
            let controlButtons = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("anti-invite")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Invites"),
              new ButtonBuilder()
                .setCustomId("anti-pings")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Pings"),
              new ButtonBuilder()
                .setCustomId("anti-alt-acc")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Alt Account"),
              new ButtonBuilder()
                .setCustomId("alt-acc-days")
                .setStyle(ButtonStyle.Primary)
                .setLabel("Alt Account Days")
            );
            let controlButton = new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("setup-continue-six")
                .setStyle(ButtonStyle.Danger)
                .setLabel("Continue")
            );
            await interaction.update({
              embeds: [embed],
              components: [controlButtons, controlButton],
              ephemeral: true,
            });
          }
        );
      } else if (["setup-continue-six"].includes(interaction.customId)) {
        let embed = new EmbedBuilder()
          .setColor(client.config.theme.color)
          .setTitle("Bot Checkup")
          .setDescription(
            "In order to ensure that I can do what my intented purpose is, I require the `administrator` permission! Also make sure to set my role to the top of the hieharcy, to ensure that nohing I do is restricted from this!"
          )
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setFooter({
            text: `${guild.name} Settings`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();
        let button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("setup-finish")
            .setLabel("Finish This!")
            .setStyle(ButtonStyle.Success)
        );
        await interaction.update({
          embeds: [embed],
          components: [button],
          ephemeral: true,
        });
      } else if (["setup-finish"].includes(interaction.customId)) {
        let embed = new EmbedBuilder()
          .setColor(client.config.theme.color)
          .setTitle("Guild Settings Completed!")
          .setDescription(
            "You have now finished the configuration of the bot. Congrats!"
          )
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
          .setFooter({
            text: `${guild.name} Settings`,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();

        let button = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy")
            .setDisabled(true)
            .setLabel("YAY!")
            .setStyle(ButtonStyle.Success)
        );

        await interaction.update({
          embeds: [embed],
          components: [button],
          ephemeral: true,
        });
      }
    }
  },
};
