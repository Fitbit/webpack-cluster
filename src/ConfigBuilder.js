import {
    has,
    set
} from 'lodash';
import Config from 'webpack-config';
import {
    supportsColor
} from 'chalk';
import STATS_OPTIONS from './StatsOptions';
import CONFIG_HOOKS from './ConfigHooks';
import WEBPACK_PROPERTIES from './CompilerWebpackProperties';

/**
 * @private
 * @type {Boolean}
 */
const SUPPORTS_COLOR = supportsColor !== false;

/**
 * @private
 * @type {WeakMap}
 */
const CONFIG = new WeakMap();

/**
 * @private
 * @type {WeakMap}
 */
const HOOKS = new WeakMap();

/**
 * @class
 */
class ConfigBuilder {
    /**
     * @constructor
     * @param {Config|ConfigList} [config]
     * @param {Object<String,Function>} [hooks]
     */
    constructor(config, hooks = CONFIG_HOOKS) {
        if (!config) {
            config = new Config();
        }

        CONFIG.set(this, config);
        HOOKS.set(this, hooks);
    }

    /**
     * @readonly
     * @type {Config|ConfigList}
     */
    get config() {
        return CONFIG.get(this);
    }

    /**
     * @readonly
     * @type {Object<String,Function>}
     */
    get hooks() {
        return HOOKS.get(this);
    }

    /**
     * @param {Object} options
     * @returns {ConfigBuilder}
     */
    merge(options) {
        this.pendingConfig.merge(options);

        return this;
    }

    /**
     * @param {Object} options
     * @returns {ConfigBuilder}
     */
    defaults(options) {
        this.pendingConfig.defaults(options);

        return this;
    }

    /**
     * @param {Object} [stats]
     * @returns {ConfigBuilder}
     */
    stats(stats = STATS_OPTIONS) {
        return this.defaults({
            [WEBPACK_PROPERTIES.stats]: stats
        });
    }

    /**
     * @param {Boolean} [colors]
     * @returns {ConfigBuilder}
     */
    colors(colors = SUPPORTS_COLOR) {
        return this.merge({
            [WEBPACK_PROPERTIES.stats]: {
                colors: colors
            }
        });
    }

    /**
     * @param {String} pattern
     * @returns {ConfigBuilder}
     */
    pattern(pattern) {
        return this.merge({
            [WEBPACK_PROPERTIES.resolveCluster]: {
                pattern: pattern
            }
        });
    }

    /**
     * @returns {ConfigBuilder}
     */
    reset() {
        if (this.pendingConfig) {
            delete this.pendingConfig;
        }

        this.pendingConfig = new Config();

        return this;
    }

    /**
     * @returns {ConfigBuilder}
     */
    applyHooks() {
        for (const [path, hook] of Object.entries(this.hooks)) {
            if (has(this.pendingConfig, path)) {
                const value = hook(path, this.pendingConfig, this.config);

                set(this.pendingConfig, path, value);
            }
        }

        return this;
    }

    /**
     * @returns {Object|Object[]}
     */
    build() {
        let config;

        if (Array.isArray(this.config)) {
            config = this.config.map(x => x.clone().merge(this.pendingConfig).toObject());
        } else {
            config = this.config.clone().merge(this.pendingConfig).toObject();
        }

        this.reset();

        return config;
    }
}

export default ConfigBuilder;
