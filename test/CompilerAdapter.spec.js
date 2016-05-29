import {
    appendFileSync,
    exists
} from 'fs';
import {
    copy,
    remove
} from 'fs-extra';
import CompilerAdapter from '../src/index';

describe('CompilerAdapter', () => {
    let callbacks;

    afterEach(done => remove('./test/fixtures/tmp', done));

    beforeEach(function() {
        callbacks = {
            done: (err, stats) => {
                expect(err).toEqual(null);
                expect(stats).toEqual(jasmine.any(Object));
            }
        };

        spyOn(callbacks, 'done');
    });

    describe('#run()', () => {
        it('should run successfully', done => {
            const compilerAdapter = new CompilerAdapter({
                memoryFs: true,
                silent: true
            });

            compilerAdapter.run('./test/fixtures/webpack.!(3).config.js', callbacks.done).then(stats => {
                expect(stats).toEqual(jasmine.any(Map));
                expect(callbacks.done.calls.count()).toEqual(3);

                done();
            });
        });

        it('should throw `Error` when `stats` has some `errors` or `warnings`', done => {
            const compilerAdapter = new CompilerAdapter({
                memoryFs: true,
                failOn: true,
                silent: true
            });

            compilerAdapter.run('./test/fixtures/webpack.3.config.js').catch(err => {
                expect(err).toEqual(jasmine.any(Error));

                done();
            });
        });

        it('should override `output.path`', done => {
            const compilerAdapter = new CompilerAdapter({
                silent: true
            }, {
                output: {
                    path: './test/fixtures/tmp/custom'
                },
                resolve: {
                    base: './test/fixtures/tmp'
                }
            });

            compilerAdapter.run('./test/fixtures/webpack.1.config.js').then(() => {
                exists('./test/fixtures/tmp/custom/1', value => {
                    expect(value).toBe(true);

                    done();
                });
            });
        });

        it('should emit `stats.json`', done => {
            const compilerAdapter = new CompilerAdapter({
                json: true,
                silent: true
            });

            compilerAdapter.run('./test/fixtures/webpack.1.config.js').then(() => {
                exists('./test/fixtures/tmp/1/stats.json', value => {
                    expect(value).toBe(true);

                    done();
                });
            });
        });
    });

    describe('#watch()', () => {
        const closeWatchers = (...watchers) => {
            return Promise.all(watchers.map(watcher => {
                return new Promise(resolve => {
                    watcher.on('end', resolve);
                    watcher.close(true);
                });
            }));
        };

        it('should watch successfully', done => {
            const compilerAdapter = new CompilerAdapter({
                memoryFs: true,
                silent: true
            });

            compilerAdapter.watch('./test/fixtures/webpack.!(3).config.js')
                .then(watchers => closeWatchers(...watchers).then(done));
        });

        it('should re-compile on file change', done => {
            const compilerAdapter = new CompilerAdapter({
                memoryFs: true,
                silent: true
            });

            let lastWatchers;

            copy('./test/fixtures/webpack.1.config.js', './test/fixtures/tmp/webpack.1.config.js', () => {
                compilerAdapter.watch('./test/fixtures/tmp/webpack.1.config.js', (err, stats) => {
                    expect(err).toEqual(null);
                    expect(stats).toEqual(jasmine.any(Object));

                    closeWatchers(...lastWatchers).then(done);
                }).then(watchers => {
                    lastWatchers = watchers;

                    appendFileSync('./test/fixtures/tmp/webpack.1.config.js', `// Modified at ${new Date()}\n`);
                });
            });
        });
    });
});
