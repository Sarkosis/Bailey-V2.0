module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
      if (interaction.isSelectMenu()) {
        const { customId, guild } = interaction;
        if (["ticket-categories"].includes(customId)) {
          client.tickets.createTicket(interaction, client, guild);
        }
      }
    },
  };
  