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
 * @param {*} promise
 * @returns {Boolean}
 */
export function isPromise(promise) {
    return promise instanceof Promise;
}

/**
 * @param {Promise|LazyPromise} promise
 * @returns {LazyPromise}
 */
export function asLazy(promise) {
    return isPromise(promise) ? () => promise : promise;
}

/**
 * @param {LazyPromise|Promise} promise
 * @returns {Promise}
 */
export function toPromise(promise) {
    return isFunction(promise) ? promise() : promise;
}

/**
 * @param {*} promise
 * @returns {Boolean}
 */
export function isCancelable(promise) {
    return isPromise(promise) && isFunction(promise.cancel);
}

/**
 * @param {Number} ms
 * @returns {Promise}
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}

/**
 * @param {LazyPromise|Promise} promise
 * @returns {Promise}
 */
export function catchReturn(promise) {
    return toPromise(promise).catch(x => Promise.resolve(x));
}
