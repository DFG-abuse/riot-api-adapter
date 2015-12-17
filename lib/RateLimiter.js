"use strict";
var assert = require("assert");
var microtime = require("microtime-nodejs");
function RateLimiter (options) {
    this.interval        = options.interval * 1000; // in microseconds
    this.maxInInterval   = options.maxInInterval;
    this.minDifference   = options.minDifference ? 1000*options.minDifference : null; // also in microseconds
    this.storage = {};
    this.timeouts = {};
    this.SAFE_SPACE = 1000; // msec. Will be added to "rolling window" to prevent accidental differences in timing
    assert(this.interval > 0, "Must pass a positive integer for `options.interval`");
    assert(this.maxInInterval > 0, "Must pass a positive integer for `options.maxInInterval`");
    assert(!(this.minDifference < 0), "`options.minDifference` cannot be negative");
}
RateLimiter.prototype.check = function(id) {

    var now = microtime.now();
    var clearBefore = now - this.interval;
    // aborting deletion
    clearTimeout(this.timeouts[id]);
    if(!this.storage[id]){
        this.storage[id] = [];
    }
    var userSet = this.storage[id].filter(function(timestamp) {
        return timestamp > clearBefore-this.SAFE_SPACE*1000;
    }.bind(this));
    var tooManyInInterval = userSet.length >= this.maxInInterval;
    var timeSinceLastRequest = this.minDifference && (now - userSet[userSet.length - 1]);
    var result;
    if (tooManyInInterval || timeSinceLastRequest < this.minDifference) {
        let result_mms = Math.min(userSet[0] - now + this.interval, this.minDifference ? this.minDifference - timeSinceLastRequest : Infinity);
        let result_ms = Math.floor(result_mms/1000); // convert from microseconds for user readability.
        result = {
            ok:false,
            wait:result_ms
        };
    } else {
        result = {
            ok:true,
            count:this.maxInInterval - userSet.length
        };
        this.storage[id].push(now);
    }
    // we will delete entire storage for this id unless request comes and aborts timeout
    this.timeouts[id] = setTimeout(function() {
        console.log('purging storage for',id);
        delete this.storage[id];
    }.bind(this), this.interval/1000); // convert to miliseconds for javascript timeout
    return result;
};
module.exports = RateLimiter;