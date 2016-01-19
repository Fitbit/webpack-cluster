'use strict';

require('worker-farm');

var workerFarmMock = function(options, path) {
    return require(path);
};

workerFarmMock.end = function() {};

require.cache[require.resolve('worker-farm')].exports = workerFarmMock;

module.exports = workerFarmMock;
