import {
    isObject,
    isError
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
const WRAPPER_PROPERTY = __filename;

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
     * @param {Object|Error} obj
     * @returns {Error}
     */
    static fromJSON(obj) {
        if (isError(obj)) {
            return obj;
        } else {
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

            delete err[WRAPPER_PROPERTY];

            return err;
        }
    }

    /**
     * @param {Error} err
     * @returns {CompilerStrategyError}
     */
    static wrap(err) {
        const wrapper = new CompilerStrategyError(err.message, err.fileName, err.lineNumber);

        wrapper.type = err.constructor.name;
        wrapper.stack = err.stack;
        wrapper[WRAPPER_PROPERTY] = true;

        return wrapper;
    }

    /**
     * @param {Object} obj
     * @returns {Boolean}
     */
    static isWrapper(obj) {
        return isObject(obj) && obj[WRAPPER_PROPERTY] === true;
    }
}

export default CompilerStrategyError;
