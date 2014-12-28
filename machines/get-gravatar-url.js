module.exports = {

  friendlyName: 'Get gravatar URL',
  description: 'Get the URL of a gravatar for a particular email address.',
  extendedDescription: 'This machine returns a properly formatted URL to obtain a gravatar.',

  inputs: {
    emailAddress: {
      example: 'john@doe-enterprises.com',
      description: 'The email address of the gravatar.',
      required: true
    },
    gravatarSize: {
      example: '400',
      description: 'The size of the gravatar (1-2048)'
    },
    defaultImage: {
      example: 'http://example.com/images/avatar.jpg',
      description: 'The image if there\'s no associated image of email address.'
    },
    forceDefaultImage: {
      example: true,
      description: 'Force the default image for the gravatar.'
    },
    rating: {
      example: 'g',
      description: 'The rating level that\'s acceptable for the gravatar image.'
    },
    secureRequest: {
      example: true,
      description: 'If true will use "https:".'
    }
  },

  defaultExit: 'success',

  exits: {

    error: {
      description: 'Unexpected error occurred.',
    },

    success: {
      description: 'The URL that can be used to display a gravatar.',
      example: 'http://www.gravatar.com/avatar/f23423d234038345345sf84f7023421'
    }

  },


  fn: function(inputs, exits) {

    // Depedencies
    var Crypto = require('crypto');
    var _ = require('lodash');
    var qs = require('querystring');


    inputs.gravatarSize = inputs.gravatarSize || '';

    inputs.defaultImage = inputs.defaultImage || '';


    if (inputs.defaultImage) {
      inputs.defaultImage = encodeURIComponent(inputs.defaultImage);
    }

    inputs.forceDefaultImage = inputs.forceDefaultImage || '';


    if (inputs.forceDefaultImage) {
      inputs.forceDefaultImage = 'y';
    }

    inputs.rating = inputs.rating || '';

    inputs.secureRequest = inputs.secureRequest || '';


    inputs.secureRequest = inputs.secureRequest || '';

    var options = {
      s: inputs.gravatarSize,
      d: inputs.defaultImage,
      f: inputs.forceDefaultImage,
      rating: inputs.rating
    };

    // Pick out all keys that have a value
    options = _.pick(options, function(val, key) {
      return val;
    });

    var gravatarHash;
    try {

      gravatarHash = Crypto.createHash('md5')
        .update(inputs.emailAddress.toLowerCase().trim())
        .digest("hex");

    } catch (error) {

      return exits.error(error);
    }

    if (inputs.secureRequest) {

      try {
        // Show Mike this and ask why it doesn't show up as an error when it's returned via exits.error but shows up
        // when I log it?
        // return exits.success('https://www.gravatar.com/avatar/'+gravatarHash+s.stringify(options));
        return exits.success('https://www.gravatar.com/avatar/' + gravatarHash + '?' + qs.stringify(options));
      }
      catch (error) {
        return exits.error(new Error(error));
      }

    }

    try {
      // Show Mike this and ask why it doesn't show up as an error when it's returned via exits.error but shows up
      // when I log it?
      // return exits.success('https://www.gravatar.com/avatar/'+gravatarHash+s.stringify(options));
      return exits.success('http://www.gravatar.com/avatar/' + gravatarHash + '?' + qs.stringify(options));
    } catch (error) {
      return exits.error(new Error(error));
    }


  }

};
