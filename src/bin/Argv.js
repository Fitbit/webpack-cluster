import yargs from 'yargs';
import {
    cpus
} from 'os';
import GROUPS from './Groups';
import MESSAGES from './Messages';
import COMPILER_PROPERTIES from './CompilerProperties';
import LOCAL_PROPERTIES from './LocalProperties';
import SYSTEM_PROPERTIES from './SystemProperties';
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
        [LOCAL_PROPERTIES.config]: {
            group: GROUPS.compiler,
            required: true,
            string: true,
            description: MESSAGES.config,
            nargs: 1,
            array: true
        },
        [COMPILER_PROPERTIES.progress]: {
            group: GROUPS.compiler,
            description: MESSAGES.progress,
            'boolean': true
        },
        [COMPILER_PROPERTIES.json]: {
            group: GROUPS.compiler,
            description: MESSAGES.json,
            'boolean': true
        },
        [COMPILER_PROPERTIES.silent]: {
            group: GROUPS.compiler,
            description: MESSAGES.silent,
            'boolean': true
        },
        [COMPILER_PROPERTIES.watch]: {
            group: GROUPS.compiler,
            description: MESSAGES.watch,
            'boolean': true
        },
        [COMPILER_PROPERTIES.memoryFs]: {
            group: GROUPS.compiler,
            description: MESSAGES.memoryFs,
            'boolean': true
        },
        [COMPILER_PROPERTIES.maxWorkers]: {
            group: GROUPS.compiler,
            description: MESSAGES.maxWorkers,
            number: true,
            defaultDescription: 'require(\'os\').cpus().length',
            'default': cpus().length
        },
        [SYSTEM_PROPERTIES.rest]: {
            group: GROUPS.webpack,
            description: MESSAGES.webpack
        },
        [SYSTEM_PROPERTIES.version]: {
            group: GROUPS.miscellaneous
        }
    })
    .version(SYSTEM_PROPERTIES.version, MESSAGES.version, VERSION)
    .argv;
