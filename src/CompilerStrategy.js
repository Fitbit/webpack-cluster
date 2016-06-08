import {
    ConfigLoader
} from 'webpack-config';
import EventEmitter from 'events';
import CompilerFactory from './CompilerFactory';
import STRATEGY_EVENTS from './CompilerStrategyEvents';
import WEBPACK_PROPERTIES from './CompilerWebpackProperties';

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
 * @class
 * @extends {EventEmitter}
 */
class CompilerStrategy extends EventEmitter {
    /**
     * @constructor
     * @param {CompilerOptions} [compilerOptions={}]
     * @param {WebpackOptions} [webpackOptions={}]
     */
    constructor(compilerOptions = {}, webpackOptions = {}) {
        super();

        webpackOptions[WEBPACK_PROPERTIES.progressCallback] = (filename, ratio, status) => this.progress(filename, ratio, status);

        COMPILER_OPTIONS.set(this, compilerOptions);
        WEBPACK_OPTIONS.set(this, webpackOptions);
    }

    /**
     * @protected
     * @param {String} filename
     * @param {Number} ratio
     * @param {String} status
     * @returns {void}
     */
    progress(filename, ratio, status) {
        this.emit(STRATEGY_EVENTS.progress, filename, ratio, status);
    }

    /**
     * @readonly
     * @type {CompilerOptions}
     */
    get compilerOptions() {
        return COMPILER_OPTIONS.get(this);
    }

    /**
     * @readonly
     * @type {WebpackOptions}
     */
    get webpackOptions() {
        return WEBPACK_OPTIONS.get(this);
    }

    /**
     * @protected
     * @param {String} filename
     * @returns {Promise<Config|ConfigList,Error>}
     */
    loadConfig(filename) {
        return new Promise((resolve, reject) => {
            try {
                const config = ConfigLoader.INSTANCE.loadConfig(filename);

                resolve(config);
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * @protected
     * @param {CompilerOptions} [compilerOptions={}]
     * @param {WebpackOptions} [webpackOptions={}]
     * @returns {Promise<WebpackCompiler,Error>}
     */
    createCompiler(compilerOptions, webpackOptions) {
        return new Promise((resolve, reject) => {
            try {
                resolve(CompilerFactory.createCompiler(compilerOptions, webpackOptions));
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * @abstract
     * @param {String[]} patterns
     * @param {Function} [callback]
     * @returns {Promise}
     */
    execute(patterns, callback) {} // eslint-disable-line no-unused-vars
}

export default CompilerStrategy;
