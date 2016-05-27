import {
    isError,
    get
} from 'lodash';
import CompilerStrategyError from './CompilerStrategyError';
import CompilerStrategyStats from './CompilerStrategyStats';
import STRATEGY_EVENTS from './CompilerStrategyEvents';
import FORK_EVENTS from './ClusterForkEvents';

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

                strategy.on(STRATEGY_EVENTS.progress, (_, ratio, status) => {
                    process.send({
                        type: FORK_EVENTS.progress,
                        data: {
                            filename,
                            ratio,
                            status
                        }
                    });
                });

                strategy.execute([
                    filename
                ], (err, stats) => {
                    if (isError(err)) {
                        err = new CompilerStrategyError(err);

                        process.send({
                            type: FORK_EVENTS.fail,
                            data: {
                                filename,
                                err
                            }
                        });
                    } else {
                        process.send({
                            type: FORK_EVENTS.done,
                            data: {
                                filename,
                                stats: new CompilerStrategyStats(stats)
                            }
                        });
                    }
                });
            }
        });
    }
}

export default ClusterWorker;
