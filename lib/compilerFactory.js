'use strict';

var webpack = require('webpack'),
    MemoryFs = require('memory-fs'),
    progressPluginFactory = require('./progressPluginFactory'),
    statsWriterPluginFactory = require('./statsWriterPluginFactory');

/**
 * @private
 * @function
 * @alias compilerFactory
 * @param {Config|Config[]} config
 * @param {CompilerOptions} options
 * @returns {Compiler}
 */
function compilerFactory(config, options) {
    var compiler = config && webpack(config);

    if (compiler) {
        if (options.memoryFs === true) {
            compiler.outputFileSystem = new MemoryFs();
        }

        if (options.json === true) {
            compiler.apply(statsWriterPluginFactory('stats.json'));
        }

        var filename = config.filename;

        if (options.progress === true && filename) {
            compiler.apply(progressPluginFactory(filename));
        }
    }

    return compiler;
}

/**
 * @private
 * @module webpack-glob/lib/compilerFactory
 * @returns {compilerFactory}
 */
module.exports = compilerFactory;
