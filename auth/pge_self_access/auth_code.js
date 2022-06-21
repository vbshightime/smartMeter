//Authorizations flow URLS

const config = require("./config")

var base64String = "Basic " + new Buffer(config.clientID + ':' + config.clientSecret).toString('base64');

const goToLoginOptions = ()=>{
    var options= {
        url : config.login,
          "headers" :{
           "Content-Type": "application/json"
          },
        params : {
            "clientId" : config.clientKey,
            "verified" : "true"
        },
          meathod : "POST"
      };
      return options;
}

const authParams = ()=>{
    var options={
        response_type : 'code',
        redirection_url : config.redirectUri,
        client_id : config.clientID,
        action : 'Grant',
        scope : '9951' 
    }
    return options;
}


module.exports={
    goToLoginOptions,
    base64String,
    authParams
}