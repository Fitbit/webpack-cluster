'use strict';

var _ = require('lodash'),
    chalk = require('chalk'),
    runAdapter = require('./runAdapter'),
    watchAdapter = require('./watchAdapter');

/**
 * @private
 * @constant
 * @type {Boolean}
 */
var SUPPORTS_COLOR = chalk.supportsColor;

/**
 * @alias CompilerAdapter
 * @class
 * @param {CompilerOptions=} compilerOptions
 * @param {WebpackOptions=} webpackOptions
 * @constructor
 */
function CompilerAdapter(compilerOptions, webpackOptions) {
    if (!_.isObject(compilerOptions)) {
        compilerOptions = {};
    }

    if (!_.isObject(webpackOptions)) {
        webpackOptions = {};
    }

    this.compilerOptions = compilerOptions;
    this.webpackOptions = webpackOptions;
}

/**
 * @private
 * @param {Pattern} pattern
 * @param {Function} adapter
 * @param {Function=} callback
 * @returns {Promise}
 */
CompilerAdapter.prototype.build = function(pattern, adapter, callback) {
    if (!_.isFunction(callback)) {
        callback = _.noop;
    }

    var webpackOptions = _.merge({}, this.webpackOptions, {
        resolve: {
            glob: pattern
        },
        stats: {
            colors: SUPPORTS_COLOR
        }
    });

    if (!SUPPORTS_COLOR) {
        // NOTE (mdreizin): Using that hack due to https://github.com/chalk/supports-color/issues/32
        process.env.TERM = 'dumb';
    }

    return adapter(pattern, this.compilerOptions, webpackOptions, callback).then(function() {
        delete process.env.TERM;
    });
};

/**
 * Builds the bundle(s)
 * @param {Pattern} pattern
 * @param {Function=} callback - `callback` doesn't receive `err` and `stats` objects because all configs compiled in separate `process`
 * @returns {Promise}
 */
CompilerAdapter.prototype.run = function(pattern, callback) {
    return this.build(pattern, runAdapter, callback);
};

/**
 * Builds the bundle(s) then starts the watcher
 * @param {Pattern} pattern
 * @param {compilationCallback=} callback
 * @returns {Promise}
 */
CompilerAdapter.prototype.watch = function(pattern, callback) {
    return this.build(pattern, watchAdapter, callback);
};

/**
 * @private
 * @module webpack-glob/lib/compilerAdapter
 * @returns {CompilerAdapter}
 */
module.exports = CompilerAdapter;
