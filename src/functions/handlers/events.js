const fs = require("fs");

module.exports = (client) => {
  client.handleEvents = async () => {
    const eventFolders = fs.readdirSync(`./src/events`);
    for (const folder of eventFolders) {
      const eventFiles = fs
        .readdirSync(`./src/events/${folder}`)
        .filter((file) => file.endsWith(".js"));
      switch (folder) {
        case "Client":
          for (const file of eventFiles) {
            const event = require(`../../events/${folder}/${file}`);
            if (event.rest) {
              if (event.once)
                client.rest.once(event.name, (...args) =>
                  event.execute(...args, client)
                );
              else
                client.rest.on(event.name, (...args) =>
                  event.execute(...args, client)
                );
            } else {
              if (event.once)
                client.once(event.name, (...args) =>
                  event.execute(...args, client)
                );
              else
                client.on(event.name, (...args) =>
                  event.execute(...args, client)
                );
            }
          }
          break;
        case "Guild":
          for (const file of eventFiles) {
            const event = require(`../../events/${folder}/${file}`);
            if (event.rest) {
              if (event.once)
                client.rest.once(event.name, (...args) =>
                  event.execute(...args, client)
                );
              else
                client.rest.on(event.name, (...args) =>
                  event.execute(...args, client)
                );
            } else {
              if (event.once)
                client.once(event.name, (...args) =>
                  event.execute(...args, client)
                );
              else
                client.on(event.name, (...args) =>
                  event.execute(...args, client)
                );
            }
          }
          break;
        case "Buttons":
          for (const file of eventFiles) {
            const event = require(`../../events/${folder}/${file}`);
            if (event.rest) {
              if (event.once)
                client.rest.once(event.name, (...args) =>
                  event.execute(...args, client)
                );
              else
                client.rest.on(event.name, (...args) =>
                  event.execute(...args, client)
                );
            } else {
              if (event.once)
                client.once(event.name, (...args) =>
                  event.execute(...args, client)
                );
              else
                client.on(event.name, (...args) =>
                  event.execute(...args, client)
                );
            }
          }
          break;
        case "Modals":
          for (const file of eventFiles) {
            const event = require(`../../events/${folder}/${file}`);
            if (event.rest) {
              if (event.once)
                client.rest.once(event.name, (...args) =>
                  event.execute(...args, client)
                );
              else
                client.rest.on(event.name, (...args) =>
                  event.execute(...args, client)
                );
            } else {
              if (event.once)
                client.once(event.name, (...args) =>
                  event.execute(...args, client)
                );
              else
                client.on(event.name, (...args) =>
                  event.execute(...args, client)
                );
            }
          }
          break;
          case "Menus":
            for (const file of eventFiles) {
              const event = require(`../../events/${folder}/${file}`);
              if (event.rest) {
                if (event.once)
                  client.rest.once(event.name, (...args) =>
                    event.execute(...args, client)
                  );
                else
                  client.rest.on(event.name, (...args) =>
                    event.execute(...args, client)
                  );
              } else {
                if (event.once)
                  client.once(event.name, (...args) =>
                    event.execute(...args, client)
                  );
                else
                  client.on(event.name, (...args) =>
                    event.execute(...args, client)
                  );
              }
            }
            break;

        default:
          break;
      }
    }
  };
};
