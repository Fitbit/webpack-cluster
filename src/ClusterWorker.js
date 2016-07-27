import {
    get,
    isError
} from 'lodash';
import CompilerStrategyProgress from './CompilerStrategyProgress';
import CompilerStrategyError from './CompilerStrategyError';
import CompilerStrategyStats from './CompilerStrategyStats';
import STRATEGY_EVENTS from './CompilerStrategyEvents';
import FORK_EVENTS from './ClusterForkEvents';
import FORK_PROPERTIES from './ClusterForkProperties';

/**
 * @private
 * @param {String} filename
 * @param {Number} ratio
 * @param {String} status
 * @returns {void}
 */
const progress = (filename, ratio, status) => {
    process.send({
        [FORK_PROPERTIES.type]: FORK_EVENTS.progress,
        [FORK_PROPERTIES.data]: new CompilerStrategyProgress(filename, ratio, status)
    });
};

/**
 * @private
 * @param {String} filename
 * @param {Object} stats
 * @param {Error} err
 * @returns {void}
 */
const done = (filename, stats, err) => {
    if (isError(err)) {
        err = CompilerStrategyError.wrap(err);
    }

    process.send({
        [FORK_PROPERTIES.type]: FORK_EVENTS.stats,
        [FORK_PROPERTIES.data]: new CompilerStrategyStats(filename, stats, err)
    });
};

class ClusterWorker {
    /**
     * @param {function(new:CompilerStrategy,Object,Object)} CompilerStrategy
     * @returns {void}
     */
    static use(CompilerStrategy) {
        process.on(FORK_EVENTS.message, message => {
            if (message.type === FORK_EVENTS.compile) {
                const data = get(message, FORK_PROPERTIES.data, {}),
                    compilerOptions = get(data, FORK_PROPERTIES.compilerOptions, {}),
                    webpackOptions = get(data, FORK_PROPERTIES.webpackOptions, {}),
                    filename = get(data, FORK_PROPERTIES.filename),
                    strategy = new CompilerStrategy(compilerOptions, webpackOptions);

                strategy.on(STRATEGY_EVENTS.progress, progress);

                strategy.execute([
                    filename
                ], (err, stats) => {
                    done(filename, stats, err);
                }).catch(err => {
                    done(filename, null, err);
                });
            }
        });
    }
}

export default ClusterWorker;
