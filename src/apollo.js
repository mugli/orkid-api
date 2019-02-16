const { ApolloServer } = require('apollo-server-express');
const { GraphQLError } = require('graphql');
const { v4 } = require('uuid');

const { schema } = require('./graphql-schema');

const apollo = redis => {
  const apl = new ApolloServer({
    schema,
    mocks: false,
    tracing: true,
    /*
  formatError: error => {
    const errId = v4();

    console.log(`GraphQL Error ${errId}`, error);
    return new GraphQLError(`Internal Error ${errId}`);
  },
  */
    cors: true, // TODO: Pass custom corsOptions
    context: ({ req }) => ({
      req,
      redis
    })
  });

  return apl;
};

module.exports = apollo;
