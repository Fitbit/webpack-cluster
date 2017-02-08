import {
    isFunction
} from 'lodash';
import {
    setupMaster,
    closeMaster,
    createFork,
    killFork,
    execFork
} from './ForkUtil';

/**
 * @private
 * @type {Symbol}
 */
const FORK = Symbol('fork');

/**
 * @internal
 * @class
 * @extends {Promise}
 */
class ForkPromise extends Promise {
    /**
     * @constructor
     * @param {Function} [executor]
     */
    constructor(executor) {
        if (!isFunction(executor)) {
            executor = resolve => resolve();
        }

        super(executor);
    }

    /**
     * @param {Function} [onFulfilled]
     * @param {Function} [onRejected]
     * @returns {ForkPromise}
     */
    then(onFulfilled, onRejected) {
        return super.then(onFulfilled, onRejected);
    }

    /**
     * @param {Object} options
     * @param {Function} [callback]
     * @returns {ForkPromise}
     */
    open(options, callback) {
        const promise = new ForkPromise(resolve => {
            const env = options.env || process.env;

            createFork(env).then(fork => {
                promise[FORK] = fork;

                return execFork(fork, options, callback)
                    .then(result => resolve(result));
            });
        });

        return promise;
    }

    /**
     * @returns {ForkPromise}
     */
    cancel() {
        return this.then(() => {
            return new Promise((resolve, reject) => {
                if (this[FORK]) {
                    killFork(this[FORK]).then(resolve, reject);
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * @param {Object} options
     * @returns {Promise}
     */
    static setupMaster(options) {
        return setupMaster(options);
    }

    /**
     * @returns {Promise}
     */
    static closeMaster() {
        return closeMaster();
    }

    /**
     * @param {Object} [options={}]
     * @param {Function} [callback]
     * @returns {ForkPromise}
     */
    static fork(options = {}, callback) {
        return new ForkPromise()
            .open(options, callback);
    }
}

export default ForkPromise;
