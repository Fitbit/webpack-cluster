import {
    cpus
} from 'os';

/**
 * @typedef {Object} CompilerAdapterOptions
 * @property {Number} [concurrency=`require('os').cpus().length`] - Maximum number of concurrent compilers
 * @property {CompilerFailureOptions} [failures] - Sets failure options
 * @property {Boolean} [dryRun=false] - Enables compiling to {@link https://webpack.js.org/api/node/#compiling-to-memory memory}
 */

/**
 * @typedef {Object|Boolean} CompilerFailureOptions
 * @property {Boolean} [sysErrors=true] - Fails build if compiler throws any internal errors
 * @property {Boolean} [errors=true] - Fails build if `stats` object has any errors
 * @property {Boolean} [warnings=false] - Fails build if `stats` object has any warnings
 */

/**
 * @type {CompilerAdapterOptions}
 */
export default {
    concurrency: cpus().length,
    silent: false,
    colors: true,
    failures: {
        sysErrors: true,
        errors: true,
        warnings: false,
    },
    watchOptions: {},
    dryRun: false
};
