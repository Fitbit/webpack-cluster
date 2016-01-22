[![NPM version](http://img.shields.io/npm/v/webpack-glob.svg?style=flat)](https://www.npmjs.org/package/webpack-glob) [![Travis build status](http://img.shields.io/travis/mdreizin/webpack-glob/master.svg?style=flat)](https://travis-ci.org/mdreizin/webpack-glob) [![AppVeyor build status](https://ci.appveyor.com/api/projects/status/github/mdreizin/webpack-glob?svg=true&branch=master)](https://ci.appveyor.com/project/mdreizin/webpack-glob) [![Code Climate](https://codeclimate.com/github/mdreizin/webpack-glob/badges/gpa.svg)](https://codeclimate.com/github/mdreizin/webpack-glob) [![Code Climate](https://codeclimate.com/github/mdreizin/webpack-glob/badges/coverage.svg)](https://codeclimate.com/github/mdreizin/webpack-glob) [![Dependency Status](https://david-dm.org/mdreizin/webpack-glob.svg?style=flat)](https://david-dm.org/mdreizin/webpack-glob) [![Dependency Status](https://david-dm.org/mdreizin/webpack-glob/dev-status.svg?style=flat)](https://david-dm.org/mdreizin/webpack-glob#info=devDependencies)

[webpack](https://github.com/webpack/webpack) + [glob](https://github.com/isaacs/node-glob) = :heart:
=====================================================================================================

<h2 id="documentation">Documentation</h2>

For API docs please see the [documentation page](https://github.com/mdreizin/webpack-glob/blob/master/docs/API.md).

<h2 id="usage">Usage</h2>

<h3 id="usage-cli">CLI</h3>

```
$ webpack-glob --config=./src/**/webpack.config.js [options]

Compiler:
  --config    Specifies configuration files using `minimatch` pattern
                                                             [string] [required]
  --progress  Displays compilation progress           [boolean] [default: false]
  --json      Saves `stats` object to JSON file       [boolean] [default: false]
  --watch     Runs webpack compiler in `watch` mode   [boolean] [default: false]
  --memoryFs  Compiles to memory                      [boolean] [default: false]

Webpack:
  --profile  Captures timing information for each module
                                                      [boolean] [default: false]
  --[*]      Many configuration options are mapped from CLI automatically
                                                                   [default: {}]

Miscellaneous:
  --version  Outputs the version number                                 [string]

```

<h3 id="usage-gulp-js">Gulp.js</h3>

```javascript
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

```
