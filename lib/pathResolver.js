'use strict';

var tildify = require('tildify');

/**
 * @private
 * @function
 * @param {String} filename
 * @returns {String}
 */
function pathResolver(filename) {
    return tildify(filename);
}

/**
 * @private
 * @module webpack-glob/lib/pathResolver
 */
module.exports = pathResolver;
