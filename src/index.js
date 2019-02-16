const { makeSchema } = require('nexus');
const { ApolloServer, gql } = require('apollo-server-express');
const { GraphQLError } = require('graphql');
const { v4 } = require('uuid');
const types = require('./schema');

const prepareIoredis = require('../utils/prepare-ioredis');
prepareIoredis();

const IORedis = require('ioredis');
const express = require('express');
const cors = require('cors');

const redis = new IORedis(); // TODO: Pass redis config here

const schema = makeSchema({
  types,
  outputs: {
    schema: __dirname + '/../generated/schema.graphql',
    typegen: __dirname + '/../generated/typings.ts'
  }
});

const apollo = new ApolloServer({
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

const app = express();
app.use(cors()); // TODO: Pass custom corsOptions
app.set('x-powered-by', false);

apollo.applyMiddleware({ app });

app.listen(4000, '0.0.0.0', () => {
  console.log(`Orkid API ready at http://localhost:4000${apollo.graphqlPath}`);
});
