#!/usr/bin/env node
'use strict';

var _ = require('lodash'),
    CompilerAdapter = require('../lib/compilerAdapter'),
    argv = require('./argv');

/**
 * @private
 * @constant
 * @type {String[]}
 */
var SYSTEM_OPTIONS = [
    '$0',
    '[*]',
    '_',
    'version'
];

/**
 * @private
 * @constant
 * @type {String[]}
 */
var LOCAL_OPTIONS = [
    'config',
    'watch'
];

/**
 * @private
 * @constant
 * @type {String[]}
 */
var COMPILER_OPTIONS = [
    'progress',
    'memoryFs',
    'failOn',
    'json'
];

/**
 * @private
 * @constant
 * @type {String[]}
 */
var WEBPACK_OMIT_OPTIONS = [].concat(LOCAL_OPTIONS, COMPILER_OPTIONS, SYSTEM_OPTIONS);

/**
 * @private
 * @constant
 * @type {String[]}
 */
var COMPILER_PICK_OPTIONS = [].concat(COMPILER_OPTIONS);

var /**
     * @private
     * @constant
     * @type {CompilerOptions}
     */
    compilerOptions = _.pick(argv, COMPILER_PICK_OPTIONS),
    /**
     * @private
     * @constant
     * @type {WebpackOptions}
     */
    webpackOptions = _.omit(argv, WEBPACK_OMIT_OPTIONS);

var adapter = new CompilerAdapter(compilerOptions, webpackOptions),
    exitCode = 0,
    promise;

if (argv.watch) {
    promise = adapter.watch(argv.config);
} else {
    promise = adapter.run(argv.config);
}

promise.catch(function() {
    exitCode = 1;
});

process.on('exit', function() {
    process.exit(exitCode); // eslint-disable-line no-process-exit
});
