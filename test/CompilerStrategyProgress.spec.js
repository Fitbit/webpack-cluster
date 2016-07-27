import CompilerStrategyProgress from '../src/CompilerStrategyProgress';

describe('CompilerStrategyProgress', () => {
    describe('#toJSON()', () => {
        it('should be used by `JSON.stringify`', () => {
            const progress = new CompilerStrategyProgress('foo.js', 0, 'bar');

            expect(JSON.stringify(progress)).toEqual('{"filename":"foo.js","ratio":0,"status":"bar"}');
        });
    });

    describe('.fromJSON()', () => {
        it('should accept `CompilerStrategyProgress`', () => {
            const progress = new CompilerStrategyProgress('./test/fixtures/webpack.1.config.js', 0, 'Compiling...');

            expect(progress).toEqual(CompilerStrategyProgress.fromJSON(progress));
        });

        it('should accept `Object`', () => {
            const progress = {
                filename: './test/fixtures/webpack.1.config.js',
                ratio: 0,
                status: 'Compiling...'
            };

            expect(CompilerStrategyProgress.fromJSON(progress)).toEqual(jasmine.any(CompilerStrategyProgress));
        });
    });
});
