import {
    remove
} from 'fs-extra';
import {
    createCompiler,
    compileConfig
} from '../src/CompilerUtil';

describe('ConfigUtil', () => {
    describe('#createCompiler()', () => {
        it('should create compiler successfully', () => {
            const compiler = createCompiler({
                entry: 'index.js'
            }, {
                dryRun: true
            });

            expect(compiler).not.toBeUndefined();
        });
    });

    describe('#compileConfig()', () => {
        const mock = {
            callback() {}
        };

        beforeEach(() => {
            spyOn(mock, 'callback').and.callFake(() => {});
        });

        afterAll(done => remove('./packages/core/test/fixtures/tmp', done));

        it('should compile successfully', done => {
            compileConfig({
                entry: 'index.js',
                output: {
                    path: __dirname
                }
            }, {
                dryRun: true
            }, (err, stats) => {
                expect(err).toEqual(null);
                expect(stats).toEqual(jasmine.any(Object));

                done();
            });
        });

        it('should handle compilation errors correctly', done => {
            compileConfig({}, {
                dryRun: true
            }, err => {
                expect(err).toEqual(jasmine.any(Error));

                done();
            });
        });

        it('should watch successfully', done => {
            compileConfig({
                entry: 'index.js',
                output: {
                    path: __dirname
                }
            }, {
                watch: true,
                dryRun: true
            }, (err, stats) => {
                expect(err).toEqual(null);
                expect(stats).toEqual(jasmine.any(Object));

                done();
            });
        });

        it('should handle watch errors correctly', done => {
            compileConfig({}, {
                watch: true,
                dryRun: true
            }, err => {
                expect(err).toEqual(jasmine.any(Error));

                done();
            });
        });
    });
});
