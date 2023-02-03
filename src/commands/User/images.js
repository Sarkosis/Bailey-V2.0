const { default: axios } = require("axios");
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("images")
    .setDescription("Images for dayss!")
    .addSubcommand((sub) =>
      sub.setName("cats").setDescription("Find images of cats!")
    )
    .addSubcommand((sub) =>
      sub.setName("foxes").setDescription("Find images of foxes!")
    )
    .addSubcommand((sub) =>
      sub.setName("shibe").setDescription("Find images of shibes!")
    ),

  async execute(interaction, client) {
    let sub = interaction.options.getSubcommand();
    switch (sub) {
      case "cats": {
        let cats = await axios({
          method: "get",
          url: "https://cataas.com/cat?json=true",
          headers: {
            Accept: "application/json, text/plain, */*",
            "User-Agent": "*",
          },
        });
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setImage("https://cataas.com" + cats.data.url),
          ],
          ephemeral: true,
        });
      }
      case "foxes": {
        let foxes = await axios({
          method: "get",
          url: "https://randomfox.ca/floof/?ref=apilist.fun",
          headers: {
            Accept: "application/json, text/plain, */*",
            "User-Agent": "*",
          },
        });
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setImage(foxes.data.image),
          ],
          ephemeral: true,
        });
      }
      case "shibe": {
        let shibes = await axios({
          method: "get",
          url: "http://shibe.online/api/shibes",
          headers: {
            Accept: "application/json, text/plain, */*",
            "User-Agent": "*",
          },
        });
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor(client.config.theme.color)
              .setImage(shibes.data[0]),
          ],
          ephemeral: true,
        });
      }

      default:
        break;
    }
  },
};
