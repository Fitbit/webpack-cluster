import {
    join
} from 'path';

export default {
    entry: 'index.js',
    resolve: {
        root: [
            __dirname
        ]
    },
    output: {
        path: join(__dirname, 'tmp', 'config-with-warnings')
    },
    module: {
        preLoaders: [{
            test: /\.js$/,
            loader: 'eslint-loader'
        }]
    },
    eslint: {
        emitWarning: true,
        rules: {
            quotes: [1, 'double']
        }
    }
};
