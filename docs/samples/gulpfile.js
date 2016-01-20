'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    WebpackGlob = require('webpack-glob');

var webpackOptions = {
        output: {
            path: './dist'
        },
        stats: {
            colors: true,
            hash: true,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false,
            children: true,
            version: false,
            cached: false,
            cachedAssets: false,
            reasons: false,
            source: false,
            errorDetails: false
        }
    },
    compilerOptions = {
        progress: false,
        json: false,
        memoryFs: false
    };

gulp.task('webpack', [], function(callback) {
    var webpack = new WebpackGlob(compilerOptions, webpackOptions);

    webpack.run('./src/**/webpack.config.js').then(function() {
        callback();
    }).catch(function(err) {
        callback(new gutil.PluginError('webpack', err));
    });
});
