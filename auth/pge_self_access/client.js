//
// ### Client credentials flow implementation
//
module.exports = function(config) {


var request = require('request'),
	querystring = require('querystring');


var base64String = "Basic " + new Buffer(config.clientID + ':' + config.clientSecret).toString('base64');

console.log('base 64  : : ' + base64String + "\n");

  //
  // ### Returns the Access Token object.
  // params.agentOptions provides SSL cert
  // callback - The callback function returning the results.
  //
  function getClientToken(callback) {

    var options = {
    	"url"  : config.site +"/test" + config.tokenPath,
    	"headers" :{
	     	"Content-Type": "application/json",
	     	"Authorization" : base64String
	    },
	    "qs" :{
        	"grant_type" : "client_credentials",
     	},
     	"agentOptions": config.agentOptions,
     	"method": "POST"
    }
	console.log("request-------------- " + querystring.stringify(options));
	console.log("request QS-------------- " + querystring.stringify(options.qs));
	console.log("request AUTHorization-------------- " + options.headers.Authorization);
	//console.log("request CERT-------------- " + options.agentOptions.pfx);
	request(options, callback);
  }
  


  return {
    'getClientToken' : getClientToken
  }
};
