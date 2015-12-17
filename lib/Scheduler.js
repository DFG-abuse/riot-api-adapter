"use strict";
let events = require('events');
let request = require('request');
/**
 * returns Promise executor that will be fulfilled when emitter emits a message
 * @returns {Function}
 */
function builder(emitter, message){
    return function(resolve){
        emitter.on(message, function(arg){
            resolve(arg);
        });
    };
}
/**
 * Represents a rule where you can make X requests per Y ms
 * @param requests Number of requests in interval
 * @param interval duration of interval (ms)
 * @constructor
 */
function Limit(requests, interval) {
    this.maxRequests = requests;
    this.availableRequests = requests;
    this.restoreRate = requests/(interval/1000);
    function reset(){
        this.availableRequests +=this.restoreRate;
        if(this.availableRequests > this.maxRequests){
            this.availableRequests = this.maxRequests;
        }

    }
    setInterval(reset.bind(this), 1000);
    this.hit = function(n){
        this.availableRequests-=n;
        if(this.availableRequests < 0 ) {
            this.availableRequests = 0;
        }
    };
}
/**
 * Schedules requests so you don't go beyond quota declared by limits
 */
function Scheduler(limits) {
    this.start = new Date();
    this.running = function(){
        return new Date() - this.start;
    };
    this.eventEmitter = new events.EventEmitter();
    this.queue = [];
    this.qcounter =0;
    if(!(limits instanceof Array)){
        limits = [limits];
    }
    this.limits = limits.map(v => new Limit(v.requests, v.interval));
    let scheduler= this;
    setInterval(function(){
        scheduler.batch();
    }, 1000);
}
/**
 * actually sends a request and emits event
 */
Scheduler.prototype.processJob = function(job, emitter){
    this.hit();
    //console.log(job.uri);
    request(job.uri, function (error, response, body) {
        if(error || response.statusCode == 429) {
            console.log(error);
            emitter.emit(job.msgID, {
                "success":0,
                "error": error
            });
        }
        else {
            emitter.emit(job.msgID, {
                "success":1,
                "error": null,
                "result": JSON.parse(body)
            });
        }
    });
};
/**
 * adds a job to a queue
 * @param uri URI of a request
 * @returns {Promise}
 */
Scheduler.prototype.add = function(uri){
    let msgID = ++this.qcounter;
    this.queue.push({
        uri:uri,
        msgID:msgID
    });
    return new Promise(builder(this.eventEmitter, msgID));
};
/**
 * checks all Limits and returns the lowest one
 * @returns number lowest counter value
 */
Scheduler.prototype.getQuota = function(){
    return this.limits.reduce(function(prev, current){
        return Math.min(prev.availableRequests, current.availableRequests);
    });
};
/**
 * decreases hit counter on all Limits
 */
Scheduler.prototype.hit = function(n){
    n = n?n:1;
    this.limits.forEach(v => v.hit(n));
};
/**
 * grabs a number of jobs from job queue and executes them
 */
Scheduler.prototype.batch = function(){
    let ee = this.eventEmitter;
    let quota = this.getQuota();
    if (quota > 0) {
        quota -=1;
    }
    let batchSize = Math.min(quota, this.queue.length);


    //console.log(this.running(),"new batch:", batchSize);

    let jobs = this.queue.splice(0,batchSize);
    jobs.forEach(v => this.processJob(v,ee));
};
module.exports=Scheduler;