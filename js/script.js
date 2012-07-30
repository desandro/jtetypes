/**
 * JTE types JS
**/


/*jshint asi: false, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */
/*global WebFont: false */

( function( window, document, undefined ) {

'use strict';

// -------------------------- fonts -------------------------- //

var fontConfigs = {
  duke: {
    familes: [ 'Duke', 'Duke Fill', 'Duke Shadow' ],
    urls: [ 'css/duke.css' ]
  }
};

window.fontConfigs = fontConfigs;

// var webFontsConfig

var html = document.getElementsByTagName('html')[0];
html.className += ' wf-loading';

// set timeout if fonts never load
// var timeout = setTimeout( function(){
//   html.className = html.className.replace(/( |^)wf-loading( |$)/g,"");
//   html.className += ' wf-inactive';
//   // config.inactive();
// }, 20 );

var webFontScript = document.createElement('script');
webFontScript.src= '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
webFontScript.async = 'true';
webFontScript.onload = webFontScript.onreadystatechange = function() {
  var readyState = this.readyState;
  if ( readyState && readyState !== 'complete' && readyState !== 'loaded' ) {
    return;
  }
  console.log('WebFont should be ready');
  loadFont('duke');
  // clearTimeout( timeout );
  // WebFont.load()
};

var firstScript = document.getElementsByTagName('script')[0];
firstScript.parentNode.insertBefore( webFontScript, firstScript );

window.loadFont = function( fontName ) {
  WebFont.load({
    custom: fontConfigs[ fontName ],
    active: function() {
      console.log('font active');
    },
    inactive: function() {
      console.log('font inactive');
    },
    loading: function() {
      console.log('loading font right now');
    },
    fontactive: function(fontFamily, fontDescription) {
      console.log( arguments );
    },
    fontinactive: function(fontFamily, fontDescription) {
      console.log( arguments );
    }
  });
};

})( window, document );
