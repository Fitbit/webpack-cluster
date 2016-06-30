import CompilerStrategyStats from '../src/CompilerStrategyStats';

describe('CompilerStrategyStats', () => {
    describe('#toJSON()', () => {
        it('should be used by `JSON.stringify`', () => {
            const stats = new CompilerStrategyStats('foo.js', {
                toString: 'bar'
            }, null);

            expect(JSON.stringify(stats)).toEqual('{"filename":"foo.js","fatalError":null,"stats":{"hasErrors":false,"hasWarnings":false,"toString":"bar"}}');
        });
    });
});
