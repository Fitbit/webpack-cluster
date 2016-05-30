import 'cluster';
import EventEmitter from 'events';

const CLUSTER_EVENTS = {
        internalMessage: 'internalMessage',
        fork: 'fork'
    },
    FORK_EVENTS = {
        message: 'message',
        disconnect: 'disconnect',
        send: 'send',
        online: 'online'
    };

class ForkMock extends EventEmitter {
    constructor() {
        super();
    }

    kill() {
        this.emit(FORK_EVENTS.disconnect);
        this.removeAllListeners();
    }

    send(message) {
        this.emit(FORK_EVENTS.send, message);
    }
}

class ClusterMock extends EventEmitter {
    constructor() {
        super();

        this.workers = {};
        this.settings = {};
    }

    setupMaster(settings) {
        if (this.settings !== settings) {
            require(settings.exec);
        }

        this.settings = settings;
    }

    fork() {
        const worker = new ForkMock();

        worker.on(FORK_EVENTS.send, message => {
            this.workers[message.data.filename] = worker;

            this.emit(CLUSTER_EVENTS.internalMessage, message);
        });

        this.once(CLUSTER_EVENTS.fork, () => worker.emit(FORK_EVENTS.online));

        process.nextTick(() => this.emit(CLUSTER_EVENTS.fork, worker));

        return worker;
    }

    disconnect(callback) {
        const internalMessageListeners = this.listeners(CLUSTER_EVENTS.internalMessage);

        this.removeAllListeners();

        internalMessageListeners.forEach(listener => this.on(CLUSTER_EVENTS.internalMessage, listener));

        for (const [filename, worker] of Object.entries(this.workers)) {
            delete this.workers[filename];

            worker.kill();
        }

        callback();
    }
}

const clusterMock = new ClusterMock(),
    processOn = process.on;

process.send = message => {
    const worker = clusterMock.workers[message.data.filename];

    if (worker instanceof ForkMock) {
        worker.emit(FORK_EVENTS.message, message);
    }
};

process.on = (type, callback) => {
    if (type === FORK_EVENTS.message) {
        clusterMock.removeListener(CLUSTER_EVENTS.internalMessage, callback);
        clusterMock.on(CLUSTER_EVENTS.internalMessage, callback);
    } else {
        processOn.apply(process, Array.from(arguments));
    }
};

require.cache[require.resolve('cluster')] = {
    exports: clusterMock
};
