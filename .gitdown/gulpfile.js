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
