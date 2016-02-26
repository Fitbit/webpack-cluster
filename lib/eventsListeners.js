'use strict';

var _ = require('lodash'),
    prettyHrtime = require('pretty-hrtime'),
    EVENTS = require('./events'),
    MESSAGES = require('./messages'),
    logger = require('./logger');

/**
 * @private
 * @function
 * @param {String[]} files
 */
function runListener(files) {
    logger.info(MESSAGES.run({
        TOTAL: files.length,
        FILES: files.map(logger.path).join(', ')
    }));
}

/**
 * @private
 * @function
 * @param {String[]} files
 */
function watchListener(files) {
    logger.info(MESSAGES.watch({
        FILES: files.map(logger.path).join(', ')
    }));
}

/**
 * @private
 * @function
 * @param {Stats} stats
 */
function statsListener(stats) {
    var filename = _.get(stats, 'compilation.options.filename'),
        options = _.get(stats, 'compilation.options.stats');

    logger.info(MESSAGES.stats({
        FILE: logger.path(filename)
    }));
    logger.unescaped(stats.toString(options));
}

/**
 * @private
 * @function
 * @param {Number[]} time
 */
function timingsListener(time) {
    logger.info(MESSAGES.time({
        TIME: prettyHrtime(time)
    }));
}

/**
 * @private
 * @param {String} level
 * @param {String[]} files
 */
function logError(level, files) {
    logger.log(level, MESSAGES[level]({
        TOTAL: files.length,
        FILES: files.map(logger.path).join(', ')
    }));
}

/**
 * @private
 * @param {String[]} files
 * @throws {Error}
 */
function throwError(files) {
    throw new Error(MESSAGES.throwError({
        TOTAL: files.length,
        FILES: files.map(logger.rawPath).join(', ')
    }));
}

/**
 * @private
 * @param {FailOnOptions} options
 * @param {FailOnResult} result
 */
function failListener(options, result) {
    var failOnErrors = _.isObject(options) ? _.get(options, 'errors', false) : options,
        failOnWarnings = _.isObject(options) ? _.get(options, 'warnings', false) : options,
        fatalErrors = _.result(result, 'fatalErrors', []),
        errors = _.result(result, 'errors', []),
        warnings = _.result(result, 'warnings', []),
        hasFatalErrors = fatalErrors.length > 0,
        hasErrors = errors.length > 0,
        hasWarnings = warnings.length > 0,
        fail = hasFatalErrors || (failOnErrors && hasErrors) || (failOnWarnings && hasWarnings);

    if (hasFatalErrors) {
        logError('fatalError', fatalErrors);
    }

    if (hasErrors) {
        logError('error', errors);
    }

    if (hasWarnings) {
        logError('warn', warnings);
    }

    if (fail) {
        var files = _.uniq([].concat(fatalErrors, errors, warnings));

        throwError(files);
    }
}

/**
 * @private
 * @constant
 * @type {Object<String,Function>}
 */
var EVENTS_LISTENERS = {};

EVENTS_LISTENERS[EVENTS.run] = runListener;
EVENTS_LISTENERS[EVENTS.watch] = watchListener;
EVENTS_LISTENERS[EVENTS.stats] = statsListener;
EVENTS_LISTENERS[EVENTS.timings] = timingsListener;
EVENTS_LISTENERS[EVENTS.fail] = failListener;

/**
 * @private
 * @module webpack-glob/lib/eventsListeners
 * @returns {EVENTS_LISTENERS}
 */
module.exports = EVENTS_LISTENERS;
