import {
    PROCESS_MESSAGE,
    FORK_DONE,
    FORK_EXEC
} from '../../src/Events';

export function send(data) {
    process.send({
        type: FORK_DONE,
        data
    });
}

process.on(PROCESS_MESSAGE, ({ type, data }) => {
    if (type === FORK_EXEC) {
        send(data);
    }
});
