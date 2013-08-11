"use strict"

/*
 * Cluster Imports
 */
var cluster 	 = require('cluster')
var http 		   = require('http')
var numCPUs 	 = require('os').cpus().length

if (cluster.isMaster) {
  /*
   * Fork workers.
   */
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork()
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died')
  })
} else {
	/*
	 * Start a new server on a new thread
	 */
	require('./server.js')
}