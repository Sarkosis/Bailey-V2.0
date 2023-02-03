const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Polls = require("discord-polls");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("polls")
    .setDescription("Starts a poll")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((sub) =>
      sub
        .setName("start")
        .setDescription("Start a poll!")
        .addStringOption((option) =>
          option
            .setName("title")
            .setDescription("The title of the poll.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("choices")
            .setDescription("Poll choices, seperated by a '-'")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("duration")
            .setDescription("Poll duration in seconds")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName("results")
        .setDescription("Find the results of a poll")
        .addStringOption((option) =>
          option
            .setName("message_id")
            .setDescription("Message ID of the poll")
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    switch (sub) {
      case "start":
        {
          const title = interaction.options.getString("title");
          const choices = interaction.options.getString("choices");
          const duration = interaction.options.getInteger("duration");
          const choicesArray = choices
            .split("-")
            .map((choice) => choice.trim());
          Polls.startPoll(interaction, title, choicesArray, duration);
        }
        break;
      case "results": {
        const ID = interaction.options.getString("message_id");
        const polls = await Polls.getResult(ID, interaction);
        return interaction.reply({
          content: `${Object.entries(polls).join("\n")}`,
          ephemeral: true,
        });
      }

      default:
        break;
    }
  },
};
