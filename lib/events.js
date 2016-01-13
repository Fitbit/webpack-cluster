'use strict';

/**
 * @private
 * @constant
 * @alias EVENTS
 * @type {Object<String,String>}
 */
var EVENTS = {
    run: 'run',
    watch: 'watch',
    stats: 'stats',
    timings: 'timings',
    violations: 'violations'
};

/**
 * @private
 * @module webpack-glob/lib/events
 * @returns {EVENTS}
 */
module.exports = EVENTS;