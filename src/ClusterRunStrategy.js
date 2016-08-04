import {
    get,
    uniq,
    isObject
} from 'lodash';
import {
    ConfigBuilder,
    finder
} from 'webpack-config';
import ClusterCompilerStrategy from './ClusterCompilerStrategy';
import CompilerStrategyProgress from './CompilerStrategyProgress';
import CompilerStrategyStats from './CompilerStrategyStats';
import CompilerStrategyResult from './CompilerStrategyResult';
import CompilerStrategyError from './CompilerStrategyError';
import STRATEGY_EVENTS from './CompilerStrategyEvents';
import STRATEGY_MESSAGES from './CompilerStrategyMessages';
import FORK_EVENTS from './ClusterForkEvents';
import FORK_PROPERTIES from './ClusterForkProperties';
import WEBPACK_PROPERTIES from './CompilerWebpackProperties';
import FAIL_ON_PROPERTIES from './CompilerFailOnProperties';

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
            .merge(this.webpackOptions)
            .merge({
                [WEBPACK_PROPERTIES.resolveCluster]: {
                    pattern: pattern
                }
            })
            .build();
    }

    /**
     * @protected
     * @param {...String} patterns
     * @returns {Promise<CompilerStrategyResult[]>}
     */
    findAll(...patterns) {
        return Promise.all(patterns.map(pattern => {
            const files = finder.findConfigs(pattern);

            return Promise.resolve(new CompilerStrategyResult(pattern, files));
        })).then(results => {
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
        })).then(() => this.doneOrFail(results), () => this.doneOrFail(results));
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

        return Promise.resolve(results);
    }

    /**
     * @private
     * @param {CompilerStrategyResult[]} results
     * @throws {CompilerStrategyError}
     * @returns {Promise}
     */
    fail(results) {
        const failOnErrors = isObject(this.failOnOptions) ? get(this.failOnOptions, FAIL_ON_PROPERTIES.errors, false) : this.failOnOptions,
            failOnWarnings = isObject(this.failOnOptions) ? get(this.failOnOptions, FAIL_ON_PROPERTIES.warnings, false) : this.failOnOptions;

        let fatalErrors = [],
            errors = [],
            warnings = [];

        results.forEach(result => {
            result.files.forEach(filename => {
                const stats = result.stats.get(filename);

                if (stats.hasFatalError) {
                    fatalErrors.push(filename);
                } else if (stats.hasErrors) {
                    errors.push(filename);
                } else if (stats.hasWarnings) {
                    warnings.push(filename);
                }
            });
        });

        fatalErrors = uniq(fatalErrors);
        errors = uniq(errors);
        warnings = uniq(warnings);

        if (fatalErrors.length > 0 || errors.length > 0 || warnings.length > 0) {
            let allErrors = [...fatalErrors];

            if (errors.length > 0 && failOnErrors === true) {
                allErrors.push(...errors);
            }

            if (warnings.length > 0 && failOnWarnings === true) {
                allErrors.push(...warnings);
            }

            allErrors = uniq(allErrors);

            if (allErrors.length > 0) {
                const err = new CompilerStrategyError(STRATEGY_MESSAGES.fatalError({
                    FILES: allErrors,
                    SIZE: allErrors.length
                }));

                return Promise.reject(err);
            }
        }

        return Promise.resolve(results);
    }

    /**
     * @private
     * @param {CompilerStrategyResult[]} results
     * @returns {Promise}
     */
    doneOrFail(results) {
        return this.done(results)
            .then(x => this.fail(x));
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
