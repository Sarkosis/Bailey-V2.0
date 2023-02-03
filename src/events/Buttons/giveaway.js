module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isButton()) {
      if (["g-enter"].includes(interaction.customId)) {
        await client.giveaways.enter(interaction, client);
      } else if (["g-leave"].includes(interaction.customId)) {
        await client.giveaways.leave(interaction, client);
      } else if (["g-end"].includes(interaction.customId)) {
        await client.giveaways.end(interaction, client)
      } else if (["g-reroll"].includes(interaction.customId)) {
        await client.giveaways.reroll(interaction, client)
      }
    }
  },
};
