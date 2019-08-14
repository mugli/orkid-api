const { ApolloServer } = require('apollo-server-express');
const IORedis = require('ioredis');

const { schema } = require('./graphql-schema');

const apollo = (redisConf = {}) => {
  const redis = new IORedis({
    ...redisConf,
    retryStrategy: function retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    }
  });

  const apl = new ApolloServer({
    schema,
    mocks: false,
    tracing: true,
    cors: true,
    formatError: err => {
      console.error(err);
      return err;
    },
    context: ({ req }) => ({
      req,
      redis
    })
  });

  return apl;
};

module.exports = apollo;
