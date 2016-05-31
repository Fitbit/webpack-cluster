import {
    isString,
    isFunction,
    noop
} from 'lodash';
import webpack from 'webpack';
import MemoryFs from 'memory-fs';
import StatsWriterPlugin from 'webpack-stats-writer-plugin';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';

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
            const memoryFs = compilerOptions.memoryFs === true,
                json = compilerOptions.json === true,
                filename = webpackOptions.filename,
                progress = compilerOptions.progress,
                progressCallback = compilerOptions.progressCallback || noop;

            if (memoryFs) {
                compiler.outputFileSystem = new MemoryFs();
            }

            if (json) {
                compiler.apply(new StatsWriterPlugin());
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
