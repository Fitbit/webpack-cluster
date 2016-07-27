import {
    copy,
    remove
} from 'fs-extra';
import ClusterRunStrategy from '../src/ClusterRunStrategy';
import CompilerStrategyEventsFactory from '../src/CompilerStrategyEventsFactory';
import CompilerStrategyInvoker from '../src/CompilerStrategyInvoker';

describe('CompilerStrategyInvoker', () => {
    let isTTY = false;

    describe('#invoke()', () => {
        beforeEach(() => {
            spyOn(console, 'log').and.callFake(() => {});
            spyOn(process.stdout, 'write').and.callFake(() => {});

            if (!process.stdout.isTTY) {
                process.stdout.isTTY = true;
                isTTY = true;
            }
        });

        afterEach(() => {
            if (isTTY) {
                delete process.stdout.isTTY;
            }
        });

        it('should write some output to `console.log()` or `process.stdout.write()`', done => {
            const compilerOptions = {
                    memoryFs: true,
                    progress: true
                },
                events = CompilerStrategyEventsFactory.createEvents(compilerOptions),
                strategy = new ClusterRunStrategy(compilerOptions),
                invoker = new CompilerStrategyInvoker(strategy, events);

            invoker.invoke('./test/fixtures/webpack.!(3|4).config.js').then(() => {
                expect(console.log.calls.allArgs().length).toBeGreaterThan(0);
                expect(process.stdout.write.calls.allArgs().length >= 0).toBeTruthy();

                done();
            });
        });

        it('should not write any output to `console.log()` or `process.stdout.write()` when `silent` is `true`', done => {
            const compilerOptions = {
                    memoryFs: true,
                    silent: true
                },
                events = CompilerStrategyEventsFactory.createEvents(compilerOptions),
                strategy = new ClusterRunStrategy(compilerOptions),
                invoker = new CompilerStrategyInvoker(strategy, events);

            invoker.invoke('./test/fixtures/webpack.!(3|4).config.js').then(() => {
                expect(console.log.calls.allArgs().length).toEqual(0);
                expect(process.stdout.write.calls.allArgs().length).toEqual(0);

                done();
            });
        });

        it('should accept `String` pattern', done => {
            const compilerOptions = {
                    memoryFs: true,
                    silent: true
                },
                events = CompilerStrategyEventsFactory.createEvents(compilerOptions),
                strategy = new ClusterRunStrategy(compilerOptions),
                invoker = new CompilerStrategyInvoker(strategy, events);

            invoker.invoke('./test/fixtures/webpack.1.config.js').then(stats => {
                expect(stats).toEqual(jasmine.any(Object));

                done();
            });
        });

        it('should accept `String[]` patterns', done => {
            const compilerOptions = {
                    memoryFs: true,
                    silent: true
                },
                events = CompilerStrategyEventsFactory.createEvents(compilerOptions),
                strategy = new ClusterRunStrategy(compilerOptions),
                invoker = new CompilerStrategyInvoker(strategy, events);

            invoker.invoke([
                './test/fixtures/webpack.1.config.js',
                './test/fixtures/webpack.2.config.js'
            ]).then(stats => {
                expect(stats).toEqual(jasmine.any(Array));

                done();
            });
        });
    });
});
