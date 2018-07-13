# hubot-brain-redis-hash

[![Build Status](https://travis-ci.org/halkeye/hubot-brain-redis-hash.svg?branch=master)](https://travis-ci.org/halkeye/hubot-brain-redis-hash)
[![NPM](https://nodei.co/npm/hubot-brain-redis-hash.png)](https://nodei.co/npm/hubot-brain-redis-hash/) [![Greenkeeper badge](https://badges.greenkeeper.io/halkeye/hubot-brain-redis-hash.svg)](https://greenkeeper.io/)

Hubot brain that uses hset and hget instead of storing everything as one giant blob

## Getting Started
1. Install the module: `npm install --save hubot-brain-redis-hash`
2. Add it `hubot-brain-redis-hash` to your external-scripts.json file in your hubot directory
3. Profit

## Configuration (optional)
```
export REDISTOGO_URL="redis://localhost:6379"
```

## Release History

0.1.3 - 2016-09-10

* Added REDIS_PREFIX env config - Thanks @erikzaadi

0.2.0 - 2017-09-09

* Updates to most libraries/deps
* Added REDISCLOUD_URL env config - Thanks @actionshrimp - #18

## License
Copyright (c) 2013 Gavin Mogan
Licensed under the MIT license.
