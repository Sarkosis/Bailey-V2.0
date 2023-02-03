module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;
      if (interaction.channel.isDMBased()) {
        return interaction.reply({
          content: "`Please use commands in guilds only!`",
          ephemeral: true,
        });
      }
      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "`Error Occured!`",
          ephemeral: true,
        });
      }
    }
  },
};
