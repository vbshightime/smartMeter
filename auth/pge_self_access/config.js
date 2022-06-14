//
// ### Application configuration 
//

// require the npm modules to read the SSL certificate 
var fs = require('fs');

console.log("INSIDE ----------------- :: Config" )
module.exports = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  clientKey : process.env.CLIENT_KEY,
  login :"https://sharemydataqa.pge.com/myAuthorization/",
  site: 'https://apiqa.pge.com/datacustodian',
  authorizationPath : '/oauth/v2/authorize',
  dataRequestURL : "https://apiqa.pge.com/GreenButtonConnect/espi/1_1/resource/Batch/Subscription/",
  tokenPath: '/oauth/v2/token',
  agentOptions : {
    ////read the certificate and also pass the password
    pfx: fs.readFileSync('auth/pge_self_access/cert/certificate.p12'),
    passphrase: process.env.PASS_PHRASE,
  }
}
