'use strict';

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    WebpackGlob = require('webpack-glob');

var webpackOptions = {
        output: {
            path: './dist'
        }
    },
    compilerOptions = {
        progress: false,
        json: false,
        stats: false,
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
