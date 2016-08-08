module.exports = {

  friendlyName: 'Get image URL',


  description: 'Build the URL of a gravatar image for a particular email address.',


  extendedDescription: 'This encrypts the provided email address and returns a properly formatted URL which points to an image on Gravatar.  This can then be used as the `src` in an `<img>` tag, etc.',


  sync: true,


  sideEffects: 'cacheable',


  inputs: {

    emailAddress: {
      example: 'john@doe-enterprises.com',
      description: 'The email address of the gravatar.',
      required: true
    },

    gravatarSize: {
      example: 400,
      description: 'The height/width of the gravatar in pixels (between 1 and 2048).'
    },

    defaultImage: {
      example: 'http://example.com/images/avatar.jpg',
      description: 'The image to use if a Gravatar image cannot be found.',
      extendedDescription: 'Useful since it won\'t be clear whether a Gravatar cannot be found until after the image URL is requested.  Don\'t forget to include the "http://" or "https://".'
    },

    rating: {
      example: 'g',
      description: 'The rating level that\'s acceptable for the gravatar image ("G", "PG", "R", etc.)'
    },

    useHttps: {
      example: true,
      description: 'Whether to build a secure URL ("https://".) Otherwise, "http://" will be used.'
    }

  },

  exits: {

    success: {
      outputFriendlyName: 'Gravatar URL',
      outputDescription: 'The URL that can be used to display a gravatar.',
      outputExample: 'http://www.gravatar.com/avatar/f23423d234038345345sf84f7023421'
    }

  },


  fn: function(inputs, exits) {

    // Import `crypto`, `querystring` and `lodash`
    var Crypto = require('crypto');
    var qs = require('querystring');
    var _ = require('lodash');

    // Strip out any keys which don't have a truthy value so as not to confuse `qs.stringify`.
    var qsParams = _.pick({

      // "s" stands for gravatar "size"
      // (cast to string if exists).
      s: inputs.gravatarSize ? inputs.gravatarSize+'' : undefined,

      // "d" stands for "default image".
      // If defaultImage src was provided, encode it for use in a URI.
      d: inputs.defaultImage ? inputs.defaultImage : undefined,

      // Removed support for "forceDefaultImage"
      // if this is important for some reason, it can be brought back.
      // However it seems more confusing than anything else.
      //
      // "f" stands for "force default image".
      // Set up the "y" that Gravatar expects to indicate we're "forcing" the default image.
      // e.g. `f: inputs.forceDefaultImage ? 'y' : undefined`

      // "rating" refers to "G", "PG", "R", "X", etc.
      rating: inputs.rating || undefined
    }, function _isTruthy(val) { return !!val; });


    // Stringify the querystring parameters that will be sent to gravatar.
    var stringifiedQsParams;
    try {
      stringifiedQsParams = qs.stringify(qsParams);
    }
    catch (e){
      // If encoding fails, there's something wrong with the inputs, so return through the `error` exit.
      // through the `error` exit.
      return exits.error(new Error('Could not encode/stringify query parameters for the Gravatar URL.'));
    }

    // Build the gravatar hash from the provided email address and compute the base url.
    var gravatarHash = Crypto.createHash('md5').update(inputs.emailAddress.replace(/\s/,'').toLowerCase().trim()).digest('hex');
    var gravatarBaseUrl = 'www.gravatar.com/avatar/' + gravatarHash + '?' + stringifiedQsParams;

    // Determine the final URL by prepending the desired protocol.
    var finalUrl = inputs.useHttps ? 'https://'+gravatarBaseUrl : 'http://'+gravatarBaseUrl;

    // Return the final URL through the `success` exit.
    return exits.success(finalUrl);

  }

};
