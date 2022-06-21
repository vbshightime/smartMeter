
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-1'});
const auth_code = require("./pge_self_access/auth_code");
var qs = require('querystring');
const config = require('./pge_self_access/config');


module.exports.handler = async(event) => {
    var redirection_uri_params = auth_code.authParams;
    var authorization_uri = config.site + config.authorizationPath + '?' +qs.parse(redirection_uri_params);
    console.log("authorization URI:",authorization_uri);

    return{
        statusCode: 302,
        headers: {"Location": authorization_uri}
    }    
};