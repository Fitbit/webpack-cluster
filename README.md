[![NPM version](http://img.shields.io/npm/v/webpack-cluster.svg)](https://www.npmjs.org/package/webpack-cluster)
[![Travis build status](http://img.shields.io/travis/Fitbit/webpack-cluster/master.svg)](https://travis-ci.org/Fitbit/webpack-cluster)
[![AppVeyor build status](https://img.shields.io/appveyor/ci/mdreizin/webpack-cluster/master.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjAgMGMxMSAwIDIwIDkgMjAgMjBzLTkgMjAtMjAgMjBTMCAzMSAwIDIwIDkgMCAyMCAwem00LjkgMjMuOWMyLjItMi44IDEuOS02LjgtLjktOC45LTIuNy0yLjEtNi43LTEuNi05IDEuMi0yLjIgMi44LTEuOSA2LjguOSA4LjkgMi44IDIuMSA2LjggMS42IDktMS4yem0tMTAuNyAxM2MxLjIuNSAzLjggMSA1LjEgMUwyOCAyNS4zYzIuOC00LjIgMi4xLTkuOS0xLjgtMTMtMy41LTIuOC04LjQtMi43LTExLjkgMEwyLjIgMjEuNmMuMyAzLjIgMS4yIDQuOCAxLjIgNC45bDYuOS03LjVjLS41IDMuMy43IDYuNyAzLjUgOC44IDIuNCAxLjkgNS4zIDIuNCA4LjEgMS44bC03LjcgNy4zeiIgZmlsbD0iI0NDQyIgZmlsbC1ydWxlPSJub256ZXJvIi8%2BPC9zdmc%2B)](https://ci.appveyor.com/project/mdreizin/webpack-cluster/branch/master)
[![Code Climate GPA](https://img.shields.io/codeclimate/github/Fitbit/webpack-cluster.svg)](https://codeclimate.com/github/Fitbit/webpack-cluster)
[![Code Climate Coverage](https://img.shields.io/codeclimate/coverage/github/Fitbit/webpack-cluster.svg)](https://codeclimate.com/github/Fitbit/webpack-cluster)
[![Dependency Status](https://img.shields.io/david/Fitbit/webpack-cluster.svg)](https://david-dm.org/Fitbit/webpack-cluster)
[![Development Dependency Status](https://img.shields.io/david/dev/Fitbit/webpack-cluster.svg)](https://david-dm.org/Fitbit/webpack-cluster#info=devDependencies)

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

<!-- eslint no-console: "allow" -->
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
