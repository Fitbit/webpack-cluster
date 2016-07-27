import {
    exists
} from 'fs';
import {
    remove
} from 'fs-extra';
import ClusterRunStrategy from '../src/ClusterRunStrategy';

describe('ClusterRunStrategy', () => {
    let callbacks;

    afterEach(done => remove('./test/fixtures/tmp', done));

    beforeEach(() => {
        callbacks = {
            done: () => {},

            fail: () => {}
        };

        spyOn(callbacks, 'done');
        spyOn(callbacks, 'fail');
    });

    describe('#execute()', () => {
        it('should run successfully', done => {
            const strategy = new ClusterRunStrategy({
                memoryFs: true
            });

            strategy.execute([
                './test/fixtures/webpack.!(3|4).config.js'
            ], callbacks.done).then(stats => {
                expect(stats).toEqual(jasmine.any(Array));
                expect(callbacks.done.calls.count()).toEqual(3);

                done();
            });
        });

        it('should run successfully without any options', done => {
            const strategy = new ClusterRunStrategy();

            strategy.execute([
                './test/fixtures/webpack.!(3|4).config.js'
            ], callbacks.done).then(stats => {
                expect(stats).toEqual(jasmine.any(Array));
                expect(callbacks.done.calls.count()).toEqual(3);

                done();
            });
        });

        it('should handle compilation errors correctly', done => {
            const strategy = new ClusterRunStrategy({
                memoryFs: true
            });

            strategy.compile = () => Promise.reject(new Error());

            strategy.execute([
                './test/fixtures/webpack.!(3|4).config.js'
            ], callbacks.done).catch(err => {
                expect(err).toEqual(jasmine.any(Error));

                done();
            });
        });

        it('should throw `Error` when `stats` has some `errors` or `warnings`', done => {
            const strategy = new ClusterRunStrategy({
                memoryFs: true,
                failOn: true
            });

            strategy.execute([
                './test/fixtures/webpack.3.config.js'
            ], callbacks.fail).catch(() => {
                expect(callbacks.fail.calls.count()).toEqual(1);

                done();
            });
        });

        it('should throw fatal `Error`', done => {
            const strategy = new ClusterRunStrategy({
                memoryFs: true,
                failOn: false
            });

            strategy.execute([
                './test/fixtures/webpack.4.config.js'
            ], callbacks.fail).catch(() => {
                expect(callbacks.fail.calls.count()).toEqual(1);

                done();
            });
        });

        it('should override `output.path`', done => {
            const strategy = new ClusterRunStrategy({}, {
                output: {
                    path: './test/fixtures/tmp/custom'
                },
                resolveCluster: {
                    base: './test/fixtures/tmp'
                }
            });

            strategy.execute([
                './test/fixtures/webpack.1.config.js'
            ], () => {}).then(() => {
                exists('./test/fixtures/tmp/custom/1', value => {
                    expect(value).toBe(true);

                    done();
                });
            });
        });

        it('should emit `stats.json`', done => {
            const strategy = new ClusterRunStrategy({
                json: true
            });

            strategy.execute([
                './test/fixtures/webpack.1.config.js'
            ], () => {}).then(() => {
                exists('./test/fixtures/tmp/1/stats.json', value => {
                    expect(value).toBe(true);

                    done();
                });
            });
        });
    });
});
