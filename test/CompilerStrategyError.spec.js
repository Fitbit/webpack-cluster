import CompilerStrategyError from '../src/CompilerStrategyError';

describe('CompilerStrategyError', () => {
    describe('#toJSON()', () => {
        it('should be used by `JSON.stringify`', () => {
            const err = new CompilerStrategyError('foo');

            expect(JSON.stringify(err)).toEqual(`{"message":"foo","stack":${JSON.stringify(err.stack)}}`);
        });
    });
});
