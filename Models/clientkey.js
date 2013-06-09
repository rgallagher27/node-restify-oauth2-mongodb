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
var ClientSchema = new Schema(
{
	id: 		ObjectId,
	client: 	{ type: String, trim: true },
	secret: 	{ type: String, trim: true }
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
ClientSchema.pre('save', function(next) 
{
	if (!validatePresenceOf(this.client)) {
		next(new restify.MissingParameterError('Client cannot be blank'));
	}
	if (!validatePresenceOf(this.secret)) {
		next(new restify.MissingParameterError('Secret cannot be blank'));
	}
	next();
})

/**
 * Methods
 */

ClientSchema.methods = {

}

mongoose.model('ClientKey', ClientSchema)