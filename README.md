[![NPM version](https://img.shields.io/npm/v/webpack-cluster.svg)](https://www.npmjs.org/package/webpack-cluster)
[![Travis build status](https://travis-ci.org/Fitbit/webpack-cluster.svg?branch=master)](https://travis-ci.org/Fitbit/webpack-cluster)
[![AppVeyor build status](https://ci.appveyor.com/api/projects/status/2bge8bboa63ap3vs/branch/master?svg=true)](https://ci.appveyor.com/project/mdreizin/webpack-cluster/branch/master)
[![Code Climate Maintainability](https://api.codeclimate.com/v1/badges/de8ade76d10f45d3e070/maintainability)](https://codeclimate.com/github/Fitbit/webpack-cluster)
[![Code Climate Coverage](https://api.codeclimate.com/v1/badges/de8ade76d10f45d3e070/test_coverage)](https://codeclimate.com/github/Fitbit/webpack-cluster)
[![Dependency Status](https://img.shields.io/david/Fitbit/webpack-cluster.svg)](https://david-dm.org/Fitbit/webpack-cluster)
[![Development Dependency Status](https://img.shields.io/david/dev/Fitbit/webpack-cluster.svg)](https://david-dm.org/Fitbit/webpack-cluster#info=devDependencies)
[![Greenkeeper badge](https://badges.greenkeeper.io/Fitbit/webpack-cluster.svg)](https://greenkeeper.io/)

# webpack-cluster
> Helps to make parallel webpack compilation easily

![](screenshot.gif)

## Installation

```bash
npm install webpack-cluster --save-dev
```

or

```bash
yarn add webpack-cluster --dev
```

## Usage

CLI

```text
$ webpack-cluster --config=**/webpack.config.js [options]

Options:
  --config       Specifies configuration files using `glob` pattern
                                                              [array] [required]
  --failures     Sets failure options                            [default: true]
  --watch        Enables `watch` mode                                  [boolean]
  --dryRun       Enables `dryRun` mode                                 [boolean]
  --concurrency  Sets maximum number of concurrent compilers
                                                           [number] [default: 8]
  --silent       Suppress all output                                   [boolean]

Miscellaneous:
  --version  Outputs version number                                    [boolean]
```

Node API

<!-- eslint no-console: 0 -->
```javascript
import WebpackCluster from 'webpack-cluster';

const webpackCluster = new WebpackCluster({
    dryRun: false,
    concurrency: 10,
    failures: {
        sysErrors: true,
        errors: true,
        warnings: true
    }
});

webpackCluster.run([
    './src/**/webpack.config.js'
]).then(results => { // In case of success
    console.log(results); // ['./src/app1/webpack.config.js', './src/app2/webpack.config.js']
}).catch(results => { // In case of any errors
    console.log(results); // [Error { filename: './src/app3/webpack.config.js', code: 2 }]
});
```

`./gulpfile.js`

```javascript
import gulp from 'gulp';
import gutil from 'gulp-util';
import WebpackCluster from 'webpack-cluster';

const webpackCluster = new WebpackCluster({
    dryRun: false,
    concurrency: 10,
    failures: {
        sysErrors: true,
        errors: true,
        warnings: true
    }
});

gulp.task('run', [], callback => {
    webpackCluster.run([
        './src/**/webpack.config.js'
    ]).then(callback).catch(err => {
        callback(new gutil.PluginError('webpack-cluster', err));
    });
});

gulp.task('watch', [], callback => {
    webpackCluster.watch([
        './src/**/webpack.config.js'
    ]).then(callback).catch(err => {
        callback(new gutil.PluginError('webpack-cluster', err));
    });
});
```
