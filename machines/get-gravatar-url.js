module.exports = {

  friendlyName: 'Get gravatar URL',
  description: 'Build the URL of a gravatar for a particular email address.',
  extendedDescription: 'This encrypts the provided email address and returns a properly formatted URL which can be visited to obtain a Gravatar image.',

  inputs: {
    emailAddress: {
      example: 'john@doe-enterprises.com',
      description: 'The email address of the gravatar.',
      required: true
    },
    gravatarSize: {
      example: '400',
      description: 'The size of the gravatar in pixels (between 1 and 2048)'
    },
    defaultImage: {
      example: 'http://example.com/images/avatar.jpg',
      description: 'The image to use if a Gravatar image cannot be found.'
    },
    forceDefaultImage: {
      example: true,
      description: 'Force the default image for the gravatar.'
    },
    rating: {
      example: 'g',
      description: 'The rating level that\'s acceptable for the gravatar image ("G", "PG", "R", etc.)'
    },
    secureRequest: {
      example: true,
      description: 'If true will use "https:".'
    }
  },

  defaultExit: 'success',

  exits: {

    error: {
      description: 'Unexpected error occurred.'
    },

    encodingFailed: {
      description: 'Could not encode/stringify query parameters for the Gravatar URL.'
    },

    success: {
      description: 'The URL that can be used to display a gravatar.',
      example: 'http://www.gravatar.com/avatar/f23423d234038345345sf84f7023421'
    }

  },


  fn: function(inputs, exits) {

    // Depedencies
    var Crypto = require('crypto');
    var qs = require('querystring');
    var _ = require('lodash');

    // Strip out any keys which don't have a truthy value so as not to confuse `qs.stringify`.
    var qsParams = _.pick({

      // "s" stands for gravatar "size"
      s: inputs.gravatarSize,

      // "d" stands for "default image".
      // If defaultImage src was provided, encode it for use in a URI
      d: inputs.defaultImage ? encodeURIComponent(inputs.defaultImage) : undefined,

      // "f" stands for "force default image".
      // Set up the "y" that Gravatar expects to indicate we're "forcing" the default image.
      f: inputs.forceDefaultImage ? 'y' : undefined,

      // "rating" refers to "G", "PG", "R", "X", etc.
      rating: inputs.rating || ''
    }, function _isTruthy(val) { return !!val; });


    // Stringify the querystring parameters that will be sent to gravatar
    var stringifiedQsParams;
    try {
      stringifiedQsParams = qs.stringify(qsParams);
    }
    catch (e){
      return exits.encodingFailed(e);
    }

    // Build the gravatar hash from the provided email address and compute the base url
    var gravatarHash = Crypto.createHash('md5').update(inputs.emailAddress.toLowerCase().trim()).digest('hex');
    var gravatarBaseUrl = 'www.gravatar.com/avatar/' + gravatarHash + '?' + stringifiedQsParams;

    // If this is a "secureRequest", use `https://`
    if (inputs.secureRequest) {
      return exits.success('https://'+gravatarBaseUrl);
    }

    // Otherwise just use `http://`
    return exits.success('http://'+gravatarBaseUrl);

  }

};
