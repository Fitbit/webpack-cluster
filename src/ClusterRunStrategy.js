import {
    get,
    uniq,
    isError
} from 'lodash';
import {
    ConfigFinder
} from 'webpack-config';
import ConfigBuilder from './ConfigBuilder';
import ClusterCompilerStrategy from './ClusterCompilerStrategy';
import CompilerStrategyError from './CompilerStrategyError';
import CompilerStrategyStats from './CompilerStrategyStats';
import CompilerStrategyResult from './CompilerStrategyResult';
import STRATEGY_EVENTS from './CompilerStrategyEvents';
import FORK_EVENTS from './ClusterForkEvents';

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
        return Promise.all(patterns.map(pattern => this.find(pattern)));
    }

    /**
     * @protected
     * @param {String} pattern
     * @param {String} filename
     * @param {Function} callback
     * @returns {Promise<CompilerStrategyStats,Error>}
     */
    compile(pattern, filename, callback) {
        return this.createFork(filename).then(worker => {
            this.emit(STRATEGY_EVENTS.compile, filename);

            worker.send({
                type: FORK_EVENTS.compile,
                data: {
                    filename,
                    compilerOptions: this.compilerOptions,
                    webpackOptions: this.webpackOptionsFor(pattern)
                }
            });

            return new Promise((resolve, reject) => {
                worker.on(FORK_EVENTS.message, message => {
                    const data = get(message, 'data', {});

                    switch (message.type) {
                        case FORK_EVENTS.progress: {
                            const ratio = get(data, 'ratio', 0),
                                status = get(data, 'status', '');

                            this.emit(STRATEGY_EVENTS.progress, filename, ratio, status);

                            break;
                        }

                        case FORK_EVENTS.done: {
                            let stats = get(data, 'stats', {});

                            stats = new CompilerStrategyStats(stats);

                            this.emit(STRATEGY_EVENTS.done, filename, stats);

                            callback(null, stats);
                            resolve(stats);
                            break;
                        }

                        case FORK_EVENTS.fail: {
                            let err = get(data, 'err');

                            if (CompilerStrategyError.isError(err)) {
                                err = CompilerStrategyError.createError(err);
                            }

                            this.emit(STRATEGY_EVENTS.fail, filename, err);

                            callback(err);
                            reject(err);
                            break;
                        }
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
            return this.throttle(result.files, filename => {
                return this.compile(result.pattern, filename, callback).then(stats => {
                    result.done.set(filename, stats);

                    return Promise.resolve(stats);
                }).catch(err => {
                    if (isError(err)) {
                        result.fail.set(filename, err);
                    }

                    return Promise.reject(err);
                });
            });
        })).then(() => this.done(results).then(() => this.failOn(results))).catch(err => Promise.reject(err));
    }

    /**
     * @protected
     * @param {CompilerStrategyResult[]} results
     * @returns {Promise}
     */
    done(results) {
        let fatalErrors = [],
            errors = [],
            warnings = [];

        results.forEach(result => {
            result.files.forEach(filename => {
                if (result.done.has(filename)) {
                    this.emit(STRATEGY_EVENTS.stats, filename, result.done.get(filename));
                }

                if (result.fail.has(filename)) {
                    this.emit(STRATEGY_EVENTS.fatalError, filename, result.fail.get(filename));
                }
            });

            result.done.forEach((stats, filename) => {
                if (stats.hasErrors) {
                    errors.push(filename);
                } else if (stats.hasWarnings) {
                    warnings.push(filename);
                }
            });

            result.fail.forEach((err, filename) => {
                fatalErrors.push(filename);
            });
        });

        fatalErrors = uniq(fatalErrors);
        errors = uniq(errors);
        warnings = uniq(warnings);

        this.emit(STRATEGY_EVENTS.fatalErrors, fatalErrors);
        this.emit(STRATEGY_EVENTS.errors, errors);
        this.emit(STRATEGY_EVENTS.warnings, warnings);

        return Promise.resolve(results);
    }

    /**
     * @protected
     * @param {CompilerStrategyResult[]} results
     * @returns {Promise}
     */
    failOn(results) {
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

        return this.openCluster().then(() => {
            return this.findAll(...patterns)
                .then(results => this.compileAll(results, callback));
        }).then(stats => this.closeCluster().then(() => Promise.resolve(stats)))
            .catch(err => this.closeCluster().then(() => Promise.reject(err)));
    }
}

export default ClusterRunStrategy;
