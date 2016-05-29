import {
    isObject
} from 'lodash';

/**
 * @private
 * @type {String[]}
 */
const SYSTEM_PROPERTIES = ['message', 'fileName', 'lineNumber', 'stack'];

/**
 * @private
 * @type {String}
 */
const WRAPPER_KEY = '$CompilerStrategyError$';

/**
 * @class
 * @extends {Error}
 */
class CompilerStrategyError extends Error {
    /**
     * @constructor
     * @param {String} message
     * @param {String} [fileName]
     * @param {Number} [lineNumber]
     */
    constructor(message, fileName, lineNumber) {
        super(message, fileName, lineNumber);
    }

    /**
     * @returns {Object}
     */
    toJSON() {
        let obj = {};

        SYSTEM_PROPERTIES.forEach(key => {
            if (this[key]) {
                obj[key] = this[key];
            }
        });

        Object.keys(this).forEach(key => {
            obj[key] = this[key];
        });

        return obj;
    }

    /**
     * @param {Object} obj
     * @returns {Error}
     */
    static fromJSON(obj) {
        let err,
            message = obj.message;

        switch (obj.type) {
            case 'TypeError':
                err = new TypeError(message);
                break;

            case 'RangeError':
                err = new RangeError(message);
                break;

            case 'EvalError':
                err = new EvalError(message);
                break;

            case 'ReferenceError':
                err = new ReferenceError(message);
                break;

            case 'SyntaxError':
                err = new SyntaxError(message);
                break;

            case 'URIError':
                err = new URIError(message);
                break;

            default:
                err = new Error(message);
        }

        SYSTEM_PROPERTIES.forEach(key => {
            if (obj[key]) {
                err[key] = obj[key];
            }
        });

        Object.keys(obj).forEach(key => {
            if (!err[key]) {
                err[key] = obj[key];
            }
        });

        delete err[WRAPPER_KEY];

        return err;
    }

    /**
     * @param {Error} err
     * @returns {CompilerStrategyError}
     */
    static fromError(err) {
        const wrapper = new CompilerStrategyError(err.message, err.fileName, err.lineNumber);

        wrapper.type = err.constructor.name;
        wrapper.stack = err.stack;
        wrapper[WRAPPER_KEY] = true;

        return wrapper;
    }

    /**
     * @param {Object} obj
     * @returns {Boolean}
     */
    static isError(obj) {
        return isObject(obj) && obj[WRAPPER_KEY] === true;
    }
}

export default CompilerStrategyError;
