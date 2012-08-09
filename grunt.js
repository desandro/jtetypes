

/*jshint asi: true, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */

var fs = require('fs');

var siteData = require('./js/site-data');

module.exports = function( grunt ) {

  'use strict';

  grunt.registerTask( 'templates', function() {
    var file = grunt.file.read('index.html');
    var processed = grunt.template.process( file, siteData );
    grunt.file.write( '_site/index.html', processed );
  });


  grunt.registerTask( 'data', function() {
    console.log( siteData );
  });

};