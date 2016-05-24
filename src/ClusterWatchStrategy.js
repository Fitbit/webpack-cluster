import {
    isError
} from 'lodash';
import {
    join,
    dirname,
    basename
} from 'path';
import {
    Glob
} from 'glob';
import {
    ConfigFinder
} from 'webpack-config';
import glob2base from 'glob2base';
import gaze from 'gaze';
import ClusterRunStrategy from './ClusterRunStrategy';
import CompilerStrategyResult from './CompilerStrategyResult';
import STRATEGY_EVENTS from './CompilerStrategyEvents';

/**
 * @private
 * @type {String}
 */
const WORKER_PATH = require.resolve('./ClusterWatchWorker');

/**
 * @private
 * @type {WeakMap}
 */
const WATCHERS = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const QUEUE = new WeakMap();

/**
 * @class
 * @extends {ClusterRunStrategy}
 */
class ClusterWatchStrategy extends ClusterRunStrategy {
    /**
     * @constructor
     * @param {CompilerOptions} [compilerOptions={}]
     * @param {WebpackOptions} [webpackOptions={}]
     */
    constructor(compilerOptions = {}, webpackOptions = {}) {
        super(compilerOptions, webpackOptions);

        WATCHERS.set(this, new Map());
        QUEUE.set(this, new Map());
    }

    /**
     * @override
     */
    get workerPath() {
        return WORKER_PATH;
    }

    /**
     * @private
     * @returns {Map<String,Gaze>}
     */
    get watchers() {
        return WATCHERS.get(this);
    }

    /**
     * @private
     * @returns {Map<String,Boolean>}
     */
    get queue() {
        return QUEUE.get(this);
    }

    /**
     * @override
     */
    closeCluster() {
        return super.closeCluster().then(() => this.closeWatchers());
    }

    /**
     * @private
     * @param {String} pattern
     * @param {Function} callback
     * @returns {Promise}
     */
    openWatcher(pattern, callback) {
        return new Promise((resolve, reject) => {
            gaze(pattern, (err, watcher) => {
                this.watchers.set(pattern, watcher);

                watcher.on('all', (event, filename) => {
                    if (event !== 'deleted') {
                        callback(filename);
                    }
                });

                if (isError(err)) {
                    reject(err);
                } else {
                    resolve(watcher);
                }
            });
        });
    }

    /**
     * @private
     * @returns {Promise}
     */
    closeWatchers() {
        let promises = [];

        for (const watcher of this.watchers.values()) {
            promises.push(new Promise(resolve => {
                watcher.on('end', resolve);
            }));

            watcher.close(true);
        }

        return Promise.all(promises);
    }

    /**
     * @private
     * @param {String} pattern
     * @param {Function} [callback]
     * @returns {Promise}
     */
    mainWatch(pattern, callback) {
        return this.openWatcher(pattern, filename => {
            const results = [];

            results.push(new CompilerStrategyResult(pattern, [ filename ]));

            this.compileAll(results, callback);
        });
    }

    /**
     * @private
     * @param {String} pattern
     * @param {Function} [callback]
     * @returns {Promise}
     */
    closestWatch(pattern, callback) {
        const cwd = glob2base(new Glob(pattern));

        return this.openWatcher(join(cwd, '**/*.js'), filename => {
            this.findAll(join(dirname(filename), basename(pattern))).then(results => this.compileAll(results, callback));
        });
    }

    /**
     * @override
     */
    compile(pattern, filename, callback) {
        this.queue.set(filename, pattern);

        return this.closeFork(filename).then(() => super.compile(pattern, filename, callback).then(stats => {
            this.queue.delete(filename);

            return Promise.resolve(stats);
        }));
    }

    /**
     * @override
     */
    find(pattern) {
        const files = ConfigFinder.INSTANCE.findClosestConfigs(pattern)
            .filter(filename => !this.queue.has(filename));

        return Promise.resolve(new CompilerStrategyResult(pattern, files));
    }

    /**
     * @override
     */
    execute(patterns, callback) {
        this.emit(STRATEGY_EVENTS.watch, patterns);

        return this.openCluster().then(() => {
            return Promise.all(patterns.map(pattern => {
                return Promise.all([
                    this.mainWatch(pattern, callback),
                    this.closestWatch(pattern, callback)
                ]);
            }));
        }).catch(err => this.closeCluster().then(() => Promise.reject(err)));
    }
}

export default ClusterWatchStrategy;
