const prepareIoredis = require('../utils/prepare-ioredis');
prepareIoredis();

const IORedis = require('ioredis');
const faker = require('faker');

const { orkidDefaults } = require('../src/common');

module.exports = {
  seed
};

const queues = [
  { name: 'mailer', fn: getMailTask },
  { name: 'insert-to-elasticsearch', fn: getProductTask },
  { name: 'sms', fn: getSmsTask }
];

async function seed(redisConfig) {
  const redis = new IORedis(redisConfig);

  await redis.flushall();
  await Promise.all([seedResult(redis), seedFailed(redis), seedDead(redis), seedQueues(redis), seedStat(redis)]);
}

async function seedStat(redis) {
  await redis.hmset(orkidDefaults.STAT, {
    processed: faker.random.number(),
    failed: faker.random.number(),
    dead: faker.random.number(),
    // waiting: will be calculated dynamically,
    retries: faker.random.number()
  });
}

async function seedResult(redis) {
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

async function seedFailed(redis) {
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

async function seedDead(redis) {
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

async function seedQueues(redis) {
  const pipeline = redis.pipeline();
  const p = [];
  for (const q of queues) {
    for (let i = 0; i < 1000; i++) {
      const task = q.fn();

      pipeline.sadd(orkidDefaults.QUENAMES, q.name);

      pipeline.hset(`${orkidDefaults.NAMESPACE}:queue:${q.name}:settings`, 'paused', 0);

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
