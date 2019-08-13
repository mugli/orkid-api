/*
  Source: https://github.com/luin/ioredis/issues/747#issuecomment-500735545
*/

function parseObjectResponse(reply, customParser = null) {
  if (!Array.isArray(reply)) {
    return reply;
  }
  const data = {};
  for (let i = 0; i < reply.length; i += 2) {
    if (customParser) {
      data[reply[i]] = customParser(reply[i], reply[i + 1]);
      continue;
    }
    data[reply[i]] = reply[i + 1];
  }
  return data;
}

function parseMessageResponse(reply) {
  if (!Array.isArray(reply)) {
    return [];
  }
  return reply.map(message => {
    return {
      id: message[0],
      data: parseObjectResponse(message[1])
    };
  });
}

module.exports = {
  parseMessageResponse
};
