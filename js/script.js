/**
 * JTE types JS
**/


/*jshint asi: true, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */
/*global WebFont: false, jQuery: false */

( function( window, document, location, $, undefined ) {

'use strict';

var $body, $theTextarea;
var path = {}; //parts of the hashes

// helper function
function capitalize( str ) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// gets 'hello-my-name-is' returns 'Hello-My-Name-Is'
function capitalizeHyphenated( str ) {
  var words = str.split('-');
  var cappedWords = [];
  var cappedWord;
  for ( var i=0, len = words.length; i < len; i++ ) {
    cappedWord = capitalize( words[i] );
    cappedWords.push( cappedWord );
  }
  return cappedWords.join('-');
}



// variation on...
// http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
var debounce = function ( func, threshold ) {

  var timeout;
  return function debounced () {
    function delayed () {
      func();
      timeout = null;
    };
    if ( timeout ) {
      clearTimeout( timeout );
    }
    timeout = setTimeout( delayed, threshold || 500 );
  };
}

// -------------------------- fonts -------------------------- //

var fontConfigs = {
  duke: {
    families: [
      'Duke',
      'Duke Fill',
      'Duke Shadow'
    ],
    urls: [ 'css/duke.css' ]
  },
  edmondsans: {
    families: [
      'Edmondsans Regular',
      'Edmondsans Medium',
      'Edmondsans Bold'
    ],
    urls: [ 'css/edmondsans.css' ]
  },
  lavanderia: {
    families: [
      'Lavanderia Delicate',
      'Lavanderia Regular',
      'Lavanderia Sturdy'
    ],
    urls: [ 'css/lavanderia.css' ]
  },
  'mission-script': {
    families: [
      'Mission Script'
    ],
    urls: [ 'css/mission-script.css' ]
  },
  'wisdom-script': {
    families: [
      'Wisdom Script'
    ],
    urls: [ 'css/wisdom-script.css' ]
  }
};


// build a hash of familes of fonts
var fontFamilies = {};
var fonts, font;
for ( var family in fontConfigs ) {
  fonts = fontConfigs[ family ].families;
  for ( var i=0, len = fonts.length; i < len; i++ ) {
    font = fonts[i].replace( /\s/gi, '-' ).toLowerCase();
    fontFamilies[ font ] = family;
  }
}

window.fontConfigs = fontConfigs;

// -------------------------- load font -------------------------- //

var loadFamily = function( family, callback ) {
  WebFont.load({
    custom: fontConfigs[ family ],
    active: function() {
      // keep track of loaded family
      fontConfigs[ family ].isLoaded = true;
      if ( callback ) {
        callback();
      }
      console.log( family + ' family active');
    },
    inactive: function() {
      console.log( family + ' family inactive');
    }
  });
};

function selectFont( font ) {
  console.log( 'selecting ', font );
  // don't change if invalid font
  if ( !( font in fontFamilies ) ) {
    return;
  }
  // path.font = font;
  var family = fontFamilies[ font ];

  if ( fontConfigs[ family ].isLoaded ) {
    // family already loaded, select the font
    activateFont( font );
  } else {
    // family not loaded, load the family, then select font
    loadFamily( family, function() {
      activateFont( font );
    });
  }
}

var activeFont;

function activateFont( font ) {
  if ( activeFont ) {
    $body.removeClass( activeFont );
  }
  $body.addClass( font );
  activeFont = font;
  console.log('activated ' + font );

}

// window.loadFont = loadFont;

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
  // load edmondsans family first
  loadFamily('edmondsans');
  // clearTimeout( timeout );
  // WebFont.load()
};

var firstScript = document.getElementsByTagName('script')[0];
firstScript.parentNode.insertBefore( webFontScript, firstScript );

// -------------------------- events -------------------------- //

function onFontSelectionClick( event ) {
  var $target = $( event.target );
  path.font = $target.attr('data-font');
  pushIt();
  event.preventDefault();
}

var changeTimeout;


function onTextareaChange( event ) {
  path.text = $theTextarea.val();
  debouncedPushIt();
}

function onHashchange( event ) {
  console.log( 'hashchange' );
  // reset
  var hashPath = getHashPath( location.hash );
  wasPushed = false;
  // parse path
}

function onSlidechange( event, ui ) {
  setFontSize( ui.value );
  path.size = ui.value + 'px';
  debouncedPushIt();
}



// -------------------------- pushIt -------------------------- //

var wasPushed = false;

// push it real good
function pushIt() {
  // set hashbang
  var hash = '#!/';
  if ( path.text ) {
    hash += encode( path.text ) + '/';
  }
  if ( path.font ) {
    hash += 'in:' + capitalizeHyphenated( path.font ) + '/';
  }
  if ( path.size ) {
    hash += 'at:' + path.size + '/';
  }
  wasPushed = true;
  $.bbq.pushState( hash );
}

var debouncedPushIt = debounce( function() {
  pushIt();
});


// -------------------------- hash path -------------------------- //

function encode( text ) {
  return text.replace( /\-/gi, '\\-' ) // dash to slash-dash
    .replace( / /g, '-' ) // space to dash
    .replace( /\n/g, '\\n' ) // break to '\n'
    .replace( /#/g, '\\H' ) // # to \H
}

function decode( text ) {
  return text.replace( /\\\-/gi, '_dash_' ) // slash-dash to _dash_
    .replace( /\-/g, ' ' ) // - to space
    .replace( /_dash_/g, '-' ) // _dash_ to -
    .replace( /\\n/g, "\n" ) // \n to line break
    .replace( /\\H/g, '#' ); // \H to #
}

function getHashPath( hash ) {
  var hashPath = {};
  var parts = hash.split('/');
  var part, font, size, text;
  var textIsSet;
  for ( var i=0, len = parts.length; i < len; i++ ) {
    part = parts[i];
    if ( part === '' || part === '#!' ) {
      // disregard hashbang or empty
      continue;
    } else if ( part.indexOf('in:') === 0 ) {
      font = part.replace( 'in:', '' ).toLowerCase();
      selectFont( font );
    } else if ( part.indexOf('at:') === 0 ) {
      setFontSize( part.replace( 'at:', '' ) );
    } else if ( !textIsSet ) {
      // set text area value
      text = decode( part );
      $theTextarea.val( text );
      textIsSet = true;
    }
  }
}

function setFontSize( size ) {
  size = parseInt( size ) + 'px';
  $theTextarea.css({
    fontSize: size
  });
  $fontSizeOutput.text( size );
}

// -------------------------- doc ready -------------------------- //

var $fontSizeOutput;

$( function() {
  $body = $('body');
  $('#font-selection').on( 'click', 'a', onFontSelectionClick );

  $theTextarea = $('#the-textarea');
  $theTextarea.on( 'keyup change', onTextareaChange );

  $( window ).on( 'hashchange', onHashchange );

  $fontSizeOutput = $('#font-sizer .output');

  // set up slider
  $('#font-size').slider({
    min: 14,
    max: 320,
    slide: onSlidechange,
    change: onSlidechange
  });

});

})( window, document, location, jQuery );
