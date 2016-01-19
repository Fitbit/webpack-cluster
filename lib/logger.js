'use strict';

var path = require('path'),
    util = require('util'),
    _ = require('lodash'),
    eazyLogger = require('eazy-logger'),
    tildify = require('tildify'),
    pkg = require('../package');

/**
 * @private
 * @constant
 * @type {String}
 */
var PATH_FORMAT = '{magenta:%s}';

/**
 * @private
 * @constant
 * @type {Object<*,String>}
 */
var PREFIXES = _.mapValues({
    base: '[{blue:%s}]',
    info: '',
    warn: '{yellow:[warn]}',
    fatalError: '{red:[fatalError]}'
}, function(value) {
    return _.isEmpty(value) ? value : value + ' ';
});

/**
 * @private
 * @function
 * @param {String} fmt
 * @returns {String}
 */
function compile(fmt) {
    return eazyLogger.compile(fmt);
}

/**
 * @private
 * @function
 * @param {String} fmt
 * @param {...*} arguments
 * @returns {String}
 */
function format() {
    return compile(util.format.apply(null, _.toArray(arguments)));
}

/**
 * @private
 * @function
 * @param {...*} arguments
 * @returns {String}
 */
function unescaped() {
    console.log.apply(console, _.toArray(arguments)); // eslint-disable-line no-console
}

/**
 * @private
 * @function
 * @param {String} filename
 * @returns {String}
 */
function rawPath(filename) {
    return tildify(path.resolve(filename));
}

/**
 * @private
 * @function
 * @param {String} filename
 * @returns {String}
 */
function compiledPath(filename) {
    return format(PATH_FORMAT, rawPath(filename));
}

/**
 * @private
 * @constant
 * @type {String}
 */
var PREFIX = util.format(PREFIXES.base, pkg.name);

/**
 * @private
 * @constant
 * @type {String}
 */
var COMPILED_PREFIX = _.trim(compile(PREFIX));

/**
 * @private
 * @type {Logger}
 */
var Logger = eazyLogger.Logger;

/**
 * @private
 * @type {Logger}
 */
var logger = new Logger({
    prefix: PREFIX,
    useLevelPrefixes: true,
    levels: {
        trace: 100,
        debug: 200,
        info: 300,
        warn: 400,
        error: 500,
        fatalError: 600
    },
    prefixes: {
        info: PREFIXES.info,
        warn: PREFIXES.warn,
        fatalError: PREFIXES.fatalError
    }
});

/**
 * @private
 * @module webpack-glob/lib/logger
 */
module.exports = logger;
module.exports.COMPILED_PREFIX = COMPILED_PREFIX;
module.exports.format = format;
module.exports.unescaped = unescaped;
module.exports.compile = compile;
module.exports.path = compiledPath;
module.exports.rawPath = rawPath;
