'use strict';

/**
 * @private
 * @constant
 * @alias STATS_OPTIONS
 * @type {Object}
 */
var STATS_OPTIONS = {
    colors: true,
    hash: true,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false,
    children: true,
    version: false,
    cached: false,
    cachedAssets: false,
    reasons: false,
    source: false,
    errorDetails: false
};

/**
 * @private
 * @module webpack-glob/lib/statsOptions
 * @return {STATS_OPTIONS}
 */
module.exports = STATS_OPTIONS;
