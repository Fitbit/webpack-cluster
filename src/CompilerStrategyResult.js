/**
 * @private
 * @type {WeakMap}
 */
const PATTERN = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const FILES = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const STATS = new WeakMap();

/**
 * @class
 * @extends {Map}
 */
class CompilerStrategyResult extends Map {
    /**
     * @param {String} pattern
     * @param {String[]} files
     */
    constructor(pattern, files = []) {
        super();

        PATTERN.set(this, pattern);
        FILES.set(this, files);
        STATS.set(this, new Map());
    }

    /**
     * @readonly
     * @type {String}
     */
    get pattern() {
        return PATTERN.get(this);
    }

    /**
     * @readonly
     * @type {String[]}
     */
    get files() {
        return FILES.get(this);
    }

    /**
     * @readonly
     * @type {Map<String,CompilerStrategyStats>}
     */
    get stats() {
        return STATS.get(this);
    }
}

export default CompilerStrategyResult;
