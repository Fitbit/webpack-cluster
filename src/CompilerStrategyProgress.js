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
 * @private
 * @type {Object<String,String>}
 */
const PROGRESS_PROPERTIES = {
    filename: 'filename',
    ratio: 'ratio',
    status: 'status'
};

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
            [PROGRESS_PROPERTIES.filename]: this.filename,
            [PROGRESS_PROPERTIES.ratio]: this.ratio,
            [PROGRESS_PROPERTIES.status]: this.status
        };
    }

    /**
     * @param {Object} obj
     * @returns {CompilerStrategyProgress}
     */
    static fromJSON(obj) {
        if (obj instanceof CompilerStrategyProgress) {
            return obj;
        } else {
            const filename = get(obj, PROGRESS_PROPERTIES.filename),
                ratio = get(obj, PROGRESS_PROPERTIES.ratio, 0),
                status = get(obj, PROGRESS_PROPERTIES.status, '');

            return new CompilerStrategyProgress(filename, ratio, status);
        }
    }
}

export default CompilerStrategyProgress;
