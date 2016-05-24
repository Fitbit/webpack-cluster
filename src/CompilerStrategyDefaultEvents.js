import {
    get,
    uniq,
    isObject
} from 'lodash';
import STRATEGY_MESSAGES from './CompilerStrategyMessages';
import STRATEGY_EVENTS from './CompilerStrategyEvents';

/**
 * @type {Object<String,Function>}
 */
export default {
    /**
     * @private
     * @param {WebpackFailOptions} options
     * @param {CompilerStrategyResult[]} results
     * @returns {void}
     */
    [STRATEGY_EVENTS.failOn]: (options, results) => {
        const failOnErrors = isObject(options) ? get(options, 'errors', false) : options,
            failOnWarnings = isObject(options) ? get(options, 'warnings', false) : options;

        let fatalErrors = [],
            errors = [],
            warnings = [];

        results.forEach(result => {
            result.done.forEach((stats, filename) => {
                if (stats.hasErrors) {
                    errors.push(filename);
                } else if (stats.hasWarnings) {
                    warnings.push(filename);
                }
            });

            result.fail.forEach((err, filename) => {
                fatalErrors.push(filename);
            });
        });

        fatalErrors = uniq(fatalErrors);
        errors = uniq(errors);
        warnings = uniq(warnings);

        if (fatalErrors.length > 0 || errors.length > 0 || warnings.length > 0) {
            let allErrors = [...fatalErrors];

            if (errors.length > 0 && failOnErrors === true) {
                allErrors.push(...errors);
            }

            if (warnings.length > 0 && failOnWarnings === true) {
                allErrors.push(...warnings);
            }

            allErrors = uniq(allErrors);

            throw new Error(STRATEGY_MESSAGES.fatalError({
                FILES: allErrors,
                SIZE: allErrors.length
            }));
        }
    }
};
