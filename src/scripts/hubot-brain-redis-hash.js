// Description:
//   None
//
// Dependencies:
//   "redis": "0.7.2"
//
// Configuration:
//   REDISTOGO_URL
//   REDIS_PREFIX - If not provided will default to 'hubot'.
//
// Commands:
//   None
//
// Author:
//   Gavin Mogan <gavin@gavinmogan.com>

'use strict';

const Url   = require("url");
const BrainUtilities = require('./utils');

// sets up hooks to persist the brain into redis.
module.exports = function(robot) {
  robot.brain.redis_hash = {};
  const client = BrainUtilities.createClient();
  const prefix = process.env.REDIS_PREFIX || 'hubot';

  let oldkeys = {};
  client.on("error", err => robot.logger.error(err));

  client.on("connect", function() {
    robot.logger.debug("Successfully connected to Redis");

    return client.hgetall(`${prefix}:brain`, function(err, reply) {
      if (err) {
        throw err;
      } else if (reply) {
        robot.logger.info("Brain data retrieved from redis-brain storage");
        const results = {};
        oldkeys = {};
        for (let key of Array.from(Object.keys(reply))) {
          results[key] = JSON.parse(reply[key].toString());
          oldkeys[key] = 1;
        }
        robot.brain.mergeData(results);
      } else {
        robot.logger.info("Initializing new redis-brain storage");
        robot.brain.mergeData({});
      }

      robot.logger.info("Enabling brain auto-saving");
      if (robot.brain.setAutoSave != null) {
        return robot.brain.setAutoSave(true);
      }
    });
  });

  // Prevent autosaves until connect has occured
  robot.logger.info("Disabling brain auto-saving");
  if (robot.brain.setAutoSave != null) {
    robot.brain.setAutoSave(false);
  }

  robot.brain.on('save', function(data) {
    let key;
    if (data == null) { data = {}; }
    robot.logger.debug("Saving brain data");
    const multi = (client.multi)();
    const keys = Object.keys(data);
    const jsonified = {};
    for (key of Array.from(keys)) {
      jsonified[key] = JSON.stringify(data[key]);
    }
    for (key of Array.from(oldkeys)) {
      if (!jsonified[key]) {
        multi.hdel(`${prefix}:brain`, key);
      }
    }

    oldkeys = {};
    for (key of Array.from(keys)) {
      if (jsonified[key] != null) {
        oldkeys[key] = 1;
        multi.hset(`${prefix}:brain`, key, jsonified[key]);
      }
    }

    return multi.exec(function(err,replies) {
      robot.brain.emit('done:save');
    });
  });

  robot.brain.on('close', () => client.quit());

  return this;
};
