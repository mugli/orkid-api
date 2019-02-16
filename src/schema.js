const { objectType, intArg, stringArg } = require('nexus');
const { orkidDefaults } = require('./common');

exports.ActionStatus = objectType({
  name: 'ActionStatus',
  definition(t) {
    t.boolean('success', { nullable: true });
  }
});

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
    t.list.field('tasks', {
      nullable: true,
      type: 'Task',
      args: {
        // TODO: Change to cursor based pagination for consistency
        offset: intArg({
          default: 0,
          description: 'The number of items to skip, for pagination'
        }),
        limit: intArg({
          default: 10,
          description: 'The number of items to fetch starting from the offset, for pagination'
        })
      },
      async resolve(root, { offset, limit }, { redis }) {
        if (offset + limit - 1 >= 0) {
          limit = offset + limit - 1;
        } else {
          return [];
        }
        const tasks = await redis.lrange(orkidDefaults.DEADLIST, offset, limit);
        return tasks.map(t => deserializeTask(t));
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
    t.list.field('tasks', {
      nullable: true,
      type: 'Task',
      args: {
        // TODO: Change to cursor based pagination for consistency
        offset: intArg({
          default: 0,
          description: 'The number of items to skip, for pagination'
        }),
        limit: intArg({
          default: 10,
          description: 'The number of items to fetch starting from the offset, for pagination'
        })
      },
      async resolve(root, { offset, limit }, { redis }) {
        if (offset + limit - 1 >= 0) {
          limit = offset + limit - 1;
        } else {
          return [];
        }
        const tasks = await redis.lrange(orkidDefaults.RESULTLIST, offset, limit);
        return tasks.map(t => deserializeTask(t));
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
    t.list.field('tasks', {
      nullable: true,
      type: 'Task',
      args: {
        // TODO: Change to cursor based pagination for consistency
        offset: intArg({
          default: 0,
          description: 'The number of items to skip, for pagination'
        }),
        limit: intArg({
          default: 10,
          description: 'The number of items to fetch starting from the offset, for pagination'
        })
      },
      async resolve(root, { offset, limit }, { redis }) {
        if (offset + limit - 1 >= 0) {
          limit = offset + limit - 1;
        } else {
          return [];
        }
        const tasks = await redis.lrange(orkidDefaults.FAILEDLIST, offset, limit);
        return tasks.map(t => deserializeTask(t));
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
  // TODO: Implement
  definition(t) {
    t.boolean('allActive', { nullable: true });
    t.field('pauseAll', { nullable: true, type: 'ActionStatus' });
    t.field('resumeAll', { nullable: true, type: 'ActionStatus' });
    t.field('deleteQueue', { nullable: true, type: 'ActionStatus' });
  }
});

exports.Stat = objectType({
  name: 'Stat',
  definition(t) {
    t.int('total');
    t.int('failed');
    t.int('dead');
    t.int('enqueued');
    t.int('retries');
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

exports.Queue = objectType({
  name: 'Queue',
  definition(t) {
    t.string('name');
    t.int('taskCount', async (root, args, { redis }) => {
      const qname = `${orkidDefaults.NAMESPACE}:queue:${root.name}`;
      const taskCount = await redis.xlen(qname);
      return taskCount;
    });
    t.int('activeWorkerCount'); // TODO: Implement
    t.boolean('active'); // TODO: Implement
    t.list.field('tasks', {
      nullable: true,
      type: 'Task',
      args: {
        // TODO: Change to cursor based pagination because XRANGE (https://redis.io/commands/xrange)
        // doesn't offer a good way to do offset based pagination
        offset: intArg({
          default: 0,
          description: 'The number of items to skip, for pagination'
        }),
        limit: intArg({
          default: 10,
          description: 'The number of items to fetch starting from the offset, for pagination'
        })
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
        const stat = await redis.hgetall(orkidDefaults.STAT);
        return stat;
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
