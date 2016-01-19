'use strict';

module.exports = function () {
    return {
        files: [
            'lib/*.js',
            'test/helpers/**/*.js',
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
        },
        bootstrap: function () {
            require('./test/helpers/workerFarmMock');
        }
    };
};
