const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-controls")
    .setDescription("Ticket controls")
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add a member or role to this ticket")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("Select a member")
            .setRequired(false)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Select a role")
            .setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Remove a member or role from this ticket")
        .addUserOption((option) =>
          option
            .setName("member")
            .setDescription("Select a member")
            .setRequired(false)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Select a role")
            .setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("rename")
        .setDescription("Rename this ticket")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("New channel name; no name = revert")
            .setRequired(false)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("ticketbuttons").setDescription("Useful ticket buttons!")
    ),

  async execute(interaction, client) {
    let { guild, member, options } = interaction;
    let sub = interaction.options.getSubcommand();
    let role = interaction.options.getRole("role");
    let selectedMember = interaction.options.getMember("member");
    let newname = interaction.options.getString("name");
    await client.connection.query(
      `SELECT * FROM ticketsettings WHERE GuildID = '${guild.id}'`,
      async (e, row) => {
        if (e) {
          if (client.config.bot.debugMode) {
            console.log(e.stack);
          }
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("`Database error occured`"),
            ],
            ephemeral: true,
          });
        }
        if (row[0]?.GuildID) {
          if (member.roles.cache.some((r) => r.id === row[0]?.StaffRole)) {
            switch (sub) {
              case "add": {
                if (role) {
                  await interaction.channel.permissionOverwrites
                    .edit(role.id, {
                      SendMessages: true,
                      ViewChannel: true,
                      ReadMessageHistory: true,
                    })
                    .catch(() => {});
                  await interaction.channel
                    .send({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setDescription(
                            `<@&${role.id}> was added to the ticket!`
                          ),
                      ],
                    })
                    .catch(() => {});
                  return interaction
                    .reply({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setDescription(
                            `<@&${role.id}> was added to the ticket successfully!`
                          ),
                      ],
                      ephemeral: true,
                    })
                    .catch(() => {});
                } else if (selectedMember) {
                  await interaction.channel.permissionOverwrites
                    .edit(selectedMember.id, {
                      SendMessages: true,
                      ViewChannel: true,
                      ReadMessageHistory: true,
                    })
                    .catch(() => {});
                  await interaction.channel
                    .send({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setDescription(
                            `<@${selectedMember.id}> was added to the ticket!`
                          ),
                      ],
                    })
                    .catch(() => {});
                  return interaction
                    .reply({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setDescription(
                            `<@${selectedMember.id}> was added to the ticket successfully!`
                          ),
                      ],
                      ephemeral: true,
                    })
                    .catch(() => {});
                } else
                  return interaction
                    .reply({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setDescription(
                            "Please select a member or role to add to this ticket!"
                          ),
                      ],
                      ephemeral: true,
                    })
                    .catch(() => {});
              }

              case "remove": {
                if (role) {
                  await interaction.channel.permissionOverwrites
                    .edit(role.id, {
                      SendMessages: false,
                      ViewChannel: false,
                      ReadMessageHistory: false,
                    })
                    .catch(() => {});
                  await interaction.channel
                    .send({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setDescription(
                            `<@&${role.id}> was removed from the ticket!`
                          ),
                      ],
                    })
                    .catch(() => {});
                  return interaction
                    .reply({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setDescription(
                            `<@&${role.id}> was added removed from ticket successfully!`
                          ),
                      ],
                      ephemeral: true,
                    })
                    .catch(() => {});
                } else if (selectedMember) {
                  await interaction.channel.permissionOverwrites
                    .edit(selectedMember.id, {
                      SendMessages: false,
                      ViewChannel: false,
                      ReadMessageHistory: false,
                    })
                    .catch(() => {});
                  await interaction.channel
                    .send({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setDescription(
                            `<@${selectedMember.id}> was removed from the ticket!`
                          ),
                      ],
                    })
                    .catch(() => {});
                  return interaction
                    .reply({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setDescription(
                            `<@${selectedMember.id}> was removed from the ticket successfully!`
                          ),
                      ],
                      ephemeral: true,
                    })
                    .catch(() => {});
                } else
                  return interaction
                    .reply({
                      embeds: [
                        new EmbedBuilder()
                          .setColor(client.config.theme.color)
                          .setDescription(
                            "Please select a member or role to add to this ticket!"
                          ),
                      ],
                      ephemeral: true,
                    })
                    .catch(() => {});
              }

              case "rename":
                {
                  if (newname) {
                    await interaction.channel
                      .edit({ name: newname })
                      .catch(() => {});
                    await interaction.channel
                      .send({
                        embeds: [
                          new EmbedBuilder()
                            .setColor(client.config.theme.color)
                            .setDescription(`Ticket was renamed to ${newname}`),
                        ],
                        ephemeral: true,
                      })
                      .catch(() => {});
                    return interaction
                      .reply({
                        embeds: [
                          new EmbedBuilder()
                            .setColor(client.config.theme.color)
                            .setDescription("Channel renamed successfully!"),
                        ],
                        ephemeral: true,
                      })
                      .catch(() => {});
                  } else if (!newname) {
                    await client.connection.query(
                      `SELECT * FROM ticketdata WHERE GuildID = '${guild.id}' AND Closed = '0' AND ChannelID = '${interaction.channel.id}'`,
                      async (e, row) => {
                        if (e) {
                          if (client.config.bot.debugMode) {
                            console.log(e.stack);
                          }
                          return interaction.reply({
                            embeds: [
                              new EmbedBuilder()
                                .setColor(client.config.theme.color)
                                .setDescription("`Database error occured`"),
                            ],
                            ephemeral: true,
                          });
                        }
                        if (row[0]?.GuildID) {
                          let tmember = await guild.members.fetch(
                            row[0]?.OpenMember
                          );
                          if (!tmember)
                            return interaction.reply({
                              embeds: [
                                new EmbedBuilder()
                                  .setColor(client.config.theme.color)
                                  .setDescription(
                                    "`Couldn't find opening member!`"
                                  ),
                              ],
                              ephemeral: true,
                            });
                          await interaction.channel.edit({
                            name: "ticket-" + tmember.user.username,
                          });
                          return interaction.reply({
                            embeds: [
                              new EmbedBuilder()
                                .setColor(client.config.theme.color)
                                .setDescription(
                                  "Ticket was successfully renamed!"
                                ),
                            ],
                            ephemeral: true,
                          });
                        } else
                          return interaction.reply({
                            embeds: [
                              new EmbedBuilder()
                                .setColor(client.config.theme.color)
                                .setDescription("`Ticket not found`"),
                            ],
                            ephemeral: true,
                          });
                      }
                    );
                  }
                }
                break;
              case "ticketbuttons": {
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
                const evenMoreButtons = new ActionRowBuilder().setComponents(
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

                return interaction.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setColor(client.config.theme.color)
                      .setDescription("Here are some useful ticket buttons!"),
                  ],
                  components: [buttons, moreButtons, evenMoreButtons],
                });
              }

              default:
                break;
            }
          } else
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.theme.color)
                  .setDescription("You aren't staff for this guild!"),
              ],
            });
        } else
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("No ticket settings found for this guild!"),
            ],
            ephemeral: true,
          });
      }
    );
  },
};
