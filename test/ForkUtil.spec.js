import {
    setupMaster,
    closeMaster,
    createFork,
    killFork,
    execFork
} from '../src/ForkUtil';

const WORKER_PATH = require.resolve('./mock/WorkerMock'),
    CONFIG_FILENAME = require.resolve('./fixtures/config-object');

describe('ForkUtil', () => {
    describe('#setupMaster()', () => {
        it('should setup master successfully', done => {
            setupMaster({
                exec: WORKER_PATH
            }).then(() => done());
        });
    });

    describe('#createFork()', () => {
        it('should create fork successfully', done => {
            setupMaster({
                exec: WORKER_PATH
            }).then(() => createFork())
                .then(() => closeMaster())
                .then(() => done());
        });
    });

    describe('#killFork()', () => {
        it('should kill fork successfully', done => {
            setupMaster({
                exec: WORKER_PATH
            }).then(() => createFork())
                .then(fork => killFork(fork))
                .then(() => closeMaster())
                .then(() => done());
        });
    });

    describe('#execFork()', () => {
        it('should exec fork successfully', done => {
            setupMaster({
                exec: WORKER_PATH
            }).then(() => createFork())
                .then(fork => {
                    return execFork(fork, {
                        filename: CONFIG_FILENAME,
                        dryRun: true,
                        silent: true
                    }).then(() => killFork(fork));
                })
                .then(() => closeMaster())
                .then(() => done());
        });
    });

    describe('#closeMaster()', () => {
        it('should close master successfully', done => {
            closeMaster()
                .then(() => done());
        });
    });
});
