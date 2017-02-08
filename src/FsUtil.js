import {
    resolve as resolvePath
} from 'path';
import glob from 'glob';
import {
    watch
} from 'chokidar';

/**
 * @module FsUtil
 */

/**
 * @private
 * @type {Object}
 */
const FIND_OPTIONS = {
    cache: true,
    dot: false,
    silent: true
};

/**
 * @private
 * @type {Object}
 */
const WATCH_OPTIONS = {
    ignoreInitial: true,
    atomic: true,
    ignorePermissionErrors: true
};

/**
 * @private
 * @callback FsWatchCallback
 * @param {String} filename
 * @returns {void}
 */
const DEFAULT_WATCH_CALLBACK = filename => {}; // eslint-disable-line no-unused-vars

/**
 * @param {String[]} patterns
 * @returns {Promise<String[]>}
 */
export function findFiles(patterns) {
    const promises = [
        ...new Set(patterns)
    ].map(pattern => {
        return new Promise(resolve => {
            glob(pattern, FIND_OPTIONS, (err, files) => resolve(files));
        });
    });

    return Promise.all(promises)
        .then(files => [].concat(...files))
        .then(files => [...new Set(files)])
        .then(files => files.map(filename => resolvePath(filename)));
}

/**
 * @param {String[]} patterns
 * @param {FsWatchCallback} [callback]
 * @returns {Promise<FSWatcher[]>}
 */
export function watchFiles(patterns, callback = DEFAULT_WATCH_CALLBACK) {
    const promises = [
        ...new Set(patterns)
    ].map(pattern => {
        return new Promise(resolve => {
            const watcher = watch(pattern, WATCH_OPTIONS),
                localCallback = filename => callback(resolvePath(filename));

            watcher.on('ready', () => resolve(watcher))
                .on('add', localCallback)
                .on('change', localCallback);
        });
    });

    return Promise.all(promises)
        .then(watchers => [].concat(...watchers));
}
