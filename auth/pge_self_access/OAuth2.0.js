var appConfig = require('./config');

module.exports = function() {
	return {
    'authCode': require('./auth-code')(appConfig),
    'client': require('./client')(appConfig)
  }
};

