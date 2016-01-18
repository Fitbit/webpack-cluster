'use strict';

var _ = require('lodash'),
    WorkerFarmRunCompilerStrategy = require('./workerFarmRunCompilerStrategy'),
    GazeWatchCompilerStrategy = require('./gazeWatchCompilerStrategy'),
    CompilerStrategyInvoker = require('./compilerStrategyInvoker');

/**
 * @alias CompilerAdapter
 * @class
 * @param {CompilerOptions=} compilerOptions
 * @param {WebpackOptions=} webpackOptions
 * @constructor
 */
function CompilerAdapter(compilerOptions, webpackOptions) {
    if (!_.isObject(compilerOptions)) {
        compilerOptions = {};
    }

    if (!_.isObject(webpackOptions)) {
        webpackOptions = {};
    }

    this.compilerOptions = compilerOptions;
    this.webpackOptions = webpackOptions;
}

/**
 * Builds the bundle(s)
 * @param {GlobString} pattern
 * @param {compilationCallback=} callback
 * @returns {Promise}
 */
CompilerAdapter.prototype.run = function(pattern, callback) {
    var strategy = new WorkerFarmRunCompilerStrategy(this.compilerOptions, this.webpackOptions),
        invoker = new CompilerStrategyInvoker(strategy, true);

    return invoker.execute(pattern, callback);
};

/**
 * Builds the bundle(s) then starts the watcher
 * @param {GlobString} pattern
 * @param {compilationCallback=} callback
 * @returns {Promise}
 */
CompilerAdapter.prototype.watch = function(pattern, callback) {
    var strategy = new GazeWatchCompilerStrategy(this.compilerOptions, this.webpackOptions),
        invoker = new CompilerStrategyInvoker(strategy, {
            watch: true,
            stats: true
        });

    return invoker.execute(pattern, callback);
};

/**
 * @module webpack-glob/lib/compilerAdapter
 * @returns {CompilerAdapter}
 */
module.exports = CompilerAdapter;
