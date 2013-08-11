node-restify-oauth2-mongodb
===========================

A simple implementation of a Node.js REST API built with Restify, using restify-oauth2 for authentication with a MongoDB backend

Installation
------------

- Install [redis](http://redis.io/), [node.js](http://nodejs.org/) and [npm](http://npmjs.org/).
- Clone the repository to your computer.
- Install dependancies: `npm install`
- Start redis: `redis-server`
- Start MongoDB: `mongod`
- Insert a Client Key into the mongoDB wit the format: 

```JSON
{
  _id: ObjectId("51c6e846ede91c0b8600005e"),
  clientName: "Test Client",
  client: "test",
  secret: "password"
}
```
- Start the server: `node web`
- You are now ready to register a user.

User Registration
-----------------
- To register a new user perform a Post to `http://localhost:8090/register`

```
curl --data "name=Test&email=test@test.com&username=tester1&password=testing27&vPassword=testing27&role=Admin" http://localhost:8090/register
```
- If everything went as planned this should be the response: 

```JSON
{
  "__v":0,
  "name":"Test",
  "email":"test@test.com",
  "username":"tester1",
  "hashed_password":"$2a$10$3uwD9IiKVlkQJvdQXqm07uQnfcXae3AGjDh.zil8.8CgtlQ2MuACK",
  "_id":"520774753472d74e2c000001",
  "role":"Admin"
}
```

- You are now ready to authenticate with the server

Login/Authentication
--------------------
- To login with the details from above POST to `http://localhost:8090/token`

```
--
```
