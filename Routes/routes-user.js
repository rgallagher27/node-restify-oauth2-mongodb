
var mongoose    	= require('mongoose');
var restify 		= require('restify');
var restifyOAuth2   = require("restify-oauth2");
var User       		= mongoose.model('User');

function validateUser(req, res){
	if (!req.username) {
		return res.sendUnauthorized();
	}
}

module.exports = function (server, config) 
{
	var config_path = config.root + '/config'

	server.get('api/V1/user', function (req, res, next) 
	{
		validateUser(req, res);

		var query = User.where( 'username', new RegExp('^' + req.username + '$', 'i') );

	    query.select('-hashed_password').findOne(function (err, user) {
	        if (err || !user) {
	            return next(new restify.InvalidCredentialsError("Invalid Credentials"));
	        } else {
	            res.send(user);
    			return next();
	        }
	    });
	});

}