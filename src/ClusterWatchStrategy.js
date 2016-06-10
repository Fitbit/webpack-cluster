import {
    merge
} from 'lodash';
import {
    join,
    resolve as resolvePath,
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
import chokidar from 'chokidar';
import minimatch from 'minimatch';
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

        WATCHERS.set(this, []);
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
     * @returns {FSWatcher[]}
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

        return this.watch(join(cwd, '**/*.*'), {}, filename => {
            if (!minimatch(filename, pattern)) {
                this.findAll(join(dirname(filename), basename(pattern))).then(results => this.compileAll(results, callback));
            }
        });
    }

    /**
     * @override
     */
    compile(filename, pattern, callback) {
        this.queue.set(filename, true);

        return this.closeFork(filename).then(() => super.compile(filename, pattern, callback).then(stats => {
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

        return this.beforeExecute().then(() => {
            return Promise.all(patterns.map(x => resolvePath(x)).map(pattern => {
                return Promise.all([
                    this.mainWatch(pattern, callback),
                    this.closestWatch(pattern, callback)
                ]);
            }));
        }).catch(err => this.afterExecute().then(() => Promise.reject(err)));
    }
}

export default ClusterWatchStrategy;
