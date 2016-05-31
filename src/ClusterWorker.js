import {
    get,
    isError
} from 'lodash';
import CompilerStrategyProgress from './CompilerStrategyProgress';
import CompilerStrategyError from './CompilerStrategyError';
import CompilerStrategyStats from './CompilerStrategyStats';
import STRATEGY_EVENTS from './CompilerStrategyEvents';
import FORK_EVENTS from './ClusterForkEvents';

/**
 * @private
 * @param {String} filename
 * @param {Number} ratio
 * @param {String} status
 * @returns {void}
 */
const progress = (filename, ratio, status) => {
    process.send({
        type: FORK_EVENTS.progress,
        data: new CompilerStrategyProgress(filename, ratio, status)
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
        err = CompilerStrategyError.fromError(err);
    }

    process.send({
        type: FORK_EVENTS.stats,
        data: new CompilerStrategyStats(filename, stats, err)
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
                const data = get(message, 'data', {}),
                    compilerOptions = get(data, 'compilerOptions', {}),
                    webpackOptions = get(data, 'webpackOptions', {}),
                    filename = get(data, 'filename'),
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
