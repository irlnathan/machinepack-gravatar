
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
    }
  },

  defaultExit: 'success',

  catchallExit: 'error',

  exits: {

    error: {
      
      description: '',
      
    },

    success: {
      
      description: 'The URL that can be used to display a gravatar.',
      
      example: 'http://www.gravatar.com/avatar/f23423d234038345345sf84f7023421'
    }

  },


  fn: function (inputs, exits) {

    var Crypto = require('crypto');



    // try {
    //   return exits.success(Crypto.createHash('md5')
    //     .update(inputs.emailAddress.toLowerCase().trim())
    //     .digest("hex"));
    // } catch(e) {
    //   return exits.error(e);
    // }
  
   
      return exits.success(Crypto.createHash('md5')
        .update(inputs.emailAddress.toLowerCase().trim())
        .digest("hex"));

    // var gravatarHash =  Crypto.createHash('md5')
    //   .update(inputs.emailAddress.toLowerCase().trim())
    //   .digest("hex");

    //   return exists.success(gravatarHash);

    // return exits.success(Crypto.createHash('md5')
    // .update(inputs.emailAddress.toLowerCase().trim())
    // .digest("hex"));

  }

};