/*eslint no-console: 0*/
import {
    noop
} from 'lodash';
import STRATEGY_MESSAGES from './CompilerStrategyMessages';
import STATUS_PREFIXES from './CompilerStatusPrefixes';
import STRATEGY_EVENTS from './CompilerStrategyEvents';
import PRETTY_STRATEGY_EVENTS from './CompilerStrategyPrettyEvents';

/**
 * @type {Object<String,Function>}
 */
export default Object.assign({}, PRETTY_STRATEGY_EVENTS, {
    /**
     * @private
     * @param {String[]} patterns
     * @returns {void}
     */
    [STRATEGY_EVENTS.run]: (patterns = []) => {
        console.log(`${STATUS_PREFIXES.info} %s`, STRATEGY_MESSAGES.run({
            PATTERNS: patterns
        }));
    },

    /**
     * @private
     * @param {String} patterns
     * @returns {void}
     */
    [STRATEGY_EVENTS.watch]: (patterns = []) => {
        console.log(`${STATUS_PREFIXES.info} %s`, STRATEGY_MESSAGES.watch({
            PATTERNS: patterns
        }));
    },

    /**
     * @private
     * @param {String} filename
     * @returns {void}
     */
    [STRATEGY_EVENTS.compilationStart]: filename => {
        console.log(`${STATUS_PREFIXES.info} ${STRATEGY_MESSAGES.compile({
            FILE: filename
        })}`);
    },

    /**
     * @private
     */
    [STRATEGY_EVENTS.compilationDone]: noop,

    /**
     * @private
     */
    [STRATEGY_EVENTS.compilationProgress]: noop
});
