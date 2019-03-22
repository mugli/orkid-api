const { ApolloServer } = require('apollo-server-express');
const { GraphQLError } = require('graphql');
const { v4 } = require('uuid');

const prepareIoredis = require('../utils/prepare-ioredis');
prepareIoredis();

const { schema } = require('./graphql-schema');

let formatError;
if (process.env.NODE_ENV !== 'development') {
  formatError = error => {
    const errId = v4();

    console.log(`GraphQL Error ${errId}`, error);
    return new GraphQLError(`Internal Error ${errId}`);
  };
}

const apollo = redis => {
  const apl = new ApolloServer({
    schema,
    mocks: false,
    tracing: true,
    formatError,
    cors: true,
    context: ({ req }) => ({
      req,
      redis
    })
  });

  return apl;
};

module.exports = apollo;
