"use strict";
/**
 * Created by lich on 2015-12-15.
 */
var co = require('co');
var util = require('util');
var Api = require('./index');
var config = require('./.env/config');
let connection = new Api(config.key);
function stack(x){
    console.log(x.stack);
}

/*
 * Нагрузочный тест.
 */
let cntr = 0;
function* req() {
    let results = yield Promise.all([
        connection.summoner(config.region,config.summonerIds),
        connection.summoner_byName(config.region,config.summonerNames),
        connection.summoner_runes(config.region,config.summonerIds),
        connection.summoner_masteries(config.region,config.summonerIds),
        connection.summoner_name(config.region,config.summonerIds),
        connection.league_entry(config.region,config.summonerIds)
    ]);
    //console.log(results);

    console.log(++cntr, JSON.stringify(results).length);
    if((cntr*6) % 1000 <= 6){
        console.log("\n\n",cntr*6,"requests in",connection.scheduler.running(),"ms","\n\n");
    }
}
setInterval(function(){
    for(let i = 0;i<11;i++){
        co(req).catch(stack);
    }
},1000);


