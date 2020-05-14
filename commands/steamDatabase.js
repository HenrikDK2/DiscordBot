module.exports.run = async function () {
    const fs = require('fs');
    const nodeFetch = require('node-fetch');
    let obj = {
        validGames:[]
    };
    let gameArrayLength = await nodeFetch('http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json')
    .then(res => res.json()).then(data => data.applist.apps.length);

    for(let i=0; i<gameArrayLength; i++){
        try {
            let res = await nodeFetch('https://store.steampowered.com/api/appdetails?appids='+i);

            if(res.status < 400){
                let data = await res.json();

                if(data[i].success === false){
                    continue;
                }

                obj.validGames.push(data[i]);
                console.log(obj)
                await fs.promises.writeFile('../data/phraseFreqs.json', JSON.stringify(output));
            }else{
                continue;
            }
        } catch (error) {
            console.log(error)
        }
    }

}