'use strict';

var logger = require('./logger');

/**
 * @private
 * @type {String}
 */
var MESSAGE_FORMAT = 'Stats for webpack config %s';

/**
 * @private
 * @function
 * @param {String} filename
 * @param {Stats} stats
 * @param {Object} options
 * @returns {Promise}
 */
function logStats(filename, stats, options) {
    logger.info(MESSAGE_FORMAT, logger.path(filename));
    logger.unescaped(stats.toString(options));
}

/**
 * @private
 * @module webpack-glob/lib/logStats
 */
module.exports = logStats;
