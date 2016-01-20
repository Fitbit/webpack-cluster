'use strict';

var util = require('util'),
    WebpackConfig = require('webpack-config'),
    yargs = require('yargs'),
    pkg = require('../package');

/**
 * @private
 * @constant
 * @type {String}
 */
var VERSION = pkg.version || 'DEV';

/**
 * @private
 * @constant
 * @type {Object<*,String>}
 */
var GROUPS = {
    compiler: 'Compiler:',
    webpack: 'Webpack:',
    miscellaneous: 'Miscellaneous:'
};

/**
 * @private
 * @constant
 * @type {Object<*,String>}
 */
var MESSAGES = {
    config: 'Specifies configuration files using `minimatch` pattern',
    progress: 'Displays compilation progress',
    json: 'Saves `stats` object to JSON file',
    profile: 'Captures timing information for each module',
    watch: 'Runs webpack compiler in `watch` mode',
    webpack: 'Many configuration options are mapped from CLI automatically',
    version: 'Outputs the version number',
    memoryFs: 'Compiles to memory'
};

/**
 * @private
 * @type {Object<*,*>}
 */
var argv = yargs
    .usage(util.format('%s --config=**/%s [options]', pkg.name, WebpackConfig.FILENAME))
    .options({
        config: {
            group: GROUPS.compiler,
            required: true,
            string: true,
            description: MESSAGES.config,
            nargs: 1
        },
        progress: {
            group: GROUPS.compiler,
            'default': false,
            description: MESSAGES.progress,
            'boolean': true
        },
        json: {
            group: GROUPS.compiler,
            'default': false,
            description: MESSAGES.json,
            'boolean': true
        },
        profile: {
            group: GROUPS.webpack,
            'default': false,
            description: MESSAGES.profile,
            'boolean': true
        },
        watch: {
            group: GROUPS.compiler,
            'default': false,
            description: MESSAGES.watch,
            'boolean': true
        },
        memoryFs: {
            group: GROUPS.compiler,
            'default': false,
            description: MESSAGES.memoryFs,
            'boolean': true
        },
        '[*]': {
            group: GROUPS.webpack,
            defaultDescription: '{}',
            description: MESSAGES.webpack
        },
        version: {
            group: GROUPS.miscellaneous,
            string: true
        }
    })
    .version(VERSION, null, MESSAGES.version)
    .argv;

/**
 * @private
 * @module webpack-glob/bin/argv
 * @returns {Object<*,*>}
 */
module.exports = argv;
