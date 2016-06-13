import {
    mapValues,
    result,
    wrap,
    trim
} from 'lodash';
import chalk from 'chalk';
import {
    resolve
} from 'path';
import tildify from 'tildify';
import MessageFormat from 'messageformat';

/**
 * @private
 * @type {String}
 */
const LOCALE = 'en';

/**
 * @private
 * @param {String} filename
 * @returns {String}
 */
const userPath = filename => tildify(resolve(filename));

/**
 * @private
 * @type {MessageFormat}
 */
const mf = new MessageFormat(LOCALE, null, {
    path: (v, lc, p) => {
        if (!Array.isArray(v)) {
            v = [v];
        }

        const values = v.map(userPath).map(x => p === 'colors' ? chalk.magenta(x) : x);

        let value = '';

        if (values.length > 1) {
            value = `[${values.join(', ')}]`;
        } else if (values.length === 1) {
            value = values[0];
        }

        return value;
    }
});

/**
 * @private
 * @param {Object<String,String>} value
 * @returns {Object<String,Function>}
 */
const compile = value => mapValues(value, message => wrap(mf.compile(message), (fn, options) => trim(fn(options))));

/**
 * @private
 * @type {Object<String,String>}
 */
const MESSAGES = {
    run: 'Processing webpack configs {PATTERNS,path,colors}',
    watch: 'Watching webpack configs {PATTERNS,path,colors}',
    files: `Compiling {SIZE, plural,
        =0 {zero}
        one {one}
        other {#}
    } webpack {SIZE, plural,
        =0 {configs}
        one {config}
        other {configs}
     } {FILES,path,colors}`,
    compile: 'Compiling webpack config {FILE,path,colors}',
    stats: 'Stats for webpack config {FILE,path,colors} {STATUS}',
    fatalError: `Cannot compile {SIZE, plural,
        =0 {zero}
        one {one}
        other {#}
    } webpack {SIZE, plural,
        =0 {configs}
        one {config}
        other {configs}
     } {FILES,path}`,
    fatalErrors: `{SIZE, plural,
        =0 {Zero}
        one {One}
        other {#}
    } webpack {SIZE, plural,
        =0 {configs}
        one {config}
        other {configs}
    } {SIZE, plural,
        =0 {have}
        one {has}
        other {have}
    } fatal errors {FILES,path,colors}`,
    errors: `{SIZE, plural,
        =0 {Zero}
        one {One}
        other {#}
    } webpack {SIZE, plural,
        =0 {configs}
        one {config}
        other {configs}
    } {SIZE, plural,
        =0 {have}
        one {has}
        other {have}
    } errors {FILES,path,colors}`,
    warnings: `{SIZE, plural,
        =0 {Zero}
        one {One}
        other {#}
    } webpack {SIZE, plural,
        =0 {configs}
        one {config}
        other {configs}
    } {SIZE, plural,
        =0 {have}
        one {has}
        other {have}
    } warnings {FILES,path,colors}`,
    time: 'Finished in {TIME}'
};

/**
 * @type {Object<String,Function>}
 */
export default compile(MESSAGES);
