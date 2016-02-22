'use strict';

var _ = require('lodash'),
    chalk = require('chalk'),
    Promise = require('bluebird'),
    EVENTS = require('./events'),
    EVENTS_LISTENERS = require('./eventsListeners');

/**
 * @private
 * @constant
 * @type {Boolean}
 */
var SUPPORTS_COLOR = chalk.supportsColor;

/**
 * @private
 * @constant
 * @type {Object<String,Boolean>}
 */
var DEFAULT_EVENTS = _.mapValues(EVENTS, function() {
    return false;
});

/**
 * @private
 * @class
 * @alias CompilerStrategyInvoker
 * @param {CompilerStrategy} strategy
 * @param {Object<String,Boolean>|Boolean} [events]
 */
function CompilerStrategyInvoker(strategy, events) {
    if (_.isBoolean(events)) {
        events = _.mapValues(DEFAULT_EVENTS, function() {
            return events;
        });
    }

    this.strategy = strategy;
    this.events = _.defaults(events, DEFAULT_EVENTS);

    this.bindEvents();
}

/**
 * @private
 */
CompilerStrategyInvoker.prototype.bindEvents = function() {
    _.forEach(this.events, _.bind(function(value, name) {
        if (value === true) {
            var callback = EVENTS_LISTENERS[name];

            this.strategy.on(name, callback);
        }
    }, this));
};

/**
 * @param {GlobString} pattern
 * @param {compilationCallback=} callback
 * @returns {Promise}
 */
CompilerStrategyInvoker.prototype.execute = function(pattern, callback) {
    return this.beforeExecute().then(_.bind(function() {
        return this.strategy.timings(this.strategy.execute(pattern, callback));
    }, this)).finally(_.bind(function() {
        return this.afterExecute();
    }, this));
};

/**
 * @private
 * @returns {Promise}
 */
CompilerStrategyInvoker.prototype.beforeExecute = function() {
    if (!SUPPORTS_COLOR) {
        // NOTE (mdreizin): Using that hack due to https://github.com/chalk/supports-color/issues/32
        process.env.TERM = 'dumb';
    }

    return Promise.resolve();
};

/**
 * @private
 * @returns {Promise}
 */
CompilerStrategyInvoker.prototype.afterExecute = function() {
    if (!SUPPORTS_COLOR) {
        delete process.env.TERM;
    }

    return Promise.resolve();
};

/**
 * @private
 * @module webpack-glob/lib/compilerStrategyInvoker
 * @returns {CompilerStrategyInvoker}
 */
module.exports = CompilerStrategyInvoker;
