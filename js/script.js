/**
 * JTE types JS
**/


/*jshint asi: true, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */
/*global WebFont: false, jQuery: false, JTE: false */

( function( window, document, location, $, JTE, undefined ) {

'use strict';

var fontConfigs = JTE.siteData.fontConfigs;
var families = JTE.siteData.families;

var $body = $('body');
var $window = $(window);
// text, fontsize, font, style
// defaults
var path = {};

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

function lowerHyphenate( str ) {
  return str.replace( /\s+/gi, '-' ).toLowerCase();
}

// variation on...
// http://unscriptable.com/2009/03/20/debouncing-javascript-methods/
var debounce = function ( func, threshold ) {

  var timeout;
  return function debounced () {
    function delayed () {
      func();
      timeout = null;
    }
    if ( timeout ) {
      clearTimeout( timeout );
    }
    timeout = setTimeout( delayed, threshold || 500 );
  };
}

// -------------------------- fonts -------------------------- //

// build a hash of fonts

var siteFonts = {};
( function() {
  var groupFonts, font;
  for ( var group in fontConfigs ) {
    groupFonts = fontConfigs[ group ].families;
    for ( var i=0, len = groupFonts.length; i < len; i++ ) {
      font = lowerHyphenate( groupFonts[i] );
      siteFonts[ font ] = {
        group: group,
        isLoaded: false
      };
    }
  }

})()

// build a hash of fonts and their families

var familyFonts = {};
( function() {
  var fonts, font;
  for ( var family in families ) {
    fonts = families[ family ].fonts;
    for ( var i=0, len = fonts.length; i < len; i++ ) {
      font = lowerHyphenate( fonts[i] );
      familyFonts[ font ] = family;
    }
  }

})()


// -------------------------- load font -------------------------- //

function onWebFontActive( font, weight ) {
  font = lowerHyphenate( font );
  siteFonts[ font ].isLoaded = true;
}

function onWebFontInactive( font, weight ) {
  // console.log( font + ' font inactive' );
}

var activityOptions = {
  length: 18,
  space: 6,
  width: 6
};

var loadFontGroup = function( font, callback ) {
  // don't proceed if WebFont isn't ready
  if ( !window.WebFont ) {
    return;
  }

  $body.activity( activityOptions );

  // console.log( fontConfigs, family, fontConfigs[ family ] );
  var group = siteFonts[ font ].group;
  var fontConfig = fontConfigs[ group ];

  WebFont.load({
    custom: fontConfig,
    active: function() {
      // keep track of loaded family
      // siteFonts[ font ].isLoaded = true;
      if ( callback ) {
        callback();
      }
      // console.log( group + ' font group active');
      $body.activity( false );
      mimicTextarea();
    },
    inactive: function() {
      // console.log( group + ' font group inactive');
      $body.activity( false )
    },
    fontactive: onWebFontActive,
    fontinactive: onWebFontInactive
  });
};

function selectFont( font, callback ) {
  // console.log( 'selecting ', font );
  // don't change if invalid font
  if ( !( font in siteFonts ) ) {
    return;
  }

  var onFontGroupLoaded = function() {
    activateFont( font );
    if ( callback ) {
      // console.log('font group loaded, triggering callback');
      callback();
    }
  };

  if ( siteFonts[ font ].isLoaded ) {
    // family already loaded, select the font
    onFontGroupLoaded()
  } else {
    // family not loaded, load the family, then select font
    loadFontGroup( font, onFontGroupLoaded );
  }
}

var activeFont;

function activateFont( font ) {
  // don't proceed if font is already activated
  if ( font === activeFont ) {
    return;
  }

  var family = familyFonts[ font ];

  if ( activeFont ) {
    $body.removeClass( activeFont );
    $fontSelection.find('.is-active').removeClass('is-active');
    $fontSelection.find('.is-active-family').removeClass('is-active-family');
  }
  $body.addClass( font );
  $fontSelection.find('li.' + font ).not('.family').addClass('is-active');
  $fontSelection.find( '.family.' + family ).addClass('is-active-family');
  positionTextarea();
  activeFont = font;
  // console.log('activated ' + font );
  path.font = font;
  pushIt();

}

var initialHash = location.hash;

// var webFontsConfig
var initialFamilyLoadedCallback = function() {
  $body.addClass('is-ready');
  // show controls if there's no custom hash
  if ( !path || !path.text ) {
    isControlsActive = false;
    toggleControls();
  }
};



var webFontScript = document.createElement('script');
webFontScript.src= '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
webFontScript.async = 'true';
webFontScript.onload = webFontScript.onreadystatechange = function() {
  var readyState = this.readyState;
  if ( readyState && readyState !== 'complete' && readyState !== 'loaded' ) {
    return;
  }
  // load edmondsans family first
  var initialFont = path.font || 'edmondsans-medium';
  var group = siteFonts[ initialFont ].group;

  if ( group !== 'initial' ) {
    loadFontGroup( 'edmondsans-medium' );
  }
  // load selected font
  selectFont( initialFont, initialFamilyLoadedCallback );
};

var firstScript = document.getElementsByTagName('script')[0];
firstScript.parentNode.insertBefore( webFontScript, firstScript );

// -------------------------- events -------------------------- //

function onFontSelectionClick( event ) {
  var $target = $( event.target );
  var font = $target.attr('data-font');
  // console.log('on click', font, $target );
  selectFont( font );
  event.preventDefault();
}

var changeTimeout;


function onTextareaChange( event ) {
  mimicTextarea();
  // console.log( event.type );
  path.text = $theTextarea.val();
  debouncedPushIt();
}

var isHashChanged;

function onHashchange( event ) {
  // console.log( 'hashchange' );
  // reset
  isHashChanged = true;
  if ( !wasPushed ) {
    getHashPath();
  }
  isHashChanged = false;
  wasPushed = false;
  // parse path
}

function onSlidechange( event, ui ) {
  // disregard slidechange from hash change
  if ( isHashChanged ) {
    return;
  }
  setFontSize( ui.value );
  path.size = ui.value + 'px';
  debouncedPushIt();
}

var onDebouncedWindowResize = debounce( function() {
  positionTextarea();
}, 200 );



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

var rePathPrefix = /^[\w\-]+:/;

function getHashPath() {
  var hash = location.hash;
  var hashPath = {};
  var parts = hash.split('/');
  var textIsSet = false;
  var part, prefix, setting, size;

  for ( var i=0, len = parts.length; i < len; i++ ) {
    part = parts[i];
    // get in:, at:, size:
    prefix = rePathPrefix.exec( part );
    prefix = prefix && prefix[0];
    // get stuff after : if its there
    setting = prefix ? part.replace( prefix, '' ) : part;
    switch ( prefix ) {
      case 'in:' :
        path.font = setting.toLowerCase();
        selectFont( path.font );
        break;
      case 'at:' :
        size = parseInt( setting, 10 )
        path.size = setting;
        setFontSize( size );
        fontSizeSlider.slider( 'value', size );
        break;
      default :
        // set text area value
        if ( !textIsSet && part !== '' && part !== '#!' ) {
          path.text = decode( part );
          $theTextarea.val( path.text );
          mimicTextarea();
          textIsSet = true;
        }
    }
  }
}

function setFontSize( size ) {
  size = parseInt( size, 10 ) + 'px';
  var sizeStyle = { fontSize: size };
  $theTextarea.css( sizeStyle );
  $dummyArea.css( sizeStyle );
  positionTextarea();
}

// -------------------------- centering textarea -------------------------- //


function formatDummyText( text ) {
  if ( !text ) {
    return '&nbsp;';
  }
  return text.replace( /\n$/, '<br>&nbsp;' )
    .replace( /\n/g, '<br>' );
}

function positionTextarea() {
  var h = $textareaWrap.innerHeight();
  var top = Math.max( 0, ( h - $dummyArea.innerHeight() ) * 0.5 );
  $theTextarea.css({
    paddingTop: top
  });
}

function mimicTextarea() {
  // for positioning text area
  var text = $theTextarea.val();
  var html = formatDummyText( text );
  $dummyArea.html( html );
  positionTextarea();
}

// -------------------------- positioning controls -------------------------- //

var isControlsActive = false;

function toggleControls( event ) {

  isControlsActive = !isControlsActive;
  var classMethod = isControlsActive ? 'addClass' : 'removeClass';
  $body[ classMethod ]('is-controls-active')
    .animate({
      paddingBottom: isControlsActive ? 200 : 0
    });

  $controls.animate({
    bottom: isControlsActive ? 0 : -200
  }, {
    step: positionTextarea
  });

  if ( event ) {
    event.preventDefault();
  }
}

// -------------------------- doc ready -------------------------- //

var $theTextarea, $fontSelection, $acquire, $dummyArea, $textareaWrap, $wrap, $controls;
var fontSizeSlider;

$( function() {

  $body.addClass('is-transitions-enabled');
  $wrap = $('#wrap');
  $controls = $('#controls');
  $fontSelection = $('#font-selection').on( 'click', 'a.js-activate-font', onFontSelectionClick );
  $acquire = $('#acquire');

  $textareaWrap = $('#textarea-wrap');
  $theTextarea = $('#the-textarea');
  $dummyArea = $textareaWrap.find('.dummy');

  $theTextarea.on( 'keyup change', onTextareaChange );

  var initialFontSize = parseInt( $theTextarea.css('font-size'), 10 );

  // set up slider
  fontSizeSlider = $('#font-size').slider({
    min: 32,
    max: 320,
    value: initialFontSize,
    slide: onSlidechange,
    change: onSlidechange
  });

  $controls.find('.toggler a').on( 'click', toggleControls );

  // trigger hash change to capture initial settings
  getHashPath();
  $window.on( 'hashchange', onHashchange )
    .on( 'resize', onDebouncedWindowResize );

});

})( window, document, location, jQuery, JTE );
