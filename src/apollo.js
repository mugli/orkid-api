const { ApolloServer } = require('apollo-server-express');

const { schema } = require('./graphql-schema');

const apollo = redis => {
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
