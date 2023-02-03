const { InteractionType } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.type == InteractionType.ModalSubmit) {
      if (["gcreate-modal"].includes(interaction.customId)) {
        client.giveaways.create(interaction, client)
      }
    }
  },
};
