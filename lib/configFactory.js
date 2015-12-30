'use strict';

var path = require('path'),
    glob = require('glob'),
    glob2base = require('glob2base'),
    _ = require('lodash'),
    WebpackConfig = require('webpack-config'),
    STATS_OPTIONS = require('./statsOptions');

/**
 * @private
 * @function
 * @param {Config} config
 * @param {WebpackOptions} options
 * @returns {Config}
 */
function mapConfig(config, options) {
    var currOutputPath = _.get(options, 'output.path'),
        pattern = _.get(options, 'resolve.glob'),
        isGlob = _.includes(pattern, '*'),
        globBase = pattern && glob2base(new glob.Glob(pattern)),
        basePath = globBase && path.resolve(globBase);

    if (currOutputPath) {
        currOutputPath = path.resolve(currOutputPath);
    }

    var prevOutputPath = _.get(config, 'output.path', path.dirname(config.filename));

    if (prevOutputPath) {
        prevOutputPath = path.resolve(prevOutputPath);
    }

    var outputPath;

    if (_.isString(basePath) && _.isString(currOutputPath)) {
        var relativePath;

        if (isGlob) {
            relativePath = prevOutputPath.replace(basePath, '');
        } else {
            relativePath = prevOutputPath.replace(path.dirname(basePath), '');
        }

        outputPath = path.join(currOutputPath, relativePath);
    } else {
        outputPath = prevOutputPath;
    }

    config.merge(options).merge({
        output: {
            path: outputPath
        }
    }).defaults({
        stats: STATS_OPTIONS
    });

    return config;
}

/**
 * @function
 * @alias configFactory
 * @param {String} filename
 * @param {WebpackOptions} options
 * @returns {Config|Config[]}
 */
function configFactory(filename, options) {
    var config = WebpackConfig.loader.loadConfig(filename),
        isArray = _.isArray(config);

    var configs = _.map([].concat(config), function(x) {
        return mapConfig(x, options);
    });

    return isArray ? configs : _.first(configs);
}

/**
 * @private
 * @module webpack-glob/lib/configFactory
 * @returns {configFactory}
 */
module.exports = configFactory;
