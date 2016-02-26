'use strict';

var CompilerAdapter = require('./lib/compilerAdapter');

/**
 * @external GlobString
 * @typedef {String} GlobString
 * @see {@link https://github.com/isaacs/minimatch#features}
 */

/**
 * @private
 * @external Compiler
 * @typedef {Object} Compiler
 * @see {@link https://github.com/webpack/webpack/blob/master/lib/Compiler.js}
 */

/**
 * @external Error
 * @typedef {Object} Error
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error}
 */

/**
 * @external Promise
 * @typedef {Object} Promise
 * @see {@link https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise}
 */

/**
 * @external Stats
 * @typedef {Object} Stats
 * @see {@link https://webpack.github.io/docs/node.js-api.html#stats}
 */

/**
 * Called when `webpack.config.js` file is compiled. Will be passed `err` and `stats` objects
 * @callback compilationCallback
 * @function
 * @param {Error} err
 * @param {Stats} stats
 */

/**
 * @private
 * @typedef {Object} FailOnResult
 * @property {String[]} fatalErrors
 * @property {String[]} errors
 * @property {String[]} warnings
 */

/**
 * @typedef {Object|Boolean} FailOnOptions
 * @property {Boolean} [errors=false] - Fails build if some `stats` objects have some errors
 * @property {Boolean} [warnings=false] - Fails build if some `stats` objects have some warnings
 */

/**
 * @typedef {Object} CompilerOptions
 * @property {Boolean} [progress=false] - Displays compilation progress
 * @property {Boolean} [memoryFs=false] - Compiles to {@link https://webpack.github.io/docs/node.js-api.html#compile-to-memory memory}
 * @property {Boolean} [json=false] - Saves `stats` object to JSON file
 * @property {FailOnOptions} [failOn={}] - In case when `failOn` is `Boolean` then all nested `failOn.*` properties will be filled out with that value
 */

/**
 * @external WebpackOptions
 * @typedef {Object} WebpackOptions
 * @see {@link https://webpack.github.io/docs/configuration.html#configuration-object-content}
 */

/**
 * @private
 * @typedef {Object} WorkerFarmWorkerOptions
 * @property {Object} options.environment
 * @property {WebpackOptions} options.webpackOptions
 * @property {CompilerOptions} options.compilerOptions
 */

/**
 * @module webpack-glob/index
 * @returns {CompilerAdapter}
 */
module.exports = CompilerAdapter;
