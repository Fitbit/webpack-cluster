'use strict';

var path = require('path'),
    logger = require('./logger'),
    progressFactory = require('./progressFactory');

/**
 * @private
 * @type {String}
 */
var MESSAGE_FORMAT = '{white:%d% %s}';

/**
 * @private
 * @function
 * @alias progressCallback
 * @param {String} filename
 * @param {Number} p
 * @param {String} msg
 */
function progressCallback(filename, p, msg) {
    filename = path.resolve(filename);

    var percentage = Math.floor(p * 100),
        progress = progressFactory(filename);

    if (p === 1) {
        delete progressFactory.caches[filename];

        msg += '\n';
    }

    progress.tick({
        prefix: logger.COMPILED_PREFIX,
        message: logger.format(MESSAGE_FORMAT, percentage, msg)
    });
}

/**
 * @private
 * @module webpack-glob/lib/progressCallback
 * @returns {progressCallback}
 */
module.exports = progressCallback;
