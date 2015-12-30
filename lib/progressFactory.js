'use strict';

var Progress = require('progress');

/**
 * @private
 * @constant
 * @type {String}
 */
var FORMAT = ':prefix :message';

/**
 * @private
 * @constant
 * @type {Number}
 */
var TOTAL = Number.MAX_VALUE;

/**
 * @private
 * @constant
 * @type {Object<String,Progress>}
 */
var caches = {};

/**
 * @private
 * @function
 * @alias progressFactory
 * @param {String} filename
 * @returns {Progress}
 */
function progressFactory(filename) {
    var progress = caches[filename];

    if (!progress) {
        progress = new Progress(FORMAT, {
            stream: process.stderr,
            total: TOTAL
        });

        caches[filename] = progress;
    }

    return progress;
}

/**
 * @private
 * @module webpack-glob/lib/progressFactory
 * @returns {progressFactory}
 */
module.exports = progressFactory;
module.exports.caches = caches;
