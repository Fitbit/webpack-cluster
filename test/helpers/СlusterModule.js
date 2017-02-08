import ClusterMock from '../mock/ClusterMock';
import ForkMock from '../mock/ForkMock';
import {
    CLUSTER_INTERNAL_MESSAGE
} from '../mock/Events';
import {
    FORK_MESSAGE
} from '../../src/Events';

const cluster = new ClusterMock(),
    processOn = process.on;

process.setMaxListeners(Number.MAX_VALUE);

process.send = message => {
    const fork = cluster.workers[message.data.filename];

    if (fork instanceof ForkMock) {
        fork.emit(FORK_MESSAGE, message);
    }
};

process.on = (type, callback) => {
    if (type === FORK_MESSAGE) {
        cluster.removeListener(CLUSTER_INTERNAL_MESSAGE, callback);
        cluster.on(CLUSTER_INTERNAL_MESSAGE, callback);
    } else {
        processOn.apply(process, Array.from(arguments));
    }
};

require.cache[require.resolve('cluster')] = {
    exports: cluster
};
