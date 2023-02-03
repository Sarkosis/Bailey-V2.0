const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isButton()) {
      if (["pause-video"].includes(interaction.customId)) {
        let currentQueue = await client.player.getQueue(interaction.guild);
        if (!interaction.member.voice.channel)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription(
                  "You need to be in a voice channel to do this!"
                ),
            ],
            ephemeral: true,
          });
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
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setDescription("Current video paused!"),
          ],
          ephemeral: true,
        });
      } else if (["resume-video"].includes(interaction.customId)) {
        let currentQueue = await client.player.getQueue(interaction.guild);
        if (!interaction.member.voice.channel)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription(
                  "You need to be in a voice channel to do this!"
                ),
            ],
            ephemeral: true,
          });
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
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setDescription("Current video unpaused!"),
          ],
          ephemeral: true,
        });
      } else if (["skip-video"].includes(interaction.customId)) {
        let currentQueue = await client.player.getQueue(interaction.guild);
        if (!interaction.member.voice.channel)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription(
                  "You need to be in a voice channel to do this!"
                ),
            ],
            ephemeral: true,
          });
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
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setDescription("Current video was skipped!"),
          ],
          ephemeral: true,
        });
      } else if (["increase-volume"].includes(interaction.customId)) {
        let currentQueue = await client.player.getQueue(interaction.guild);
        if (!interaction.member.voice.channel)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription(
                  "You need to be in a voice channel to do this!"
                ),
            ],
            ephemeral: true,
          });
        if (!currentQueue || !currentQueue.playing)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("There is no video currently playing!"),
            ],
            ephemeral: true,
          });
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setDescription(`Please enter the volume in chat`),
          ],
          ephemeral: true,
        });
        interaction.channel
          .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
          .then(async (collected) => {
            let collectedVol = collected.first().content;
            let volume = Number(collectedVol);
            if (volume < 0)
              return interaction.editReply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.theme.color)
                    .setDescription("Volume must be higher than 0"),
                ],
                ephemeral: true,
              });
            if (volume > 100)
              return interaction.editReply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.theme.color)
                    .setDescription("Volume must be lower than 100"),
                ],
                ephemeral: true,
              });
            await currentQueue.setVolume(volume);
            return interaction
              .editReply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.theme.color)
                    .setDescription(`Volume changed to **${volume}**`),
                ],
                ephemeral: true,
              })
              .then(() => collected.first().delete());
          });
      } else if (["decrease-volume"].includes(interaction.customId)) {
        console.log("test de");
        let currentQueue = await client.player.getQueue(interaction.guild);
        if (!interaction.member.voice.channel)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription(
                  "You need to be in a voice channel to do this!"
                ),
            ],
            ephemeral: true,
          });
        if (!currentQueue || !currentQueue.playing)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("There is no video currently playing!"),
            ],
            ephemeral: true,
          });
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setDescription(`Please enter the volume in chat`),
          ],
          ephemeral: true,
        });
        interaction.channel
          .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
          .then(async (collected) => {
            let collectedVol = collected.first().content;
            let volume = Number(collectedVol);
            if (volume < 0)
              return interaction.editReply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.theme.color)
                    .setDescription("Volume must be higher than 0"),
                ],
                ephemeral: true,
              });
            if (volume > 100)
              return interaction.editReply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.theme.color)
                    .setDescription("Volume must be lower than 100"),
                ],
                ephemeral: true,
              });
            await currentQueue.setVolume(volume);
            return await interaction
              .editReply({
                embeds: [
                  new EmbedBuilder()
                    .setColor(client.config.theme.color)
                    .setDescription(`Volume changed to **${volume}**`),
                ],
                ephemeral: true,
              })
              .then(() => collected.first().delete());
          });
      } else if (["mute-volume"].includes(interaction.customId)) {
        let currentQueue = await client.player.getQueue(interaction.guild);
        if (!interaction.member.voice.channel)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription(
                  "You need to be in a voice channel to do this!"
                ),
            ],
            ephemeral: true,
          });
        if (!currentQueue || !currentQueue.playing)
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription("There is no video currently playing!"),
            ],
            ephemeral: true,
          });
        await currentQueue.setVolume("0");
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setDescription(`Video was muted!`),
          ],
          ephemeral: true,
        });
      }
    }
  },
};
