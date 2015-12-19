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
    this.summoner = {
        "get" : summoner.bind(this),
        "byName" : summoner_byName.bind(this),
        "masteries" : summoner_masteries.bind(this),
        "name" : summoner_name.bind(this),
        "runes" : summoner_runes.bind(this)
    };
    this.league = {
        "entry" : league_entry.bind(this)
    };
    this.stats = {
        "summary": stats_summary.bind(this),
        "ranked": stats_ranked.bind(this)
    };
    this.game = {
        "recent" : game_recent.bind(this)
    };
    this.matchlist = matchlist.bind(this);
}
function summoner_byName(region, summonerNames){
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
}
function summoner(region, summonerIds){
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
}
function summoner_masteries(region, summonerIds){
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
}
function summoner_name(region, summonerIds){
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
}
function summoner_runes(region, summonerIds){
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
}
function league_entry(region, summonerIds){
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
}
function stats_summary(region, summonerId){
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
}
function stats_ranked(region, summonerId){
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
}
function game_recent(region, summonerId){
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
}
function matchlist(region, summonerId){
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
}
module.exports = Api;
