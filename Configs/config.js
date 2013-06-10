/**
 * Environment dependent configuration properties
 */
module.exports = {
    development: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'Nodejs Restify Oauth Mongoose Demo'
      },
	    host: 'localhost',
	    port: '8090',
      db_url: 'mongodb://localhost:27017/restify_test',
      redis_url: null,
      session_timeout: 20 * 60 * 10, // defaults to 20 minutes, in ms (20 * 60 * 1000)
      socket_loglevel: '1', // 0 - error, 1 - warn, 2 - info, 3 - debug
      mailSettings : {
          mailFrom: 'test@gmail.com',
          mailService: "Gmail",
          mailAuth: {user: "test@gmail.com", pass: "testpass"},
          sendEmail: false,
          browserPreview: true
      },
	    version: '1.0.0'
    },
    test: {
      root: require('path').normalize(__dirname + '/..'),
      app: {
        name: 'Nodejs Restify Oauth Mongoose Demo'
      },
      host: 'http://enigmatic-anchorage-1633.herokuapp.com',
      port: process.env.PORT,
      db_url: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL,
      redis_url: process.env.REDISTOGO_URL,
      session_timeout: 20 * 60 * 10, // defaults to 20 minutes, in ms (20 * 60 * 10)
      socket_loglevel: '1', // 0 - error, 1 - warn, 2 - info, 3 - debug
      mailSettings : {
          mailFrom: 'test@gmail.com',
          mailService: "Gmail",
          mailAuth: {user: "test@gmail.com", pass: "testpass"},
          sendEmail: false,
          browserPreview: true
      },
      version: '1.0.0'
    }, 
    production: {

    }
}