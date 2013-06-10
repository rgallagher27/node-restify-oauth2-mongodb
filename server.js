"use strict";

var restify         = require("restify");
var restifyOAuth2   = require("restify-oauth2");
var mongoose        = require('mongoose');
var fs              = require('fs');

// Load configurations
var env     = process.env.NODE_ENV || 'development';
var config  = require('./Configs/config')[env];

// Paths
var models_path = config.root + '/Models'
var config_path = config.root + '/Configs'
var routes_path = config.root + '/Routes' 

// Connect to MongoDB
mongoose.connect(config.db_url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("Database connection opened.");
});

// Bootstrap models
fs.readdirSync(models_path).forEach(function (file) {
  console.log("Loading model " + file);
  require(models_path + '/' +file);
});

// Load hooks after models have been loaded
var hooks = require("./Configs/hooks");

/* 
 * NB: we're using [HAL](http://stateless.co/hal_specification.html) here to communicate RESTful links among our
 * resources, but you could use any JSON linking format, or XML, or even just Link headers.
 */ 
var server = restify.createServer({
    name: "Example Restify-OAuth2 Resource Owner Password Credentials Server",
    version: require("./package.json").version,
    formatters: {
        "application/hal+json": function (req, res, body) {
            return res.formatters["application/json"](req, res, body);
        }
    }
});

// Setup the Restify Server with Oauth2
server.use(restify.authorizationParser());
server.use(restify.bodyParser({ mapParams: false }));
restifyOAuth2.ropc(server, { tokenEndpoint: "/token", hooks: hooks });


require(routes_path + '/routes')(server, config);


var port = config.port;
    server.listen(port);