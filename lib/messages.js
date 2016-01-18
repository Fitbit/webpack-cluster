'use strict';

var _ = require('lodash'),
    MessageFormat = require('messageformat');

/**
 * @private
 * @constant
 * @type {String}
 */
var LOCALE = 'en';

/**
 * @private
 * @type {MessageFormat}
 */
var mf = new MessageFormat(LOCALE);

/**
 * @private
 * @function
 * @alias messageCompiler
 * @param {Object<String,String>} messages
 * @returns {Object<String,Function>}
 */
function compile(messages) {
    return _.mapValues(messages, function(message) {
        return mf.compile(message);
    });
}

/**
 * @private
 * @constant
 * @alias MESSAGES
 * @type {Object<String,String>}
 */
var MESSAGES = {
    run: 'Compiling \\{white:{TOTAL}\\} webpack {TOTAL, plural, one {config} other {configs}} [{FILES}]',
    watch: 'Watching webpack configs [{FILES}]',
    stats: 'Stats for webpack config {FILE}',
    time: 'Finished in \\{white:{TIME}\\}',
    throwError: 'Cannot compile {TOTAL} webpack {TOTAL, plural, one {config} other {configs}} [{FILES}]',
    fatalError: '\\{white:{TOTAL}\\} webpack {TOTAL, plural, one {config} other {configs}} {TOTAL, plural, one {has} other {have}} fatal error [{FILES}]',
    error: '\\{white:{TOTAL}\\} webpack {TOTAL, plural, one {config} other {configs}} {TOTAL, plural, one {has} other {have}} some errors [{FILES}]',
    warn: '\\{white:{TOTAL}\\} webpack {TOTAL, plural, one {config} other {configs}} {TOTAL, plural, one {has} other {have}} some warnings [{FILES}]'
};

/**
 * @private
 * @alias COMPILED_MESSAGES
 * @type {Object<String,Function>}
 */
var COMPILED_MESSAGES = compile(MESSAGES);

/**
 * @private
 * @module webpack-glob/lib/messages
 * @returns {COMPILED_MESSAGES}
 */
module.exports = COMPILED_MESSAGES;
