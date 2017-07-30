import {
    join
} from 'path';

export default {
    entry: 'index.js',
    resolve: {
        modules: [
            __dirname
        ]
    },
    output: {
        path: join(__dirname, 'tmp', 'config-with-errors')
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'eslint-loader',
            options: {
                emitError: true,
                rules: {
                    quotes: [2, 'double']
                }
            }
        }]
    }
};
