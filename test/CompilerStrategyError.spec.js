import CompilerStrategyError from '../src/CompilerStrategyError';

describe('CompilerStrategyError', () => {
    describe('#toJSON()', () => {
        it('should be used by `JSON.stringify`', () => {
            const err = new CompilerStrategyError('foo');

            err.foo = 'foo';

            expect(JSON.stringify(err)).toEqual(`{"message":"foo","stack":${JSON.stringify(err.stack)},"foo":"foo"}`);
        });
    });

    describe('.wrap()', () => {
        it('should wrap `Error`', () => {
            const err = CompilerStrategyError.wrap(new Error());

            expect(err).toEqual(jasmine.any(Error));
            expect(CompilerStrategyError.isWrapper(err)).toBeTruthy();
        });
    });

    describe('.fromJSON()', () => {
        it('should accept `Error`', () => {
            const err = new Error();

            expect(CompilerStrategyError.fromJSON(err)).toEqual(err);
        });

        it('should accept `Object`', () => {
            const errors = [
                'TypeError',
                'RangeError',
                'EvalError',
                'ReferenceError',
                'SyntaxError',
                'URIError',
                'Error'
            ];

            errors.forEach(error => {
                const err = {
                    message: 'Test',
                    type: error
                };

                expect(CompilerStrategyError.fromJSON(err)).toEqual(jasmine.any(Error));
            });
        });
    });
});
