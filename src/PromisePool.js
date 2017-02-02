import throttle from 'throat';
import {
    asLazy,
    toPromise,
    isCancelable,
    catchReturn
} from './PromiseUtil';
import {
    canceledError
} from './CompilerErrorFactory';

/**
 * @private
 * @type {WeakMap}
 */
const CONCURRENCY = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const PENDING = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const CANCELED = new WeakMap();

/**
 * @class
 * @extends {Map}
 */
class PromisePool extends Map {
    /**
     * @constructor
     * @param {Number} [concurrency]
     */
    constructor(concurrency = Infinity) {
        super();

        CONCURRENCY.set(this, concurrency);
        PENDING.set(this, new Map());
        CANCELED.set(this, new Map());
    }

    /**
     * @readonly
     * @type {Number}
     */
    get concurrency() {
        return CONCURRENCY.get(this);
    }

    /**
     * @readonly
     * @type {Map<*, Promise>}
     */
    get pending() {
        return PENDING.get(this);
    }

    /**
     * @readonly
     * @type {Map<*, Promise>}
     */
    get canceled() {
        return CANCELED.get(this);
    }

    /**
     * @param {*} key
     * @param {Promise|LazyPromise} value
     * @return {PromisePool}
     */
    set(key, value) {
        return super.set(key, asLazy(value));
    }

    /**
     * @returns {void}
     */
    clear() {
        super.clear();

        this.pending.clear();
        this.canceled.clear();
    }

    /**
     * @param {*} key
     * @returns {Promise}
     */
    start(key) {
        const promise = toPromise(this.get(key));

        this.pending.set(key, promise);

        return promise
            .catch(x => Promise.resolve(x))
            .then(x => {
                const canceledOrDefault = this.canceled.has(key) ? this.canceled.get(key) : Promise.resolve(x);

                this.pending.delete(key);
                this.canceled.delete(key);

                return catchReturn(canceledOrDefault);
            });
    }

    /**
     * @param {*} key
     * @returns {Promise}
     */
    stop(key) {
        let promise = this.pending.get(key),
            err = canceledError(key);

        this.pending.delete(key);

        if (isCancelable(promise)) {
            promise = promise.cancel()
                .then(() => Promise.reject(err))
                .catch(() => Promise.reject(err));
        } else {
            promise = Promise.reject(err);
        }

        this.canceled.set(key, promise);

        return catchReturn(promise);
    }

    /**
     * @returns {Promise}
     */
    waitAll() {
        const promises = Array.from(this.keys())
            .map(throttle(this.concurrency, key => this.start(key)));

        return Promise.all(promises);
    }

    /**
     * @returns {Promise}
     */
    closeAll() {
        const promises = Array.from(this.pending.keys())
            .map(key => this.stop(key));

        return Promise.all(promises);
    }
}

export default PromisePool;
