/**
 * @private
 * @type {WeakMap}
 */
const FILENAME = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const CODE = new WeakMap();

/**
 * @class
 * @extends {Error}
 */
class CompilerError extends Error {
    /**
     * @constructor
     * @param {String} filename
     * @param {Number} code
     */
    constructor(filename, code) {
        super();

        Error.captureStackTrace(this, this.constructor);

        FILENAME.set(this, filename);
        CODE.set(this, code);
    }

    /**
     * @readonly
     * @returns {String}
     */
    get filename() {
        return FILENAME.get(this);
    }

    /**
     * @readonly
     * @returns {Number}
     */
    get code() {
        return CODE.get(this);
    }
}

export default CompilerError;
