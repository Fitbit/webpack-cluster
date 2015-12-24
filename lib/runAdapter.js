'use strict';

var path = require('path'),
    util = require('util'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    WebpackConfig = require('webpack-config'),
    prettyHrtime = require('pretty-hrtime'),
    findFiles = require('./findFiles'),
    runJob = require('./runJob'),
    pathResolver = require('./pathResolver'),
    logger = require('./logger'),
    messageCompiler = require('./messageCompiler');

/**
 * @private
 * @type {Object<*, String>}
 */
var MESSAGES = {
    start: 'Compiling \\{white:{TOTAL}\\} webpack {TOTAL, plural, one {config} other {configs}}: [%s]',
    end: 'Compiled in \\{white:{TIME}\\}',
    error: '\\{white:{TOTAL}\\} webpack {TOTAL, plural, one {config} other {configs}} {TOTAL, plural, one {has} other {have}} some errors: [%s]',
    warn: '\\{white:{TOTAL}\\} webpack {TOTAL, plural, one {config} other {configs}} {TOTAL, plural, one {has} other {have}} some warnings: [%s]',
    fatalError: '\\{white:{TOTAL}\\} webpack {TOTAL, plural, one {config} other {configs}} {TOTAL, plural, one {has} other {have}} fatal error: [%s]',
    throwError: 'Cannot compile {TOTAL} webpack {TOTAL, plural, one {config} other {configs}}: [%s]'
};

/**
 * @private
 * @type {Object<*, Function>}
 */
var COMPILED_MESSAGES = messageCompiler(MESSAGES);

/**
 * @private
 * @param {String} level
 * @param {String[]} files
 */
function logFiles(level, files) {
    var message = COMPILED_MESSAGES[level]({
        TOTAL: files.length
    });

    logger.log(level, message, files.map(logger.path).join(', '));
}

/**
 * Runs compiler in `run` mode
 * @private
 * @param {Pattern} pattern
 * @param {CompilerOptions} compilerOptions
 * @param {WebpackOptions} webpackOptions
 * @returns {Promise}
 */
function runAdapter(pattern, compilerOptions, webpackOptions) {
    var environment = WebpackConfig.environment.getAll(),
        failOn = _.get(compilerOptions, 'failOn', {}),
        failOnErrors = _.isObject(failOn) ? _.get(failOn, 'errors', false) : failOn,
        failOnWarnings = _.isObject(failOn) ? _.get(failOn, 'warnings', false) : failOn,
        errors = [],
        warnings = [],
        fatalErrors = [];

    return findFiles(path.resolve(pattern)).then(function(files) {
        logger.info(COMPILED_MESSAGES.start({
            TOTAL: files.length
        }), files.map(logger.path).join(', '));

        var startTime = process.hrtime();

        return Promise.map(files, function(filename) {
            return runJob(filename, {
                compilerOptions: compilerOptions,
                webpackOptions: webpackOptions,
                environment: environment
            }).then(function(resp) {
                var hasErrors = _.get(resp, 'errors', false),
                    hasWarnings = _.get(resp, 'warnings', false);

                if (failOnErrors && hasErrors) {
                    errors.push(filename);
                }

                if (failOnWarnings && hasWarnings) {
                    warnings.push(filename);
                }
            }).catch(function() {
                fatalErrors.push(filename);
            });
        }).finally(function() {
            var endTime = process.hrtime(startTime);

            logger.info(COMPILED_MESSAGES.end({
                TIME: prettyHrtime(endTime)
            }));
        });
    }).finally(function() {
        if (fatalErrors.length > 0) {
            logFiles('fatalError', fatalErrors);
        }

        if (errors.length > 0) {
            logFiles('error', errors);
        }

        if (warnings.length > 0) {
            logFiles('warn', warnings);
        }

        var throwError = fatalErrors.length > 0 || errors.length > 0 || warnings.length > 0;

        if (throwError) {
            var allErrors = _.uniq([].concat(fatalErrors, errors, warnings));

            throw new Error(util.format(COMPILED_MESSAGES.throwError({
                TOTAL: allErrors.length
            }), allErrors.map(pathResolver).join(', ')));
        }
    });
}

/**
 * @private
 * @module webpack-glob/lib/runAdapter
 */
module.exports = runAdapter;
