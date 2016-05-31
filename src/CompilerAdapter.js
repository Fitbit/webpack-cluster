import ClusterRunStrategy from './ClusterRunStrategy';
import ClusterWatchStrategy from './ClusterWatchStrategy';
import CompilerStrategyInvoker from './CompilerStrategyInvoker';
import CompilerStrategyEventsFactory from './CompilerStrategyEventsFactory';

/**
 * @private
 * @type {WeakMap}
 */
const COMPILER_OPTIONS = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const WEBPACK_OPTIONS = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const EVENTS = new WeakMap();

/**
 * @class
 */
class CompilerAdapter {
    /**
     * @constructor
     * @param {CompilerOptions} [compilerOptions={}]
     * @param {WebpackOptions} [webpackOptions={}]
     */
    constructor(compilerOptions = {}, webpackOptions = {}) {
        const events = CompilerStrategyEventsFactory.createEvents(compilerOptions);

        COMPILER_OPTIONS.set(this, compilerOptions);
        WEBPACK_OPTIONS.set(this, webpackOptions);
        EVENTS.set(this, events);
    }

    /**
     * Gets current {@link CompilerOptions}
     * @readonly
     * @type {CompilerOptions}
     */
    get compilerOptions() {
        return COMPILER_OPTIONS.get(this);
    }

    /**
     * Gets current {@link WebpackOptions}
     * @readonly
     * @type {WebpackOptions}
     */
    get webpackOptions() {
        return WEBPACK_OPTIONS.get(this);
    }

    /**
     * @private
     * @readonly
     * @type {Object<String,Function>}
     */
    get events() {
        return EVENTS.get(this);
    }

    /**
     * @private
     * @param {CompilerStrategy} strategy
     * @param {String|String[]} patterns
     * @param {Function} [callback]
     * @returns {Promise}
     */
    execute(strategy, patterns, callback) {
        const invoker = new CompilerStrategyInvoker(strategy, this.events);

        return invoker.invoke(patterns, callback);
    }

    /**
     * Builds the bundle(s)
     * @param {String|String[]} patterns
     * @param {Function} [callback]
     * @returns {Promise}
     */
    run(patterns, callback) {
        const strategy = new ClusterRunStrategy(this.compilerOptions, this.webpackOptions);

        return this.execute(strategy, patterns, callback);
    }

    /**
     * Builds the bundle(s) then starts the watcher, which rebuilds bundles whenever their source files change
     * @param {String|String[]} patterns
     * @param {Function} [callback]
     * @returns {Promise}
     */
    watch(patterns, callback) {
        const strategy = new ClusterWatchStrategy(this.compilerOptions, this.webpackOptions);

        return this.execute(strategy, patterns, callback);
    }
}

export default CompilerAdapter;
