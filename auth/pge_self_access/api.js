//
// ### Sync and Aysnc Call Flow....
//
var appConfig = require('./config');

module.exports = function() {

	var request = require('request'),
	querystring = require('querystring');

	//
	// ### Make the call to get Data Synchronously/Asynchronously
	// options object which will be sent as request body
	// callback - The callback function returning the results.
	//
	function makeRequest(params,callback){
		
		if (params.type==="Async"){
			params.url = appConfig.dataRequestURL + params.subscriptionID
		}
		else{
			params.url = appConfig.dataRequestURL + params.subscriptionID + "/UsagePoint/" + params.usagePointID
		}
		
		console.log("REQUEST URLLLLLLL ---------------  :::" + params.url);
		var options = {
    
		  "url": params.url,
			"headers" :{
			 "Content-Type": "application/json",
			 "Authorization" : "Bearer " + params.token
			},
			"qs" : {
			  "published-max" : params.maxDate,
			  "published-min" : params.minDate
			},
			 "agentOptions": appConfig.agentOptions,
			"method": "GET"
		}
		
		request(options,callback);
	}

	//
	// ### Make the call to get Data Asynchronously
	// options object which will be sent as request body
	// callback - The callback function returning the results.
	//	
	function asyncRequest(options,callback){
		request(options,callback);
	}
	
	//
	// ### Make the call to get Data Synchronously
	// options object which will be sent as request body
	// callback - The callback function returning the results.
	//
	
	function syncRequest(options,callback){
		request(options,callback);
	}

	return {
		'makeRequest' : makeRequest,
		'asyncRequest' : asyncRequest,
		'syncRequest' : syncRequest
	}
};


