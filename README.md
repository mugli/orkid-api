# orkid-api

GraphQL API to Monitor and Manage Orkid Task Queue.

**This package comes bundled with Orkid UI.**
End users of Orkid Queue don't have to install this separately.

![screenshot](https://raw.githubusercontent.com/mugli/orkid-api/master/screenshot.png)

_If you are contributing to the API or UI, please read below._

## Install

```
npm install orkid-api --save
```

## Development

### Minimum Requirements

- Node.js >= 10
- Redis >= 5

### Seed Data

You don't have to have Orkid running so that the API can return data. There is a seed script that can generate necessary data in redis.

```
npm run flush-and-seed
```

**Warning: It will DELETE all existing data in Redis!**

Running the command will ask if it is ok to delete existing data and proceed with seed. Enter `Yes` to continue.

### Start the GraphQL API Server in development mode

Make sure Redis server is running. Then:

```
npm run dev
```

It should show:

> Orkid API ready at http://localhost:4000/graphql

Open the URL in the browser to launch GraphQL playground (showed in the screenshot above).
