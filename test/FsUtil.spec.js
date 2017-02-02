import {
    findFiles,
    watchFiles
} from '../src/FsUtil';

describe('FsUtil', () => {
    describe('#findFiles()', () => {
        it('should find files successfully', done => {
            findFiles([
                './test/fixtures/config-*.js',
            ]).then(files => {
                expect(files.length).toEqual(5);

                done();
            });
        });
    });

    describe('#watchFiles()', () => {
        it('should watch files successfully', done => {
            watchFiles([
                './test/fixtures/config-*.js',
            ]).then(watchers => {
                expect(watchers.length).toEqual(1);

                watchers.forEach(x => x.close());

                done();
            });
        });
    });
});
