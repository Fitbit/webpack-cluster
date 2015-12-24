'use strict';

var path = require('path');

module.exports = {
    filename: __filename,
    output: {
        path: path.join(__dirname, 'tmp', '0')
    }
};
