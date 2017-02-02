import EventEmitter from 'Events';
import {
    FORK_SEND
} from './Events';
import {
    FORK_DISCONNECT
} from '../../src/Events';

/**
 * @class
 * @extends {EventEmitter}
 */
class ForkMock extends EventEmitter {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * @returns {void}
     */
    kill() {
        this.emit(FORK_DISCONNECT);
        this.removeAllListeners();
    }

    /**
     * @param {Object} message
     * @returns {void}
     */
    send(message) {
        this.emit(FORK_SEND, message);
    }
}

export default ForkMock;
