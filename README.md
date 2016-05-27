[![NPM version](http://img.shields.io/npm/v/webpack-cluster.svg?style=flat-square)](https://www.npmjs.org/package/webpack-cluster)
[![Travis build status](http://img.shields.io/travis/mdreizin/webpack-cluster/master.svg?style=flat-square)](https://travis-ci.org/mdreizin/webpack-cluster)
[![AppVeyor build status](https://img.shields.io/appveyor/ci/mdreizin/webpack-cluster/master.svg?style=flat-square)](https://ci.appveyor.com/project/mdreizin/webpack-cluster/branch/master)
[![Code Climate GPA](https://img.shields.io/codeclimate/github/github/mdreizin/webpack-cluster.svg?style=flat-square)](https://codeclimate.com/github/mdreizin/webpack-cluster)
[![Code Climate Coverage](https://img.shields.io/codeclimate/coverage/github/github/mdreizin/webpack-cluster.svg?style=flat-square)](https://codeclimate.com/github/mdreizin/webpack-cluster)
[![Dependency Status](https://img.shields.io/david/mdreizin/webpack-cluster.svg?style=flat-square)](https://david-dm.org/mdreizin/webpack-cluster)
[![Development Dependency Status](https://img.shields.io/david/dev/mdreizin/webpack-cluster.svg?style=flat-square)](https://david-dm.org/mdreizin/webpack-cluster#info=devDependencies)

webpack-cluster
===============

Helps to make parallel webpack compilation easily

<h2 id="usage">Usage</h2>

<h3 id="usage-cli">CLI</h3>

```
$ webpack-cluster --config=**/webpack.config.js [options]

Compiler:
  --config      Specifies configuration files using `minimatch` pattern
                                                             [string] [required]
  --progress    Displays compilation progress                          [boolean]
  --json        Saves `stats` object to JSON file                      [boolean]
  --silent      Suppress all output                                    [boolean]
  --watch       Runs webpack compiler in `watch` mode                  [boolean]
  --memoryFs    Compiles to memory                                     [boolean]
  --maxWorkers  Number of concurrent workers
                                 [number] [default: require('os').cpus().length]

Webpack:
  --profile  Captures timing information for each module               [boolean]
  --[*]      Many configuration options are mapped from CLI automatically

Miscellaneous:
  --version  Outputs the version number                                [boolean]

```

<h3 id="usage-gulp-js">Gulp.js</h3>

```javascript
import gulp from 'gulp';
import gutil from 'gulp-util';
import WebpackCluster from 'webpack-cluster';

const WEBPACK_OPTIONS = {
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
    COMPILER_OPTIONS = {
        progress: false,
        json: false,
        memoryFs: false
    },
    webpack = new WebpackCluster(COMPILER_OPTIONS, WEBPACK_OPTIONS);

gulp.task('run', [], callback => {
    webpack.run('./src/**/webpack.config.js').then(callback).catch(err => {
        callback(new gutil.PluginError('webpack', err));
    });
});

gulp.task('watch', [], callback => {
    webpack.watch('./src/**/webpack.config.js').then(callback).catch(err => {
        callback(new gutil.PluginError('webpack', err));
    });
});

```
