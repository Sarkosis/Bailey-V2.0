const chalk = require("chalk");
const axios = require("axios");

setTimeout(() => {
  const version = Number(process.version.split(".")[0].replace("v", ""));
  if (version < 16)
    return console.log(chalk.red("\n\nPlease upgrade to Node v16 or higher"));
}, 8000);
setTimeout(async () => {
  const version = require("../../package.json").version;
  const currver = version;
  const req = await axios({
    method: "get",
    url: "https://raw.githubusercontent.com/Sarkosis/version-pub-api/main/versions.json",
    headers: { Accept: "application/json, text/plain, */*", "User-Agent": "*" },
  });
  const latestver = req.data.giveaway;
  if (latestver != currver) {
    console.log(
      `${chalk.yellow("[Version Checker]\n")}${chalk.red(
        `You are not on the latest version.\nCurrent Version: ${currver}\nLatest Version: ${latestver}`
      )}`
    );
  } else {
    console.log(
      `${chalk.green("[Version Checker]")} You are on the latest version.`
    );
  }
}, 4000);
