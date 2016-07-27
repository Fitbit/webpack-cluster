import {
    get,
    uniq,
    isObject
} from 'lodash';
import CompilerStrategyError from './CompilerStrategyError';
import STRATEGY_MESSAGES from './CompilerStrategyMessages';
import STRATEGY_EVENTS from './CompilerStrategyEvents';
import FAIL_ON_PROPERTIES from './CompilerFailOnProperties';

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
        const failOnErrors = isObject(options) ? get(options, FAIL_ON_PROPERTIES.errors, false) : options,
            failOnWarnings = isObject(options) ? get(options, FAIL_ON_PROPERTIES.warnings, false) : options;

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

        if (fatalErrors.length > 0 || errors.length > 0 || warnings.length > 0) {
            let allErrors = [...fatalErrors];

            if (errors.length > 0 && failOnErrors === true) {
                allErrors.push(...errors);
            }

            if (warnings.length > 0 && failOnWarnings === true) {
                allErrors.push(...warnings);
            }

            allErrors = uniq(allErrors);

            if (allErrors.length > 0) {
                throw new CompilerStrategyError(STRATEGY_MESSAGES.fatalError({
                    FILES: allErrors,
                    SIZE: allErrors.length
                }));
            }
        }
    }
};
