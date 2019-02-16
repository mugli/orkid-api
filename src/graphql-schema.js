const { makeSchema } = require('nexus');
const types = require('./graphql-resolvers');

const schema = makeSchema({
  types,
  outputs: {
    schema: __dirname + '/../generated/schema.graphql',
    typegen: __dirname + '/../generated/typings.ts'
  },
  shouldGenerateArtifacts: process.env.NODE_ENV === 'development'
});

module.exports = {
  schema
};
