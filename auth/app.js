var express = require("express");
var app  = express();
var bodyParser = require('body-parser'),
querystring     = require('querystring'),
request = require('request');
app.use(bodyParser.json())


// require the custom Oauth module created
//pass the config object
// this module will return custom auth-code and client acces token modules created
// we can use this object to call various methods to make OAuth requests.
var oauth2 = require('./pge_self_access/OAuth2.0')();

//require the custom api module
// use this to make the Async and Sync request to get the XML data.
var apiRequest = require('./pge_self_access/api')();


console.log("apiRequest ----------------" + apiRequest);

// create the agentOptions object which holds the SSL cert values.
// this object will be passed to various method calls
// in ordert to share the SSL cert

//starting point of the app
app.get('/', function (req, res) {

  // send a rsponse back to client
  // if the user clicks on the link
  // the server redirects to dologin page
  res.send('<a href="/doLogin">Click me to Log in </a>');
});

//makes a call to myAuthorization link as defined in the config object
//and redirects to log-in page if statusCode 302 is received.
//
app.get("/doLogin",function(req,res){

  oauth2.authCode.goToLogin(redirectCallback);


  // callback to the login-request made.
  // if the user is authorized
  // a 302 status code is recieved
  // and the app is redirected to the location provided in the response recieved
  function redirectCallback(error,result){
    if (error) {
      console.log('send data error :::::::::::::'   + error);
      console.log('send data error :::::::::::::' + querystring.stringify(error));
      res.send(error);
    }
    else{
      //res.send(result);
      console.log("<\n>" + "send data result ------------- " + result);
      console.log("<\n>" + "send data result ------------- " + querystring.stringify(result.headers));
      console.log("<\n>" + "send data result ------------- " + result.headers["content-type"]);
      console.log("<\n>" + "send data result ------------- " + result.headers.location);

      // redirect to location
      res.redirect(result.headers.location);
    }
  }
});

//redirection after user logged-in and sets up a authorization
//click on the link to get the authcode.
app.get('/login',function(req,res){

  res.send('<h3>I am redirected from Log in Page Now let us try to get Auth code</h3>\n<a href="/getAuthCode">Click to get Auth Code</a>');
});


 //makes a request to get the authorization Code
// Authorization uri definition
// provide the redirect uri and scope
// this will construct and return the URI where the app should be redirected
// to get the authorization code
app.get('/getAuthCode', function (req, res) {
  console.log("auth URI :::" + authorization_uri);

  var authorization_uri = oauth2.authCode.authorizeURL({
    redirect_uri: 'http://localhost:3000/OAuthCallback',
    scope: '9951',
  });

  console.log("Redirect URI for auth : " + authorization_uri);

  //redirect to the auth URI constructed
  res.redirect(authorization_uri);
});



//OAuthCode request callback
// once the user gets the OAuth code the page is redirected here.
// take the oAuthcode and request for a oAuth access token
app.get('/OAuthCallback', function (req, res) {

  console.log("CODE--------------------------- : " + req.query.code);

  var params = {
    code: req.query.code,
    redirect_uri: 'http://localhost:3000/OAuthCallback'
  }
  // call the getToken method to get the OAuth access token
 oauth2.authCode.getOAuthToken(params, saveToken);

  // callback method
  // this catches the error and result recieved from oAuth acces token request
  // the response is send back to the client
  function saveToken(error, result) {
    if (error) {
      console.log('Access Token Error', error.message);
      res.send(error);
    }
    else{
      console.log(result);
        //res.send(result);
        res.send(result );
    }
  }
});

//oAuth acess token refresh method.
// hit this url from postman
//by passing the refresh token recieved from OAuth acees token request
//in order to receive a new OAuth access token
//Please note that this will also provide a new refresh token
app.post("/refreshToken",function(req,res){

    console.log("refreshtoken--------- : " + req.body.refresh_token);

    // var params = {
    //   agentOptions: agentOptions,
    //   refresh_token : req.body.refresh_token
    // }

    // call the refreshToken method to get new OAuth access token
    oauth2.authCode.refreshOAuthToken(req.body.refresh_token,refreshTokenCallback);

    // callback method
    // this catches the error and result recieved from oAuth acces token request
    // the response is send back to the client
    function refreshTokenCallback(error,result){
      if (error) {
      console.log('Access Token Error', error.message);
      res.send(error);
    }
    else{
      console.log(result);

       res.send(result);
      }
    }
});


//data request method
//call this from postman
//pass body object
//make the request
app.post("/dataRequest", function (req, res) {

  //req.body.agentOptions = agentOptions;

  console.log("dataRequest--------- : MIn Date" + querystring.stringify(req.body.qs));
  console.log("dataRequest--------- : options " + querystring.stringify(req.body));

  // call the apiRequest method to make a dataRequest
  apiRequest.makeRequest(req.body,dataRequestCallback);

    // callback method
    // this catches the error and result recieved from dataRequest
    // the response is send back to the client
    // this will provide 202 status if succesfull
  function dataRequestCallback(error, result){
    if (error) {
      console.log('Access Token Error', error.message);
      res.send(error);
    }
    else{
      res.send(result);
    }
  }
});

// catch the post request to get the client acess token
// catch the req body
// make the params object and send it to the client module
// the module makes the request and sends back the error/result
// to callback method.
app.post("/getClientToken",function(req,res){

  // var params = {
  //   agentOptions : agentOptions
  // };

  oauth2.client.getClientToken(saveToken);

  function saveToken(error,result){
    if (error) {
      console.log('error :::::::::::::' + error);
      res.send(error);
    }
    else{
      console.log("<\n>" + "result ------------- " + querystring.stringify(result));
      // if status is 200 i.e. authorized
      // then parse the result body and add the expiry value to the Date object
      // send a HTML file to client
      // else just send the body to client displaying the message/reason for unauthorization
      if(result.statusCode ==200){
        //result.body = JSON.parse(result.body);//oToken;
        //console.log("TOKEN _____________________________     " + result.body.client_access_token);
        res.send(result);
      }
      else{
       res.send(result);
      }
    }
  }
});

// catches the request from the PG&E server which will send the data
// after an Async request is made.
app.post("/AsyncData",function(req,res){
  res.send(req.body);
});


// //async request method
// //call this from postman
// //pass body object
// //make the request
// app.post("/asyncRequest", function (req, res) {

//   console.log("asyncRequest--------- : " + req.body.url);

//   req.body.agentOptions = agentOptions;

//   console.log("asyncRequest--------- : MIn Date" + querystring.stringify(req.body.qs));
//   console.log("asyncRequest--------- : options " + querystring.stringify(req.body));

//   // call the apiRequest method to make a asyncRequest
//   apiRequest.makeRequest(req.body,asyncRequestCallback);

//     // callback method
//     // this catches the error and result recieved from asyncRequest
//     // the response is send back to the client
//     // this will provide 202 status if succesfull
//   function asyncRequestCallback(error, result){
//     if (error) {
//       console.log('Access Token Error', error.message);
//       res.send(error);
//     }
//     else{
//       res.send(result);
//     }
//   }
// });

// //sync request method
// //call this from postman
// //pass body object
// //add cert and url params (published-max and published-min)
// //make the request
// app.post('/syncRequest', function (req, res) {


//   req.body.agentOptions = agentOptions;

//   console.log("syncRequest--------- : Min Date" + querystring.stringify(req.body.qs));
//   console.log("syncRequest--------- : options " + querystring.stringify(req.body));

//   // call the apiRequest method to make a syncRequest
//   apiRequest.makeRequest(req.body,syncRequestCallback);

//     // callback method
//     // this catches the error and result recieved from syncRequest
//     // the response is send back to the client
//     // this will provide 200 status if succesfull
//   function syncRequestCallback(error, result){
//     if (error) {
//       console.log('Access Token Error', error.message);
//       res.send(error);
//     }
//     else{
//       res.send(result);
//     }
//   }
// });

module.exports = {app};
