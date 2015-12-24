'use strict';

/**
 * @private
 * @alias StatsWriterPlugin
 * @param filename
 * @class
 */
function StatsWriterPlugin(filename) {
    this.filename = filename;
}

/**
 * @private
 */
StatsWriterPlugin.prototype.apply = function(compiler) {
    var filename = this.filename;

    compiler.plugin('emit', function (compilation, callback) {
        var stats = compilation.getStats().toJson(),
            buffer = new Buffer(JSON.stringify(stats));

        compilation.assets[filename] = {
            source: function() {
                return buffer;
            },

            size: function () {
                return buffer.length;
            }
        };

        callback();
    });
};

/**
 * @private
 * @module webpack-glob/lib/statsWriterPlugin
 */
module.exports = StatsWriterPlugin;
