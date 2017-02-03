import {
    isFunction
} from 'lodash';

/**
 * @callback LazyPromise
 * @returns {Promise}
 */

/**
 * @module PromiseUtil
 */

/**
 * @internal
 * @param {*} promise
 * @returns {Boolean}
 */
export function isPromise(promise) {
    return promise instanceof Promise;
}

/**
 * @internal
 * @param {Promise|LazyPromise} promise
 * @returns {LazyPromise}
 */
export function asLazy(promise) {
    return isPromise(promise) ? () => promise : promise;
}

/**
 * @internal
 * @param {LazyPromise|Promise} promise
 * @returns {Promise}
 */
export function toPromise(promise) {
    return isFunction(promise) ? promise() : promise;
}

/**
 * @internal
 * @param {*} promise
 * @returns {Boolean}
 */
export function isCancelable(promise) {
    return isPromise(promise) && isFunction(promise.cancel);
}

/**
 * @internal
 * @param {Number} ms
 * @returns {Promise}
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

/**
 * @internal
 * @param {LazyPromise|Promise} promise
 * @returns {Promise}
 */
export function catchReturn(promise) {
    return toPromise(promise).catch(x => Promise.resolve(x));
}
