'use strict';

var util = require('util'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    glob = require('glob'),
    EventEmitter = require('events'),
    EVENTS = require('./events'),
    ConfigBuilder = require('./configBuilder'),
    compilerFactory = require('./compilerFactory');

/**
 * @private
 * @function
 */
var findFiles = Promise.promisify(glob);

/**
 * @private
 * @constant
 * @type {Object}
 */
var GLOB_OPTIONS = {
    cache: true,
    dot: false,
    silent: true
};

/**
 * @private
 * @class
 * @alias CompilerStrategy
 * @param {CompilerOptions=} compilerOptions
 * @param {WebpackOptions=} webpackOptions
 * @extends {EventEmitter}
 */
function CompilerStrategy(compilerOptions, webpackOptions) {
    EventEmitter.call(this);

    if (!_.isObject(compilerOptions)) {
        compilerOptions = {};
    }

    if (!_.isObject(webpackOptions)) {
        webpackOptions = {};
    }

    this.compilerOptions = compilerOptions;
    this.webpackOptions = webpackOptions;
}

util.inherits(CompilerStrategy, EventEmitter);

/**
 * @abstract
 * @param {GlobString} pattern
 * @param {compilationCallback=} callback
 * @returns {Promise}
 */
CompilerStrategy.prototype.execute = function(pattern, callback) {}; // eslint-disable-line

/**
 * @protected
 * @param {String} filename
 * @returns {ConfigBuilder}
 */
CompilerStrategy.prototype.loadConfig = function(filename) {
    return ConfigBuilder.fromFile(filename).merge(this.webpackOptions);
};

/**
 * @protected
 * @returns {ConfigBuilder}
 */
CompilerStrategy.prototype.newConfig = function() {
    return ConfigBuilder.fromObject(this.webpackOptions);
};

/**
 * @protected
 * @param {Config|Config[]} config
 * @returns {Compiler}
 */
CompilerStrategy.prototype.createCompiler = function(config) {
    return compilerFactory(config, this.compilerOptions);
};

/**
 * @protected
 * @param {GlobString} pattern
 * @returns {Promise}
 */
CompilerStrategy.prototype.findFiles = function(pattern) {
    return findFiles(pattern, GLOB_OPTIONS);
};

/**
 * @param {Promise} promise
 * @returns {Promise}
*/
CompilerStrategy.prototype.timings = function(promise) {
    var startTime = process.hrtime();

    return promise.finally(_.bind(function() {
        var endTime = process.hrtime(startTime);

        this.emit(EVENTS.timings, endTime);
    }, this));
};

/**
 * @private
 * @module webpack-glob/lib/compilerStrategy
 * @returns {CompilerStrategy}
 */
module.exports = CompilerStrategy;
