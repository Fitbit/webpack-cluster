import PromisePool from '../src/PromisePool';
import {
    delay
} from '../src/PromiseUtil';
import {
    canceledError
} from '../src/CompilerErrorFactory';

describe('PromisePool', () => {
    describe('#waitAll()', () => {
        it('should wait for all items', done => {
            const pool = new PromisePool(),
                err = new Error(4);

            pool.set(1, Promise.resolve(1))
                .set(2, Promise.resolve(2))
                .set(3, () => Promise.resolve(3))
                .set(4, Promise.reject(err));

            pool.waitAll().then(results => {
                expect(pool.pending.size).toEqual(0);
                expect(pool.canceled.size).toEqual(0);
                expect(results).toEqual([
                    1,
                    2,
                    3,
                    err
                ]);

                done();
            });
        });
    });

    describe('#closeAll()', () => {
        it('should cancel all items', done => {
            const pool = new PromisePool(),
                val = 1,
                cancelablePromise1 = delay(40).then(() => Promise.resolve(4)),
                cancelablePromise2 = delay(40).then(() => Promise.resolve(4));

            cancelablePromise1.cancel = () => Promise.resolve();
            cancelablePromise2.cancel = () => Promise.reject();

            pool.set(1, delay(10).then(() => Promise.resolve(val)))
                .set(2, delay(20).then(() => Promise.resolve(2)))
                .set(3, delay(30).then(() => Promise.resolve(3)))
                .set(4, cancelablePromise1)
                .set(5, cancelablePromise2);

            delay(15).then(() => pool.closeAll()).then(results => {
                expect(results).toEqual([
                    canceledError(2),
                    canceledError(3),
                    canceledError(4),
                    canceledError(5)
                ]);
            });

            pool.waitAll().then(results => {
                expect(pool.canceled.size).toEqual(0);
                expect(pool.pending.size).toEqual(0);
                expect(results).toEqual([
                    val,
                    canceledError(2),
                    canceledError(3),
                    canceledError(4),
                    canceledError(5)
                ]);

                done();
            });
        });
    });

    describe('#clear()', () => {
        it('should clear all items', () => {
            const pool = new PromisePool();

            pool.set(1, Promise.resolve(1))
                .set(2, Promise.resolve(2))
                .set(3, Promise.resolve(3));

            pool.clear();

            expect(pool.size).toEqual(0);
        });
    });
});
