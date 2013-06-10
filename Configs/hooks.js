"use strict";

var mongoose    = require('mongoose');
var _           = require("underscore");
var crypto      = require("crypto");
var Client      = mongoose.model('ClientKey');
var Token       = mongoose.model('AuthToken');
var User        = mongoose.model('User');

// Load configurations
var env     = process.env.NODE_ENV || 'development';
var config  = require('./config')[env];

// Connect Redis connection
if( env === "development" ) {
    var redis           = require('redis');
    var redisClient     = redis.createClient(null, config.redis_url, null);
}else {
    var redisClient = require('redis-url').connect(config.redis_url);
}

redisClient.on("error", function (err) {
    console.log("Error " + err);
});

function generateToken(data) 
{
    var random          = Math.floor(Math.random() * 100001);
    var timestamp       = (new Date()).getTime();
    var sha256          = crypto.createHmac("sha256", random + "WOO" + timestamp);

    return sha256.update(data).digest("base64");
}

exports.validateClient = function (clientId, clientSecret, cb) 
{
    // Call back with `true` to signal that the client is valid, and `false` otherwise.
    // Call back with an error if you encounter an internal server error situation while trying to validate.
    Client.findOne({ client: clientId, secret: clientSecret }, function (err, client) {
        if(err){
            cb(null, false);
        }else {
            if( client === null ) {
                cb(null, false);
            } else {
                cb(null, true);
            }
        }
    });
};

exports.grantUserToken = function (username, password, cb) 
{
    var query = User.where( 'username', new RegExp('^' + username + '$', 'i') );

    query.findOne(function (err, user) {
        if (err) {
            cb(null, false);
        } else if (!user) {
            cb(null, false);
        } else if (user.authenticate(password)) {
            // If the user authenticates, generate a token for them and store it to the database so
            // we can look it up later.

            var token       = generateToken(username + ":" + password);
            var newToken    = new Token({ username: username, token: token });
            newToken.save();

            // Store the token in the Redis datastore so we can perform fast queries on it
            redisClient.set(token, username);

            // Call back with the token so Restify-OAuth2 can pass it on to the client.
            return cb(null, token);
        } else {
            cb(null, false);
        }
    });
};

exports.authenticateToken = function (token, cb) 
{
    // Query the Redis store for the Auth Token 
    redisClient.get(token, function (err, reply) {
        console.log("Redis reply " + reply);
        /* 
         * If we get an error fall back to the MongoDb incase
         * Redis has deleted the token
         */
        if(err || reply === null){
            Token.findOne({ token: token }, function (err, authToken) {
                if(err){
                    cb(null, false);
                }else {
                    if( authToken === null ) {
                        cb(null, false);
                    } else {
                        // If the token authenticates, call back with the corresponding username. Restify-OAuth2 will put it in the
                        // request's `username` property.
                        return cb(null, authToken.username);
                    }
                }
            });
        } else {
            // Return the username
            return cb(null, reply);
        }
    });
};