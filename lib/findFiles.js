'use strict';

var glob = require('glob'),
    _ = require('lodash'),
    Promise = require('bluebird');

/**
 * @private
 * @function
 * @param {Pattern} pattern
 * @returns {Promise}
 */
function findFiles(pattern) {
    return new Promise(function(resolve, reject) {
        glob(pattern, {
            cache: true,
            dot: false,
            silent: true
        }, function(err, files) {
            if (_.isError(err)) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
}

/**
 * @private
 * @module webpack-glob/lib/findFiles
 */
module.exports = findFiles;
