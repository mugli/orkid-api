const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const Apollo = require('./apollo');

const apollo = Apollo();

const app = express();
app.use(cors());
app.set('x-powered-by', false);

const requestLogger = function requestLogger(req, _res, next) {
  if (req.body) {
    console.log('------------------------');
    console.log('Request (req.body.variables):', req.body.variables);
    console.log('Request (req.body.query):', req.body.query);
    console.log('------------------------');
  }
  next();
};

if (process.env.NODE_ENV === 'development') {
  app.use(bodyParser.json());
  app.use(requestLogger);
}

apollo.applyMiddleware({ app, path: '/api/graphql' });

app.listen(4100, '0.0.0.0', () => {
  console.log(`Orkid API ready in Development Mode at http://localhost:4100${apollo.graphqlPath}`);
});
