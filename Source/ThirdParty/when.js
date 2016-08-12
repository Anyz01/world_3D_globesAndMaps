/*global define*/
define([
    './bluebird'
], function(
    Promise) {
    'use strict';

    Promise.prototype.otherwise = Promise.prototype.catch;

    var when = function(promiseOrValue, onFulfilled, onRejected, onProgress) {
        var promise = Promise.resolve(promiseOrValue);
        if (onFulfilled) {
            promise = promise.then(onFulfilled);
        }
        if (onRejected) {
            promise = promise.catch(onRejected);
        }
        return promise;
    };

    when.defer = Promise.defer;
    when.resolve = Promise.resolve;
    when.reject = Promise.reject;

    when.join = Promise.join;

    when.all = Promise.all;
    when.map = Promise.map;
    when.reduce = Promise.reduce;

    when.any = Promise.any;
    when.some = Promise.some;

    when.isPromise = function(promiseOrValue) {
        return promiseOrValue && typeof promiseOrValue.then === 'function';
    };

    return when;
});
