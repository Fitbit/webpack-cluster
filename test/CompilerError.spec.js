import CompilerError from '../src/CompilerError';

describe('CompilerError', () => {
    it('should have properties', () => {
        const err = new CompilerError('./test/fixtures/config-object.js', 1);

        expect(err).toEqual(jasmine.any(Error));
        expect(err.filename).not.toBeUndefined();
        expect(err.code).not.toBeUndefined();
        expect(err.stack).not.toBeUndefined();
    });
});
