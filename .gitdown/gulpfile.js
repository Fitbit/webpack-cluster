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
