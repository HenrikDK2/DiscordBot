require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
let env = process.env;
let commands = []

//Login - Initial
client.login(process.env.token);
fs.readdirSync('./commands/').forEach(file => {
    commands.push(file.split('.js')[0])
});

//Events
client.on('message', msg => {
    if (msg.author.bot) return;
    let word = msg.content.split(' ')[0];

    for (let i = 0, l = commands.length; i < l; i++) {
        if (word.charAt(0) === env.prefix && word.slice(1) === commands[i]) {
            require('./commands/' + word.slice(1)).run(msg);
        }
    }
});