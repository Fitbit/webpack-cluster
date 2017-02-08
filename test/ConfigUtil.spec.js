import {
    loadConfig
} from '../src/ConfigUtil';

describe('ConfigUtil', () => {
    describe('#loadConfig()', () => {
        it('should load `Object` successfully', done => {
            loadConfig('./test/fixtures/config-object.js').then(config => {
                expect(config).not.toBeUndefined();

                done();
            });
        });

        it('should load `Function` successfully', done => {
            loadConfig('./test/fixtures/config-function.js').then(config => {
                expect(config).not.toBeUndefined();

                done();
            });
        });

        it('should throw exception when config is not found', done => {
            loadConfig('./test/fixtures/config-not-found.js').catch(err => {
                expect(err).toEqual(jasmine.any(Error));

                done();
            });
        });
    });
});
