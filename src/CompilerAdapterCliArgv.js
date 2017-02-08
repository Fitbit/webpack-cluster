import {
    cpus
} from 'os';
import yargs from 'yargs';
import DEFAULT_OPTIONS from './CompilerAdapterOptions';
import {
    name,
    version
} from '../package.json';

/**
 * @private
 * @type {String}
 */
const VERSION = version || 'latest';

/**
 * @private
 * @type {Object<String,String>}
 */
const GROUPS = {
    options: 'Options:',
    miscellaneous: 'Miscellaneous:'
};

/**
 * @private
 * @type {Object<String,String>}
 */
const DESCRIPTIONS = {
    config: 'Specifies configuration files using `glob` pattern',
    watch: 'Enables `watch` mode',
    version: 'Outputs version number',
    dryRun: 'Enables `dryRun` mode',
    concurrency: 'Sets maximum number of concurrent compilers',
    failures: 'Sets failure options',
    silent: 'Suppress all output'
};

/**
 * @type {Object<String,*>}
 */
export default yargs
    .usage(`${name} --config=**/webpack.config.js [options]`)
    .options({
        config: {
            group: GROUPS.options,
            required: true,
            string: true,
            description: DESCRIPTIONS.config,
            nargs: 1,
            array: true
        },
        failures: {
            group: GROUPS.options,
            description: DESCRIPTIONS.failures,
            'default': true
        },
        watch: {
            group: GROUPS.options,
            description: DESCRIPTIONS.watch,
            'boolean': true
        },
        dryRun: {
            group: GROUPS.options,
            description: DESCRIPTIONS.dryRun,
            'boolean': true
        },
        concurrency: {
            group: GROUPS.options,
            description: DESCRIPTIONS.concurrency,
            number: true,
            defaultDescription: DEFAULT_OPTIONS.concurrency,
            'default': cpus().length
        },
        silent: {
            group: GROUPS.options,
            description: DESCRIPTIONS.silent,
            'boolean': true
        },
        version: {
            group: GROUPS.miscellaneous
        }
    })
    .version('version', DESCRIPTIONS.version, VERSION)
    .argv;
