import {
    get
} from 'lodash';
import {
    ConfigFinder
} from 'webpack-config';
import ConfigBuilder from './ConfigBuilder';
import ClusterCompilerStrategy from './ClusterCompilerStrategy';
import CompilerStrategyProgress from './CompilerStrategyProgress';
import CompilerStrategyStats from './CompilerStrategyStats';
import CompilerStrategyResult from './CompilerStrategyResult';
import STRATEGY_EVENTS from './CompilerStrategyEvents';
import FORK_EVENTS from './ClusterForkEvents';
import FORK_PROPERTIES from './ClusterForkProperties';

/**
 * @private
 * @type {String}
 */
const WORKER_PATH = require.resolve('./ClusterRunWorker');

/**
 * @class
 * @extends {ClusterCompilerStrategy}
 */
class ClusterRunStrategy extends ClusterCompilerStrategy {
    /**
     * @override
     */
    get workerPath() {
        return WORKER_PATH;
    }

    /**
     * @protected
     * @param {String} pattern
     * @returns {Object}
     */
    webpackOptionsFor(pattern) {
        return new ConfigBuilder()
            .reset()
            .merge(this.webpackOptions)
            .pattern(pattern)
            .build();
    }

    /**
     * @protected
     * @param {String} pattern
     * @returns {Promise<CompilerStrategyResult>}
     */
    find(pattern) {
        const files = ConfigFinder.INSTANCE.findConfigs(pattern);

        return Promise.resolve(new CompilerStrategyResult(pattern, files));
    }

    /**
     * @protected
     * @param {...String} patterns
     * @returns {Promise<CompilerStrategyResult[]>}
     */
    findAll(...patterns) {
        return Promise.all(patterns.map(pattern => this.find(pattern))).then(results => {
            this.emit(STRATEGY_EVENTS.find, results);

            return Promise.resolve(results);
        });
    }

    /**
     * @protected
     * @param {String} filename
     * @param {String} pattern
     * @param {Function} callback
     * @returns {Promise<CompilerStrategyStats,Error>}
     */
    compile(filename, pattern, callback) {
        this.emit(STRATEGY_EVENTS.compilationStart, filename);

        return this.createFork(filename).then(worker => {
            return new Promise(resolve => {
                worker.on(FORK_EVENTS.message, message => {
                    const data = get(message, FORK_PROPERTIES.data, {});

                    switch (message[FORK_PROPERTIES.type]) {
                        case FORK_EVENTS.progress: {
                            const progress = CompilerStrategyProgress.fromJSON(data);

                            this.emit(STRATEGY_EVENTS.compilationProgress, progress);
                            break;
                        }

                        case FORK_EVENTS.stats: {
                            const stats = CompilerStrategyStats.fromJSON(data);

                            this.emit(STRATEGY_EVENTS.compilationDone, stats);

                            callback(stats.fatalError, stats.raw);
                            resolve(stats);
                            break;
                        }
                    }
                });

                worker.send({
                    [FORK_PROPERTIES.type]: FORK_EVENTS.compile,
                    [FORK_PROPERTIES.data]: {
                        [FORK_PROPERTIES.filename]: filename,
                        [FORK_PROPERTIES.compilerOptions]: this.compilerOptions,
                        [FORK_PROPERTIES.webpackOptions]: this.webpackOptionsFor(pattern)
                    }
                });
            });
        });
    }

    /**
     * @protected
     * @param {CompilerStrategyResult[]} results
     * @param {Function} callback
     * @returns {Promise<CompilerStrategyResult[]>}
     */
    compileAll(results, callback) {
        return Promise.all(results.map(result => {
            return this.throttle(result.files, filename => this.compile(filename, result.pattern, callback).then(stats => {
                result.stats.set(filename, stats);

                return Promise.resolve(stats);
            }));
        })).then(() => this.done(results), () => this.done(results));
    }

    /**
     * @private
     * @param {CompilerStrategyResult[]} results
     * @returns {Promise}
     */
    done(results) {
        results.forEach(result => {
            result.files.forEach(filename => {
                const stats = result.stats.get(filename);

                this.emit(STRATEGY_EVENTS.compilationStats, stats);
            });
        });

        this.emit(STRATEGY_EVENTS.done, results);

        try {
            this.emit(STRATEGY_EVENTS.failOn, this.failOnOptions, results);

            return Promise.resolve(results);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * @override
     */
    execute(patterns, callback) {
        this.emit(STRATEGY_EVENTS.run, patterns);

        return this.beforeExecute().then(() => {
            return this.findAll(...patterns)
                .then(results => this.compileAll(results, callback));
        }).then(results => this.afterExecute().then(() => Promise.resolve(results)))
            .catch(err => this.afterExecute().then(() => Promise.reject(err)));
    }
}

export default ClusterRunStrategy;
