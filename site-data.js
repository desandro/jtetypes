
(function( global ) {

var siteData = {
  families: {
    duke: {
      title: 'Duke',
      primaryFont: 'Duke',
      acquire: '<a href="http://www.losttype.com/font/?name=duke">Buy</a>',
      fonts: [
        'Duke',
        'Duke Fill',
        'Duke Shadow'
      ],
      variations: {
        'Regular': 'Duke',
        'Fill': 'Duke Fill',
        'Shadow': 'Duke Shadow'
      }
    },

    edmondsans: {
      title: 'Edmondsans',
      primaryFont: 'Edmondsans-Medium',
      acquire: '<a href="http://www.losttype.com/font/?name=edmondsans">Buy</a>',
      fonts: [
        'Edmondsans Regular',
        'Edmondsans Medium',
        'Edmondsans Bold'
      ],
      variations: {
        'Regular': 'Edmondsans Regular',
        'Medium': 'Edmondsans Medium',
        'Bold': 'Edmondsans Bold'
      }
    },

    lavanderia: {
      title: 'Lavanderia',
      primaryFont: 'Lavanderia-Regular',
      acquire: '<a href="http://www.losttype.com/font/?name=lavanderia">Buy</a>',
      fonts: [
        'Lavanderia Delicate',
        'Lavanderia Regular',
        'Lavanderia Sturdy'
      ],
      variations: {
        'Delicate': 'Lavanderia Delicate',
        'Regular': 'Lavanderia Regular',
        'Sturdy': 'Lavanderia Sturdy'
      }
    },

    'mission-script': {
      title: 'Mission Script',
      primaryFont: 'Mission-Script',
      acquire: '<a href="http://www.losttype.com/font/?name=mission_script">Buy</a>',
      fonts: [
        'Mission Script'
      ]
    },

    'wisdom-script': {
      title: 'Wisdom Script',
      primaryFont: 'Wisdom-Script',
      acquire: '<a href="http://www.losttype.com/font/?name=wisdom%20script">Buy</a>',
      fonts: [
        'Wisdom Script'
      ]
    }

  },

  // configs for WebFont loader
  fontConfigs: {
    initial: {
      families: [
        'Duke',
        'Edmondsans Medium',
        'Lavanderia Regular',
        'Mission Script',
        'Wisdom Script'
      ],
      urls: [ 'css/initial-fonts.css' ]
    },
    dukeExtras: {
      families: [
        'Duke Fill',
        'Duke Shadow'
      ],
      urls: [ 'css/duke-extras.css' ]
    },
    edmondsansExtras: {
      families: [
        'Edmondsans Regular',
        'Edmondsans Bold'
      ],
      urls: [ 'css/edmondsans-extras.css' ]
    },
    lavanderiaExtras: {
      families: [
        'Lavanderia Delicate',
        'Lavanderia Sturdy'
      ],
      urls: [ 'css/lavanderia-extras.css' ]
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
