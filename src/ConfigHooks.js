import {
    get,
    isString,
    includes
} from 'lodash';
import {
    resolve,
    join
} from 'path';
import {
    Glob
} from 'glob';
import glob2base from 'glob2base';

/**
 * @private
 * @param {String} key
 * @param {*} value
 * @param {*} fallback
 * @returns {*}
 */
const getOrDefault = (key, value, fallback) => get(value, key, get(fallback, key));

/**
 * @type {Object<String,Function>}
 */
export default {
    /**
     * @param {String} key
     * @param {Config} current
     * @param {Config} previous
     * @returns {String}
     */
    'output.path': (key, current, previous) => {
        let base = getOrDefault('resolve.base', current, previous),
            pattern = getOrDefault('resolve.pattern', current, previous),
            currentPath = get(current, key),
            previousPath = get(previous, key);

        const isGlob = includes(pattern, '*');

        if (isGlob) {
            base = glob2base(new Glob(pattern));
        }

        if (isString(base)) {
            base = resolve(base);
        }

        if (isString(pattern)) {
            pattern = resolve(pattern);
        }

        if (isString(currentPath)) {
            currentPath = resolve(currentPath);
        }

        if (isString(previousPath)) {
            previousPath = resolve(previousPath);
        }

        currentPath = join(currentPath, previousPath.replace(base, ''));

        return currentPath;
    }
};
