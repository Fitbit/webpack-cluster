import {
    join
} from 'path';

export default () => {
    return {
        entry: 'index.js',
        resolve: {
            modules: [
                __dirname
            ]
        },
        output: {
            path: join(__dirname, 'tmp', 'config-function')
        }
    };
};
