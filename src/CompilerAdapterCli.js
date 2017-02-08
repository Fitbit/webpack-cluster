#!/usr/bin/env node
import {
    omit
} from 'lodash';
import ARGV from './CompilerAdapterCliArgv';
import {
    PROCESS_EXIT
} from './Events';
import CompilerAdapter from './CompilerAdapter';

/**
 * @private
 * @type {Object<String,Number>}
 */
const EXIT_CODE = {
    SUCCESS: 0,
    ERROR: 1
};

/**
 * @private
 * @param {Object} argv
 * @returns {void}
 */
function main(argv) {
    const adapter = new CompilerAdapter(omit(argv, [
        '$0',
        '_',
        'version',
        'config',
        'watch'
    ]));

    let exitCode,
        promise;

    if (argv.watch === true) {
        promise = adapter.watch(argv.config);
    } else {
        promise = adapter.run(argv.config);
    }

    promise.then(() => {
        exitCode = EXIT_CODE.SUCCESS;
    }).catch(() => {
        exitCode = EXIT_CODE.ERROR;
    });

    process.on(PROCESS_EXIT, () => {
        process.exit(exitCode); // eslint-disable-line no-process-exit
    });
}

main(ARGV);
