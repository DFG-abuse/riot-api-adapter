"use strict";
/**
 * Created by malyavkin < draven@dfg.rip > on 2015-12-14.
 */
let Scheduler = require('./lib/Scheduler');
let tools = require('./lib/tools');
function Api(key){
    this.key = key;
    this.scheduler = new Scheduler([
        {// 10 запросов за 10 секунд
            "requests": 10,
            "interval": 10000
        },{// 500 запросов за 10 минут
            "requests": 500,
            "interval": 60*10000
        }
    ]);
}
Api.prototype.summoner_byName = function(region, summonerNames){
    const PARENT_API = "summoner";
    summonerNames = tools.standardize(summonerNames);
    let uri = tools.makeURI({
        "region" : region,
        "version" : tools.getVersion(PARENT_API),
        "api": PARENT_API,
        "value" : summonerNames,
        "pre_api" : "by-name",
        "key":this.key
    });
    return new Promise(tools.getBasicExecutor(this.scheduler, uri));
};
Api.prototype.summoner = function(region, summonerIds){
    const PARENT_API = "summoner";
    summonerIds = tools.standardize(summonerIds);
    let uri = tools.makeURI({
        "region" : region,
        "version" : tools.getVersion(PARENT_API),
        "api": PARENT_API,
        "value" : summonerIds,
        "key":this.key
    });
    return new Promise(tools.getBasicExecutor(this.scheduler, uri));
};
Api.prototype.summoner_masteries = function(region, summonerIds){
    const PARENT_API = "summoner";
    summonerIds = tools.standardize(summonerIds);
    let uri = tools.makeURI({
        "region" : region,
        "version" : tools.getVersion(PARENT_API),
        "api": PARENT_API,
        "value" : summonerIds,
        "post_api" : "masteries",
        "key":this.key
    });
    return new Promise(tools.getBasicExecutor(this.scheduler, uri));
};
Api.prototype.summoner_name = function(region, summonerIds){
    const PARENT_API = "summoner";
    summonerIds = tools.standardize(summonerIds);
    let uri = tools.makeURI({
        "region" : region,
        "version" : tools.getVersion(PARENT_API),
        "api": PARENT_API,
        "value" : summonerIds,
        "post_api" : "name",
        "key":this.key
    });
    return new Promise(tools.getBasicExecutor(this.scheduler, uri));
};
Api.prototype.summoner_runes = function(region, summonerIds){
    const PARENT_API = "summoner";
    summonerIds = tools.standardize(summonerIds);
    let uri = tools.makeURI({
        "region" : region,
        "version" : tools.getVersion(PARENT_API),
        "api": PARENT_API,
        "value" : summonerIds,
        "post_api" : "runes",
        "key":this.key
    });
    return new Promise(tools.getBasicExecutor(this.scheduler, uri));
};
Api.prototype.league_entry = function(region, summonerIds){
    const PARENT_API = "league";
    summonerIds = tools.standardize(summonerIds);
    let uri = tools.makeURI({
        "region" : region,
        "version" : tools.getVersion(PARENT_API),
        "api": PARENT_API,
        "value" : summonerIds,
        "post_api" : "entry",
        "pre_api" : "by-summoner",
        "key":this.key
    });
    return new Promise(tools.getBasicExecutor(this.scheduler, uri));
};
module.exports = Api;
