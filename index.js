"use strict";
/**
 * Created by malyavkin < draven@dfg.rip > on 2015-12-14.
 */
let Scheduler = require('./lib/Scheduler');
let tools = require('./lib/tools');
let assert = require('assert');
function Api(key){
    this.key = key;
    this.scheduler = new Scheduler([
        {
            interval:10000,
            maxInInterval: 10
        },{
            interval:60*10000,
            maxInInterval: 500
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
Api.prototype.stats_summary = function(region, summonerId){
    assert(typeof summonerId === 'number');
    const PARENT_API = "stats";
    summonerId = tools.standardize(summonerId);
    let uri = tools.makeURI({
        "region" : region,
        "version" : tools.getVersion(PARENT_API),
        "api": PARENT_API,
        "value" : summonerId,
        "pre_api" : "by-summoner",
        "post_api" : "summary",
        "key":this.key
    });
    return new Promise(tools.getBasicExecutor(this.scheduler, uri));
};
Api.prototype.stats_ranked = function(region, summonerId){
    assert(typeof summonerId === 'number');
    const PARENT_API = "stats";
    summonerId = tools.standardize(summonerId);
    let uri = tools.makeURI({
        "region" : region,
        "version" : tools.getVersion(PARENT_API),
        "api": PARENT_API,
        "value" : summonerId,
        "pre_api" : "by-summoner",
        "post_api" : "ranked",
        "key":this.key
    });
    return new Promise(tools.getBasicExecutor(this.scheduler, uri));
};
Api.prototype.game_recent = function(region, summonerId){
    assert(typeof summonerId === 'number');
    const PARENT_API = "game";
    summonerId = tools.standardize(summonerId);
    let uri = tools.makeURI({
        "region" : region,
        "version" : tools.getVersion(PARENT_API),
        "api": PARENT_API,
        "value" : summonerId,
        "pre_api" : "by-summoner",
        "post_api" : "recent",
        "key":this.key
    });
    return new Promise(tools.getBasicExecutor(this.scheduler, uri));
};
Api.prototype.matchlist= function(region, summonerId){
    assert(typeof summonerId === 'number');
    const PARENT_API = "matchlist";
    summonerId = tools.standardize(summonerId);
    let uri = tools.makeURI({
        "region" : region,
        "version" : tools.getVersion(PARENT_API),
        "api": PARENT_API,
        "value" : summonerId,
        "pre_api" : "by-summoner",
        "key":this.key
    });
    return new Promise(tools.getBasicExecutor(this.scheduler, uri));
};
module.exports = Api;
