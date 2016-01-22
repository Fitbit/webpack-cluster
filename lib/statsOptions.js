'use strict';

/**
 * @private
 * @constant
 * @alias STATS_OPTIONS
 * @type {Object<String,*>}
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
 * @returns {STATS_OPTIONS}
 */
module.exports = STATS_OPTIONS;
