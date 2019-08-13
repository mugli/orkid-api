const { Base64 } = require('js-base64');
const { objectType, intArg, stringArg } = require('nexus');

const { orkidDefaults } = require('./common');

exports.ActionStatus = objectType({
  name: 'ActionStatus',
  definition(t) {
    t.boolean('success', { nullable: true });
  }
});

const getResultFeed = async (redis, feedName, nextCursor, limit) => {
  const start = nextCursor ? Number(Base64.decode(nextCursor)) : 0;
  const oneMore = start + limit;

  const tasks = (await redis.lrange(feedName, start, oneMore)).map(t => deserializeTask(t));
  let hasNextPage = false;
  let newCursor = null;

  if (limit + 1 === tasks.length) {
    hasNextPage = true;
    tasks.pop();
    newCursor = Base64.encode(oneMore);
  }

  return {
    hasNextPage,
    nextCursor: newCursor,
    tasks
  };
};

const deserializeTask = t => {
  const r = JSON.parse(t);
  if (r.data) {
    r.data = JSON.stringify(r.data);
  }

  if (r.result) {
    r.result = JSON.stringify(r.result);
  }

  return r;
};

exports.DeadList = objectType({
  name: 'DeadList',
  definition(t) {
    t.int('taskCount', {
      async resolve(root, args, { redis }) {
        const taskCount = await redis.llen(orkidDefaults.DEADLIST);
        return taskCount;
      }
    });
    t.field('taskFeed', {
      nullable: true,
      type: 'TaskFeed',
      args: {
        nextCursor: stringArg({
          default: null
        }),
        limit: intArg({
          default: 10
        })
      },
      resolve(root, { nextCursor, limit }, { redis }) {
        return getResultFeed(redis, orkidDefaults.DEADLIST, nextCursor, limit);
      }
    });
  }
});

exports.ResultList = objectType({
  name: 'ResultList',
  definition(t) {
    t.int('taskCount', {
      async resolve(root, args, { redis }) {
        const taskCount = await redis.llen(orkidDefaults.RESULTLIST);
        return taskCount;
      }
    });
    t.field('taskFeed', {
      nullable: true,
      type: 'TaskFeed',
      args: {
        nextCursor: stringArg({
          default: null
        }),
        limit: intArg({
          default: 10
        })
      },
      resolve(root, { nextCursor, limit }, { redis }) {
        return getResultFeed(redis, orkidDefaults.RESULTLIST, nextCursor, limit);
      }
    });
  }
});

exports.FailedList = objectType({
  name: 'FailedList',
  definition(t) {
    t.int('taskCount', {
      async resolve(root, args, { redis }) {
        const taskCount = await redis.llen(orkidDefaults.FAILEDLIST);
        return taskCount;
      }
    });
    t.field('taskFeed', {
      nullable: true,
      type: 'TaskFeed',
      args: {
        nextCursor: stringArg({
          default: null
        }),
        limit: intArg({
          default: 10
        })
      },
      resolve(root, { nextCursor, limit }, { redis }) {
        return getResultFeed(redis, orkidDefaults.FAILEDLIST, nextCursor, limit);
      }
    });
  }
});

exports.ErrorLog = objectType({
  name: 'ErrorLog',
  definition(t) {
    t.string('name', { nullable: true });
    t.string('message', { nullable: true });
    t.string('stack', { nullable: true });
  }
});

exports.Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('pauseAll', {
      nullable: true,
      type: 'ActionStatus',
      resolve() {
        // TODO: Implement
      }
    });
    t.field('resumeAll', {
      nullable: true,
      type: 'ActionStatus',
      resolve() {
        // TODO: Implement
      }
    });
    t.field('deleteQueue', {
      nullable: true,
      type: 'ActionStatus',
      resolve() {
        // TODO: Implement
      }
    });
    t.field('resetGlobalStats', {
      nullable: true,
      type: 'ActionStatus',
      resolve() {
        // TODO: Implement
      }
    });
    t.field('updateGlobalSettings', {
      nullable: true,
      type: 'ActionStatus',
      resolve() {
        // TODO: Implement
      }
    });
  }
});

exports.Stat = objectType({
  name: 'Stat',
  definition(t) {
    t.int('processed');
    t.int('failed');
    t.int('dead');
    t.int('waiting', async (root, args, { redis }) => {
      const queueNames = await redis.smembers(orkidDefaults.QUENAMES);
      const keys = queueNames.map(q => `${orkidDefaults.NAMESPACE}:queue:${q}`);

      const waiting = (await Promise.all(keys.map(k => redis.xlen(k)))).reduce((acc, cur) => acc + cur, 0);

      return waiting;
    });
    t.int('retries');
    t.boolean('someQueuesArePaused', async (root, args, { redis }) => {
      const queueNames = await redis.smembers(orkidDefaults.QUENAMES);
      const settingsKeys = queueNames.map(q => `${orkidDefaults.NAMESPACE}:queue:${q}:settings`);
      const allPaused = (await Promise.all(settingsKeys.map(k => redis.hget(k, 'paused')))).map(
        v => !!v && Number(v) === 1
      );

      let retval = false;
      for (const v of allPaused) {
        if (v) {
          retval = true;
          break;
        }
      }

      return retval;
    });
  }
});

exports.Task = objectType({
  name: 'Task',
  definition(t) {
    t.string('id', { nullable: true });
    t.string('qname', { nullable: true });
    t.string('data', { nullable: true });
    t.string('dedupKey', { nullable: true });
    t.int('retryCount', { nullable: true });
    t.string('result', { nullable: true });
    t.field('error', { nullable: true, type: 'ErrorLog' });
    t.string('at', { nullable: true });
  }
});

exports.TaskFeed = objectType({
  name: 'TaskFeed',
  definition(t) {
    t.string('nextCursor', { nullable: true });
    t.boolean('hasNextPage');
    t.list.field('tasks', {
      type: 'Task',
      nullable: true
    });
  }
});

exports.Queue = objectType({
  name: 'Queue',
  definition(t) {
    t.string('name');
    t.int('taskCount', async (root, args, { redis }) => {
      const qname = `${orkidDefaults.NAMESPACE}:queue:${root.name}`;
      const taskCount = await redis.xlen(qname);
      return taskCount;
    });
    t.int('activeWorkerCount', async (root, args, { redis }) => {
      const clients = (await redis.client('LIST')).split('\n');
      let retval = 0;

      for (const cli of clients) {
        const values = cli.split(' ');
        for (const v of values) {
          if (v.startsWith('name=')) {
            const namePair = v.split('=');
            if (namePair.length > 1 && namePair[1]) {
              if (namePair[1].startsWith(`${orkidDefaults.NAMESPACE}:queue:${root.name}:cg:c:`)) {
                retval++;
              }
            }
          }
        }
      }

      return retval;
    });
    t.boolean('isPaused', async (root, args, { redis }) => {
      const settingsKey = `${orkidDefaults.NAMESPACE}:queue:${root.name}:settings`;
      const val = await redis.hget(settingsKey, 'paused');
      const result = !!val && Number(val) === 1;

      return result;
    });
    t.field('taskFeed', {
      nullable: true,
      type: 'TaskFeed',
      args: {
        nextCursor: stringArg({
          default: null
        }),
        limit: intArg({
          default: 10
        })
      },
      async resolve(root, { nextCursor, limit }, { redis }) {
        const qname = `${orkidDefaults.NAMESPACE}:queue:${root.name}`;
        const start = nextCursor ? Base64.decode(nextCursor) : '-';
        const oneMore = limit + 1;

        const tasks = (await redis.xrange(qname, start, '+', 'COUNT', oneMore)).map(task => ({
          id: task.id,
          data: task.data ? task.data.data : null,
          dedupKey: task.data ? task.data.dedupKey : null,
          retryCount: task.data ? task.data.retryCount : 0,
          qname: root.name,
          at: new Date(Number(task.id.split('-')[0])).toISOString()
        }));

        let hasNextPage = false;
        let newCursor = null;

        if (oneMore === tasks.length) {
          hasNextPage = true;
          const task = tasks.pop();
          newCursor = Base64.encode(task.id);
        }

        return {
          hasNextPage,
          nextCursor: newCursor,
          tasks
        };
      }
    });
  }
});

exports.Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('resultList', {
      nullable: true,
      type: 'ResultList',
      resolve() {
        return {};
      }
    });
    t.field('deadList', {
      nullable: true,
      type: 'DeadList',
      resolve() {
        return {};
      }
    });
    t.field('failedList', {
      nullable: true,
      type: 'FailedList',
      resolve() {
        return {};
      }
    });
    t.field('stat', {
      nullable: true,
      type: 'Stat',
      async resolve(root, args, { redis }) {
        const defaultStat = { processed: 0, failed: 0, dead: 0, waiting: 0, retries: 0 };
        const stat = await redis.hgetall(orkidDefaults.STAT);
        return { ...defaultStat, ...stat };
      }
    });
    t.list.field('queueNames', {
      nullable: true,
      type: 'String',
      async resolve(root, args, { redis }) {
        const queueNames = await redis.smembers(orkidDefaults.QUENAMES);
        return queueNames;
      }
    });
    t.field('queue', {
      nullable: true,
      type: 'Queue',
      args: {
        name: stringArg({
          required: true
        })
      },
      async resolve(root, { name }, { redis }) {
        const exists = await redis.exists(`${orkidDefaults.NAMESPACE}:queue:${name}`);

        if (!exists) {
          return null;
        }

        return {
          name
        };
      }
    });
  }
});
