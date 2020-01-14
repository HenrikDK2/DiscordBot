module.exports.run = function (msg) {
    require('dotenv').config();
    let oldPrefix = process.env.prefix;
    let newPrefix = msg.content.split(" ");

    if (newPrefix.length === 1) {
        msg.reply('den nuværende prefix er ' + oldPrefix);
    } else if (newPrefix[1].length === 1) {
        process.env.prefix = newPrefix[1];
        msg.reply(oldPrefix + " er erstattet med " + newPrefix[1]);
    } else {
        msg.reply("Prefix må kun være 1 tegn!");
    }
}