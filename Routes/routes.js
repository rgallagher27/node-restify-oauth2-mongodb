
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

   	server.pre(function(req, res, next) 
 	{
    	if (req.url === '/') {
         	return next();
      	}
      	else if (req.url === '/public') {
         	return next();
      	}
      	else if (req.url === '/token') {
         	return next();
      	}
      	req.headers.accept = 'application/json';
      	return next();
   	});

   	// Define entry points
	var RESOURCES = Object.freeze({
	    INITIAL		: "/",
	    REGISTER 	: "/register",
	    TOKEN 		: "/token",
	    PUBLIC 		: "/public",
	    SECRET 		: "/secret"
	});

   	server.get(RESOURCES.INITIAL, function (req, res) {
	    var response = {
	        _links: {
	            self: { href: RESOURCES.INITIAL },
	            "http://localhost:8090/public": { href: RESOURCES.PUBLIC }
	        }
	    };

	    if (req.username) {
	        response._links["http://localhost:8090/secret"] = { href: RESOURCES.SECRET };
	    } else {
	        response._links["oauth2-token"] = {
	            href: RESOURCES.TOKEN,
	            "grant-types": "password",
	            "token-types": "bearer"
	        };
	    }

	    res.contentType = "application/hal+json";
	    res.send(response);
	});

	server.post(RESOURCES.REGISTER, function (req, res, next) {
		if (req.params.password != req.params.vPassword) {
			return next(new restify.MissingParameterError('Password and Verify Password must match.'));
		}
		var user = new User(req.params);
		if (user.username != null && user.username != '') {
			user.save(function (err, user) {
				if (!err) {
					res.send(user);
				} else {
					return next(err);
				}
			});
		} else {
			return next(new restify.MissingParameterError('Username required.'));
		}
	});

	server.get(RESOURCES.PUBLIC, function (req, res) {
	    res.send({
	        "public resource": "is public",
	        "it's not even": "a linked HAL resource",
	        "just plain": "application/json",
	        "personalized message": req.username ? "hi, " + req.username + "!" : "hello stranger!"
	    });
	});

	server.get(RESOURCES.SECRET, function (req, res) {
		validateUser(req, res);
	    res.send({'message':'Success'});
	});
}