import webpack from 'webpack';
import MemoryFs from 'memory-fs';

/**
 * @module CompilerUtil
 */

/**
 * @internal
 * @param {Object} config
 * @param {Object} options
 * @returns {Webpack}
 */
export function createCompiler(config, options) {
    const compiler = webpack(config);

    if (options.dryRun === true) {
        compiler.outputFileSystem = new MemoryFs();
    }

    return compiler;
}

/**
 * @internal
 * @param {Object} config
 * @param {Object} [options={}]
 * @param {Function} [callback]
 * @returns {void}
 */
export function compileConfig(config, options, callback) {
    const compiler = createCompiler(config, options);

    if (options.watch === true) {
        const watchOptions = (options.watchOptions || compiler.options.watchOptions) || {};

        compiler.watch(watchOptions, (err, stats) => callback(err, stats));
    } else {
        compiler.run((err, stats) => callback(err, stats));
    }
}
