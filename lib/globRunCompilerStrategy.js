'use strict';

var util = require('util'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    glob = require('glob'),
    EVENTS = require('./events'),
    CompilerStrategy = require('./compilerStrategy');

/**
 * @private
 * @constant
 * @type {Object}
 */
var GLOB_OPTIONS = {
    cache: true,
    dot: false,
    silent: true
};

/**
 * @private
 * @function
 */
var findFiles = Promise.promisify(glob);

/**
 * @private
 * @param {*} err
 * @returns {Boolean}
 */
function isError(err) {
    return err instanceof Error;
}

/**
 * @private
 * @class
 * @alias GlobRunCompilerStrategy
 * @extends {CompilerStrategy}
 */
function GlobRunCompilerStrategy() {
    CompilerStrategy.apply(this, _.toArray(arguments));
}

util.inherits(GlobRunCompilerStrategy, CompilerStrategy);

/**
 * @protected
 * @param {String} filename
 * @param {GlobString} pattern
 * @param {compilationCallback=} callback
 * @returns {Promise}
 */
GlobRunCompilerStrategy.prototype.compile = function(filename, pattern, callback) {
    var config = this.loadConfig(filename).glob(pattern).build(),
        compiler = this.createCompiler(config);

    return new Promise(_.bind(function(resolve, reject) {
        compiler.run(_.bind(function(err, stats) {
            this.emit(EVENTS.stats, stats);

            if (isError(err)) {
                reject(err);
            } else {
                resolve(stats);
            }

            callback(err, stats);
        }, this));
    }, this));
};

/**
 * @protected
 * @param {GlobString} pattern
 * @returns {Promise}
 */
GlobRunCompilerStrategy.prototype.findFiles = function(pattern) {
    return findFiles(pattern, GLOB_OPTIONS);
};

/**
 * @protected
 * @param {GlobString} pattern
 * @param {compilationCallback=} callback
 * @returns {Promise}
 */
GlobRunCompilerStrategy.prototype.compileAll = function(pattern, callback) {
    var failOn = _.get(this.compilerOptions, 'failOn', {}),
        fatalErrors = [],
        errors = [],
        warnings = [];

    return this.findFiles(pattern).then(_.bind(function(files) {
        this.emit(EVENTS.run, files);

        return Promise.map(files, _.bind(function(filename) {
            return new Promise(_.bind(function (resolve, reject) {
                this.compile(filename, pattern, callback).asCallback(function(err, stats) {
                    var hasFatalError = isError(err),
                        hasErrors = _.result(stats, 'hasErrors', false),
                        hasWarnings = _.result(stats, 'hasWarnings', false);

                    if (hasFatalError) {
                        fatalErrors.push(filename);
                    }

                    if (hasErrors) {
                        errors.push(filename);
                    }

                    if (hasWarnings) {
                        warnings.push(filename);
                    }

                    return hasFatalError ? reject(err) : resolve(stats);
                });
            }, this));
        }, this)).finally(_.bind(function() {
            this.emit(EVENTS.fail, failOn, {
                fatalErrors: fatalErrors,
                errors: errors,
                warnings: warnings
            });
        }, this));
    }, this));
};

/**
 * @override
 */
GlobRunCompilerStrategy.prototype.execute = function(pattern, callback) {
    if (!_.isFunction(callback)) {
        callback = _.noop;
    }

    return this.compileAll(pattern, callback);
};

/**
 * @private
 * @module webpack-glob/lib/globRunCompilerStrategy
 * @returns {GlobRunCompilerStrategy}
 */
module.exports = GlobRunCompilerStrategy;
