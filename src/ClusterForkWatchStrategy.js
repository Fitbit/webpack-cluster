import {
    get,
    isError
} from 'lodash';
import ClusterForkRunStrategy from './ClusterForkRunStrategy';
import WEBPACK_PROPERTIES from './CompilerWebpackProperties';

/**
 * @class
 * @extends {ClusterForkRunStrategy}
 */
class ClusterForkWatchStrategy extends ClusterForkRunStrategy {
    /**
     * @override
     */
    execute(patterns, callback) {
        return this.loadConfig(patterns[0]).then(config => {
            return this.createCompiler(this.compilerOptions, this.webpackOptionsFor(config)).then(compiler => {
                const watchOptions = get(config, WEBPACK_PROPERTIES.watchOptions) || get(this.compilerOptions, WEBPACK_PROPERTIES.watchOptions) || {};

                return new Promise((resolve, reject) => {
                    compiler.watch(watchOptions, (err, stats) => {
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

export default ClusterForkWatchStrategy;
