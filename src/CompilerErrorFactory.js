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
    return new CompilerError(key, code);
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
