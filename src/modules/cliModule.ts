import { input, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export type MessageLevel = 'verbose' | 'info' | 'error';

export class CliModule {
  argv = yargs(hideBin(process.argv))
    .option('verbose', {
      alias: 'v',
      type: 'boolean',
      describe: 'Turn on verbose logging mode, each step is logged',
      default: false,
    })
    .option('quick', {
      alias: 'q',
      type: 'boolean',
      describe:
        'Turn on semiautomatic mode. Only version update is asked to be confirmed. After that everything is done without user interaction',
      default: false,
    })
    .option('help', { alias: 'h', type: 'boolean', default: false })
    .parseSync();

  showMessage = (message: string, type: MessageLevel) => {
    const isVerbose = this.getIsVerbose();
    if (type === 'verbose' && !isVerbose) return;
    if (type === 'info') console.info(message);
    if (type === 'verbose')
      console.log(`${this.getVerbosePrefix('Verbose:')} ${message}`);
    if (type === 'error')
      console.log(`${this.getErrorPrefix('Error:')} ${message}`);
  };

  getIsVerbose = () => {
    return this.argv?.verbose === true;
  };

  getIsQuick = () => {
    return this.argv?.quick === true;
  };

  getSuccessPrefix = (prefixText?: string) => {
    const strings = [chalk.green('✔')];
    if (prefixText) strings.push(chalk.bold(prefixText));
    return strings.join(' ');
  };

  getWarningPrefix = (prefixText?: string) => {
    const strings = [chalk.yellow('!')];
    if (prefixText) strings.push(chalk.bold(prefixText));
    return strings.join(' ');
  };

  getErrorPrefix = (prefixText?: string) => {
    const strings = [chalk.red('✘')];
    if (prefixText) strings.push(chalk.bold(prefixText));
    return strings.join(' ');
  };

  getVerbosePrefix = (prefixText?: string) => {
    const strings = [chalk.magenta('📣')];
    if (prefixText) strings.push(chalk.bold(prefixText));
    return strings.join(' ');
  };

  promptForInput = async (message: string, defaultValue?: string) => {
    try {
      const options = {
        message,
        default: defaultValue,
      };
      const answer = await input(options);
      return answer;
    } catch (err) {
      throw new Error(`Failed to prompt for input: ${err}`);
    }
  };

  promptForConfirmation = async (
    message: string,
    defaultValue?: boolean,
    isQuick?: boolean
  ) => {
    try {
      if (isQuick) return true;
      const options = {
        message,
        default: defaultValue,
      };
      const answer = await confirm(options);
      return answer;
    } catch (err) {
      throw new Error(`Failed to prompt for confirmation: ${err}`);
    }
  };
}
