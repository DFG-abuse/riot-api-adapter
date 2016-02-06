"use strict";
let format = require('string-format');
let _ = require('underscore');
function getBasicExecutor(scheduler,uri){
    return function(resolve,reject) {
        scheduler.add(uri).then(function (result) {
            if (result.success) {
                resolve(result.result);
            }
            else {
                console.log(result.error);
                reject(result.error);
            }
        });
    };
}
function _standardize(name){
    if(name instanceof Number || typeof name === "number") {
        return name.toString();
    }
    return name.toLocaleLowerCase().replace(/\s/g,"");
}
function testNotEmptyString(string) {
    return String(string).trim() !== "";
}
function makeURI(options){
    options.rest = "";
    if(options.params){
        let rest = _.map(options.params, (v, k) => {
            return k + "=" + v;
        }).join("&");
        if(rest){
            rest = "&"+rest;
            options.rest = rest;
        }
    }
    if(!options.pre_api) {
        options.pre_api = "";
    }
    if(!options.post_api) {
        options.post_api= "";
    }
    options.value = encodeURIComponent(options.value);
    options.param = [options.pre_api,options.value,options.post_api]
        .filter(testNotEmptyString)
        .join("/");
    return format("https://{region}.api.pvp.net/api/lol/{region}/{version}/{api}/{param}?api_key={key}{rest}",options);
}
function standardize(names){
    if(names instanceof String || typeof names === "string") {
        names = _standardize(names);
    }
    if(names instanceof Number || typeof names === "number") {
        names = names.toString();
    }
    if(names instanceof Array){
        names = names.map(_standardize).join(',');
    }
    return names;
}
const API_PROPS = {
    champion:{
        v:"v1.2",
        regions:["br","eune","euw","kr","lan","las","na","oce","ru","tr"]
    },
    currentgame:{
        v:"v1.0",
        regions:["br","eune","euw","kr","lan","las","na","oce","pbe","ru","tr"]
    },
    featuredgames:{
        v:"v1.0",
        regions:["br","eune","euw","kr","lan","las","na","oce","pbe","ru","tr"]
    },
    game:{
        v:"v1.3",
        regions:["br","eune","euw","kr","lan","las","na","oce","ru","tr"]
    },
    league:{
        v:"v2.5",
        regions:["br","eune","euw","kr","lan","las","na","oce","ru","tr"]
    },
    lolstaticdata:{
        v:"v1.2",
        regions:["br","eune","euw","kr","lan","las","na","oce","pbe","ru","tr"]
    },
    lolstatus:{
        v:"v1.0",
        regions:["br","eune","euw","lan","las","na","oce","pbe","ru","tr"]
    },
    match:{
        v:"v2.2",
        regions:["br","eune","euw","kr","lan","las","na","oce","ru","tr"]
    },
    matchlist:{
        v:"v2.2",
        regions:["br","eune","euw","kr","lan","las","na","oce","ru","tr"]
    },
    stats:{
        v:"v1.3",
        regions:["br","eune","euw","kr","lan","las","na","oce","ru","tr"]
    },
    summoner:{
        v:"v1.4",
        regions:["br","eune","euw","kr","lan","las","na","oce","ru","tr"]
    },
    team:{
        v:"v2.4",
        regions:["br","eune","euw","kr","lan","las","na","oce","ru","tr"]
    }
};
function getVersion(api){
    return API_PROPS[api].v;
}
function isAvailable(api, region){
    api  = standardize(api);
    let regions = API_PROPS[api].regions;
    return regions.indexOf(region) === -1;
}
function stack(x){
    console.log(x.stack);
}
module.exports.getVersion = getVersion;
module.exports.isAvailable = isAvailable;
module.exports.getBasicExecutor = getBasicExecutor;
module.exports.makeURI = makeURI;
module.exports.standardize = standardize;
module.exports.stack = stack;
module.exports.REGIONS = ["br","eune","euw","kr","lan","las","na","oce","pbe","ru","tr"];