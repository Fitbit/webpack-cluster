import {
    copy,
    remove
} from 'fs-extra';
import CompilerAdapter from '../src/index';
import closeWatchers from './helpers/closeWatchers';

describe('CompilerAdapter', () => {
    describe('#run()', () => {
        it('should run successfully', done => {
            const adapter = new CompilerAdapter({
                memoryFs: true,
                silent: true
            });

            adapter.run('./test/fixtures/webpack.!(3|4).config.js').then(() => {
                done();
            });
        });

        it('should handle compilation errors correctly', done => {
            const adapter = new CompilerAdapter({
                memoryFs: true,
                silent: true
            });

            adapter.run('./test/fixtures/webpack.4.config.js').catch(err => {
                expect(err).toEqual(jasmine.any(Error));

                done();
            });
        });
    });

    describe('#watch()', () => {
        let lastWatchers;

        beforeEach(done => {
            closeWatchers(lastWatchers);

            done();
        });

        beforeAll(done => copy('./test/fixtures', './test/tmp', done));

        afterAll(done => remove('./test/tmp', done));

        it('should watch successfully', done => {
            const adapter = new CompilerAdapter({
                memoryFs: true,
                silent: true
            });

            adapter.watch('./test/tmp/webpack.!(3).config.js').then(watchers => {
                lastWatchers = watchers;

                done();
            });
        });
    });
});
