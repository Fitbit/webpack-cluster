'use strict';

var _ = require('lodash'),
    MessageFormat = require('messageformat');

/**
 * @private
 * @type {MessageFormat}
 */
var mf = new MessageFormat('en');

/**
 * @private
 * @function
 * @param {Object<*,String>} messages
 * @returns {Object<*,Function>}
 */
function messageCompiler(messages) {
    return _.mapValues(messages, function(message) {
        return mf.compile(message);
    });
}

/**
 * @private
 * @module webpack-glob/lib/messageCompiler
 */
module.exports = messageCompiler;
