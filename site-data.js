
(function( global ) {

var siteData = {
  families: {
    duke: {
      acquire: '<a href="http://www.losttype.com/font/?name=duke">Purchase Duke at Lost Type Co-Op</a>',
      fonts: [
        'Duke',
        'Duke Fill',
        'Duke Shadow'
      ]
    },

    edmondsans: {
      acquire: '<a href="http://www.losttype.com/font/?name=edmondsans">Purchase Edmondsans at Lost Type Co-Op</a>',
      fonts: [
        'Edmondsans Regular',
        'Edmondsans Medium',
        'Edmondsans Bold',
      ]
    },

    lavanderia: {
      acquire: '<a href="http://www.losttype.com/font/?name=lavanderia">Purchase Lavandria at Lost Type Co-Op</a>',
      fonts: [
        'Lavanderia Delicate',
        'Lavanderia Regular',
        'Lavanderia Sturdy',
      ]
    },

    'mission-script': {
      acquire: '<a href="http://www.losttype.com/font/?name=mission_script">Purchase Mission Script at Lost Type Co-Op</a>',
      fonts: [
        'Mission Script',
      ]
    },

    'wisdom-script': {
      acquire: '<a href="http://www.losttype.com/font/?name=wisdom%20script">Purchase Wisdom Script at Lost Type Co-Op</a>',
      fonts: [
        'Wisdom Script',
      ]
    }

  }
};


if ( typeof module !== "undefined" ) {
  // make available as a node module
  module.exports = siteData;
} else {
  // make available for browser
  global.JTE = global.JTE || {};
  global.JTE.siteData = siteData;
}

})( this );
