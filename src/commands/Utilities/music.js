const {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { QueryType } = require("discord-player");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Music Player options.")
    .addSubcommandGroup((subg) =>
      subg
        .setName("play")
        .setDescription("Play options")
        .addSubcommand((sub) =>
          sub
            .setName("url")
            .setDescription("Play a song from a youtube video")
            .addStringOption((option) =>
              option
                .setName("url")
                .setDescription("The video url")
                .setRequired(true)
            )
        )
        .addSubcommand((sub) =>
          sub
            .setName("search")
            .setDescription("Search youtube for a video to play")
            .addStringOption((option) =>
              option
                .setName("query")
                .setDescription("The search query")
                .setRequired(true)
            )
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("volume")
        .setDescription("Tune the volume")
        .addNumberOption((option) =>
          option
            .setName("volume")
            .setDescription("The volume you want the music to play at.")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("pause").setDescription("Pause the current song")
    )
    .addSubcommand((sub) =>
      sub.setName("resume").setDescription("Resume the currently paused song")
    )
    .addSubcommand((sub) =>
      sub.setName("skip").setDescription("Skip the current song")
    )
    .addSubcommand((sub) =>
      sub.setName("queue").setDescription("View the entrie queue")
    )
    .addSubcommand((sub) =>
      sub.setName("cancel").setDescription("Turn off the music")
    )
    .addSubcommand((sub) =>
      sub.setName("clear-queue").setDescription("Clear the current queue")
    ),

  async execute(interaction, client) {
    if (!interaction.member.voice.channel)
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor(client.config.theme.color)
            .setDescription("Please connect to a voice channel to use this!"),
        ],
        ephemeral: true,
      });
    let musicQueue = await client.player.createQueue(interaction.guild);
    let currentQueue = await client.player.getQueue(interaction.guild);
    if (!musicQueue.connection) {
      await musicQueue.connect(interaction.member.voice.channel).catch(() => {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setDescription(
                "An error occured when I tried connecting to your voice channel!"
              ),
          ],
          ephemeral: true,
        });
      });
    }
    let subgroup = interaction.options.getSubcommandGroup();
    let sub = interaction.options.getSubcommand();
    let embed = new EmbedBuilder();
    switch (subgroup) {
      case "play":
        {
          switch (sub) {
            case "url": {
              let videoLink = interaction.options.getString("url");
              let result = await client.player.search(videoLink, {
                requestedBy: interaction.user.id,
                searchEngine: QueryType.YOUTUBE_VIDEO,
              });
              if (result.tracks.length === 0)
                return interaction.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setColor(client.config.theme.color)
                      .setDescription("No videos found"),
                  ],
                  ephemeral: true,
                });

              let song = result.tracks[0];
              await musicQueue.addTrack(song);
              if (!musicQueue.playing) await musicQueue.play();

              embed
                .setColor(client.config.theme.color)
                .setTitle("Song Added to Queue")
                .setDescription(
                  `Video: ${song.title}\nRequested By: <@${interaction.user.id}>\nVideo Link: [Click Me](${song.url})\nVideo Duration: ${song.duration}`
                )
                .setImage(song.thumbnail)
                .setFooter({
                  text: "Video Queued",
                  iconURL: interaction.guild.iconURL({ dynamic: true }),
                })
                .setTimestamp();
              let controls = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("dummy1")
                  .setDisabled(true)
                  .setLabel("Controls:")
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId("pause-video")
                  .setEmoji("⏸️")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("resume-video")
                  .setEmoji("▶️")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("skip-video")
                  .setEmoji("⏹️")
                  .setStyle(ButtonStyle.Danger)
              );
              let volume = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("dummy2")
                  .setDisabled(true)
                  .setLabel("Volume:")
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId("increase-volume")
                  .setEmoji("🔼")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("decrease-volume")
                  .setEmoji("🔽")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("mute-volume")
                  .setLabel("Mute")
                  .setStyle(ButtonStyle.Danger)
              );
              return interaction
                .reply({
                  embeds: [embed],
                  components: [controls, volume],
                })
                .catch(() => {
                  return interaction.reply({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.theme.color)
                        .setDescription(
                          "An error occured when I tried adding this video!"
                        ),
                    ],
                    ephemeral: true,
                  });
                });
            }

            case "search": {
              let search = interaction.options.getString("query");
              let result = await client.player.search(search, {
                requestedBy: interaction.user.id,
                searchEngine: QueryType.AUTO,
              });
              if (result.tracks.length === 0)
                return interaction.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setColor(client.config.theme.color)
                      .setDescription("No videos found"),
                  ],
                  ephemeral: true,
                });

              let song = result.tracks[0];
              await musicQueue.addTrack(song);
              if (!musicQueue.playing) await musicQueue.play();

              embed
                .setColor(client.config.theme.color)
                .setTitle("Song Added to Queue")
                .setDescription(
                  `Video: ${song.title}\nRequested By: <@${interaction.user.id}>\nVideo Link: [Click Me](${song.url})\nVideo Duration: ${song.duration}`
                )
                .setImage(song.thumbnail)
                .setFooter({
                  text: "Video Queued",
                  iconURL: interaction.guild.iconURL({ dynamic: true }),
                })
                .setTimestamp();
              let controls = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("dummy1")
                  .setDisabled(true)
                  .setLabel("Controls:")
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId("pause-video")
                  .setEmoji("⏸️")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("resume-video")
                  .setEmoji("▶️")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("skip-video")
                  .setEmoji("⏹️")
                  .setStyle(ButtonStyle.Danger)
              );
              let volume = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("dummy2")
                  .setDisabled(true)
                  .setLabel("Volume:")
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId("increase-volume")
                  .setEmoji("🔼")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("decrease-volume")
                  .setEmoji("🔽")
                  .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                  .setCustomId("mute-volume")
                  .setLabel("Mute")
                  .setStyle(ButtonStyle.Danger)
              );
              return interaction
                .reply({
                  embeds: [embed],
                  components: [controls, volume],
                })
                .catch(() => {
                  return interaction.reply({
                    embeds: [
                      new EmbedBuilder()
                        .setColor(client.config.theme.color)
                        .setDescription(
                          "An error occured when I tried adding this video!"
                        ),
                    ],
                    ephemeral: true,
                  });
                });
            }

            default:
              break;
          }
        }

        break;

      default:
        break;
    }
    switch (sub) {
      case "volume": {
        if (!currentQueue || !currentQueue.playing)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("There is no video currently playing!"),
            ],
            ephemeral: true,
          });
        let volume = interaction.options.getNumber("volume");
        if (volume < 0)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("The volume cannot be below 0"),
            ],
            ephemeral: true,
          });
        if (volume > 100)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("There volume cannot be higher than 100"),
            ],
            ephemeral: true,
          });
        await currentQueue.setVolume(volume);
        return interaction
          .reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription(`Volume changed to **${volume}**`),
            ],
            ephemeral: true,
          })
          .catch(() => {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.theme.color)
                  .setDescription(
                    "An error occured when I tried changing the volume!"
                  ),
              ],
              ephemeral: true,
            });
          });
      }
      case "pause": {
        if (!currentQueue || !currentQueue.playing)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("There is no video currently playing!"),
            ],
            ephemeral: true,
          });
        currentQueue.setPaused(true);
        return interaction
          .reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("Current video paused!"),
            ],
            ephemeral: true,
          })
          .catch(() => {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.theme.color)
                  .setDescription(
                    "An error occured when I tried pausing this video!"
                  ),
              ],
              ephemeral: true,
            });
          });
      }
      case "resume": {
        if (!currentQueue || !currentQueue.playing)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("There is no video currently playing!"),
            ],
            ephemeral: true,
          });
        currentQueue.setPaused(false);
        return interaction
          .reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("Current video unpaused!"),
            ],
            ephemeral: true,
          })
          .catch(() => {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.theme.color)
                  .setDescription(
                    "An error occured when I tried resuming this video!"
                  ),
              ],
              ephemeral: true,
            });
          });
      }
      case "skip": {
        if (!currentQueue || !currentQueue.playing)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("There is no video currently playing!"),
            ],
            ephemeral: true,
          });
        await currentQueue.skip();
        return interaction
          .reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("Current video was skipped!"),
            ],
            ephemeral: true,
          })
          .catch(() => {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.theme.color)
                  .setDescription(
                    "An error occured when I tried skipping this video!"
                  ),
              ],
              ephemeral: true,
            });
          });
      }
      case "queue": {
        if (!currentQueue || !currentQueue.playing)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("There is no video currently playing!"),
            ],
            ephemeral: true,
          });
        let currentVideo = currentQueue.current;
        let queuedVideos = currentQueue.tracks
          .slice(0, 10)
          .map((v, i) => {
            return `${i + 1} [${v.title}](${v.url}) - ${
              v.duration
            }\n**Requested By:** <@${v.requestedBy.id}>`;
          })
          .join("\n");
        embed
          .setColor(client.config.theme.color)
          .setTitle("Video Queue")
          .setDescription(
            `**Current Video:** [${currentVideo.title}](${currentVideo.url}) - ${currentVideo.duration}\n**Requested By:** <@${currentVideo.requestedBy.id}>\n**Video Queue:**\n\n${queuedVideos}`
          )
          .setFooter({
            text: interaction.guild.name,
            iconURL: interaction.guild.iconURL({ dynamic: true }),
          })
          .setThumbnail(currentVideo.thumbnail)
          .setTimestamp();
        return interaction
          .reply({
            embeds: [embed],
            ephemeral: true,
          })
          .catch(() => {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.theme.color)
                  .setDescription(
                    "An error occured when I tried loading the queue!"
                  ),
              ],
              ephemeral: true,
            });
          });
      }
      case "cancel": {
        if (!currentQueue || !currentQueue.playing)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("There is no video currently playing!"),
            ],
            ephemeral: true,
          });
        currentQueue.destroy();
        return interaction
          .reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("Video player has left"),
            ],
            ephemeral: true,
          })
          .catch(() => {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.theme.color)
                  .setDescription("An error occured when I tried leaving!"),
              ],
              ephemeral: true,
            });
          });
      }
      case "clear-queue": {
        if (!currentQueue || !currentQueue.playing)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("There is no video currently playing!"),
            ],
            ephemeral: true,
          });
        await currentQueue.clear();
        return interaction
          .reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("Current Queue was cleared!"),
            ],
            ephemeral: true,
          })
          .catch(() => {
            return interaction.reply({
              embeds: [
                new EmbedBuilder()
                  .setColor(client.config.theme.color)
                  .setDescription(
                    "An error occured when I tried clearing the queue!"
                  ),
              ],
              ephemeral: true,
            });
          });
      }

      default:
        break;
    }
  },
};
