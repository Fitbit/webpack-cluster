import {
    join
} from 'path';

export default {
    filename: __filename,
    output: {
        path: join(__dirname, 'tmp', '0')
    }
};
