'use strict';

var CompilerAdapter = require('../lib/compilerAdapter');

xdescribe('CompilerAdapter', function () {
    var compilerAdapter;

    beforeEach(function() {
        spyOn(console, 'log');

        compilerAdapter = new CompilerAdapter({
            memoryFs: true,
            progress: false
        });
    });

    describe('#run()', function() {
        it('dummy', function(done) {
            compilerAdapter.run('./test/fixtures/webpack*config.js').then(function() {
                expect(true).toBeTruthy();

                done();
            });
        });
    });
});
