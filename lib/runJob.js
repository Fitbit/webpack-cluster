'use strict';

var _ = require('lodash'),
    Promise = require('bluebird'),
    workerFarm = require('worker-farm');

/**
 * @private
 * @constant
 * @type {String}
 */
var WORKER_PATH = require.resolve('./runWorker');

/**
 * @private
 * @constant
 * @type {Object}
 */
var FARM_OPTIONS = {};

/**
 * @private
 * @type {String[]}
 */
var queue = [];

/**
 * @private
 */
var workers = workerFarm(FARM_OPTIONS, WORKER_PATH);

/**
 * @private
 */
function flushWorkers() {
    workerFarm.end(workers);
}

process.on('SIGINT', function() {
    flushWorkers();
});

/**
 * @private
 * @function
 * @param {String} filename
 * @param {Object} options
 * @returns {Promise}
 */
function runJob(filename, options) {
    return new Promise(function(resolve, reject) {
        queue.push(filename);

        workers(filename, options, function(err, resp) {
            var index = queue.indexOf(filename);

            if (index > -1) {
                queue.splice(index, 1);
            }

            if (queue.length === 0) {
                flushWorkers();
            }

            if (_.isError(err)) {
                reject(err);
            } else {
                resolve(resp);
            }
        });
    });
}

/**
 * @private
 * @module webpack-glob/lib/runJob
 */
module.exports = runJob;
