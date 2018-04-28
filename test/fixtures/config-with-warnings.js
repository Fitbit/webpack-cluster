import {
    join
} from 'path';

export default {
    mode: 'development',
    entry: 'index.js',
    resolve: {
        modules: [
            __dirname
        ]
    },
    output: {
        path: join(__dirname, 'tmp', 'config-with-warnings')
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'eslint-loader',
            options: {
                emitWarning: true,
                rules: {
                    quotes: [1, 'double']
                }
            }
        }]
    }
};
