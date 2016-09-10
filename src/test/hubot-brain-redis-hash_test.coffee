'use strict'

process.env.HUBOT_LOG_LEVEL="alert"
process.env.EXPRESS_PORT = process.env.PORT = 0

Hubot = require('hubot')
Path = require('path')
Url = require 'url'
should = require('should')
sinon = require('sinon')
fakeredis = require('fakeredis')

adapterPath = Path.join Path.dirname(require.resolve 'hubot'), "src", "adapters"
{TextMessage} = require Path.join(adapterPath,'../message')

hubot_brain_redis_hash = require('../scripts/hubot-brain-redis-hash')

describe 'Hubot-Brain-Redis-Hash', ()->
  before ->
    sinon.stub(hubot_brain_redis_hash, 'createClient', fakeredis.createClient)

  beforeEach ->
    @robot = Hubot.loadBot adapterPath, "shell", "true", "MochaHubot"
    hubot_brain_redis_hash(@robot)
    @client = @robot.brain.redis_hash.client

  after ->
    hubot_brain_redis_hash.createClient.restore()

  afterEach (done)->
    @client.flushdb ->
      done()

  it 'handleError', ()->
    @client.emit('error', 'this is my fake error')

  it 'handleConnect', (done)->

    orig_data = { users: {}, _private: {} }
    @robot.brain.data.should.eql(orig_data)
    orig_data.thisisgavin = { a: "byebye" }

    multi = do @client.multi
    for key, value of orig_data
      multi.hset "hubot:brain", key, JSON.stringify(orig_data[key])

    multi.exec (err, replies) =>
      @robot.brain.on 'loaded', (data) ->
        data.should.eql(orig_data)
        done()
      @client.emit('connect')

  it 'handleSave', (done)->
    @robot.brain.data.should.eql({ users: {}, _private: {} })
    @robot.brain.data.gavin = "gavin"
    @robot.brain.data.gavin.should.eql("gavin")
    @robot.brain.save()
    @robot.brain.on 'done:save', () =>
      @client.hgetall "hubot:brain", (err, reply) ->
        reply.gavin.should.eql('"gavin"')
        done(err)

