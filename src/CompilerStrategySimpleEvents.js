/*eslint no-console: 0*/
import STRATEGY_MESSAGES from './CompilerStrategyMessages';
import STATUS_PREFIXES from './CompilerStatusPrefixes';
import STRATEGY_EVENTS from './CompilerStrategyEvents';
import PRETTY_STRATEGY_EVENTS from './CompilerStrategyPrettyEvents';

/**
 * @private
 * @type {Object<String,Function>}
 */
const SIMPLE_STRATEGY_EVENTS = Object.assign({}, PRETTY_STRATEGY_EVENTS, {
    /**
     * @private
     * @param {String} filename
     * @returns {void}
     */
    [STRATEGY_EVENTS.compilationStart]: filename => {
        console.log(`${STATUS_PREFIXES.info} ${STRATEGY_MESSAGES.compile({
            FILE: filename
        })}`);
    }
});

delete SIMPLE_STRATEGY_EVENTS[STRATEGY_EVENTS.compilationDone];
delete SIMPLE_STRATEGY_EVENTS[STRATEGY_EVENTS.compilationProgress];

/**
 * @type {Object<String,Function>}
 */
export default SIMPLE_STRATEGY_EVENTS;
