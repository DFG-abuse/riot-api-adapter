"use strict";
/**
 * Created by lich on 2015-12-15.
 */
var co = require('co');
var util = require('util');
var Api = require('./index');
var config = require('./.env/config');
let connection = new Api(config.key);
/*co(function*(){
    let results = yield Promise.all([
        connection.summoner_byName(config.region,config.summonerNames),
        connection.summoner_runes(config.region,config.summonerIds),
        connection.summoner_masteries(config.region,config.summonerIds),
        connection.summoner(config.region,config.summonerIds),
        connection.summoner_name(config.region,config.summonerIds),
        connection.summoner_name(config.region,config.summonerIds),
        connection.summoner_name(config.region,config.summonerIds),
        connection.summoner_name(config.region,config.summonerIds),
        connection.summoner_name(config.region,config.summonerIds),
        connection.summoner_name(config.region,config.summonerIds),
        connection.summoner_name(config.region,config.summonerIds),
        connection.league_entry(config.region,config.summonerIds)

    ]);
    console.log(results);
}).catch(function(x){
    console.log(x.stack);
});
*/
let RL = require('./lib/RateLimiter');
let rl = new RL({
    interval:10000,
    maxInInterval: 10
});
let cntr = 0;
setInterval(function(){
    for(let i = 0;i<11;i++){
        co(function*() {
            if(rl.check("id").ok){
                let result = yield connection.summoner_byName(config.region, config.summonerNames);
                console.log(++cntr, Object.keys( result));
            }
        }).catch(function(x){
            console.log(x.stack);
        });

    }
},1000);


