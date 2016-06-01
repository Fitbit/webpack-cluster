/*eslint no-console: 0*/
import {
    uniq,
    flattenDeep
} from 'lodash';
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
     * @param {CompilerStrategyResult[]} results
     * @returns {void}
     */
    [STRATEGY_EVENTS.find]: (results = []) => {
        const files = flattenDeep(results.map(x => x.files));

        console.log(`${STATUS_PREFIXES.info} %s`, STRATEGY_MESSAGES.files({
            FILES: files,
            SIZE: files.length
        }));
    },

    /**
     * @private
     * @param {String} filename
     * @returns {void}
     */
    [STRATEGY_EVENTS.compilationStart]: filename => {
        const task = observatory.add(`${STATUS_PREFIXES.info} ${STRATEGY_MESSAGES.compile({
            FILE: filename
        })}`).status(STATUS_LABELS.pending);

        TASKS.set(filename, task);
    },

    /**
     * @private
     * @param {CompilerStrategyProgress} progress
     * @returns {void}
     */
    [STRATEGY_EVENTS.compilationProgress]: progress => {
        const task = TASKS.get(progress.filename);

        task.status(`${progress.toString()}`).details(progress.status);
    },

    /**
     * @private
     * @param {CompilerStrategyStats} stats
     * @returns {void}
     */
    [STRATEGY_EVENTS.compilationDone]: stats => {
        const task = TASKS.get(stats.filename);

        if (stats.hasErrors || stats.hasFatalError) {
            task.fail(STATUS_LABELS.fail);
        } else if (stats.hasWarnings) {
            task.done(STATUS_LABELS.warn);
        } else {
            task.done(STATUS_LABELS.done);
        }
    },

    /**
     * @private
     * @param {CompilerStrategyStats} stats
     * @returns {void}
     */
    [STRATEGY_EVENTS.compilationStats]: stats => {
        let status;

        if (stats.hasErrors || stats.hasFatalError) {
            status = STATUS_LABELS.fail;
        } else if (stats.hasWarnings) {
            status = STATUS_LABELS.warn;
        } else {
            status = STATUS_LABELS.done;
        }

        console.log(`${STATUS_PREFIXES.info} %s`, STRATEGY_MESSAGES.stats({
            FILE: stats.filename,
            STATUS: status,
            ERROR: stats.fatalError
        }));
        console.log(stats.toString());
    },

    /**
     * @private
     * @param {CompilerStrategyResult[]} results
     * @returns {void}
     */
    [STRATEGY_EVENTS.done]: results => {
        let fatalErrors = [],
            errors = [],
            warnings = [];

        results.forEach(result => {
            result.files.forEach(filename => {
                const stats = result.stats.get(filename);

                if (stats.hasFatalError) {
                    fatalErrors.push(filename);
                } else if (stats.hasErrors) {
                    errors.push(filename);
                } else if (stats.hasWarnings) {
                    warnings.push(filename);
                }
            });
        });

        fatalErrors = uniq(fatalErrors);
        errors = uniq(errors);
        warnings = uniq(warnings);

        console.log(`${STATUS_PREFIXES.fatalError} %s`, STRATEGY_MESSAGES.fatalErrors({
            FILES: fatalErrors,
            SIZE: fatalErrors.length
        }));
        console.log(`${STATUS_PREFIXES.error} %s`, STRATEGY_MESSAGES.errors({
            FILES: errors,
            SIZE: errors.length
        }));
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
