import ForkPromise from '../src/ForkPromise';

const WORKER_PATH = require.resolve('./mock/WorkerMock'),
    CONFIG_FILENAME = require.resolve('./fixtures/config-object');

describe('ForkPromise', () => {
    describe('.setupMaster()', () => {
        it('should setup master successfully', done => {
            ForkPromise.setupMaster({
                exec: WORKER_PATH
            }).then(() => done());
        });
    });

    describe('.closeMaster()', () => {
        it('should close master successfully', done => {
            ForkPromise.closeMaster()
                .then(() => done());
        });
    });

    describe('#open()', () => {
        it('should fork successfully', done => {
            ForkPromise.setupMaster({
                exec: WORKER_PATH
            }).then(() => {
                return new ForkPromise().open({
                    filename: CONFIG_FILENAME,
                    dryRun: true,
                    silent: true
                });
            }).then(() => ForkPromise.closeMaster()).then(() => done());
        });
    });

    describe('#cancel()', () => {
        it('should cancel successfully', done => {
            ForkPromise.setupMaster({
                exec: WORKER_PATH
            }).then(() => {
                return new ForkPromise().cancel();
            }).then(() => {
                return ForkPromise.fork({
                    filename: CONFIG_FILENAME,
                    dryRun: true,
                    silent: true
                }).cancel();
            }).then(() => ForkPromise.closeMaster()).then(() => done());
        });
    });
});
