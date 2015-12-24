'use strict';

var _ = require('lodash'),
    WebpackConfig = require('webpack-config'),
    configFactory = require('./configFactory'),
    compilerFactory = require('./compilerFactory'),
    logStats = require('./logStats');

/**
 * @private
 * @function
 * @param {String} filename
 * @param {Object} options
 * @param {Object} options.environment
 * @param {WebpackOptions} options.webpackOptions
 * @param {CompilerOptions} options.compilerOptions
 * @param {Function} callback
 */
function runWorker(filename, options, callback) {
    WebpackConfig.environment.setAll(options.environment);

    var config = configFactory(filename, options.webpackOptions);
    var compiler = compilerFactory(config, options.compilerOptions);
    var statsOptions = _.get(config, 'stats', {});

    compiler.run(function(err, stats) {
        logStats(filename, stats, statsOptions);

        callback(err, {
            errors: stats.hasErrors(),
            warnings: stats.hasWarnings()
        });
    });
}

/**
 * @private
 * @module webpack-glob/lib/runWorker
 */
module.exports = runWorker;
