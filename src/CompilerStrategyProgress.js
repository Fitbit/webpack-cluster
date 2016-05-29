import {
    get
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
const RATIO = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const STATUS = new WeakMap();

/**
 * @class
 */
class CompilerStrategyProgress {
    /**
     * @param {String} filename
     * @param {Number} ratio
     * @param {String} status
     */
    constructor(filename, ratio, status) {
        FILENAME.set(this, filename);
        RATIO.set(this, ratio);
        STATUS.set(this, status);
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
     * @type {Number}
     */
    get ratio() {
        return RATIO.get(this);
    }

    /**
     * @readonly
     * @type {String}
     */
    get status() {
        return STATUS.get(this);
    }

    /**
     * @readonly
     * @type {Number}
     */
    get percent() {
        return Math.floor(this.ratio * 100);
    }

    /**
     * @override
     */
    toString() {
        return `${this.percent}%s`;
    }

    /**
     * @returns {Object}
     */
    toJSON() {
        return {
            filename: this.filename,
            ratio: this.ratio,
            status: this.status
        };
    }

    /**
     * @param {Object} obj
     * @returns {CompilerStrategyProgress}
     */
    static fromJSON(obj) {
        const filename = get(obj, 'filename'),
            ratio = get(obj, 'ratio', 0),
            status = get(obj, 'status', '');

        return new CompilerStrategyProgress(filename, ratio, status);
    }
}

export default CompilerStrategyProgress;
