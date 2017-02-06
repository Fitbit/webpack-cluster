[![NPM version](http://img.shields.io/npm/v/webpack-cluster.svg?style=flat-square)](https://www.npmjs.org/package/webpack-cluster)
[![Travis build status](http://img.shields.io/travis/Fitbit/webpack-cluster/master.svg?style=flat-square)](https://travis-ci.org/Fitbit/webpack-cluster)
[![AppVeyor build status](https://img.shields.io/appveyor/ci/mdreizin/webpack-cluster/master.svg?style=flat-square)](https://ci.appveyor.com/project/mdreizin/webpack-cluster/branch/master)
[![Code Climate GPA](https://img.shields.io/codeclimate/github/Fitbit/webpack-cluster.svg?style=flat-square)](https://codeclimate.com/github/Fitbit/webpack-cluster)
[![Code Climate Coverage](https://img.shields.io/codeclimate/coverage/github/Fitbit/webpack-cluster.svg?style=flat-square)](https://codeclimate.com/github/Fitbit/webpack-cluster)
[![Dependency Status](https://img.shields.io/david/Fitbit/webpack-cluster.svg?style=flat-square)](https://david-dm.org/Fitbit/webpack-cluster)
[![Development Dependency Status](https://img.shields.io/david/dev/Fitbit/webpack-cluster.svg?style=flat-square)](https://david-dm.org/Fitbit/webpack-cluster#info=devDependencies)

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
    webpackCluster.run('./src/**/webpack.config.js').then(callback).catch(err => {
        callback(new gutil.PluginError('webpack-cluster', err));
    });
});

gulp.task('watch', [], callback => {
    webpackCluster.watch('./src/**/webpack.config.js').then(callback).catch(err => {
        callback(new gutil.PluginError('webpack-cluster', err));
    });
});
```
