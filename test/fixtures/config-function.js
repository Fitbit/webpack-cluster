import {
    join
} from 'path';

export default () => {
    return {
        output: {
            path: join(__dirname, 'tmp', 'config-function')
        }
    };
};
