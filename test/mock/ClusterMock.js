import EventEmitter from 'events';
import ForkMock from './ForkMock';
import {
    CLUSTER_INTERNAL_MESSAGE,
    CLUSTER_FORK,
    FORK_SEND
} from './Events';
import {
    FORK_ONLINE
} from '../../src/Events';

/**
 * @class
 * @extends {EventEmitter}
 */
class ClusterMock extends EventEmitter {
    /**
     * @constructor
     */
    constructor() {
        super();

        this.workers = {};
        this.settings = {};
    }

    /**
     * @param {Object} settings
     * @returns {void}
     */
    setupMaster(settings) {
        if (this.settings !== settings) {
            require(settings.exec);
        }

        this.settings = settings;
    }

    /**
     * @returns {ForkMock}
     */
    fork() {
        const fork = new ForkMock();

        fork.on(FORK_SEND, message => {
            this.workers[message.data.filename] = fork;

            this.emit(CLUSTER_INTERNAL_MESSAGE, message);
        });

        this.once(CLUSTER_FORK, () => fork.emit(FORK_ONLINE));

        process.nextTick(() => this.emit(CLUSTER_FORK, fork));

        return fork;
    }

    /**
     * @param {Function} callback
     * @returns {void}
     */
    disconnect(callback) {
        const internalMessageListeners = this.listeners(CLUSTER_INTERNAL_MESSAGE);

        this.removeAllListeners();

        internalMessageListeners.forEach(listener => this.on(CLUSTER_INTERNAL_MESSAGE, listener));

        for (const [filename, worker] of Object.entries(this.workers)) {
            delete this.workers[filename];

            worker.kill();
        }

        callback();
    }
}

export default ClusterMock;
