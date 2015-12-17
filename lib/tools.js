"use strict";
var format = require('string-format');
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
    if(!options.pre_api) {
        options.pre_api = "";
    }
    if(!options.post_api) {
        options.post_api= "";
    }
    options.param = [options.pre_api,options.value,options.post_api]
        .filter(testNotEmptyString)
        .join("/");
    return format("https://{region}.api.pvp.net/api/lol/{region}/{version}/{api}/{param}?api_key={key}",options);
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
        regions:["BR","EUNE","EUW","KR","LAN","LAS","NA","OCE","RU","TR"]
    },
    currentgame:{
        v:"v1.0",
        regions:["BR","EUNE","EUW","KR","LAN","LAS","NA","OCE","PBE","RU","TR"]
    },
    featuredgames:{
        v:"v1.0",
        regions:["BR","EUNE","EUW","KR","LAN","LAS","NA","OCE","PBE","RU","TR"]
    },
    game:{
        v:"v1.3",
        regions:["BR","EUNE","EUW","KR","LAN","LAS","NA","OCE","RU","TR"]
    },
    league:{
        v:"v2.5",
        regions:["BR","EUNE","EUW","KR","LAN","LAS","NA","OCE","RU","TR"]
    },
    lolstaticdata:{
        v:"v1.2",
        regions:["BR","EUNE","EUW","KR","LAN","LAS","NA","OCE","PBE","RU","TR"]
    },
    lolstatus:{
        v:"v1.0",
        regions:["BR","EUNE","EUW","LAN","LAS","NA","OCE","PBE","RU","TR"]
    },
    match:{
        v:"v2.2",
        regions:["BR","EUNE","EUW","KR","LAN","LAS","NA","OCE","RU","TR"]
    },
    matchlist:{
        v:"v2.2",
        regions:["BR","EUNE","EUW","KR","LAN","LAS","NA","OCE","RU","TR"]
    },
    stats:{
        v:"v1.3",
        regions:["BR","EUNE","EUW","KR","LAN","LAS","NA","OCE","RU","TR"]
    },
    summoner:{
        v:"v1.4",
        regions:["BR","EUNE","EUW","KR","LAN","LAS","NA","OCE","RU","TR"]
    },
    team:{
        v:"v2.4",
        regions:["BR","EUNE","EUW","KR","LAN","LAS","NA","OCE","RU","TR"]
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
module.exports.getVersion = getVersion;
module.exports.isAvailable = isAvailable;
module.exports.getBasicExecutor = getBasicExecutor;
module.exports.makeURI = makeURI;
module.exports.standardize = standardize;