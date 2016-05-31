import yargs from 'yargs';
import {
    cpus
} from 'os';
import GROUPS from './Groups';
import MESSAGES from './Messages';
import pkg from '../../package.json';

/**
 * @type {String}
 */
const VERSION = pkg.version || 'DEV';

/**
 * @type {Object<String,*>}
 */
export default yargs
    .usage(`${pkg.name} --config=**/webpack.config.js [options]`)
    .options({
        config: {
            group: GROUPS.compiler,
            required: true,
            string: true,
            description: MESSAGES.config,
            nargs: 1,
            array: true
        },
        progress: {
            group: GROUPS.compiler,
            description: MESSAGES.progress,
            'boolean': true
        },
        json: {
            group: GROUPS.compiler,
            description: MESSAGES.json,
            'boolean': true
        },
        profile: {
            group: GROUPS.webpack,
            description: MESSAGES.profile,
            'boolean': true
        },
        silent: {
            group: GROUPS.compiler,
            description: MESSAGES.silent,
            'boolean': true
        },
        watch: {
            group: GROUPS.compiler,
            description: MESSAGES.watch,
            'boolean': true
        },
        memoryFs: {
            group: GROUPS.compiler,
            description: MESSAGES.memoryFs,
            'boolean': true
        },
        maxWorkers: {
            group: GROUPS.compiler,
            description: MESSAGES.maxWorkers,
            number: true,
            defaultDescription: 'require(\'os\').cpus().length',
            'default': cpus().length
        },
        '[*]': {
            group: GROUPS.webpack,
            description: MESSAGES.webpack
        },
        version: {
            group: GROUPS.miscellaneous
        }
    })
    .version('version', MESSAGES.version, VERSION)
    .argv;
