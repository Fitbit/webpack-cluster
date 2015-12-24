'use strict';

var ProgressPlugin = require('webpack/lib/ProgressPlugin'),
    progressCallback = require('./progressCallback');

/**
 * @private
 * @function
 * @param {String} filename
 * @returns {ProgressPlugin}
 */
function progressPluginFactory(filename) {
    return new ProgressPlugin(function(p, msg) {
        progressCallback(filename, p, msg);
    });
}

/**
 * @private
 * @module webpack-glob/lib/progressPluginFactory
 */
module.exports = progressPluginFactory;
