const prepareIoredis = require('../utils/prepare-ioredis');
prepareIoredis();

const IORedis = require('ioredis');
const program = require('commander');
const Confirm = require('prompt-confirm');
const chalk = require('chalk');
const faker = require('faker');
const log = console.log;

const { orkidDefaults } = require('../src/common');

const queues = [
  { name: 'mailer', fn: getMailTask },
  { name: 'insert-to-elasticsearch', fn: getProductTask },
  { name: 'sms', fn: getSmsTask }
];

program
  .option('-h, --host <host>', 'Redis Host', '127.0.0.1')
  .option('-p, --port <port>', 'Redis Port', 6379)
  .option('-y, --confirm-flush', 'Proceed with flushing and seeding without reconfirmation')
  .parse(process.argv);

let redis;

async function seed() {
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

  redis = new IORedis({
    port: program.port,
    host: program.host
    // TODO: Pass other options like password: 'auth', db: 0 etc
  });

  log(chalk.green('Flushing Redis'));
  await redis.flushall();
  await Promise.all([seedResult(), seedFailed(), seedDead(), seedQueues(), seedStat()]);

  process.exit(0);
}

async function seedStat() {
  log(chalk.green('Seeding Stat'));

  await redis.hmset(orkidDefaults.STAT, {
    total: faker.random.number(),
    failed: faker.random.number(),
    dead: faker.random.number(),
    enqueued: faker.random.number(),
    retries: faker.random.number()
  });
}

async function seedResult() {
  log(chalk.green('Seeding Result List'));
  const pipeline = redis.pipeline();

  for (const q of queues) {
    for (let i = 0; i < 1000; i++) {
      const task = q.fn();

      pipeline.lpush(
        orkidDefaults.RESULTLIST,
        JSON.stringify({
          id: faker.random.number(),
          qname: q.name,
          data: task.data,
          dedupKey: task.dedupKey,
          retryCount: faker.random.number(),
          result: {
            success: true
          },
          at: new Date().toISOString()
        })
      );
    }
  }

  await pipeline.exec();
}

async function seedFailed() {
  log(chalk.green('Seeding Failed List'));
  const pipeline = redis.pipeline();

  for (const q of queues) {
    for (let i = 0; i < 1000; i++) {
      const task = q.fn();

      pipeline.lpush(
        orkidDefaults.FAILEDLIST,
        JSON.stringify({
          id: faker.random.number(),
          qname: q.name,
          data: task.data,
          dedupKey: task.dedupKey,
          retryCount: faker.random.number(),
          error: getErrorDetails(),
          at: new Date().toISOString()
        })
      );
    }
  }

  await pipeline.exec();
}

async function seedDead() {
  log(chalk.green('Seeding Dead List'));
  const pipeline = redis.pipeline();

  for (const q of queues) {
    for (let i = 0; i < 1000; i++) {
      const task = q.fn();

      pipeline.lpush(
        orkidDefaults.DEADLIST,
        JSON.stringify({
          id: faker.random.number(),
          qname: q.name,
          data: task.data,
          dedupKey: task.dedupKey,
          retryCount: faker.random.number(),
          error: getErrorDetails(),
          at: new Date().toISOString()
        })
      );
    }
  }

  await pipeline.exec();
}

async function seedQueues() {
  log(chalk.green('Seeding Queues'));
  const pipeline = redis.pipeline();
  const p = [];
  for (const q of queues) {
    for (let i = 0; i < 1000; i++) {
      const task = q.fn();
      pipeline.sadd(orkidDefaults.QUENAMES, q.name);
      pipeline.xadd(
        `${orkidDefaults.NAMESPACE}:queue:${q.name}`,
        '*',
        'data',
        JSON.stringify(task.data),
        'dedupKey',
        task.dedupKey,
        'retryCount',
        faker.random.number()
      );
    }
  }

  await pipeline.exec();
}

function getErrorDetails() {
  const e = new Error(faker.random.word());
  return {
    name: e.name,
    message: e.message,
    stack: e.stack
  };
}

function getMailTask() {
  return {
    data: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      body: faker.lorem.paragraph()
    }
  };
}

function getProductTask() {
  const id = faker.random.uuid();
  return {
    data: {
      id,
      title: faker.commerce.productName(),
      price: faker.commerce.price(),
      quantity: faker.random.number()
    },
    dedupKey: id
  };
}

function getSmsTask() {
  return {
    data: {
      number: faker.phone.phoneNumber(),
      name: faker.name.findName(),
      text: faker.lorem.sentence()
    }
  };
}

seed()
  .then(console.log)
  .catch(console.error);
