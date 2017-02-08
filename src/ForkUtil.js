import cluster from 'cluster';
import {
    isFunction
} from 'lodash';
import {
    FORK_MESSAGE,
    FORK_DONE,
    FORK_EXEC,
    FORK_ONLINE,
    FORK_DISCONNECT
} from './Events';

/**
 * @module ForkUtil
 */

/**
 * @param {Object} options
 * @returns {Promise}
 */
export function setupMaster(options) {
    cluster.setupMaster(options);

    return Promise.resolve();
}

/**
 * @returns {Promise}
 */
export function closeMaster() {
    return new Promise(resolve => cluster.disconnect(resolve));
}

/**
 * @param {Object} [env]
 * @returns {Promise<Worker>}
 */
export function createFork(env) {
    return new Promise(resolve => {
        const fork = cluster.fork(env);

        fork.once(FORK_ONLINE, () => resolve(fork));
    });
}

/**
 * @param {Worker} fork
 * @param {Object} options
 * @param {Function} [callback]
 * @returns {Promise<CompilerResult>}
 */
export function execFork(fork, options, callback) {
    return new Promise(resolve => {
        fork.on(FORK_MESSAGE, ({ type, data }) => {
            if (type === FORK_DONE) {
                if (isFunction(callback)) {
                    callback(data);
                }

                resolve(data);
            }
        });

        fork.send({
            type: FORK_EXEC,
            data: options
        });
    });
}

/**
 * @param {Worker} fork
 * @returns {Promise}
 */
export function killFork(fork) {
    return new Promise(resolve => {
        fork.once(FORK_DISCONNECT, () => resolve());

        fork.kill();
    });
}
