require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();
let env = process.env;
let commands = [];

//Login - Initial
client.login(process.env.token);
fs.readdirSync("./commands/").forEach((file) => {
  commands.push(file.split(".js")[0]);
});

client.on("ready", () => {
  setInterval(async () => {
    try {
      let data = await require("./commands/reddit").run(
        "https://old.reddit.com/r/FreeGameFindings/new/",
        client
      );

      if (data !== null) {
        client.channels
          .find((channel) => channel.name === "gratis-spil")
          .send(`${data.title} ${data.url}`, {
            file: data.thumbnail,
          });
      }
    } catch (error) {}
  }, 10000);
});

//Events
client.on("message", (msg) => {
  if (msg.author.bot) return;
  let word = msg.content.split(" ")[0];

  for (let i = 0, l = commands.length; i < l; i++) {
    if (word.charAt(0) === env.prefix && word.slice(1) === commands[i]) {
      require("./commands/" + word.slice(1)).run(msg);
    }
  }
});

//Global Function
function randMax(max) {
  return Math.floor(Math.random() * max);
}

//Global export
module.exports = {
  randMax,
};
