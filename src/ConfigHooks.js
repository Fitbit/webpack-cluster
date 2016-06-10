import {
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
import WEBPACK_PROPERTIES from './CompilerWebpackProperties';

/**
 * @private
 * @param {String} path
 * @param {Config} value
 * @param {Config} fallback
 * @returns {*}
 */
const getOrDefault = (path, value, fallback) => value.get(path, fallback.get(path));

/**
 * @type {Object<String,Function>}
 */
export default {
    /**
     * @param {String} path
     * @param {Config} current
     * @param {Config} previous
     * @returns {String}
     */
    'output.path': (path, current, previous) => {
        let base = getOrDefault(`${WEBPACK_PROPERTIES.resolveCluster}.base`, current, previous),
            pattern = getOrDefault(`${WEBPACK_PROPERTIES.resolveCluster}.pattern`, current, previous),
            currentPath = current.get(path),
            previousPath = previous.get(path);

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
