

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
        devel: false,
        eqeqeq: true,
        forin: false,
        newcap: true,
        noempty: true,
        smarttabs: true,
        strict: true,
        undef: true,
        browser: true
      },
      globals: {
        Modernizr: false,
        module: false,
        jQuery: false
      }
    }

  });

  function minCatJS() {
    var output = '';
    var timeStamp = grunt.template.today('yymmddhhmmss');
    // timestamp destination js file
    var dest = 'js/scripts-all.' + timeStamp + '.js';

    siteData.scripts.forEach( function( filePath, i ) {
      var file = grunt.file.read( filePath );
      output += '// ---- ' + filePath + ' ---- //';
      output += "\n\n";
      if ( filePath.indexOf('.min.js') !== -1 ) {
        // concat full file
        output += file;
      } else {
        // concat minified file
        output += grunt.helper( 'uglify', file );
      }
      output += "\n\n";
    });

    grunt.file.write( '_site/' + dest, output );
    grunt.log.writeln( ( 'generated ' + dest ).cyan );
    return dest;
  }

  grunt.registerTask( 'mincatjs', 'Minifies and concats JS', minCatJS );

  function getDevScripts() {
    // each script gets a tag
    var taggedScripts = siteData.scripts.map( function( filePath ) {
      return '<script src="' + filePath + '"></script>';
    });
    return taggedScripts.join("\n");
  }

  function getProductionScripts() {
    var scriptPath = minCatJS();
    // console.log( scriptPath );
    return '<script src="' + scriptPath + '"></script>';
  }


  grunt.registerTask( 'templates', function( arg1 ) {
    var file = grunt.file.read('index.html');
    var scriptsHtml = arg1 === 'dev' ? getDevScripts() : getProductionScripts();

    var processed = grunt.template.process( file, {
      data: siteData,
      scripts: scriptsHtml
    });
    grunt.file.write( '_site/index.html', processed );
  });

  grunt.registerTask( 'build', function( arg1 ) {
    var opt1 = arg1 ? ':' + arg1 : '';
    grunt.task.run( 'lint templates' + opt1 );
  });

};