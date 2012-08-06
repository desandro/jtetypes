

/*jshint asi: true, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */

// var siteData = require('./site-data.js');

var fs = require('fs');

// require('./site-data.js');
var siteData = require('./site-data');

module.exports = function( grunt ) {

  'use strict';

  // var siteData = grunt.file.readJSON('site-data.json');



  grunt.registerTask( 'templates', function() {

    var file = grunt.file.read('index.html');
    var processed = grunt.template.process( file, siteData );
    // create _site dir if not there
    // if ( fs.existsSync('_site') ) {
    //   fs.mkdirSync( '_site', '0755' );
    // }
    grunt.file.write( '_site/index.html', processed );
  });


  grunt.registerTask( 'data', function() {
    console.log( siteData );
  });

};