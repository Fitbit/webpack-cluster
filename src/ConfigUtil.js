import Config from 'webpack-config';

/**
 * @module ConfigUtil
 */

/**
 * @internal
 * @param {String} filename
 * @returns {Promise<Object|Error>}
 */
export function loadConfig(filename) {
    let promise;

    try {
        const config = new Config().extend(filename);

        promise = Promise.resolve(config);
    } catch (err) {
        promise = Promise.reject(err);
    }

    return promise;
}
