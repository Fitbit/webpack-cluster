/**
 * @internal
 * @class
 * @extends {Error}
 */
class CompilerError extends Error {
    /**
     * @constructor
     * @param {String} [message]
     * @param {String} [fileName]
     * @param {Number} [lineNumber]
     */
    constructor(message, fileName, lineNumber) {
        super(message, fileName, lineNumber);
    }
}

export default CompilerError;
