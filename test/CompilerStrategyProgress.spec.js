import CompilerStrategyProgress from '../src/CompilerStrategyProgress';

describe('CompilerStrategyProgress', () => {
    describe('#toJSON()', () => {
        it('should be used by `JSON.stringify`', () => {
            const progress = new CompilerStrategyProgress('foo.js', 0, 'bar');

            expect(JSON.stringify(progress)).toEqual('{"filename":"foo.js","ratio":0,"status":"bar"}');
        });
    });
});
