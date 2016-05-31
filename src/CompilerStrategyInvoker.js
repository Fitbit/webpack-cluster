import {
    isFunction,
    noop
} from 'lodash';
import STRATEGY_EVENTS from './CompilerStrategyEvents';

/**
 * @private
 * @type {WeakMap}
 */
const STRATEGY = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const EVENTS = new WeakMap();

/**
 * @class
 */
class CompilerStrategyInvoker {
    /**
     * @constructor
     * @param {CompilerStrategy} strategy
     * @param {Object<String,Function>} [events]
     */
    constructor(strategy, events = {}) {
        STRATEGY.set(this, strategy);
        EVENTS.set(this, events);

        this.bindEvents();
    }

    /**
     * @readonly
     * @type {CompilerStrategy}
     */
    get strategy() {
        return STRATEGY.get(this);
    }

    /**
     * @readonly
     * @type {Object<String,Boolean>}
     */
    get events() {
        return EVENTS.get(this);
    }

    /**
     * @private
     * @returns {void}
     */
    bindEvents() {
        for (const [key, value] of Object.entries(this.events)) {
            if (isFunction(value)) {
                this.strategy.on(key, value);
            }
        }
    }

    /**
     * @private
     * @param {Number[]} startTime
     * @returns {void}
     */
    time(startTime) {
        const endTime = process.hrtime(startTime);

        this.strategy.emit(STRATEGY_EVENTS.time, endTime);
    }

    /**
     * @param {String|String[]} patterns
     * @param {Function} [callback]
     * @returns {Promise}
     */
    invoke(patterns, callback) {
        if (!isFunction(callback)) {
            callback = noop;
        }

        const isArray = Array.isArray(patterns);

        if (!isArray) {
            patterns = [
                patterns
            ];
        }

        const startTime = process.hrtime();

        return this.strategy.execute(patterns, callback).then(stats => {
            this.time(startTime);

            return Promise.resolve(isArray ? stats : stats[0]);
        }).catch(err => {
            this.time(startTime);

            return Promise.reject(err);
        });
    }
}

export default CompilerStrategyInvoker;
