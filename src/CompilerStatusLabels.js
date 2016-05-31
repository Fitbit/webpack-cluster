import chalk from 'chalk';

/**
 * @type {Object<String,String>}
 */
export default {
    pending: chalk.yellow('·'),
    fail: chalk.red('×'),
    warn: chalk.yellow('✓'),
    done: chalk.green('✓')
};
