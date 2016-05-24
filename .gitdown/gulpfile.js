import gulp from 'gulp';
import gutil from 'gulp-util';
import CompilerAdapter from 'webpack-glob';

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
    compilerAdapter = new CompilerAdapter(COMPILER_OPTIONS, WEBPACK_OPTIONS);

gulp.task('run', [], callback => {
    compilerAdapter.run('./src/**/webpack.config.js').then(callback).catch(err => {
        callback(new gutil.PluginError('webpack', err));
    });
});

gulp.task('watch', [], callback => {
    compilerAdapter.watch('./src/**/webpack.config.js').then(callback).catch(err => {
        callback(new gutil.PluginError('webpack', err));
    });
});
