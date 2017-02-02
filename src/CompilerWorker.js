import userPath from 'tildify';
import {
    RED,
    MAGENTA
} from './CompilerColors';
import {
    FAIL,
    WARN,
    SUCCESS,
} from './CompilerErrorLabels';
import {
    PROCESS_MESSAGE,
    FORK_DONE,
    FORK_EXEC
} from './Events';
import {
    compileConfig
} from './CompilerUtil';
import {
    loadConfig
} from './ConfigUtil';
import CompilerResult from './CompilerResult';
import STATS_OPTIONS from './CompilerStatsOptions';

/**
 * @private
 * @param {String} filename
 * @param {Object} options
 * @param {Error} [err]
 * @param {Object} [stats]
 * @returns {void}
 */
function done(filename, options, err, stats) {
    const result = new CompilerResult(filename, stats, err);

    if (!options.silent) {
        let label,
            buffer = [];

        if (err) {
            label = FAIL;
        } else if (stats && stats.hasErrors()) {
            label = FAIL;
        } else if (stats && stats.hasWarnings()) {
            label = WARN;
        } else {
            label = SUCCESS;
        }

        buffer.push(`${label} Stats for webpack config ${MAGENTA(userPath(filename))}`);

        if (err) {
            buffer.push(RED(err.stack));
        }

        if (stats) {
            const statsOptions = Object.assign({}, stats.compilation.options.stats, STATS_OPTIONS);

            buffer.push(stats.toString(statsOptions));
        }

        console.log(buffer.join('\n')); // eslint-disable-line no-console
    }

    process.send({
        type: FORK_DONE,
        data: result
    });
}

process.on(PROCESS_MESSAGE, ({ type, data }) => {
    if (type === FORK_EXEC) {
        const { filename } = data;

        loadConfig(filename).then(config => {
            compileConfig(config, data, (err, stats) => {
                done(filename, data, err, stats);
            });
        }).catch(err => {
            done(filename, data, err);
        });
    }
});
