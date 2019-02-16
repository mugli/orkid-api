const express = require('express');
const cors = require('cors');
const prepareIoredis = require('../utils/prepare-ioredis');
prepareIoredis();

const IORedis = require('ioredis');
const redis = new IORedis(); // TODO: Pass redis config
const Apollo = require('./apollo');
const apollo = Apollo(redis);

const app = express();
app.use(cors()); // TODO: Pass custom corsOptions
app.set('x-powered-by', false);

apollo.applyMiddleware({ app });

app.listen(4000, '0.0.0.0', () => {
  console.log(`Orkid API ready at http://localhost:4000${apollo.graphqlPath}`);
});
