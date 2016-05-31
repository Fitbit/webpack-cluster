import chalk from 'chalk';

/**
 * @type {Object<String,String>}
 */
export default {
    info: chalk.white('[info]'),
    warn: chalk.yellow('[warn]'),
    error: chalk.red('[error]'),
    fatalError: chalk.red('[fatalError]')
};
