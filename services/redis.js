const redis = require("redis"),
      log   = require("./log"),
      client = redis.createClient();

client.on("connect",  () => log.debug("Redis client connected successfully."));
client.on("error", (err) => log.debug("Error with Redis client.", err));

module.exports = client;
