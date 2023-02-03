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
      if (["add-member"].includes(interaction.customId)) {
        let newButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setLabel(
              "Please mention the member you want to add to the voice channel!"
            ),
          new ButtonBuilder()
            .setCustomId("jtc-cancel")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Cancel")
        );
        await interaction.update({ components: [newButtons], ephemeral: true });
        interaction.channel
          .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
          .then(async (col) => {
            let colm = col.first().mentions.members.first();
            let them = await interaction.guild.members.cache.get(colm.id);
            if (!them?.id)
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("error")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("The message sent wasn't a member!"),
                    new ButtonBuilder()
                      .setCustomId("jtc-cancel")
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("Return")
                  ),
                ],
                ephemeral: true,
              });
            if (them?.id) {
              await interaction.channel.permissionOverwrites
                .edit(them, {
                  ViewChannel: true,
                  Connect: true,
                  Speak: true,
                  Stream: true,
                  ReadMessageHistory: true,
                  SendMessages: true,
                })
                .catch(() => {});

              let controlembed = new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription(`Use these buttons for controls!`);
              let controls = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("add-member")
                  .setStyle(ButtonStyle.Primary)
                  .setLabel("Add Member"),
                new ButtonBuilder()
                  .setCustomId("remove-member")
                  .setStyle(ButtonStyle.Primary)
                  .setLabel("Remove Member")
              );

              return interaction
                .editReply({
                  embeds: [controlembed],
                  components: [controls],
                  ephemeral: true,
                })
                .then(() => {
                  let m = col.first();
                  m.delete();
                });
            }
          });
      } else if (["remove-member"].includes(interaction.customId)) {
        let newButtons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setLabel(
              "Please mention the member you want to remove from the voice channel!"
            ),
          new ButtonBuilder()
            .setCustomId("jtc-cancel")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Cancel")
        );
        await interaction.update({ components: [newButtons], ephemeral: true });
        interaction.channel
          .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
          .then(async (col) => {
            let colm = col.first().mentions.members.first();
            let them = await interaction.guild.members.cache.get(colm.id);
            if (!them?.id)
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("error")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("The message sent wasn't a member!"),
                    new ButtonBuilder()
                      .setCustomId("jtc-cancel")
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("Return")
                  ),
                ],
                ephemeral: true,
              });
            if (them?.id) {
              await interaction.channel.permissionOverwrites
                .edit(them, {
                  ViewChannel: false,
                  Connect: false,
                  Speak: false,
                  Stream: false,
                  ReadMessageHistory: false,
                  SendMessages: false,
                })
                .catch(() => {});

              let controlembed = new EmbedBuilder()
                .setColor(client.config.theme.color)
                .setDescription(`Use these buttons for controls!`);
              let controls = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("add-member")
                  .setStyle(ButtonStyle.Primary)
                  .setLabel("Add Member"),
                new ButtonBuilder()
                  .setCustomId("remove-member")
                  .setStyle(ButtonStyle.Primary)
                  .setLabel("Remove Member")
              );

              return interaction
                .editReply({
                  embeds: [controlembed],
                  components: [controls],
                  ephemeral: true,
                })
                .then(() => {
                  let m = col.first();
                  m.delete();
                });
            }
          });
      } else if (["jtc-cancel"].includes(interaction.customId)) {
        let controlembed = new EmbedBuilder()
          .setColor(client.config.theme.color)
          .setDescription(`Use these buttons for controls!`);
        let controls = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("add-member")
            .setStyle(ButtonStyle.Primary)
            .setLabel("Add Member"),
          new ButtonBuilder()
            .setCustomId("remove-member")
            .setStyle(ButtonStyle.Primary)
            .setLabel("Remove Member")
        );
        return interaction.update({
          embeds: [controlembed],
          components: [controls],
          ephemeral: true,
        });
      }
    }
  },
};
