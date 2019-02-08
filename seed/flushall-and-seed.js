const program = require('commander');
const Confirm = require('prompt-confirm');
const chalk = require('chalk');
const log = console.log;

program
  .option('-h, --host <host>', 'Redis Host', '127.0.0.1')
  .option('-p, --port <port>', 'Redis Port', 6379)
  .option('-y, --confirm-flush', 'Proceed with flushing and seeding without reconfirmation')
  .parse(process.argv);

async function seed() {
  if (!program.confirmFlush) {
    const confirm = await new Confirm('All data in your redis sever will be cleared. Proceed?').run();
    if (!confirm) {
      log(chalk.red('Quitting without seeding any data!'));
      process.exit(1);
    }
  }

  log(chalk.green('Flushing Redis...'));
}

seed();
