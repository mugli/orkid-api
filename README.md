# orkid-api

[![NPM version](https://img.shields.io/npm/v/orkid-api.svg)](https://www.npmjs.com/package/orkid-api)
![Dependencies](https://img.shields.io/david/mugli/orkid-api.svg?style=flat)
![Dev Dependencies](https://img.shields.io/david/dev/mugli/orkid-api.svg?style=flat)
![Required Node Version](https://img.shields.io/node/v/orkid-api.svg?style=flat)
![License](https://img.shields.io/npm/l/orkid-api.svg?style=flat)

GraphQL API to monitor and manage [Orkid task queue](https://github.com/mugli/orkid-node).

📎 **This package should come bundled with Orkid UI.**
End users of [Orkid queue](https://github.com/mugli/orkid-node) don't have to use this separately.

![screenshot](https://raw.githubusercontent.com/mugli/orkid-api/master/screenshot.png)

_If you are contributing to the API or UI projects, please read below._

--

## Install

In a project where you want to consume the API (typically in a [Orkid UI project](https://github.com/mugli/orkid-ui)):

```
npm install orkid-api --save
```

## Development

### Minimum Requirements

- Node.js >= 10
- Redis >= 5

### Seed Initial Data

You don't have to have Orkid running so that the API can return data from Redis for development purpose. The seed script generates necessary data in redis.

Make sure `redis-server` is running. Then:

```
npm run flush-and-seed
```

**Warning: It will DELETE all existing data in Redis!**

Running the command will ask if it is ok to delete existing data and proceed with seed.

> All data in your redis sever will be cleared. Proceed? (y/N)

Enter `y` to continue.

### Start the GraphQL API Server

Make sure `redis-server` is running. Then:

```
npm run dev
```

It should show:

> Orkid API ready at http://localhost:4100/api/graphql

Open the URL in the browser to launch GraphQL playground (showed in the screenshot above).

## Author

- Mehdi Hasan Khan ([@MehdiHK](https://twitter.com/MehdiHK))

## License

MIT

---

### Related Projects

- [orkid-node](https://github.com/mugli/orkid-node): Reliable and modern Redis based task queue for Node.js. Use this to produce and consume jobs.
- [orkid-ui](https://github.com/mugli/orkid-ui): Dashboard to monitor and manage Orkid task queue.
