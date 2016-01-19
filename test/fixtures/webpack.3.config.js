'use strict';

var path = require('path');

module.exports = {
    entry: {
        test: 'index.js'
    },
    filename: __filename,
    resolve: {
        root: [
            __dirname
        ]
    },
    output: {
        path: path.join(__dirname, 'tmp', '3')
    }
};
