'use strict';

var chalk = require('chalk'),
    _ = require('lodash'),
    WebpackConfig = require('webpack-config'),
    STATS_OPTIONS = require('./statsOptions'),
    HOOKS = require('./configHooks');

/**
 * @private
 * @constant
 * @type {Boolean}
 */
var SUPPORTS_COLOR = chalk.supportsColor;

/**
 * @private
 * @function
 * @param {Config|Config[]} config
 * @return {Config|Config[]}
 */
function clone(config) {
    if (_.isArray(config)) {
        return _.map(config, function(x) {
            return x.clone();
        });
    } else {
        return config.clone();
    }
}

/**
 * @private
 * @function
 * @param {Config|Config[]} config
 * @param {Function} callback
 * @param {*} context
 */
function map(config, callback, context) {
    if (_.isArray(config)) {
        return _.map(config, function(x) {
            return callback.call(context, x);
        });
    } else {
        return callback.call(context, config);
    }
}

/**
 * @private
 * @class
 * @alias ConfigBuilder
 * @param {Config|Config[]} [config]
 */
function ConfigBuilder(config) {
    this.config = config;
    this.hooks = HOOKS;

    this.reset();
}

/**
 * @private
 */
ConfigBuilder.prototype.reset = function() {
    if (this.pendingConfig) {
        delete this.pendingConfig;
    }

    this.pendingConfig = new WebpackConfig();
};

/**
 * @param {Object} options
 * @returns {ConfigBuilder}
 */
ConfigBuilder.prototype.merge = function(options) {
    this.pendingConfig.merge(options);

    return this;
};

/**
 * @param {Object} options
 * @returns {ConfigBuilder}
 */
ConfigBuilder.prototype.defaults = function(options) {
    this.pendingConfig.defaults(options);

    return this;
};

/**
 * @param {GlobString} pattern
 * @returns {ConfigBuilder}
 */
ConfigBuilder.prototype.glob = function(pattern) {
    return this.defaults({
        resolve: {
            glob: pattern
        }
    });
};

/**
 * @returns {Config|Config[]}
 */
ConfigBuilder.prototype.build = function() {
    this.pendingConfig.defaults({
        stats: STATS_OPTIONS
    }).merge({
        stats: {
            colors: SUPPORTS_COLOR
        }
    });

    var result = map(clone(this.config), function(config) {
        _.forEach(this.hooks, _.bind(function(hook, key) {
            if (_.has(this.pendingConfig, key)) {
                var value = hook(key, this.pendingConfig, config);

                _.set(this.pendingConfig, key, value);
            }
        }, this));

        return config.merge(this.pendingConfig.toObject());
    }, this);

    this.reset();

    return result;
};

/**
 * @static
 * @param {String} filename
 * @returns {ConfigBuilder}
 */
ConfigBuilder.fromFile = function(filename) {
    var config = WebpackConfig.loader.loadConfig(filename);

    return new ConfigBuilder(config);
};

/**
 * @static
 * @param {Object} options
 * @returns {ConfigBuilder}
 */
ConfigBuilder.fromObject = function(options) {
    return new ConfigBuilder(new WebpackConfig().merge(options));
};

/**
 * @private
 * @module webpack-glob/lib/configBuilder
 * @returns {ConfigBuilder}
 */
module.exports = ConfigBuilder;
