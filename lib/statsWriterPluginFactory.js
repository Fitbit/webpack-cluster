'use strict';

var StatsWriterPlugin = require('webpack-stats-writer-plugin');

/**
 * @private
 * @function
 * @alias statsWriterPluginFactory
 * @param {String} filename
 * @returns {StatsWriterPlugin}
 */
function statsWriterPluginFactory(filename) {
    return new StatsWriterPlugin(filename);
}

/**
 * @private
 * @module webpack-glob/lib/statsWriterPluginFactory
 * @returns {statsWriterPluginFactory}
 */
module.exports = statsWriterPluginFactory;
