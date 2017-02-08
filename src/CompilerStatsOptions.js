import {
    COLORS
} from './CompilerColors';

/**
 * @type {Object<String,Boolean>}
 */
export default {
    colors: COLORS,
    hash: true,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false,
    children: true,
    version: false,
    cached: false,
    cachedAssets: false,
    reasons: false,
    source: false,
    errorDetails: false
};
