/*eslint no-console: 0*/
import prettyHrtime from 'pretty-hrtime';
import observatory from 'observatory';
import STRATEGY_MESSAGES from './CompilerStrategyMessages';
import STRATEGY_EVENTS from './CompilerStrategyEvents';
import STATUS_LABELS from './CompilerStatusLabels';
import STATUS_PREFIXES from './CompilerStatusPrefixes';
import SYSTEM_DEFAULT_EVENTS from './CompilerStrategyDefaultEvents';

/**
 * @private
 * @type {Map}
 */
const TASKS = new Map();

/**
 * @private
 * @type {String}
 */
const OBSERVATORY_PREFIX = '';

observatory.settings({
    prefix: OBSERVATORY_PREFIX
});

/**
 * @type {Object<String,Function>}
 */
export default Object.assign({}, SYSTEM_DEFAULT_EVENTS, {
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
     * @param {String[]} patterns
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
    [STRATEGY_EVENTS.compile]: filename => {
        const task = observatory.add(`${STATUS_PREFIXES.info} ${STRATEGY_MESSAGES.compile({
            FILE: filename
        })}`).status(STATUS_LABELS.pending);

        TASKS.set(filename, task);
    },

    /**
     * @private
     * @param {String} filename
     * @param {Number} ratio
     * @param {String} status
     * @returns {void}
     */
    [STRATEGY_EVENTS.progress]: (filename, ratio = 0, status = '') => {
        const task = TASKS.get(filename),
            percentage = Math.floor(ratio * 100);

        task.status(`${percentage}%`).details(status);
    },

    /**
     * @private
     * @param {String} filename
     * @param {CompilerStrategyStats} stats
     * @returns {void}
     */
    [STRATEGY_EVENTS.stats]: (filename, stats) => {
        let status;

        if (stats.hasErrors) {
            status = STATUS_LABELS.fail;
        } else if (stats.hasWarnings) {
            status = STATUS_LABELS.warn;
        } else {
            status = STATUS_LABELS.done;
        }

        console.log(`${STATUS_PREFIXES.info} %s`, STRATEGY_MESSAGES.statsWithStatus({
            FILE: filename,
            STATUS: status
        }));
        console.log(stats.toString());
    },

    /**
     * @private
     * @param {String} filename
     * @param {Error} error
     * @returns {void}
     */
    [STRATEGY_EVENTS.fatalError]: (filename, error) => {
        console.log(`${STATUS_PREFIXES.debug} %s`, STRATEGY_MESSAGES.fatalErrorWithStack({
            FILE: filename,
            ERROR: error
        }));
    },

    /**
     * @private
     * @param {String} filename
     * @param {CompilerStrategyStats} stats
     * @returns {void}
     */
    [STRATEGY_EVENTS.done]: (filename, stats) => {
        const task = TASKS.get(filename);

        if (stats.hasErrors) {
            task.fail(STATUS_LABELS.fail);
        } else if (stats.hasWarnings) {
            task.done(STATUS_LABELS.warn);
        } else {
            task.done(STATUS_LABELS.done);
        }
    },

    /**
     * @private
     * @param {String} filename
     * @returns {void}
     */
    [STRATEGY_EVENTS.fail]: filename => {
        const task = TASKS.get(filename);

        task.fail(STATUS_LABELS.fail);
    },

    /**
     * @private
     * @param {String[]} errors
     * @returns {void}
     */
    [STRATEGY_EVENTS.fatalErrors]: errors => {
        console.log(`${STATUS_PREFIXES.fatalError} %s`, STRATEGY_MESSAGES.fatalErrors({
            FILES: errors,
            SIZE: errors.length
        }));
    },

    /**
     * @private
     * @param {String[]} errors
     * @returns {void}
     */
    [STRATEGY_EVENTS.errors]: errors => {
        console.log(`${STATUS_PREFIXES.error} %s`, STRATEGY_MESSAGES.errors({
            FILES: errors,
            SIZE: errors.length
        }));
    },

    /**
     * @private
     * @param {String[]} warnings
     * @returns {void}
     */
    [STRATEGY_EVENTS.warnings]: warnings => {
        console.log(`${STATUS_PREFIXES.warn} %s`, STRATEGY_MESSAGES.warnings({
            FILES: warnings,
            SIZE: warnings.length
        }));
    },

    /**
     * @private
     * @param {Number[]} time
     * @returns {void}
     */
    [STRATEGY_EVENTS.time]: time => {
        console.log(`${STATUS_PREFIXES.info} %s`, STRATEGY_MESSAGES.time({
            TIME: prettyHrtime(time)
        }));
    }
});
