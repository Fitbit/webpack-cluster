'use strict';

var util = require('util'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    EVENTS = require('./events'),
    CompilerStrategy = require('./compilerStrategy');

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

            if (_.isError(err)) {
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
 * @param {String} filename
 * @param {GlobString} pattern
 * @param {compilationCallback=} callback
 * @returns {Promise}
 */
GlobRunCompilerStrategy.prototype.getCompilationViolations = function(filename, pattern, callback) {
    return new Promise(_.bind(function(resolve) {
        var hasFatalError = false,
            hasErrors = false,
            hasWarnings = false;

        this.compile(filename, pattern, callback).then(function(stats) {
            hasErrors = _.result(stats, 'hasErrors');
            hasWarnings = _.result(stats, 'hasWarnings');
        }).catch(function() {
            hasFatalError = true;
        }).finally(function() {
            resolve({
                hasFatalError: hasFatalError,
                hasErrors: hasErrors,
                hasWarnings: hasWarnings
            });
        });
    }, this));
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

        return this.timings(Promise.map(files, _.bind(function(filename) {
            return this.getCompilationViolations(filename, pattern, callback).then(function(violations) {
                var hasFatalError = _.result(violations, 'hasFatalError', false),
                    hasErrors = _.result(violations, 'hasErrors', false),
                    hasWarnings = _.result(violations, 'hasWarnings', false);

                if (hasFatalError) {
                    fatalErrors.push(filename);
                }

                if (hasErrors) {
                    errors.push(filename);
                }

                if (hasWarnings) {
                    warnings.push(filename);
                }
            });
        }, this)).finally(_.bind(function() {
            this.emit(EVENTS.violations, failOn, {
                fatalErrors: fatalErrors,
                errors: errors,
                warnings: warnings
            });
        }, this)));
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
