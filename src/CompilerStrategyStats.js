import {
    result,
    get,
    isPlainObject,
    isString,
    isFunction
} from 'lodash';
import STATS_OPTIONS from './StatsOptions';

/**
 * @private
 * @type {WeakMap}
 */
const STATS = new WeakMap();

/**
 * @class
 */
class CompilerStrategyStats {
    /**
     * @constructor
     * @param {Object} stats
     */
    constructor(stats = {}) {
        STATS.set(this, stats);
    }

    /**
     * @type {Object}
     */
    get stats() {
        return STATS.get(this);
    }

    /**
     * @type {Boolean}
     */
    get hasErrors() {
        return result(this.stats, 'hasErrors');
    }

    /**
     * @type {Boolean}
     */
    get hasWarnings() {
        return result(this.stats, 'hasWarnings');
    }

    /**
     * @override
     * @param {Object} [options]
     * @returns {String}
     */
    toString(options) {
        if (!isPlainObject(options)) {
            options = get(this.stats, 'compilation.options.stats', STATS_OPTIONS);
        }

        let toString;

        if (isFunction(this.stats.toString)) {
            toString = this.stats.toString(options);
        } else if (isString(this.stats.toString)) {
            toString = this.stats.toString;
        }

        return toString;
    }

    /**
     * @returns {Object}
     */
    toJSON() {
        return {
            hasErrors: this.hasErrors,
            hasWarnings: this.hasWarnings,
            toString: this.toString()
        };
    }
}

export default CompilerStrategyStats;
