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

/**
 * @private
 * @type {WeakMap}
 */
const FILENAME = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const STATS = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const FATAL_ERROR = new WeakMap();

/**
 * @class
 */
class CompilerStrategyStats {
    /**
     * @constructor
     * @param {String} filename
     * @param {Object} stats
     * @param {Error} fatalError
     */
    constructor(filename, stats = null, fatalError = null) {
        FILENAME.set(this, filename);
        STATS.set(this, stats);
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
    get stats() {
        return STATS.get(this);
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
        return result(this.stats, 'hasErrors', false);
    }

    /**
     * @type {Boolean}
     */
    get hasWarnings() {
        return result(this.stats, 'hasWarnings', false);
    }

    /**
     * @override
     * @param {Object} [options]s
     * @returns {String}
     */
    toString(options) {
        if (!isPlainObject(options)) {
            options = get(this.stats, 'compilation.options.stats', STATS_OPTIONS);
        }

        let toString;

        if (isObject(this.stats)) {
            if (isFunction(this.stats.toString)) {
                toString = this.stats.toString(options);
            } else if (isString(this.stats.toString)) {
                toString = this.stats.toString;
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
            filename: this.filename,
            fatalError: this.fatalError,
            stats: {
                hasErrors: this.hasErrors,
                hasWarnings: this.hasWarnings,
                toString: this.toString()
            }
        };
    }

    /**
     * @param {Object} obj
     * @returns {CompilerStrategyStats}
     */
    static fromJSON(obj) {
        const filename = get(obj, 'filename'),
            stats = get(obj, 'stats');

        let fatalError = get(obj, 'fatalError');

        if (CompilerStrategyError.isError(fatalError)) {
            fatalError = CompilerStrategyError.fromJSON(fatalError);
        }

        return new CompilerStrategyStats(filename, stats, fatalError);
    }
}

export default CompilerStrategyStats;
