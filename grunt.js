

/*jshint asi: true, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */

var fs = require('fs');

var siteData = require('./js/site-data');

var reMinJs = /.min.js$/;

module.exports = function( grunt ) {

  'use strict';

  // build linted script files
  var lintableScripts = siteData.scripts.filter( function( filePath ) {
    return !reMinJs.test( filePath );
  });

  grunt.initConfig({

    // JS Hint
    lint: {
      files: lintableScripts
    },
    jshint: {
      options: {
        asi: false,
        curly: true,
        devel: true,
        eqeqeq: true,
        forin: false,
        newcap: true,
        noempty: true,
        strict: true,
        undef: true,
        browser: true
      },
      globals: {
        Modernizr: false
      }
    }

  });



  grunt.registerTask( 'templates', function( arg1 ) {
    var file = grunt.file.read('index.html');

    var taggedScripts = siteData.scripts.map( function( filePath ) {
      return '<script src="' + filePath + '"></script>';
    });

    var processed = grunt.template.process( file, {
      data: siteData,
      scripts: taggedScripts.join("\n")
    });
    grunt.file.write( '_site/index.html', processed );
  });


  grunt.registerTask( 'data', function() {
    console.log( siteData );
  });

};