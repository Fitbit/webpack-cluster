'use strict';

var path = require('path');

module.exports = function (wallaby) {
    process.env.NODE_PATH += path.delimiter + path.join(wallaby.localProjectDir, 'node_modules');

    return {
        files: [
            'lib/*.js',
            'test/fixtures/**/*.js',
            'index.js',
            'package.json'
        ],
        tests: [
            'test/*.spec.js'
        ],
        testFramework: 'jasmine',
        env: {
            type: 'node'
        }
    };
};
