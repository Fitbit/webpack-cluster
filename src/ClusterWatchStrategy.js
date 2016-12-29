import {
    merge
} from 'lodash';
import {
    resolve as resolvePath
} from 'path';
import chokidar from 'chokidar';
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

        WATCHERS.set(this, []);
    }

    /**
     * @override
     */
    get workerPath() {
        return WORKER_PATH;
    }

    /**
     * @private
     * @returns {FSWatcher[]}
     */
    get watchers() {
        return WATCHERS.get(this);
    }

    /**
     * @override
     */
    afterExecute() {
        return super.afterExecute().then(() => {
            return Promise.all(this.watchers.map(watcher => {
                watcher.close();

                return Promise.resolve();
            }));
        });
    }

    /**
     * @private
     * @param {String} pattern
     * @param {Object} options
     * @param {Function} callback
     * @returns {Promise}
     */
    watch(pattern, options, callback) {
        return new Promise(resolve => {
            const watcher = chokidar.watch(pattern, merge({}, options, {
                ignoreInitial: true,
                atomic: true,
                ignorePermissionErrors: true
            })).on('ready', () => {
                this.watchers.push(watcher);

                resolve(watcher);
            }).on('add', callback)
                .on('change', callback);
        });
    }

    /**
     * @private
     * @param {String} pattern
     * @param {Function} [callback]
     * @returns {Promise}
     */
    mainWatch(pattern, callback) {
        return this.watch(pattern, {}, filename => {
            const results = [];

            results.push(new CompilerStrategyResult(pattern, [ filename ]));

            this.compileAll(results, callback).catch(() => {});
        });
    }

    /**
     * @override
     */
    compile(filename, pattern, callback) {
        return this.closeFork(filename).then(() => super.compile(filename, pattern, callback));
    }

    /**
     * @override
     */
    execute(patterns, callback) {
        this.emit(STRATEGY_EVENTS.watch, patterns);

        return this.beforeExecute().then(() => {
            return Promise.all(patterns.map(x => resolvePath(x)).map(pattern => {
                return this.mainWatch(pattern, callback);
            }));
        }).catch(err => this.afterExecute().then(() => Promise.reject(err)));
    }
}

export default ClusterWatchStrategy;
