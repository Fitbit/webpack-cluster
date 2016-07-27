import {
    appendFileSync
} from 'fs';
import {
    copy,
    remove
} from 'fs-extra';
import ClusterWatchStrategy from '../src/ClusterWatchStrategy';
import closeWatchers from './helpers/closeWatchers';

const addChanges = filename => appendFileSync(filename, `// Modified at ${new Date()}\n`);

describe('ClusterWatchStrategy', () => {
    let callbacks;

    afterEach(done => remove('./test/fixtures/tmp', done));

    beforeEach(() => {
        callbacks = {
            done: () => {}
        };

        spyOn(callbacks, 'done');
    });

    describe('#execute()', () => {
        let lastWatchers;

        beforeEach(done => {
            closeWatchers(lastWatchers);

            done();
        });

        beforeAll(done => copy('./test/fixtures', './test/tmp', done));

        afterAll(done => remove('./test/tmp', done));

        it('should watch successfully', done => {
            const strategy = new ClusterWatchStrategy({
                memoryFs: true
            });

            strategy.execute([
                './test/tmp/webpack.!(3).config.js'
            ], () => {}).then(watchers => {
                lastWatchers = watchers;

                done();
            });
        });

        it('should handle compilation errors correctly', done => {
            const strategy = new ClusterWatchStrategy({
                memoryFs: true
            });

            strategy.execute([
                './test/tmp/webpack.4.config.js'
            ], err => {
                expect(err).toEqual(jasmine.any(Error));

                done();
            }).then(watchers => {
                lastWatchers = watchers;

                addChanges('./test/tmp/webpack.4.config.js');
            });
        });

        it('should handle watch errors correctly', done => {
            const strategy = new ClusterWatchStrategy({
                memoryFs: true
            });

            strategy.watch = () => Promise.reject(new Error());

            strategy.execute([
                './test/tmp/webpack.not-found.config.js'
            ], () => {}).catch(err => {
                expect(err).toEqual(jasmine.any(Error));

                done();
            });
        });

        it('should recompile successfully', done => {
            const strategy = new ClusterWatchStrategy({
                memoryFs: true
            });

            let count = 0;

            strategy.execute([
                './test/tmp/webpack.1.config.js'
            ], (err, stats) => {
                count++;

                expect(err).toEqual(null);
                expect(stats).toEqual(jasmine.any(Object));

                if (count === 2) {
                    done();
                }
            }).then(watchers => {
                lastWatchers = watchers;

                addChanges('./test/tmp/webpack.1.config.js');

                setTimeout(() => addChanges('./test/tmp/webpack.1.config.js'), 250)
            });
        });
    });
});
