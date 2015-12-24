'use strict';

var path = require('path'),
    _ = require('lodash'),
    gaze = require('gaze'),
    Promise = require('bluebird'),
    configFactory = require('./configFactory'),
    compilerFactory = require('./compilerFactory'),
    logger = require('./logger'),
    logStats = require('./logStats');

/**
 * @private
 * @constant
 * @type {Object<String,Compiler>}
 */
var caches = {};

/**
 * @private
 * @type {String}
 */
var START_MESSAGE_FORMAT = 'Watching webpack configs [%s]';

/**
 * @private
 * @type {String}
 */
var CHANGE_MESSAGE_FORMAT = '%s webpack config %s';

/**
 * @private
 * @param {String} filename
 */
function close(filename) {
    if (caches[filename]) {
        caches[filename].close(_.noop);

        delete caches[filename];
    }
}

/**
 * @private
 * @param {String} filename
 * @param {CompilerOptions} compilerOptions
 * @param {WebpackOptions} webpackOptions
 * @param {Function} callback
 */
function compile(filename, compilerOptions, webpackOptions, callback) {
    var config = configFactory(filename, webpackOptions),
        compiler = compilerFactory(config, compilerOptions),
        watchOptions = _.get(config, 'watchOptions', {}),
        statsOptions = _.get(config, 'stats', {});

    caches[filename] = compiler.watch(watchOptions, function(err, stats) {
        logStats(filename, stats, statsOptions);
        callback(err, stats);
    });
}

/**
 * Runs compiler in `run` mode
 * @private
 * @param {Pattern} pattern
 * @param {CompilerOptions} compilerOptions
 * @param {WebpackOptions} webpackOptions
 * @param {compilationCallback} callback
 * @returns {Promise}
 */
function watchAdapter(pattern, compilerOptions, webpackOptions, callback) {
    logger.info(START_MESSAGE_FORMAT, logger.path(path.resolve(pattern)));

    return new Promise(function(resolve, reject) {
        gaze(path.resolve(pattern), function(err) {
            this.on('all', function(event, filename) {
                logger.info(CHANGE_MESSAGE_FORMAT, _.capitalize(event), logger.path(filename));

                close(filename);

                if (event !== 'deleted') {
                    compile(filename, compilerOptions, webpackOptions, callback);
                }
            });

            if (_.isError(err)) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

/**
 * @private
 * @module webpack-glob/lib/watchAdapter
 */
module.exports = watchAdapter;
