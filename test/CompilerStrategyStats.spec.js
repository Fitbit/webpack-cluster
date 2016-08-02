import CompilerStrategyStats from '../src/CompilerStrategyStats';
import CompilerStrategyError from '../src/CompilerStrategyError';

describe('CompilerStrategyStats', () => {
    describe('#toJSON()', () => {
        it('should be used by `JSON.stringify`', () => {
            const stats = new CompilerStrategyStats('foo.js', {
                toString: 'bar'
            }, null);

            expect(JSON.stringify(stats)).toEqual('{"filename":"foo.js","fatalError":null,"stats":{"hasErrors":false,"hasWarnings":false,"toString":"bar"}}');
        });
    });

    describe('.fromJSON()', () => {
        it('should accept `CompilerStrategyStats`', () => {
            const stats = new CompilerStrategyStats('foo.js', {
                toString: 'bar'
            }, null);

            expect(stats).toEqual(CompilerStrategyStats.fromJSON(stats));
        });

        it('should accept `Object`', () => {
            const stats = {
                filename: './test/fixtures/webpack.1.config.js',
                stats: {},
                fatalError: CompilerStrategyError.wrap(new Error())
            };

            expect(CompilerStrategyStats.fromJSON(stats)).toEqual(jasmine.any(CompilerStrategyStats));
        });
    });
});
