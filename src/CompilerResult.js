import {
    isError,
    result
} from 'lodash';

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
class CompilerResult {
    /**
     * @constructor
     * @param {String} filename
     * @param {Object} [stats]
     * @param {Boolean|Error} [fatalError]
     */
    constructor(filename, stats, fatalError) {
        FILENAME.set(this, filename);
        STATS.set(this, stats);
        FATAL_ERROR.set(this, fatalError);
    }

    /**
     * @readonly
     * @type {String}
     */
    get filename() {
        return FILENAME.get(this);
    }

    /**
     * @readonly
     * @type {Object}
     */
    get stats() {
        return STATS.get(this) || {};
    }

    /**
     * @readonly
     * @type {Error}
     */
    get fatalError() {
        return FATAL_ERROR.get(this);
    }

    /**
     * @readonly
     * @type {Boolean}
     */
    get hasSysErrors() {
        return isError(this.fatalError) || result(this.stats, 'hasSysErrors', false);
    }

    /**
     * @readonly
     * @type {Boolean}
     */
    get hasErrors() {
        return result(this.stats, 'hasErrors', false);
    }

    /**
     * @readonly
     * @type {Boolean}
     */
    get hasWarnings() {
        return result(this.stats, 'hasWarnings', false);
    }

    /**
     * @returns {Object}
     */
    toJSON() {
        return {
            filename: this.filename,
            stats: {
                hasSysErrors: this.hasSysErrors,
                hasErrors: this.hasErrors,
                hasWarnings: this.hasWarnings
            }
        };
    }

    /**
     * @param {Object|CompilerResult} value
     * @returns {CompilerResult}
     */
    static from(value) {
        if (!(value instanceof CompilerResult)) {
            value = new CompilerResult(value.filename, value.stats, value.fatalError);
        }

        return value;
    }
}

export default CompilerResult;
