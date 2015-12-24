'use strict';

var CompilerAdapter = require('./lib/compilerAdapter');

/**
 * @external Pattern
 * @type {String}
 * @see {@link https://github.com/isaacs/minimatch#features}
 */

/**
 * @external Compiler
 * @type {Object}
 * @see {@link https://github.com/webpack/webpack/blob/master/lib/Compiler.js}
 */

/**
 * @external Error
 * @type {Error}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error}
 */

/**
 * @external Stats
 * @type {Object}
 * @see {@link https://webpack.github.io/docs/node.js-api.html#stats}
 */

/**
 * Called when `webpack.config.js` file is compiled. Will be passed `err` and `stats` objects.
 * @callback compilationCallback
 * @function
 * @param {Error} err
 * @param {Stats} stats
 */

/**
 * @typedef {Object} CompilerOptions
 * @property {Boolean} [progress=false] - Displays compilation progress
 * @property {Boolean} [memoryFs=false] - Compiles to {@link https://webpack.github.io/docs/node.js-api.html#compile-to-memory memory}
 * @property {Boolean} [json=false] - Saves `stats` object to JSON file
 * @property {Boolean} [profile=false] - Captures timing information for each module
 * @property {Object|Boolean} [failOn={}] - In case when `failOn` is `Boolean` then all nested `failOn.*` properties will be filled out with that value.
 * @property {Boolean} [failOn.errors=false] - Fails build if some `stats` objects have some errors
 * @property {Boolean} [failOn.warnings=false] - Fails build if some `stats` objects have some warnings
 */

/**
 * {@link https://webpack.github.io/docs/configuration.html#configuration-object-content}
 * @typedef {Object} WebpackOptions
 */

/**
 * @module webpack-glob/index
 * @returns {CompilerAdapter}
 */
module.exports = CompilerAdapter;
