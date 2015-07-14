module.exports = (grunt)->
  'use strict'

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    jshint:
      options:
        jshintrc: '.jshintrc'
      scripts:
        src: ['src/scripts/**/*.js']
      test:
        src: ['src/test/**/*.js']
    coffeelint:
      gruntfile:
        src: 'Gruntfile.coffee'
      scripts:
        src: ['src/scripts/*.coffee']
      test:
        src: ['src/test/*.coffee']
      options:
        no_trailing_whitespace:
          level: 'error'
        max_line_length:
          level: 'warn'
    simplemocha:
      all:
        src: [
          'node_modules/should/lib/should.js'
          'src/test/**/*.coffee'
        ]
        options:
          globals: ['should']
          timeout: 3000
          ignoreLeaks: false
          #grep: '**/*.js'
          ui: 'bdd'
          reporter: 'tap'
    watch:
      gruntfile:
        files: '<%= coffeelint.gruntfile.src %>'
        tasks: ['coffeelint:gruntfile']
      coffeeLib:
        files: '<%= coffeelint.scripts.src %>'
        tasks: ['coffeelint:scripts', 'simplemocha']
      coffeeTest:
        files: '<%= coffeelint.test.src %>'
        tasks: [ 'coffeelint:test', 'simplemocha']

  # plugins.
  grunt.loadNpmTasks 'grunt-simple-mocha'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  # tasks.
  grunt.registerTask 'compile', [
    'coffeelint'
  ]

  grunt.registerTask 'test', [ 'simplemocha' ]
  grunt.registerTask 'default', ['compile', 'test']

