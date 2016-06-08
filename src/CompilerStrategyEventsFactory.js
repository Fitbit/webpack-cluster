import isCI from 'is-ci';
import STRATEGY_EVENTS from './CompilerStrategyEvents';
import DEFAULT_EVENTS from './CompilerStrategyDefaultEvents';
import PRETTY_EVENTS from './CompilerStrategyPrettyEvents';
import SIMPLE_EVENTS from './CompilerStrategySimpleEvents';
import COMPILER_PROPERTIES from './CompilerProperties';

/**
 * @private
 * @type {String[]}
 */
const WATCH_IGNORED_EVENTS = [
    STRATEGY_EVENTS.time,
    STRATEGY_EVENTS.find,
    STRATEGY_EVENTS.done,
    STRATEGY_EVENTS.failOn
];

/**
 * @class
 */
class CompilerStrategyEventsFactory {
    /**
     * @param {CompilerOptions} compilerOptions
     * @returns {Object<String,Function>}
     */
    static createEvents(compilerOptions = {}) {
        let events;

        if (compilerOptions[COMPILER_PROPERTIES.silent] === true) {
            events = DEFAULT_EVENTS;
        } else if (compilerOptions[COMPILER_PROPERTIES.progress] === true && process.stdout && process.stdout.isTTY === true) {
            events = PRETTY_EVENTS;
        } else if (isCI) {
            events = SIMPLE_EVENTS;
        } else {
            events = SIMPLE_EVENTS;
        }

        if (compilerOptions[COMPILER_PROPERTIES.watch] === true) {
            WATCH_IGNORED_EVENTS.forEach(value => {
                delete events[value];
            });
        }

        return events;
    }
}

export default CompilerStrategyEventsFactory;
