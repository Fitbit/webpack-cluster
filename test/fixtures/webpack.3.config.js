import {
    join
} from 'path';

export default {
    entry: {
        test: 'index.js'
    },
    filename: __filename,
    resolve: {
        root: [
            __dirname
        ]
    },
    output: {
        path: join(__dirname, 'tmp', '3')
    }
};
