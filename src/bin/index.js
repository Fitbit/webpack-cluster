#!/usr/bin/env node
import {
    pick,
    omit
} from 'lodash';
import ARGV from './Argv';
import SYSTEM_PROPERTIES from './SystemProperties';
import LOCAL_PROPERTIES from './LocalProperties';
import COMPILER_PROPERTIES from './CompilerProperties';
import CompilerAdapter from '../index';

const compilerOptions = pick(ARGV, Object.values(COMPILER_PROPERTIES)),
    webpackOptions = omit(ARGV, [
        ...Object.values(LOCAL_PROPERTIES),
        ...Object.values(COMPILER_PROPERTIES),
        ...Object.values(SYSTEM_PROPERTIES)
    ]),
    adapter = new CompilerAdapter(compilerOptions, webpackOptions);

let exitCode = 0,
    promise;

if (ARGV[COMPILER_PROPERTIES.watch]) {
    promise = adapter.watch(ARGV[LOCAL_PROPERTIES.config]);
} else {
    promise = adapter.run(ARGV[LOCAL_PROPERTIES.config]);
}

promise.catch(() => {
    exitCode = 1;
});

process.on('exit', () => {
    process.exit(exitCode); // eslint-disable-line no-process-exit
});
