#!/usr/bin/env node
import {
    pick,
    omit
} from 'lodash';
import ARGV from './Argv';
import SYSTEM_OPTIONS from './SystemOptions';
import LOCAL_OPTIONS from './LocalOptions';
import COMPILER_OPTIONS from './CompilerOptions';
import CompilerAdapter from '../index';

const compilerOptions = pick(ARGV, COMPILER_OPTIONS),
    webpackOptions = omit(ARGV, [...LOCAL_OPTIONS, ...COMPILER_OPTIONS, ...SYSTEM_OPTIONS]),
    adapter = new CompilerAdapter(compilerOptions, webpackOptions);

let exitCode = 0,
    promise;

if (ARGV.watch) {
    promise = adapter.watch(ARGV.config);
} else {
    promise = adapter.run(ARGV.config);
}

promise.catch(() => {
    exitCode = 1;
});

process.on('exit', () => {
    process.exit(exitCode); // eslint-disable-line no-process-exit
});
