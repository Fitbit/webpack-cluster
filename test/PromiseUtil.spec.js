import {
    asLazy,
    toPromise,
    catchReturn,
    isCancelable,
    delay,
    isPromise
} from '../src/PromiseUtil';

describe('PromiseUtil', () => {
    describe('#asLazy()', () => {
        it('should convert `Promise` to `Function<Promise>`', () => {
            const promise = Promise.resolve(1),
                lazyPromise = asLazy(promise);

            expect(lazyPromise).toEqual(jasmine.any(Function));
            expect(lazyPromise()).toEqual(promise);
        });

        it('should not convert `Function<Promise>`', () => {
            const promise = Promise.resolve(1),
                lazyFn = () => promise,
                lazyPromise = asLazy(lazyFn);

            expect(lazyPromise).toEqual(lazyFn);
            expect(lazyPromise()).toEqual(promise);
        });
    });

    describe('#toPromise()', () => {
        it('should convert `Function<Promise>` or `Promise` to `Promise`', () => {
            const promise = Promise.resolve(1),
                lazyPromise = () => promise;

            expect(toPromise(lazyPromise)).toEqual(promise);
            expect(toPromise(promise)).toEqual(promise);
        });
    });

    describe('#isPromise()', () => {
        it('should detect `Promise`', () => {
            expect(isPromise(1)).toEqual(false);
            expect(isPromise(() => {})).toEqual(false);
            expect(isPromise(new Promise(resolve => resolve()))).toEqual(true);
            expect(isPromise(Promise.resolve())).toEqual(true);
        });
    });

    describe('#isCancelable()', () => {
        it('should detect `Promise` which has `.cancel` method', () => {
            const promise1 = Promise.resolve(1),
                promise2 = Promise.resolve(2);

            promise2.cancel = () => {};

            expect(isCancelable(promise1)).toEqual(false);
            expect(isCancelable(promise2)).toEqual(true);
        });
    });

    describe('#delay()', () => {
        it('should resolve `Promise` after 10 ms', done => {
            delay(10).then(() => done());
        });
    });

    describe('#catchReturn()', () => {
        it('should convert rejected `Promise` to resolved', done => {
            const err = new Error(1),
                promise = Promise.reject(err);

            catchReturn(promise).then(result => {
                expect(result).toEqual(err);

                done();
            });
        });
    });
});
