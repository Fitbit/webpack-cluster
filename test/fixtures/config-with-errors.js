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
        path: join(__dirname, 'tmp', 'config-with-errors')
    },
    module: {
        preLoaders: [{
            test: /\.js$/,
            loader: 'eslint-loader'
        }]
    },
    eslint: {
        emitError: true,
        rules: {
            quotes: [2, 'double']
        }
    }
};
