'use strict';

process.env.HUBOT_LOG_LEVEL="alert";
process.env.EXPRESS_PORT = (process.env.PORT = 0);

const Hubot = require('hubot');
const Path = require('path');
const Url = require('url');
const should = require('should');
const sinon = require('sinon');
const fakeredis = require('fakeredis');
const {promisify} = require('util');

const BrainUtilities = require('../scripts/utils');
const Helper = require('hubot-test-helper');
const helper = new Helper('../scripts/hubot-brain-redis-hash.js');

const hubot_brain_redis_hash = require('../scripts/hubot-brain-redis-hash');

describe('Hubot-Brain-Redis-Hash', function(){
  let room;
  let client;

  before(() => {
    client = fakeredis.createClient();
    sinon.stub(BrainUtilities, 'createClient').returns(client)
  });
  after(() => BrainUtilities.createClient.restore());

  beforeEach(function () {
    room = helper.createRoom({ httpd: false });
  });

  afterEach(function(done){
    client.flushdb(() => done());
  });

  it('handleError', function(){
    client.emit('error', 'this is my fake error');
  });

  it('handleConnect', function(done){
    const orig_data = { users: {}, _private: {} };
    room.robot.brain.data.should.eql(orig_data);
    orig_data.thisisgavin = { a: "byebye" };

    const multi = client.multi();
    for (let key of Object.keys(orig_data)) {
      const value = orig_data[key];
      const a = multi.hset("hubot:brain", key, JSON.stringify(orig_data[key]));
    }

    multi.exec((err, replies) => {
      room.robot.brain.on('loaded', function(data) {
        data.should.eql(orig_data);
        done();
      });
      client.emit('connect');
    });
  });

  it('handleSave', async function(){
    room.robot.brain.data.should.eql({ users: {}, _private: {} });
    room.robot.brain.data.gavin = "gavin";
    room.robot.brain.data.gavin.should.eql("gavin");
    room.robot.brain.save();
    await new Promise(resolve => room.robot.brain.once('done:save', resolve));
    const reply = await new Promise(resolve => client.hgetall("hubot:brain", function (err, values) { resolve(values); }));
    reply.gavin.should.eql('"gavin"');
  });
});

