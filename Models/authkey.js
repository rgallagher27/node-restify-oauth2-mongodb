/**
 * Module dependencies.
 */
var mongoose 	= require('mongoose');
var Schema 		= mongoose.Schema;
var ObjectId 	= Schema.ObjectId;
var restify 	= require('restify');

/*
 * Client Key Schema
 */
var TokenSchema = new Schema(
{
	id: 		ObjectId,
	username: 	{ type: String, trim: true },
	token: 		{ type: String, trim: true }
})

/**
 * Validations
 */
var validatePresenceOf = function (value) 
{
	return value && value.length
}

/**
 * Pre-save hook
 */
TokenSchema.pre('save', function(next) 
{
	if (!validatePresenceOf(this.username)) {
		next(new restify.MissingParameterError('Username cannot be blank'));
	}
	if (!validatePresenceOf(this.token)) {
		next(new restify.MissingParameterError('Token cannot be blank'));
	}
	next();
})

/**
 * Methods
 */

TokenSchema.methods = {

}

mongoose.model('AuthToken', TokenSchema)