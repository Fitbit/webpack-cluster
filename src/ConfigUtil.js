import {
    resolve as resolvePath
} from 'path';
import {
    isFunction
} from 'lodash';
import yargs from 'yargs';

/**
 * @module ConfigUtil
 */

/**
 * @private
 * @type {Object}
 */
const ARGV = yargs.options({
    env: {}
}).argv;

/**
 * @internal
 * @param {String} filename
 * @returns {Promise<Object|Error>}
 */
export function loadConfig(filename) {
    let promise;

    try {
        let config = require(resolvePath(filename));

        if (isFunction(config)) {
            config = config(ARGV.env);
        }

        promise = Promise.resolve(config);
    } catch (err) {
        promise = Promise.reject(err);
    }

    return promise;
}
