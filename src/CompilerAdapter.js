import {
    isBoolean,
    isError
} from 'lodash';
import PromisePool from './PromisePool';
import ForkPromise from './ForkPromise';
import CompilerResult from './CompilerResult';
import DEFAULT_OPTIONS from './CompilerAdapterOptions';
import {
    PROCESS_SIGINT
} from './Events';
import {
    findFiles,
    watchFiles
} from './FsUtil';
import {
    invalidError
} from './CompilerErrorFactory';

/**
 * @private
 * @type {WeakMap}
 */
const OPTIONS = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const POOL = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const WATCHERS = new WeakMap();

/**
 * @callback CompilerAdapterCallback
 * @returns {void}
 */
const DEFAULT_CALLBACK = () => {};

/**
 * @private
 * @type {String}
 */
const WORKER_PATH = require.resolve('./CompilerWorker');

/**
 * @class
 */
class CompilerAdapter {
    /**
     * @constructor
     * @param {CompilerAdapterOptions} [options]
     */
    constructor(options = {}) {
        OPTIONS.set(this, Object.assign({}, DEFAULT_OPTIONS, options));

        /* istanbul ignore next */
        process.on(PROCESS_SIGINT, () => this.closeAll());
    }

    /**
     * @readonly
     * @type {CompilerAdapterOptions}
     */
    get options() {
        return OPTIONS.get(this);
    }

    /**
     * @readonly
     * @private
     * @type {CompilerFailureOptions}
     */
    get failures() {
        let options = this.options.failures;

        if (isBoolean(options)) {
            options = {
                sysErrors: options,
                warnings: options,
                errors: options
            };
        }

        const { sysErrors, warnings, errors } = options;

        return {
            sysErrors,
            warnings,
            errors
        };
    }

    /**
     * @private
     * @readonly
     * @type {PromisePool}
     */
    get pool() {
        if (!POOL.has(this)) {
            POOL.set(this, new PromisePool(this.options.concurrency));
        }

        return POOL.get(this);
    }

    /**
     * @private
     * @readonly
     * @type {Set<FSWatcher>}
     */
    get watchers() {
        if (!WATCHERS.has(this)) {
            WATCHERS.set(this, new Set([]));
        }

        return WATCHERS.get(this);
    }

    /**
     * @internal
     * @returns {Promise}
     */
    closeAll() {
        return this.closePool()
            .then(() => this.closeWatchers())
            .then(() => CompilerAdapter.closeMaster());
    }

    /**
     * @private
     * @returns {Promise}
     */
    closePool() {
        return this.pool.closeAll().then(() => {
            this.pool.clear();
        });
    }

    /**
     * @private
     * @returns {Promise}
     */
    closeWatchers() {
        const promises = Array.from(this.watchers.values()).map(watcher => {
            watcher.close();

            return Promise.resolve();
        });

        return Promise.all(promises).then(() => {
            this.watchers.clear();
        });
    }

    /**
     * @private
     * @param {Object} options
     * @param {CompilerAdapterCallback} [callback]
     * @returns {Promise}
     */
    fork(options, callback) {
        return ForkPromise.fork(Object.assign({}, this.options, options), callback);
    }

    /**
     * @private
     * @param {Object} data
     * @returns {Promise<String|Error>}
     */
    done(data) {
        const result = CompilerResult.from(data),
            failures = this.failures,
            hasError = (failures.sysErrors && result.hasSysErrors) ||
                (failures.errors && result.hasErrors) ||
                (failures.warnings && result.hasWarnings);

        return Promise.resolve(hasError ? invalidError(result.filename) : result.filename);
    }

    /**
     * Builds the bundles
     * @param {String[]} patterns
     * @param {CompilerAdapterCallback} [callback]
     * @returns {Promise<String[]|Error[]>}
     */
    run(patterns, callback = DEFAULT_CALLBACK) {
        return CompilerAdapter.setupMaster().then(() => {
            return findFiles(patterns).then(files => {
                files.forEach(filename => {
                    this.pool.set(filename, () => this.fork({
                        filename,
                        watch: false
                    }, callback));
                });

                return this.pool.waitAll().then(results => {
                    return Promise.all(results.map(result => this.done(result)));
                });
            });
        }).then(results => this.closeAll().then(() => {
            const errors = results.filter(isError);

            return errors.length > 0 ? Promise.reject(errors) : Promise.resolve(results);
        }));
    }

    /**
     * Builds the bundles then starts the watcher, which rebuilds bundles whenever their source files change
     * @param {String[]} patterns
     * @param {CompilerAdapterCallback} [callback]
     * @returns {Promise}
     */
    watch(patterns, callback = DEFAULT_CALLBACK) {
        return CompilerAdapter.setupMaster().then(() => {
            return watchFiles(patterns, filename => {
                Promise.resolve().then(() => {
                    return this.pool.has(filename) ? this.pool.stop(filename) : Promise.resolve();
                }).then(() => {
                    this.pool.set(filename, () => this.fork({
                        filename,
                        watch: true
                    }, callback));

                    return this.pool.start(filename);
                });
            }).then(watchers => {
                watchers.forEach(watcher => this.watchers.add(watcher));

                return Promise.resolve([]);
            });
        });
    }

    /**
     * @private
     * @static
     * @returns {Promise}
     */
    static setupMaster() {
        return ForkPromise.setupMaster({
            exec: WORKER_PATH
        });
    }

    /**
     * @private
     * @static
     * @returns {Promise}
     */
    static closeMaster() {
        return ForkPromise.closeMaster();
    }
}

export default CompilerAdapter;
