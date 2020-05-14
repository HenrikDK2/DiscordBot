module.exports.run = async function (msg) {
    const nodeFetch = require('node-fetch');
    const g = require('../bot');
    let gameArrayLength = await nodeFetch('http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json')
        .then(res => res.json()).then(data => data.applist.apps.length);

    game = () => {
        let appid = g.randMax(gameArrayLength);
        nodeFetch("https://store.steampowered.com/api/appdetails?appids=" + appid)
            .then(res => res.json()).then(data => {

                if (data[appid].success === false ||
                    data[appid].data.type === "movie" ||
                    data[appid].data.type === "dlc" ||
                    data[appid].data.type === "advertising" ||
                    data[appid].data.type === "demo") {
                    game();
                } else {
                    console.log(data[appid])
                    console.log(data[appid].data.type)
                    msg.reply("https://store.steampowered.com/app/" + appid);
                    msg.reply(`https://www.allkeyshop.com/blog/buy-${data[appid].data.name.split(' ').join('-').toLowerCase().replace(':', '')}-cd-key-compare-prices/`);
                }
            })
    }


    game();
}