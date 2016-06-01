import CompilerAdapter from './CompilerAdapter';

/**
 * @typedef {Object} CompilerOptions
 * @property {Boolean} [progress=false] - Displays compilation progress
 * @property {Function} [progressCallback] - Progress callback
 * @property {Boolean} [debug=false] - Displays debug information
 * @property {Boolean} [watch=false] - Runs in `watch` mode
 * @property {Boolean} [memoryFs=false] - Compiles to {@link https://webpack.github.io/docs/node.js-api.html#compile-to-memory memory}
 * @property {Boolean} [json=false] - Saves `stats` object to JSON file
 * @property {WebpackFailOptions} [failOn] - In case when `failOn` is `Boolean` then all nested `failOn.*` properties will be filled out with that value
 * @property {Number} [maxWorkers=require('os').cpus().length] - Number of concurrent workers
 * @property {Boolean} [silent=false] - Suppress all output
 */

/**
 * @external WebpackOptions
 * @typedef {Object} WebpackOptions
 * @see {@link https://webpack.github.io/docs/configuration.html#configuration-object-content}
 */

/**
 * @typedef {Object|Boolean} WebpackFailOptions
 * @property {Boolean} [errors=false] - Fails build if some `stats` objects have some errors
 * @property {Boolean} [warnings=false] - Fails build if some `stats` objects have some warnings
 */

/**
 * @external WebpackCompiler
 * @typedef {Object} WebpackCompiler
 * @see {@link https://github.com/webpack/webpack/blob/master/lib/Compiler.js}
 */

/**
 * @external WebpackStats
 * @typedef {Object} WebpackStats
 * @see {@link https://webpack.github.io/docs/node.js-api.html#stats}
 */

/**
 * @module webpack-cluster
 */

/**
 * @type {CompilerAdapter}
 */
export default CompilerAdapter;

/**
 * @type {Object}
 */
export {
    /**
     * @type {CompilerAdapter}
     */
    CompilerAdapter
};
