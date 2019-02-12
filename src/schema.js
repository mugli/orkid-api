const { objectType, intArg, stringArg } = require('nexus');

exports.ActionStatus = objectType({
  name: 'ActionStatus',
  definition(t) {
    t.boolean('success', { nullable: true });
  }
});

exports.DeadList = objectType({
  name: 'DeadList',
  definition(t) {
    t.int('taskCount', {
      resolve(root, args, ctx) {
        // TODO: Implement
      }
    });
    t.list.field('tasks', {
      nullable: true,
      type: 'Task',
      resolve(root, args, ctx) {
        // TODO: Implement
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

exports.FailedList = objectType({
  name: 'FailedList',
  definition(t) {
    t.int('taskCount', {
      resolve(root, args, ctx) {
        // TODO: Implement
      }
    });
    t.list.field('tasks', {
      nullable: true,
      type: 'Task',
      resolve(root, args, ctx) {
        // TODO: Implement
      }
    });
  }
});

exports.Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.boolean('allActive', { nullable: true });
    t.field('pauseAll', { nullable: true, type: 'ActionStatus' });
    t.field('resumeAll', { nullable: true, type: 'ActionStatus' });
  }
});

exports.Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('resultList', { nullable: true, type: 'ResultList' });
    t.field('deadList', { nullable: true, type: 'DeadList' });
    t.field('failedList', { nullable: true, type: 'FailedList' });
    t.field('stat', { nullable: true, type: 'Stat' });
    t.list.string('queueNames', {
      nullable: true,
      resolve(root, args, ctx) {
        // TODO: Implement
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
      resolve(root, args, ctx) {
        // TODO: Implement
      }
    });
  }
});

exports.Queue = objectType({
  name: 'Queue',
  definition(t) {
    t.string('name');
    t.int('taskCount');
    t.int('workerCount');
    t.boolean('active', { nullable: true });
    t.list.field('tasks', {
      nullable: true,
      type: 'Task',
      args: {
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

exports.ResultList = objectType({
  name: 'ResultList',
  definition(t) {
    t.int('taskCount', {
      resolve(root, args, ctx) {
        // TODO: Implement
      }
    });
    t.list.field('tasks', {
      nullable: true,
      type: 'Task',
      resolve(root, args, ctx) {
        // TODO: Implement
      }
    });
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
  },
  defaultResolver(root, args, ctx) {
    // TODO: Implement
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
