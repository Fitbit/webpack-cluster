import {
    get
} from 'lodash';
import {
    cpus
} from 'os';
import throat from 'throat';
import cluster from 'cluster';
import CompilerStrategy from './CompilerStrategy';

/**
 * @private
 * @type {Number}
 */
const DEFAULT_MAX_WORKERS = cpus().length;

/**
 * @private
 * @type {WeakMap}
 */
const WORKERS = new WeakMap();

/**
 * @class
 * @extends {CompilerStrategy}
 */
class ClusterCompilerStrategy extends CompilerStrategy {
    /**
     * @constructor
     * @param {CompilerOptions} [compilerOptions={}]
     * @param {WebpackOptions} [webpackOptions={}]
     */
    constructor(compilerOptions = {}, webpackOptions = {}) {
        super(compilerOptions, webpackOptions);

        this.maxWorkers = get(compilerOptions, 'maxWorkers', DEFAULT_MAX_WORKERS);
        this.isConnected = false;
        this.failOnOptions = get(compilerOptions, 'failOn', {});

        WORKERS.set(this, new Map());

        process.on('SIGINT', () => this.afterExecute());
        process.on('SIGTERM', () => this.afterExecute());
    }

    /**
     * @abstract
     * @type {String}
     */
    get workerPath() {}

    /**
     * @protected
     * @returns {Map<String,Worker>}
     */
    get workers() {
        return WORKERS.get(this);
    }

    /**
     * @protected
     * @returns {Promise}
     */
    beforeExecute() {
        return new Promise(resolve => {
            if (!this.isConnected) {
                cluster.setupMaster({
                    exec: this.workerPath
                });

                this.isConnected = true;
            }

            resolve();
        });
    }

    /**
     * @protected
     * @returns {Promise}
     */
    afterExecute() {
        return new Promise(resolve => {
            if (this.isConnected) {
                cluster.disconnect(resolve);

                this.isConnected = false;
            } else {
                resolve();
            }
        });
    }

    /**
     * @protected
     * @param {String} filename
     * @returns {Promise<Worker>}
     */
    createFork(filename) {
        return new Promise(resolve => {
            if (!this.workers.has(filename)) {
                const worker = cluster.fork();

                worker.once('online', () => {
                    this.workers.set(filename, worker);

                    resolve(worker);
                });
            } else {
                resolve(this.workers.get(filename));
            }
        });
    }

    /**
     * @protected
     * @param {String} filename
     * @returns {Promise}
     */
    closeFork(filename) {
        return new Promise(resolve => {
            if (this.workers.has(filename) && this.isConnected) {
                const worker = this.workers.get(filename);

                worker.once('disconnect', () => {
                    this.workers.delete(filename);

                    resolve();
                });

                worker.kill();
            } else {
                resolve();
            }
        });
    }

    /**
     * @protected
     * @param {Array} array
     * @param {Function} callback
     * @returns {Promise}
     */
    throttle(array, callback) {
        return Promise.all(array.map(throat(this.maxWorkers, callback)));
    }
}

export default ClusterCompilerStrategy;
