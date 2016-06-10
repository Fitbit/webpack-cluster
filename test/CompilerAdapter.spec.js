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

    describe('#run()', () => {
        beforeEach(() => {
            callbacks = {
                done: (err, stats) => {
                    expect(err).toEqual(null);
                    expect(stats).toEqual(jasmine.any(Object));
                }
            };

            spyOn(callbacks, 'done');
            spyOn(console, 'log').and.callFake(() => {});
            spyOn(process.stdout, 'write').and.callFake(() => {});
        });

        it('should run successfully', done => {
            const compilerAdapter = new CompilerAdapter({
                memoryFs: true,
                silent: true
            });

            compilerAdapter.run('./test/fixtures/webpack.!(3|4).config.js', callbacks.done).then(stats => {
                expect(stats).toEqual(jasmine.any(Map));
                expect(callbacks.done.calls.count()).toEqual(3);

                done();
            });
        });

        it('should run successfully with default options', done => {
            const compilerAdapter = new CompilerAdapter();

            compilerAdapter.run('./test/fixtures/webpack.!(3|4).config.js', callbacks.done).then(stats => {
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

        it('should throw fatal `Error`', done => {
            const compilerAdapter = new CompilerAdapter({
                memoryFs: true,
                failOn: false,
                silent: true
            });

            compilerAdapter.run('./test/fixtures/webpack.4.config.js').catch(err => {
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
                resolveCluster: {
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

        it('should write some output to `console.log()` or `process.stdout.write()`', done => {
            const compilerAdapter = new CompilerAdapter({
                memoryFs: true,
                progress: true
            });

            compilerAdapter.run('./test/fixtures/webpack.!(3|4).config.js').then(() => {
                expect(console.log.calls.allArgs().length).toBeGreaterThan(0);
                expect(process.stdout.write.calls.allArgs().length >= 0).toBeTruthy();

                done();
            });
        });

        it('should not write any output to `console.log()` or `process.stdout.write()` when `silent` is `true`', done => {
            const compilerAdapter = new CompilerAdapter({
                memoryFs: true,
                progress: false,
                silent: true
            });

            compilerAdapter.run('./test/fixtures/webpack.!(3|4).config.js').then(() => {
                expect(console.log.calls.allArgs().length).toEqual(0);
                expect(process.stdout.write.calls.allArgs().length).toEqual(0);

                done();
            });
        });
    });

    describe('#watch()', () => {
        let lastWatchers;

        beforeEach(done => {
            if (Array.isArray(lastWatchers)) {
                lastWatchers.forEach(watcher => watcher.close());
            }

            done();
        });

        beforeAll(done => copy('./test/fixtures', './test/tmp/fixtures', done));

        afterAll(done => remove('./test/tmp', done));

        it('should watch successfully', done => {
            const compilerAdapter = new CompilerAdapter({
                memoryFs: true,
                silent: true
            });

            compilerAdapter.watch('./test/fixtures/webpack.!(3).config.js').then(watchers => {
                lastWatchers = watchers;

                done();
            });
        });

        it('should re-compile on file change', done => {
            const compilerAdapter = new CompilerAdapter({
                memoryFs: true,
                silent: true
            });

            compilerAdapter.watch('./test/tmp/fixtures/webpack.1.config.js', (err, stats) => {
                expect(err).toEqual(null);
                expect(stats).toEqual(jasmine.any(Object));

                done();
            }).then(watchers => {
                lastWatchers = watchers;

                appendFileSync('./test/tmp/fixtures/webpack.1.config.js', `// Modified at ${new Date()}\n`);
            });
        });

        it('should re-compile on closest file change', done => {
            const compilerAdapter = new CompilerAdapter({
                memoryFs: true,
                silent: true
            });

            compilerAdapter.watch('./test/tmp/fixtures/webpack.1.config.js', (err, stats) => {
                expect(err).toEqual(null);
                expect(stats).toEqual(jasmine.any(Object));

                done();
            }).then(watchers => {
                lastWatchers = watchers;

                appendFileSync('./test/tmp/fixtures/sub/sub/index.html', `<!--Modified at ${new Date()}-->\n`);
            });
        });
    });
});
