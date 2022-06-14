
const jwt = require('jsonwebtoken');

const JWT_EXPIRATION_TIME = '20d';
const util = require('../util.js');
//const bcrypt = require('bcrypt');
const AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-1'});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.USER_TABLE;


module.exports.handler = async(event) => {
  const {email_id,password} = JSON.parse(event.body);
  const userName = email_id.split("@");
  try {
    let params = {
      TableName: tableName,
      KeyConditionExpression: "userName = :userName",
      ExpressionAttributeValues: {
          ":userName": userName[0]
      },
    };
    let data = await dynamodb.query(params).promise();

    if(data.Count === 0){
      return{
        statusCode: 200,
        headers: util.getResponseHeaders(),
        body: JSON.stringify({Success: false,
                              error:util.user_error.No_USER}),
      }
    }
    
    if(password != data.Items[0].password){
      return{
          statusCode: 200,
          headers: util.getResponseHeaders(),
          body: JSON.stringify({Success: false,
                                error:util.user_error.BAD_PASS}),
        }
    }

    

    const user = {
      userName: userName[0],
      email_id: data.Items[0].email_id,
    };
    const token = jwt.sign({user:user}, process.env.JWT_SECRET,{expiresIn:JWT_EXPIRATION_TIME});
      return{ // Success response
        statusCode: 200,
        headers: util.getResponseHeaders(),
        body: JSON.stringify({Success:true,
          token
        })
      }
  } catch (e) {
    console.log(`Error logging in: ${e.message}`);
    return{ // Error response
        statusCode: err.statusCode ? err.statusCode : 500,
        headers: util.getResponseHeaders(),
        body: JSON.stringify({
            Success:false,
            error: err.name ? err.name : "Exception",
            message: err.message ? err.message : "Unknown error"
        })
    };
  }
};