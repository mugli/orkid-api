#!/usr/bin/env node

const program = require('commander');
const Confirm = require('prompt-confirm');
const chalk = require('chalk');
const log = console.log;

const { seed } = require('../utils/seed');

program
  .option('-h, --host <host>', 'Redis Host', '127.0.0.1')
  .option('-p, --port <port>', 'Redis Port', 6379)
  .option('-y, --confirm-flush', 'Proceed with flushing and seeding without reconfirmation')
  .parse(process.argv);

let redis;

async function flushAndSeed() {
  if (!program.confirmFlush) {
    const confirm = await new Confirm({
      message: 'All data in your redis sever will be cleared. Proceed?',
      default: false
    }).run();
    if (!confirm) {
      log(chalk.red('Quitting without seeding any data!'));
      process.exit(1);
    }
  }

  await seed({
    port: program.port,
    host: program.host
    // TODO: Pass other options like password: 'auth', db: 0 etc
  });
  log(chalk.green('Done'));

  process.exit(0);
}

flushAndSeed()
  .then(console.log)
  .catch(console.error);
