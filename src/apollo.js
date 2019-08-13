const { ApolloServer } = require('apollo-server-express');
const IORedis = require('ioredis');

const { schema } = require('./graphql-schema');

const apollo = (redisConf = {}) => {
  const redis = new IORedis(redisConf);

  const apl = new ApolloServer({
    schema,
    mocks: false,
    tracing: true,
    cors: true,
    context: ({ req }) => ({
      req,
      redis
    })
  });

  return apl;
};

module.exports = apollo;
