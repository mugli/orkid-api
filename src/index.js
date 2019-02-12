const { queryType, stringArg, makeSchema } = require('nexus');
const { ApolloServer, gql } = require('apollo-server-express');
const { GraphQLError } = require('graphql');
const { v4 } = require('uuid');

const express = require('express');
const cors = require('cors');

const Query = queryType({
  definition(t) {
    t.string('hello', {
      args: { name: stringArg({ nullable: true }) },
      resolve: (parent, { name }) => `Hello ${name || 'World'}!`
    });
  }
});

const schema = makeSchema({
  types: [Query],
  outputs: {
    schema: __dirname + '/../generated/schema.graphql',
    typegen: __dirname + '/../generated/typings.ts'
  }
});

const apollo = new ApolloServer({
  schema,
  mocks: false,
  tracing: true,
  formatError: error => {
    const errId = v4();

    console.log(`GraphQL Error ${errId}`, error);
    return new GraphQLError(`Internal Error ${errId}`);
  },
  cors: true, // TODO: Pass custom corsOptions
  context: ({ req }) => ({
    req
  })
});

const app = express();
app.use(cors()); // TODO: Pass custom corsOptions
app.set('x-powered-by', false);

apollo.applyMiddleware({ app });

app.listen(4000, '0.0.0.0', () => {
  console.log(`Orkid API ready at http://localhost:4000${apollo.graphqlPath}`);
});
