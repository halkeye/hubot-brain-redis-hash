###

hubot-bucket
https://github.com/halkeye/hubot-bucket

Copyright (c) 2013 Gavin
Licensed under the MIT license.

###

'use strict'
monkey = require 'monkey-patch'
module.exports = (robot) ->
  robot.adapter._oldsend = robot.adapter.send
  robot.adapter.send = (envelope, strings...) ->
    for i in [0...strings.length]
      strings[i] = strings[i].replace('$blah', 'whatever')

    @_oldsend envelope, strings

  robot.hear /^(.*)/, (msg) ->
    msg.reply(msg.match[0])

  robot.enter (response) ->
    # track enter
  robot.leave (response) ->
    # track leave
