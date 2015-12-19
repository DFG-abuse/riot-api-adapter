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
        connection.summoner.get(config.region,config.summonerIds[0]),
        connection.summoner.byName(config.region,config.summonerNames[0]),
        connection.summoner.runes(config.region,config.summonerIds[0]),
        connection.summoner.masteries(config.region,config.summonerIds),
        connection.summoner.name(config.region,config.summonerIds[0]),
        connection.league.entry(config.region,config.summonerIds[0]),
        connection.stats.summary(config.region,config.summonerIds[0]),
        connection.stats.ranked(config.region,config.summonerIds[0]),
        connection.matchlist(config.region,config.summonerIds[0]),
        connection.game.recent(config.region,config.summonerIds[0])
    ]);
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
        //co(req).catch(stack);
    }
},1000);

co(function*(){
    let me = yield this.batch.basicSummonerInfo(config.region,config.summonerIds[1]);
    console.log(util.inspect(me,{depth: null }));
}.bind(connection));


