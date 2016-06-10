import {
    isError
} from 'lodash';
import {
    supportsColor
} from 'chalk';
import {
    ConfigBuilder
} from 'webpack-config';
import CompilerStrategy from './CompilerStrategy';
import WEBPACK_PROPERTIES from './CompilerWebpackProperties';
import STATS_OPTIONS from './StatsOptions';
import CONFIG_HOOKS from './ConfigHooks';

/**
 * @private
 * @type {Boolean}
 */
const SUPPORTS_COLOR = supportsColor !== false;

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
        return new ConfigBuilder()
            .copyOf(config)
            .merge({
                [WEBPACK_PROPERTIES.stats]: {
                    colors: SUPPORTS_COLOR
                }
            })
            .defaults({
                [WEBPACK_PROPERTIES.stats]: STATS_OPTIONS
            })
            .merge(this.webpackOptions)
            .applyHooks(CONFIG_HOOKS)
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
