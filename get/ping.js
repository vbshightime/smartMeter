'use strict';
const querystring = require('querystring');
const util = require('../util.js');


module.exports.handler = async() => {
  var oauth2 = require('../auth/pge_self_access/OAuth2.0')();
  var apiRequest = require('../auth/pge_self_access/api')();


  oauth2.authCode.goToLogin(redirectCallback);
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

function redirectCallback(error,result){
  if (error) {
    console.log('send data error :::::::::::::'   + error);
    console.log('send data error :::::::::::::' + querystring.stringify(error));
    return{ // Error response
      statusCode: 500,
      body: {
          Success:false,
          error: error
      }
  };
  }
  else{
    //res.send(result);
    console.log("<\n>" + "send data result ------------- " + result);
    console.log("<\n>" + "send data result ------------- " + querystring.stringify(result.headers));
    console.log("<\n>" + "send data result ------------- " + result.headers["content-type"]);
    console.log("<\n>" + "send data result ------------- " + result.headers.location);

    return{ // Error response
      statusCode: 200,
      body: JSON.stringify({
          Success:true,
          redirection: result.headers.location
      })
  };
    //res.redirect(result.headers.location);
  }
}
