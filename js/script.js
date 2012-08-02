/**
 * JTE types JS
**/


/*jshint asi: true, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */
/*global WebFont: false, jQuery: false */

( function( window, document, location, $, undefined ) {

'use strict';

var $body, $theTextarea;
var path = {}; //parts of the hashes

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


// build valid fonts
var validFonts = [];
var fonts, font;
for ( var family in fontConfigs ) {
  fonts = fontConfigs[ family ].families;
  for ( var i=0, len = fonts.length; i < len; i++ ) {
    font = fonts[i].replace( /\s/gi, '-' ).toLowerCase();
    console.log( font );
    validFonts.push( font );
  }
}

console.log( validFonts );

window.fontConfigs = fontConfigs;

// -------------------------- load font -------------------------- //

var loadedFamilies = {};

var loadFamily = function( family, callback ) { 
  WebFont.load({
    custom: fontConfigs[ family ],
    active: function() {
      loadedFamilies[ family ] = true;
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

var selectedFont;

function selectFont( font ) {
  console.log( 'selecting ', font );
  // throw out invalid font
  if ( validFonts.indexOf( font ) === -1 ) {
    return;
  }
  if ( selectedFont ) {
    $body.removeClass( selectedFont );
  }
  $body.addClass( font );
  selectedFont = font;
  console.log('selected ' + font );
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
  // loadFont('edmondsans');
  // clearTimeout( timeout );
  // WebFont.load()
};

var firstScript = document.getElementsByTagName('script')[0];
firstScript.parentNode.insertBefore( webFontScript, firstScript );

// -------------------------- events -------------------------- //

function onFontSelectionClick( event ) {
  var $target = $( event.target );
  var family = $target.parents('.family').attr('data-family');
  var font = $target.attr('data-font');
  var isFamilyLoaded = family in loadedFamilies;
  // console.log( 'selected', family, font );
  if ( isFamilyLoaded ) {
    selectFont( font );
  } else {
    loadFamily( family, function() {
      selectFont( font );
    });
  }
}

var changeTimeout;


function onTextareaChange( event ) {

  var debounced = function() {
    onDebouncedTextareaChange( event );
    changeTimeout = null;
  };

  if ( changeTimeout ) {
    window.clearTimeout( changeTimeout );
  }

  changeTimeout = window.setTimeout( debounced, 250 );

}

function onDebouncedTextareaChange( event ) {
  console.log('text area change');
  path.text = $theTextarea.val();
  pushIt();
}


function onHashchange( event ) {
  console.log( 'hashchange' );
  // reset
  var hashPath = getHashPath( location.hash );
  wasPushed = false;
  // parse path
}

// -------------------------- pushIt -------------------------- //

var wasPushed = false;

// push it real good
function pushIt() {
  // set hashbang
  var hash = '#!/';
  if ( path.text ) {
    hash += path.text.replace( /\s/gi, '-' ) + '/';
  }
  if ( path.font ) {
    hash += 'in:' + path.font + '/';
  }
  if ( path.size ) {
    hash += 'at:' + path.size + '/';
  }
  wasPushed = true;
  $.bbq.pushState( hash );
}

function getHashPath( hash ) {
  var hashPath = {};
  var parts = hash.split('/');
  console.log( parts );
  var part, font, size, text;
  for ( var i=0, len = parts.length; i < len; i++ ) {
    part = parts[i];
    if ( part === '' || part === '#!' ) {
      return;
    } else if ( part.indexOf('in:') === 0 ) {
      font = part.replace( 'in:', '' ).toLowerCase();
      selectFont( font );
    }
  }
}

// -------------------------- doc ready -------------------------- //

$( function() {
  $body = $('body');
  $('#font-selection').on( 'click', 'a', onFontSelectionClick );

  $theTextarea = $('#the-textarea');
  $theTextarea.on( 'keyup change', onTextareaChange );

  $( window ).on( 'hashchange', onHashchange );

});

})( window, document, location, jQuery );
