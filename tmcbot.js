const Telegraf = require('telegraf');
const fetch = require("node-fetch");
const fs = require('fs');

// const config = require('./config.js');
const helpMsg = require('./helpmessage.js');

const TOKEN = process.env.TOKEN || config.TOKEN;
const GOOGLESHEETURL = process.env.GOOGLESHEETURL || config.GOOGLESHEETURL;
const ADMIN = process.env.ADMIN || config.ADMIN;
const PORT = process.env.PORT || 5000;
const URL = process.env.URL;

const bot = new Telegraf(TOKEN);

var log = true;

bot.use((ctx, next) => {
    if(log){
        var details = ctx.chat.username + " (" + ctx.from.id + ")" + " said: " + ctx.update.message.text;
        console.log(details);
        bot.telegram.sendMessage(ADMIN, details);
    }
    ctx.message.text = ctx.message.text.toLowerCase();
    next();
});

bot.start((ctx) => {
    ctx.reply('Welcome');
    bot.telegram.sendMessage(ctx.from.id, helpMsg);
});

bot.command(['h','help'], (ctx) => {
    bot.telegram.sendMessage(ctx.from.id, helpMsg);
});

bot.command(['t', 'tip'], async (ctx) => {

    fs.readFile('data.json', 'utf8', (err, rawData) => {
        if(err) console.log(err);
        data = JSON.parse(rawData);

        let randomNo = Math.floor(Math.random()*data.B2.info) + 2;
        bot.telegram.sendMessage(ctx.from.id, 'Hey ' + ctx.from.first_name + ', ' + "Tip#" + data["D" + randomNo].info + "-" + data["E" + randomNo].info);
    });
});

bot.command(['v','video'], async (ctx) => {

    fs.readFile('data.json', 'utf8', (err, rawData) => {
        if(err) console.log(err);
        data = JSON.parse(rawData);

        let randomNo = Math.floor(Math.random()*data.B3.info) + 2;
        console.log(randomNo)
        bot.telegram.sendMessage(ctx.from.id, 'Hey ' + ctx.from.first_name + ', check out this video-\n' + "Video#" + data["G" + randomNo].info + " - " + data["H" + randomNo].info + ":\n" + data["I" + randomNo].info);
    });
});

bot.command(['r','random'], async (ctx) => {

    fs.readFile('data.json', 'utf8', (err, rawData) => {
        if(err) console.log(err);
        data = JSON.parse(rawData);

        let randomNo = Math.floor(Math.random()*data.B4.info) + 2;
        console.log(randomNo)
        bot.telegram.sendMessage(ctx.from.id, 'Hey ' + ctx.from.first_name + ', your random Table Topic is:\n' + "Topic#" + data["K" + randomNo].info + " - " + data["L" + randomNo].info);
    });
});

bot.command(['ig','instagram'], (ctx) => {
    bot.telegram.sendMessage(ctx.from.id, 'www.instagram.com/smutmc');
});

bot.command(['c','credits'], (ctx) => {
    bot.telegram.sendMessage(ctx.from.id, 'made by @marktrj');
});

//---------------------------------------------------------------------------------
//admin commands
//get data from google sheet and save in data.json file
bot.command(['u','update'], async (ctx) => {
    if(ADMIN == ctx.from.id){
        let response = await fetch(GOOGLESHEETURL,{ headers: {'Content-Type': 'application/json'}});
        rawData = await response.json();
        let data = {};
        rawData.feed.entry.forEach((cell) => {
            data[cell.title.$t] = {
                info: cell.gs$cell.$t,
                row: cell.gs$cell.row,
                col: cell.gs$cell.col
            }
        });
        
        fs.writeFile('data.json', JSON.stringify(data), (err) => {
            if (err) console.log(err);
            else {
                bot.telegram.sendMessage(ADMIN, "File saved");
            }
        });
    }
});

bot.command("log", (ctx) => {
    if(ctx.from.id == ADMIN){
        if(log){
            log = false;
            bot.telegram.sendMessage(ADMIN, "Message log turned off");
        }else{
            log = true;
            bot.telegram.sendMessage(ADMIN, "Message log turned on");
        }
    }
});


bot.telegram.setWebhook(`${URL}bot${TOKEN}`);
bot.startWebhook(`/bot${TOKEN}`, null, PORT);

// bot.launch();

