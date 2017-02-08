import CompilerResult from '../src/CompilerResult';

describe('CompilerResult', () => {
    describe('#toJSON()', () => {
        it('should return `Object`', () => {
            const result = new CompilerResult(__filename);

            const obj = result.toJSON();

            expect(obj).not.toEqual(jasmine.any(CompilerResult));
            expect(obj).toEqual({
                filename: __filename,
                stats: {
                    hasSysErrors: false,
                    hasErrors: false,
                    hasWarnings: false
                }
            });
        });
    });

    describe('.from()', () => {
        it('should convert `Object` to `CompilerResult`', () => {
            const err = new Error(1),
                obj = {
                    filename: __filename,
                    fatalError: err
                };

            const result = CompilerResult.from(obj);

            expect(result).toEqual(jasmine.any(CompilerResult));
            expect(result.toJSON()).toEqual({
                filename: __filename,
                stats: {
                    hasSysErrors: true,
                    hasErrors: false,
                    hasWarnings: false
                }
            });
        });
    });
});
