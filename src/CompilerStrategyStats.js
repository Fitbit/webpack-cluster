import {
    result,
    get,
    isPlainObject,
    isObject,
    isString,
    isFunction,
    isError
} from 'lodash';
import CompilerStrategyError from './CompilerStrategyError';
import STATS_OPTIONS from './StatsOptions';
import WEBPACK_PROPERTIES from './CompilerWebpackProperties';

/**
 * @private
 * @type {WeakMap}
 */
const FILENAME = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const RAW = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const FATAL_ERROR = new WeakMap();

/**
 * @private
 * @type {Object<String,String>}
 */
const STATS_PROPERTIES = {
    filename: 'filename',
    fatalError: 'fatalError',
    hasErrors: 'hasErrors',
    hasWarnings: 'hasWarnings',
    toString: 'toString',
    statsOptions: `compilation.options.${WEBPACK_PROPERTIES.stats}`
};

/**
 * @class
 */
class CompilerStrategyStats {
    /**
     * @constructor
     * @param {String} filename
     * @param {Object} raw
     * @param {Error} fatalError
     */
    constructor(filename, raw, fatalError) {
        FILENAME.set(this, filename);
        RAW.set(this, raw);
        FATAL_ERROR.set(this, fatalError);
    }

    /**
     * @type {String}
     */
    get filename() {
        return FILENAME.get(this);
    }

    /**
     * @type {Object}
     */
    get raw() {
        return RAW.get(this);
    }

    /**
     * @type {Error}
     */
    get fatalError() {
        return FATAL_ERROR.get(this);
    }

    /**
     * @type {Boolean}
     */
    get hasFatalError() {
        return isError(this.fatalError);
    }

    /**
     * @type {Boolean}
     */
    get hasErrors() {
        return result(this.raw, STATS_PROPERTIES.hasErrors, false);
    }

    /**
     * @type {Boolean}
     */
    get hasWarnings() {
        return result(this.raw, STATS_PROPERTIES.hasWarnings, false);
    }

    /**
     * @override
     * @param {Object} [options]s
     * @returns {String}
     */
    toString(options) {
        if (!isPlainObject(options)) {
            options = get(this.raw, STATS_PROPERTIES.statsOptions, STATS_OPTIONS);
        }

        let toString;

        if (isObject(this.raw)) {
            if (isFunction(this.raw.toString)) {
                toString = this.raw.toString(options);
            } else if (isString(this.raw[STATS_PROPERTIES.toString])) {
                toString = this.raw[STATS_PROPERTIES.toString];
            }
        }

        if (!isString(toString)) {
            toString = '';
        }

        return toString;
    }

    /**
     * @returns {Object}
     */
    toJSON() {
        return {
            [STATS_PROPERTIES.filename]: this.filename,
            [STATS_PROPERTIES.fatalError]: this.fatalError,
            [WEBPACK_PROPERTIES.stats]: {
                [STATS_PROPERTIES.hasErrors]: this.hasErrors,
                [STATS_PROPERTIES.hasWarnings]: this.hasWarnings,
                [STATS_PROPERTIES.toString]: this.toString()
            }
        };
    }

    /**
     * @param {Object} obj
     * @returns {CompilerStrategyStats}
     */
    static fromJSON(obj) {
        if (obj instanceof CompilerStrategyStats) {
            return obj;
        } else {
            const filename = get(obj, STATS_PROPERTIES.filename),
                stats = get(obj, WEBPACK_PROPERTIES.stats);

            let fatalError = get(obj, STATS_PROPERTIES.fatalError);

            if (CompilerStrategyError.isError(fatalError)) {
                fatalError = CompilerStrategyError.fromJSON(fatalError);
            }

            return new CompilerStrategyStats(filename, stats, fatalError);
        }
    }
}

export default CompilerStrategyStats;
