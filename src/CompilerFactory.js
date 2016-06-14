import {
    isString,
    isFunction,
    noop
} from 'lodash';
import webpack from 'webpack';
import MemoryFs from 'memory-fs';
import StatsWriterWebpackPlugin from 'stats-writer-webpack-plugin';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';
import COMPILER_PROPERTIES from './CompilerProperties';
import WEBPACK_PROPERTIES from './CompilerWebpackProperties';

/**
 * @class
 */
class CompilerFactory {
    /**
     * @param {CompilerOptions} compilerOptions
     * @param {WebpackOptions} webpackOptions
     * @returns {WebpackCompiler}
     */
    static createCompiler(compilerOptions, webpackOptions) {
        const compiler = webpackOptions && webpack(webpackOptions);

        if (compiler) {
            const memoryFs = compilerOptions[COMPILER_PROPERTIES.memoryFs] === true,
                json = compilerOptions[COMPILER_PROPERTIES.json] === true,
                filename = webpackOptions[WEBPACK_PROPERTIES.filename],
                progress = compilerOptions[COMPILER_PROPERTIES.progress],
                progressCallback = webpackOptions[WEBPACK_PROPERTIES.progressCallback] || noop;

            if (memoryFs) {
                compiler.outputFileSystem = new MemoryFs();
            }

            if (json) {
                compiler.apply(new StatsWriterWebpackPlugin());
            }

            if (progress && isString(filename) && isFunction(progressCallback)) {
                compiler.apply(new ProgressPlugin((p, msg) => {
                    progressCallback(filename, p, msg);
                }));
            }
        }

        return compiler;
    }
}

export default CompilerFactory;
