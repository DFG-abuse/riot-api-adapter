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
        connection.summoner(config.region,config.summonerIds[0]),
        connection.summoner_byName(config.region,config.summonerNames[0]),
        connection.summoner_runes(config.region,config.summonerIds),
        connection.summoner_masteries(config.region,config.summonerIds),
        connection.summoner_name(config.region,config.summonerIds[0]),
        connection.league_entry(config.region,config.summonerIds[0]),
        connection.stats_summary(config.region,config.summonerIds[0]),
        connection.stats_ranked(config.region,config.summonerIds[0]),
        connection.matchlist(config.region,config.summonerIds[0]),
        connection.game_recent(config.region,config.summonerIds[0])
    ]);
    //console.log(results);
    let json = JSON.stringify(results);
    console.log(++cntr, json.length);
    if(JSON.stringify(results).length === null){
        console.log(results);
    }
    if((cntr*results.length) % 1000 <results.length){
        console.log("\n\n",cntr*results.length,"requests in",connection.scheduler.running(),"ms","\n\n");
    }
}
setInterval(function(){
    for(let i = 0;i<11;i++){
        co(req).catch(stack);
    }
},1000);


