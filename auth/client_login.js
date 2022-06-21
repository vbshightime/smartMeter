
const AWS = require('aws-sdk');
const axios = require('axios').default;
AWS.config.update({region: 'us-west-1'});
const auth_code = require("./pge_self_access/auth_code");


module.exports.handler = async(event) => {
    
};