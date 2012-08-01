/**
 * JTE types JS
**/


/*jshint asi: false, curly: true, devel: true, eqeqeq: true, forin: false, newcap: true, noempty: true, strict: true, undef: true, browser: true */
/*global WebFont: false, jQuery: false */

( function( window, document, $, undefined ) {

'use strict';

var $body, $theTextarea;

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

window.fontConfigs = fontConfigs;

// -------------------------- load font -------------------------- //

var loadedFamilies = [];

var loadFamily = function( family, callback ) {
  WebFont.load({
    custom: fontConfigs[ family ],
    active: function() {
      loadedFamilies.push( family );
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
  if ( isFamilyLoaded ) {
    selectFont( font );
  } else {
    loadFamily( family, function() {
      selectFont( font );
    });
  }
  console.log( family, font );
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

  $.bbq.pushState( '#!/' + $theTextarea.val() )
}


// -------------------------- doc ready -------------------------- //

$( function() {
  $body = $('body');
  $('#font-selection').on( 'click', 'a', onFontSelectionClick );

  $theTextarea = $('#the-textarea');
  $theTextarea.on( 'keyup change', onTextareaChange );

});

})( window, document, jQuery );
