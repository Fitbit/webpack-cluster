'use strict';

var util = require('util'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    workerFarm = require('worker-farm'),
    WebpackConfig = require('webpack-config'),
    GlobRunCompilerStrategy = require('./globRunCompilerStrategy');

/**
 * @private
 * @constant
 * @type {String}
 */
var WORKER_PATH = require.resolve('./workerFarmRunWorker');

/**
 * @private
 * @constant
 * @type {Object}
 */
var FARM_OPTIONS = {};

/**
 * @private
 * @constant
 * @type {String}
 */
var CALLBACK_ERROR_MESSAGE = 'You cannot pass `callback` because all configs are compiled in separate `process` and currently is no way to share `stats` between processes';

/**
 * @private
 * @class
 * @alias WorkerFarmRunCompilerStrategy
 * @extends {GlobRunCompilerStrategy}
 */
function WorkerFarmRunCompilerStrategy() {
    GlobRunCompilerStrategy.apply(this, _.toArray(arguments));

    this.environment = WebpackConfig.environment.getAll();
    this.workers = workerFarm(FARM_OPTIONS, WORKER_PATH);
    this.pipe = Promise.promisify(this.workers);

    process.on('SIGINT', _.bind(this.close, this));
}

util.inherits(WorkerFarmRunCompilerStrategy, GlobRunCompilerStrategy);

/**
 * @private
 */
WorkerFarmRunCompilerStrategy.prototype.close = function() {
    workerFarm.end(this.workers);
};

/**
 * @override
 */
WorkerFarmRunCompilerStrategy.prototype.compile = function(filename, pattern, callback) { // eslint-disable-line
    var config = this.newConfig().glob(pattern).build();

    return this.pipe(filename, {
        compilerOptions: this.compilerOptions,
        webpackOptions: config.toObject(),
        environment: this.environment
    });
};

/**
 * @override
 */
WorkerFarmRunCompilerStrategy.prototype.execute = function(pattern, callback) {
    if (_.isFunction(callback)) {
        throw new Error(CALLBACK_ERROR_MESSAGE);
    }

    return this.compileAll(pattern).finally(_.bind(this.close, this));
};

/**
 * @private
 * @module webpack-glob/lib/workerFarmRunCompilerStrategy
 * @returns {WorkerFarmRunCompilerStrategy}
 */
module.exports = WorkerFarmRunCompilerStrategy;
module.exports.CALLBACK_ERROR_MESSAGE = CALLBACK_ERROR_MESSAGE;
