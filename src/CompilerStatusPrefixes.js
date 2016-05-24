import chalk from 'chalk';

/**
 * @type {Object<String,String>}
 */
export default {
    fatalError: chalk.red('[fatalError]'),
    info: chalk.white('[info]'),
    warn: chalk.yellow('[warn]'),
    debug: chalk.gray('[debug]'),
    error: chalk.red('[error]')
};
