const { SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Add a user or role to a ticket")
    .addChannelOption((O) =>
      O.setName("ticket")
        .setDescription("Input the ticket channel")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("Input the user or role ID")
        .setRequired(true)
    ),

  async execute(interaction, client) {
    let { member, options, guild } = interaction;
    let ticket = options.getChannel("ticket");
    let userOrRole = options.getString("id");
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
            try {
              await ticket.permissionOverwrites.edit(userOrRole, {
                SendMessages: true,
                ViewChannel: true,
                ReadMessageHistory: true,
              });
            } catch (error) {
              return interaction.reply({
                content: "Failed to add the user or role to ticket!",
                ephemeral: true,
              });
            }
            return interaction.reply({
              content: "Successfully added the user or role to ticket!",
              ephemeral: true,
            });
          }
        );
      }
    );
  },
};
