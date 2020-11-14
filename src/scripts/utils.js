const Redis = require("redis");

module.exports = {}
module.exports.createClient = function() {
  let client;
  const info = Url.parse(process.env.REDISTOGO_URL || process.env.BOXEN_REDIS_URL || process.env.REDISCLOUD_URL || 'redis://localhost:6379');

  if (info.hostname === '') {
    client = Redis.createClient(info.pathname);
  } else {
    client = Redis.createClient(info.port, info.hostname);
  }

  if (info.auth) {
    client.auth(info.auth.split(":")[1]);
  }

  return client;
};
