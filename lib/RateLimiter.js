"use strict";
let assert = require("assert");
let microtime = require("microtime-nodejs");
function RateLimiter (limits) {
    if(!(limits instanceof Array)) {
        limits= [limits];
    }
    this.limits = limits.slice();
    limits.forEach(function(v){
        v.interval*=1000;// in microseconds
        if(v.minDifference) {
            v.minDifference*=1000;
        } else {
            v.minDifference=null;
        }
        assert(v.interval > 0, "Must pass a positive integer for `options.interval`");
        assert(v.maxInInterval > 0, "Must pass a positive integer for `options.maxInInterval`");
        assert(v.minDifference >= 0, "`options.minDifference` cannot be negative");
    });
    this.maxWindow = limits.reduce(function(prev,current){
        return Math.max(prev.interval,current.interval);
    });
    this.storage = {};
    this.timeouts = {};
    this.SAFE_SPACE = 1000; // msec. Will be added to "rolling window" to prevent accidental differences in timing

}
function checkLimit(safeSpace, now, storage){
    return function(limit){
        let clearBefore = now - limit.interval - safeSpace*1000;
        let userSet = storage.filter(function(timestamp) {
            return timestamp > clearBefore;
        });

        let tooManyInInterval = userSet.length >= limit.maxInInterval;
        let timeSinceLastRequest = limit.minDifference && (now - userSet[userSet.length - 1]);
        let result;
        if (tooManyInInterval || timeSinceLastRequest < limit.minDifference) {
            let result_mms = Math.min(userSet[0] - now + limit.interval, limit.minDifference ? limit.minDifference - timeSinceLastRequest : Infinity);
            let result_ms = Math.floor(result_mms/1000); // convert from microseconds for user readability.
            result = {
                ok:false,
                count:0,
                wait:result_ms
            };
        } else {
            result = {
                ok:true,
                count:limit.maxInInterval - userSet.length,
                wait:0
            };

        }
        return result;
    };
}

RateLimiter.prototype.push = function(id) {
    this.storage[id].push(microtime.now());
};
RateLimiter.prototype.check = function(id) {

    let now = microtime.now();
    let clearBefore = now - this.maxWindow - this.SAFE_SPACE*1000;
    // aborting deletion
    clearTimeout(this.timeouts[id]);
    if(!this.storage[id]){
        this.storage[id] = [];
    }
    this.storage[id] = this.storage[id].filter(function(timestamp) {
        return timestamp > clearBefore;
    });

    let results = this.limits.map(checkLimit(this.SAFE_SPACE, now, this.storage[id]));
    let result = results.reduce(function(prev,current){
        return {
            ok : prev.ok && current.ok,
            count : Math.min(prev.count, current.count),
            wait : Math.max(prev.wait, current.wait)
        };
    });

    // we will delete entire storage for this id unless request comes and aborts timeout
    this.timeouts[id] = setTimeout(function() {
        console.log('purging storage for',id);
        delete this.storage[id];
    }.bind(this), this.maxWindow/1000); // convert to miliseconds for javascript timeout
    return result;
};
module.exports = RateLimiter;