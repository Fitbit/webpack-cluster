import {
    isError
} from 'lodash';
import ConfigBuilder from './ConfigBuilder';
import CompilerStrategy from './CompilerStrategy';

/**
 * @class
 * @extends {CompilerStrategy}
 */
class ClusterForkRunStrategy extends CompilerStrategy {
    /**
     * @protected
     * @param {Config|ConfigList} config
     * @returns {Object}
     */
    webpackOptionsFor(config) {
        return new ConfigBuilder(config)
            .reset()
            .colors()
            .stats()
            .merge(this.webpackOptions)
            .applyHooks()
            .build();
    }

    /**
     * @override
     */
    execute(patterns, callback) {
        return this.loadConfig(patterns[0]).then(config => {
            return this.createCompiler(this.compilerOptions, this.webpackOptionsFor(config)).then(compiler => {
                return new Promise((resolve, reject) => {
                    compiler.run((err, stats) => {
                        callback(err, stats);

                        if (isError(err)) {
                            reject(err);
                        } else {
                            resolve(stats);
                        }
                    });
                });
            });
        });
    }
}

export default ClusterForkRunStrategy;
