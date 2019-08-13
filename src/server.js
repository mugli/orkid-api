const express = require('express');
const cors = require('cors');
const IORedis = require('ioredis');

const redis = new IORedis(); // Pass custom redis config here
const Apollo = require('./apollo');

const apollo = Apollo(redis);

const app = express();
app.use(cors());
app.set('x-powered-by', false);

apollo.applyMiddleware({ app, path: '/api/graphql' });

app.listen(4100, '0.0.0.0', () => {
  console.log(`Orkid API ready in Development Mode at http://localhost:4100${apollo.graphqlPath}`);
});
