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
      let embeds = interaction.message.embeds[0];
      let membed = EmbedBuilder.from(embeds);
      let { channel } = interaction;
      let row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("dummy1")
          .setDisabled(true)
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Embed Settings:"),
        new ButtonBuilder()
          .setCustomId("embed-title")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Title"),
        new ButtonBuilder()
          .setCustomId("embed-description")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Description"),
        new ButtonBuilder()
          .setCustomId("embed-thumbnail")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Thumbnail")
      );
      let row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("dummy2")
          .setDisabled(true)
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Embed Settings:"),
        new ButtonBuilder()
          .setCustomId("embed-color")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Color"),
        new ButtonBuilder()
          .setCustomId("embed-image")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Image"),
        new ButtonBuilder()
          .setCustomId("embed-footer")
          .setStyle(ButtonStyle.Primary)
          .setLabel("Footer")
      );
      let row3 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("dummy3")
          .setDisabled(true)
          .setStyle(ButtonStyle.Secondary)
          .setLabel("Extra:"),
        new ButtonBuilder()
          .setCustomId("embed-send-channel")
          .setStyle(ButtonStyle.Success)
          .setLabel("Send to Channel"),
        new ButtonBuilder()
          .setCustomId("embed-delete")
          .setStyle(ButtonStyle.Danger)
          .setLabel("Delete Embed")
      );
      if (["embed-title"].includes(interaction.customId)) {
        let editComponents = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setLabel("Please input your title into the channel!"),
          new ButtonBuilder()
            .setCustomId("embed-cancel")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Cancel")
        );
        await interaction.update({ components: [editComponents] });
        channel
          .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
          .then(async (collected) => {
            let title = collected.first().content;
            if (!title)
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("I didn't detect any title!"),
                    new ButtonBuilder()
                      .setCustomId("embed-cancel")
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("Cancel")
                  ),
                ],
              });
            if (title) {
              membed.setTitle(title);
              await interaction
                .editReply({
                  embeds: [membed],
                  components: [row1, row2, row3],
                })
                .then(async () => {
                  let message = collected.first();
                  await message.delete();
                });
            }
          });
      } else if (["embed-description"].includes(interaction.customId)) {
        let editComponents = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setLabel("Please input your description into the channel!"),
          new ButtonBuilder()
            .setCustomId("embed-cancel")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Cancel")
        );
        await interaction.update({ components: [editComponents] });
        channel
          .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
          .then(async (collected) => {
            let description = collected.first().content;
            if (!description)
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("I didn't detect any description!"),
                    new ButtonBuilder()
                      .setCustomId("embed-cancel")
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("Cancel")
                  ),
                ],
              });
            if (description) {
              membed.setDescription(description);
              await interaction
                .editReply({
                  embeds: [membed],
                  components: [row1, row2, row3],
                })
                .then(async () => {
                  let message = collected.first();
                  await message.delete();
                });
            }
          });
      } else if (["embed-thumbnail"].includes(interaction.customId)) {
        let editComponents = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setLabel("Please input your thumbnail URL into the channel!"),
          new ButtonBuilder()
            .setCustomId("embed-cancel")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Cancel")
        );
        await interaction.update({ components: [editComponents] });
        channel
          .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
          .then(async (collected) => {
            let thumbnail = collected.first().content;
            if (!thumbnail.includes("https://"))
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("I didn't detect any urls!"),
                    new ButtonBuilder()
                      .setCustomId("embed-cancel")
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("Cancel")
                  ),
                ],
              });
            if (thumbnail) {
              membed.setThumbnail(thumbnail);
              await interaction
                .editReply({
                  embeds: [membed],
                  components: [row1, row2, row3],
                })
                .then(async () => {
                  let message = collected.first();
                  await message.delete();
                });
            }
          });
      } else if (["embed-color"].includes(interaction.customId)) {
        let editComponents = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setLabel("Please input your HEX Code into the channel!"),
          new ButtonBuilder()
            .setCustomId("embed-cancel")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Cancel")
        );
        await interaction.update({ components: [editComponents] });
        channel
          .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
          .then(async (collected) => {
            let color = collected.first().content;
            if (!color.includes("#"))
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("I didn't detect any HEX codes!"),
                    new ButtonBuilder()
                      .setCustomId("embed-cancel")
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("Cancel")
                  ),
                ],
              });
            if (color) {
              membed.setColor(color);
              await interaction
                .editReply({
                  embeds: [membed],
                  components: [row1, row2, row3],
                })
                .then(async () => {
                  let message = collected.first();
                  await message.delete();
                });
            }
          });
      } else if (["embed-image"].includes(interaction.customId)) {
        let editComponents = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setLabel("Please input your image URL into the channel!"),
          new ButtonBuilder()
            .setCustomId("embed-cancel")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Cancel")
        );
        await interaction.update({ components: [editComponents] });
        channel
          .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
          .then(async (collected) => {
            let image = collected.first().content;
            if (!image.includes("https://"))
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("I didn't detect any urls!"),
                    new ButtonBuilder()
                      .setCustomId("embed-cancel")
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("Cancel")
                  ),
                ],
              });
            if (image) {
              membed.setImage(image);
              await interaction
                .editReply({
                  embeds: [membed],
                  components: [row1, row2, row3],
                })
                .then(async () => {
                  let message = collected.first();
                  await message.delete();
                });
            }
          });
      } else if (["embed-footer"].includes(interaction.customId)) {
        let editComponents = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setLabel("Please input your footer into the channel!"),
          new ButtonBuilder()
            .setCustomId("embed-cancel")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Cancel")
        );
        await interaction.update({ components: [editComponents] });
        channel
          .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
          .then(async (collected) => {
            let footer = collected.first().content;
            if (!footer)
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("I didn't detect any footer!"),
                    new ButtonBuilder()
                      .setCustomId("embed-cancel")
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("Cancel")
                  ),
                ],
              });
            if (footer) {
              membed.setFooter({
                text: footer,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
              });
              await interaction
                .editReply({
                  embeds: [membed],
                  components: [row1, row2, row3],
                })
                .then(async () => {
                  let message = collected.first();
                  await message.delete();
                });
            }
          });
      } else if (["embed-send-channel"].includes(interaction.customId)) {
        let editComponents = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("dummy1")
            .setDisabled(true)
            .setStyle(ButtonStyle.Primary)
            .setLabel("Please mention a channel!"),
          new ButtonBuilder()
            .setCustomId("embed-cancel")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Cancel")
        );
        await interaction.update({ components: [editComponents] });
        channel
          .awaitMessages({ max: 1, time: 20000, errors: ["time"] })
          .then(async (collected) => {
            let c = collected.first().mentions.channels.first();
            if (!c)
              return interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy2")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("I didn't detect any channel !"),
                    new ButtonBuilder()
                      .setCustomId("embed-cancel")
                      .setStyle(ButtonStyle.Danger)
                      .setLabel("Cancel")
                  ),
                ],
              });
            if (c) {
              let embed = new EmbedBuilder()
                .setColor(embeds.color)
                .setTitle(embeds.title)
                .setDescription(embeds.description)
                .setThumbnail(embeds.thumbnail.url)
                .setImage(embeds.image.url)
                .setFooter({
                  text: embeds.footer?.text || interaction.guild.name,
                  iconURL:
                    embeds.footer?.iconURL ||
                    interaction.guild.iconURL({ dynamic: true }),
                });
              await c.send({ embeds: [embed] }).catch((e) => {
                console.log(e);
              });
              await interaction.editReply({
                components: [
                  new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("dummy3")
                      .setDisabled(true)
                      .setStyle(ButtonStyle.Success)
                      .setLabel(
                        "Embed was sent to the selected channel selcted! This will be deleted shortly!"
                      )
                  ),
                ],
              });
              setTimeout(async () => {
                await interaction.deleteReply();
              }, 5000);
            }
          });
      } else if (["embed-delete"].includes(interaction.customId)) {
        await interaction.update({
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("dummy3")
                .setDisabled(true)
                .setStyle(ButtonStyle.Success)
                .setLabel("Embed will be deleted shortly!")
            ),
          ],
        });
        setTimeout(async () => {
          await interaction.deleteReply();
        }, 5000);
      } else if (["embed-cancel"].includes(interaction.customId)) {
        let embed = new EmbedBuilder()
          .setColor(client.config.theme.color)
          .setDescription("Build an embed here")
          .setTitle("Embed Creator");

        return interaction.update({
          embeds: [embed],
          components: [row1, row2, row3],
          ephemeral: true,
        });
      }
    }
  },
};
