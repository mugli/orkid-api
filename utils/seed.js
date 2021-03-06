const IORedis = require('ioredis');
const faker = require('faker');

const { orkidDefaults } = require('../src/common');

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

const queues = [
  { name: 'mailer', fn: getMailTask },
  { name: 'insert-to-elasticsearch', fn: getProductTask },
  { name: 'sms', fn: getSmsTask }
];

async function seedStat(redis) {
  const pipeline = redis.pipeline();

  pipeline.hmset(orkidDefaults.STAT, {
    processed: faker.random.number(),
    failed: faker.random.number(),
    dead: faker.random.number(),
    retries: faker.random.number()
  });

  for (const q of queues) {
    pipeline.hmset(`${orkidDefaults.STAT}:${q.name}`, {
      processed: faker.random.number(),
      failed: faker.random.number(),
      dead: faker.random.number(),
      retries: faker.random.number()
    });
  }

  await pipeline.exec();
}

async function seedResult(redis) {
  const pipeline = redis.pipeline();

  for (const q of queues) {
    for (let i = 0; i < 1000; i++) {
      const task = q.fn();

      pipeline.zadd(
        orkidDefaults.RESULTLIST,
        new Date().getTime().toString(),
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

      pipeline.zadd(
        `${orkidDefaults.RESULTLIST}:${q.name}`,
        new Date().getTime().toString(),
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

      pipeline.zadd(
        orkidDefaults.FAILEDLIST,
        new Date().getTime().toString(),
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

      pipeline.zadd(
        `${orkidDefaults.FAILEDLIST}:${q.name}`,
        new Date().getTime().toString(),
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

      pipeline.zadd(
        orkidDefaults.DEADLIST,
        new Date().getTime().toString(),
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

      pipeline.zadd(
        `${orkidDefaults.DEADLIST}:${q.name}`,
        new Date().getTime().toString(),
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

async function seed(redisConfig) {
  const redis = new IORedis(redisConfig);

  await redis.flushall();
  await Promise.all([seedResult(redis), seedFailed(redis), seedDead(redis), seedQueues(redis), seedStat(redis)]);
}

module.exports = {
  seed
};
