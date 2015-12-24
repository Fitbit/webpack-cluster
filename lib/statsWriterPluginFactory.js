'use strict';

var StatsWriterPlugin = require('./statsWriterPlugin');

/**
 * @private
 * @function
 * @param {String} filename
 * @returns {StatsWriterPlugin}
 */
function statsWriterPluginFactory(filename) {
    return new StatsWriterPlugin(filename);
}

/**
 * @private
 * @module webpack-glob/lib/statsWriterPluginFactory
 */
module.exports = statsWriterPluginFactory;
