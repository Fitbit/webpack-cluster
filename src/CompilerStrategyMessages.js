import {
    mapValues,
    result
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

        return v.map(userPath).map(x => p === 'colors' ? chalk.magenta(x) : x).join(', ');
    },

    stack: v => result(v, 'stack', '')
});

/**
 * @private
 * @param {Object<String,String>} messages
 * @returns {Object<String,Function>}
 */
const compile = messages => mapValues(messages, message => mf.compile(message));

/**
 * @private
 * @type {Object<String,String>}
 */
const MESSAGES = {
    run: 'Compiling webpack configs [{PATTERNS,path,colors}]',
    watch: 'Watching webpack configs [{PATTERNS,path,colors}]',
    compile: 'Compiling webpack config {FILE,path,colors}',
    compileWithStatus: 'Compiling webpack config {FILE,path,colors} {STATUS}',
    statsWithStatus: 'Stats for webpack config {FILE,path,colors} {STATUS}',
    fatalError: `Cannot compile {SIZE, plural,
        =0 {zero}
        one {one}
        other {#}
    } webpack {SIZE, plural,
        =0 {configs}
        one {config}
        other {configs}
     } [{FILES,path}]`,
    fatalErrorWithStack: 'Cannot compile webpack config {FILE,path,colors} due to {ERROR,stack}',
    fatalErrorWithStatus: 'Cannot compile webpack config {FILE,path,colors} {STATUS}',
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
    } fatal error [{FILES,path,colors}]`,
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
    } errors [{FILES,path,colors}]`,
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
    } warnings [{FILES,path,colors}]`,
    time: 'Finished in {TIME}'
};

/**
 * @type {Object<String,Function>}
 */
export default compile(MESSAGES);
