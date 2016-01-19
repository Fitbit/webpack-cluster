'use strict';

var path = require('path'),
    util = require('util'),
    Promise = require('bluebird'),
    _ = require('lodash'),
    gaze = require('gaze'),
    EVENTS = require('./events'),
    CompilerStrategy = require('./compilerStrategy');

/**
 * @private
 * @constant
 * @type {Object<String,Compiler>}
 */
var caches = {};

/**
 * @private
 * @class
 * @alias GazeWatchCompilerStrategy
 * @extends {CompilerStrategy}
 */
function GazeWatchCompilerStrategy() {
    CompilerStrategy.apply(this, _.toArray(arguments));
}

util.inherits(GazeWatchCompilerStrategy, CompilerStrategy);

/**
 * @protected
 * @param {String} filename
 */
GazeWatchCompilerStrategy.prototype.close = function(filename) {
    if (caches[filename]) {
        caches[filename].close(_.noop);

        delete caches[filename];
    }
};

/**
 * @protected
 * @param {String} filename
 * @param {GlobString} pattern
 * @param {compilationCallback=} callback
 * @returns {Compiler}
 */
GazeWatchCompilerStrategy.prototype.compile = function(filename, pattern, callback) {
    var config = this.loadConfig(filename).glob(pattern).build(),
        compiler = this.createCompiler(config),
        watchOptions = _.get(config, 'watchOptions', {});

    caches[filename] = compiler.watch(watchOptions, _.bind(function(err, stats) {
        this.emit(EVENTS.stats, stats);

        callback(err, stats);
    }, this));
};

/**
 * @private
 * @param {GlobString} pattern
 * @param {Function} callback
 * @returns {Promise}
 */
GazeWatchCompilerStrategy.prototype.watch = function(pattern, callback) {
    return new Promise(_.bind(function(resolve, reject) {
        this.emit(EVENTS.watch, [pattern]);

        gaze(path.resolve(pattern), function(err, watcher) {
            watcher.on('all', function(event, filename) {
                callback(event, filename);
            });

            if (_.isError(err)) {
                reject(err);
            } else {
                resolve(watcher);
            }
        });
    }, this));
};

/**
 * @override
 */
GazeWatchCompilerStrategy.prototype.execute = function(pattern, callback) {
    if (!_.isFunction(callback)) {
        callback = _.noop;
    }

    return this.watch(pattern, _.bind(function(event, filename) {
        this.close(filename);

        if (event !== 'deleted') {
            this.compile(filename, pattern, callback);
        }
    }, this));
};

/**
 * @private
 * @module webpack-glob/lib/gazeWatchCompilerStrategy
 * @returns {GazeWatchCompilerStrategy}
 */
module.exports = GazeWatchCompilerStrategy;
