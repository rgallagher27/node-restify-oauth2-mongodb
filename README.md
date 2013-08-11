node-restify-oauth2-mongodb
===========================

A simple implementation of a Node.js REST API built with Restify, using restify-oauth2 for authentication with a MongoDB backend

Installation
------------

- Install [redis](http://redis.io/), [node.js](http://nodejs.org/) and [npm](http://npmjs.org/).
- Clone the repository: `git clone git://github.com/rgallagher27/node-restify-oauth2-mongodb.git && cd node-restify-oauth2-mongodb`
- Install dependancies: `npm install`
- Start redis: `redis-server`
- Start MongoDB: `mongod`
- insert a Client Key into the mongoDB wit the format: 

{
  _id: ObjectId("51c6e846ede91c0b8600005e"),
  clientName: "Test Client",
  client: "test",
  secret: "password"
}