const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reminder")
    .setDescription("Set a reminder for yourself")
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add a reminder for yourself!")
        .addStringOption((option) =>
          option
            .setName("timer")
            .setDescription(
              "How long should I wait to remind you? (1m, 1h, 1d, 1y)"
            )
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("The thing you want to remind yourself about")
            .setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName("remove").setDescription("Remove your active reminders")
    ),
  async execute(interaction, client) {
    let { guild, member } = interaction;
    let sub = interaction.options.getSubcommand();
    switch (sub) {
      case "add":
        {
          let timer = interaction.options.getString("timer");
          let reminder = interaction.options.getString("message");
          let realtime = ms(timer);
          let newtime = interaction.createdTimestamp + realtime;
          await client.connection.query(
            `INSERT INTO reminders (GuildID, UserID, Reminder, Timer, Active) VALUES ('${guild.id}', '${member.id}', '${reminder}', '${newtime}', '1')`,
            async (e) => {
              if (e) {
                if (client.config.bot.debugMode) {
                  console.log(e.stack);
                }
                return interaction.reply({
                  embeds: [
                    new EmbedBuilder()
                      .setColor(client.config.theme.color)
                      .setDescription("`Database error occured`"),
                  ],
                  ephemeral: true,
                });
              }
              await member
                .send({
                  embeds: [
                    new EmbedBuilder()
                      .setColor(client.config.theme.color)
                      .setDescription(
                        `You have set a ${ms(
                          realtime
                        )} timer for the reminder of:\n${reminder}`
                      ),
                  ],
                })
                .catch(() => {});
              return interaction.reply({
                content: "Timer was set!",
                ephemeral: true,
              });
            }
          );
        }

        break;
      case "remove": {
        await client.connection.query(
          `DELETE FROM reminders WHERE UserID = '${member.id}' AND GuildID = '${guild.id}' AND Active = '1'`,
          async (e, rows) => {
            if (e) {
              if (client.config.bot.debugMode) {
                console.log(e.stack);
              }
              return interaction.reply({
                content: "`Database error occured`",
                ephemeral: true,
              });
            }
            if (!rows)
              return interaction.reply({
                content: "You don't have any active reminders in this guild!",
                ephemeral: true,
              });
            if (rows) {
              await client.connection.query(
                `UPDATE reminders SET Active = '0' WHERE GuildID = '${guild.id}' AND UserID = '${member.id}' AND Active = '1'`,
                async (er) => {
                  if (er) {
                    if (client.config.bot.debugMode) {
                      console.log(er.stack);
                    }
                  }
                  return interaction.reply({
                    content:
                      "All active reminders for this guild were removed!",
                    ephemeral: true,
                  });
                }
              );
            }
          }
        );
      }

      default:
        break;
    }
  },
};
