const { SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("archive")
    .setDescription("Archive a ticket")
    .addChannelOption((o) =>
      o
        .setName("ticket")
        .setDescription("Input the ticket channel")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addChannelOption((o) =>
      o
        .setName("category")
        .setDescription("Input the archive category")
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(true)
    ),

  async execute(interaction, client) {
    let { member, options, guild } = interaction;
    let ticket = options.getChannel("ticket");
    let category = options.getChannel("category");
    await client.con.query(
      `SELECT * FROM drproles WHERE GuildID = "${guild.id}"`,
      async (e, mrows) => {
        if (e) {
          if (client.config.debugmode) {
            console.log(e.stack);
          }
        }
        await client.con.query(
          `SELECT * FROM btnroles WHERE GuildID = "${guild.id}"`,
          async (e, brows) => {
            if (e) {
              if (client.config.debugmode) {
                console.log(e.stack);
              }
            }
            let checkroles = [];
            mrows.forEach((r) => {
              checkroles.push(r.RoleID);
            });
            brows.forEach((r) => {
              checkroles.push(r.RoleID);
            });
            let memberroles = [];
            member.roles.cache.forEach((role) => {
              memberroles.push(role.id);
            });
            let result = client.utils.hasRoles(checkroles, memberroles);
            if (result == false) {
              return interaction.reply({
                content:
                  "You aren't staff in this server!\nYou **cannot** use this action.",
                ephemeral: true,
              });
            }
            await client.con.query(
              `SELECT * FROM logs WHERE GuildID = '${guild.id}' AND ChannelID = "${ticket.id}" AND Archived = "false"`,
              async (e, row) => {
                if (e) {
                  if (client.config.debugmode) {
                    console.log(e.stack);
                  }
                }
                if (!row[0]) {
                  return interaction.reply({
                    content: "Ticket not found!\n**Notice: This could be because the ticket is already archived.**",
                    ephemeral: true,
                  });
                }
                await client.con.query(
                  `UPDATE logs SET Archived = "true" WHERE GuildID = '${guild.id}' AND ChannelID = "${ticket.id}"`,
                  async (e) => {
                    if (e) {
                      if (client.config.debugmode) {
                        console.log(e.stack);
                      }
                    }
                    let thecat = await guild.channels.resolve(category);
                    let thechan = await guild.channels.resolve(ticket);
                    if (!thecat) {
                      return interaction.reply({
                        content: "Category not found!",
                        ephemeral: true,
                      });
                    }
                    if (!thechan?.id) {
                      return interaction.reply({
                        content: "Channel not found!",
                        ephemeral: true,
                      });
                    }
                    try {
                      await thechan.edit({
                        parent: thecat.id,
                        topic: "Ticket archived",
                      });
                    } catch (error) {
                      return interaction.reply({
                        content: "Failed to archive",
                        ephemeral: true,
                      });
                    }
                    return interaction.reply({
                      content: "Successfully archived ticket!",
                      ephemeral: true,
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  },
};
