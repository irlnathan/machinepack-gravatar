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
      description: 'Unexpected error occurred.'
    },

    couldNotCreateHash: {
      description: 'Could not create gravatar hash using the specified email address.'
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

    // Pick out only those keys which have a truthy value
    var qsParams = _.pick({

      // "s" stands for gravatar "size"
      s: inputs.gravatarSize || '',

      // "d" stands for "default image".
      // If defaultImage src was provided, encode it for use in a URI
      d: inputs.defaultImage ? encodeURIComponent(inputs.defaultImage) : '',

      // "f" stands for "force default image".
      // Set up the "y" that Gravatar expects to indicate we're "forcing" the default image.
      f: inputs.forceDefaultImage ? 'y' : '',

      // "rating" refers to "G", "PG", "R", "X", etc.
      rating: inputs.rating || ''
    }, function _isTruthy(val) { return !!val; });


    // Build the gravatar hash from the provided email address
    var gravatarHash;
    try {
      gravatarHash =
      Crypto.createHash('md5')
      .update(inputs.emailAddress.toLowerCase().trim())
      .digest('hex');
    }
    catch (e) {
      return exits.couldNotCreateHash(e);
    }

    if (inputs.secureRequest) {

      try {
        return exits.success('https://www.gravatar.com/avatar/' + gravatarHash + '?' + qs.stringify(qsParams));
      }
      catch (e) {
        return exits.error(e);
      }
    }

    try {
      return exits.success('http://www.gravatar.com/avatar/' + gravatarHash + '?' + qs.stringify(qsParams));
    }
    catch (e) {
      return exits.error(e);
    }

  }

};
