//
// ### Authorization Code flow implementation
//
module.exports = function(config) {

  console.log("INSIDE AUTH_CODE___________");
  var qs     = require('querystring'),
  request = require('request');
  
  var base64String = "Basic " + new Buffer(config.clientID + ':' + config.clientSecret).toString('base64');

// ### Redirect the user to the Login page
  //  config.login is the URI to hit and get the redirection URI for the Login Page
  //  config.clientId - A String that represents the registered client application ID
  // user is redirected to the login page   
  //
  function goToLogin(callback){
    var options= {
      "url": config.login,
        "headers" :{
         "Content-Type": "application/json"
        },
      "qs" :{
		  "clientId" : config.clientKey,
		  "verified" : "true"
	  },
        "method": "POST"
    };

    request(options,callback);
  }

  // ### Redirect the user to the authorization page
  //
  //  params.redirectURI - A String that represents the registered application URI where the
  // user is redirected after authorization.
  //  params.scope - A String that represents the application privileges.
  //
  function authorizeURL(params) {
    params.response_type = 'code';
    params.client_id = config.clientID;
	  params.action = "Grant"
    return config.site + config.authorizationPath + '?' + qs.stringify(params);
  }

  //
  // ### Returns the Access Token object.
  //
  //  params.code - Authorization code (from previous step).
  //  params.redirectURI - A String that represents the callback uri.
  //  params.agentOptions SSL cert
  //  Authorization : "Basic " + base64String(ClientID:ClientSecret)
  //  callback - The callback function returning the results.
  // An error object is passed as first argument and the result as last.
  //
   
  function  getOAuthToken (params, callback) {
  var options= {
      "url": config.site+config.tokenPath,
        "headers" :{
         "Content-Type": "application/json",
         "Authorization" : base64String
        },
      "qs" :{
        "grant_type" : "authorization_code",
        "code" : params.code,
        "redirect_uri"  : params.redirect_uri,
      },
     "agentOptions": config.agentOptions,
        "method": "POST"
    };
  console.log("OAuthCallback getToken base64String-------------- " + options.headers.Authorization);
  console.log("OAuthCallback getToken code-------------- " + options.qs.code);
  console.log("OAuthCallback getToken agentOptions-------------- " + qs.stringify(options.agentOptions));
  //console.log("OAuthCallback getToken cert-------------- " +options.agentOptions.pfx);

  request(options,callback);
    //params.grant_type = 'authorization_code';
    //core.api('POST', config.tokenPath, params, callback);
  }

  //
  // ### Refresh the access token
  // params.refresh_token provides the refresh token 
  // params.agentOptions SSL cert
  //Authorization : "Basic " + base64String(ClientID:ClientSecret)
  // callback - The callback function returning the results.
  //
function refreshOAuthToken(refreshToken,callback){
	
	console.log("inside refresh token method-----------");
	

  var options= {
      "url": config.site+config.tokenPath,
        "headers" :{
         "Content-Type": "application/json",
         "Authorization" : base64String
        },
      "qs" :{
        "grant_type" : "refresh_token",
        "refresh_token" : refreshToken
      },
     "agentOptions": config.agentOptions,
        "method": "POST"
    };
  console.log("refreshToken getToken base64String-------------- " + options.headers.Authorization);
  console.log("refreshToken getToken agentOptions-------------- " + qs.stringify(options.agentOptions));
  //console.log("refreshToken getToken cert-------------- " +options.agentOptions.pfx);
    request(options,callback);
}


  return {
    'goToLogin' : goToLogin,
    'authorizeURL' : authorizeURL,
    'getOAuthToken' : getOAuthToken,
    'refreshOAuthToken' : refreshOAuthToken
  }
};
