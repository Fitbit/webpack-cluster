import {
    CANCELED,
    INVALID
} from './CompilerErrorTypes';
import CompilerError from './CompilerError';

/**
 * @module CompilerErrorFactory
 */

/**
 * @private
 * @param {*} key
 * @param {Number} code
 * @returns {Error}
 */
function createError(key, code) {
    const err = new CompilerError(key);

    err.code = code;

    return err;
}

/**
 * @internal
 * @param {*} key
 * @returns {Error}
 */
export function invalidError(key) {
    return createError(key, INVALID);
}

/**
 * @internal
 * @param {*} key
 * @returns {Error}
 */
export function canceledError(key) {
    return createError(key, CANCELED);
}
