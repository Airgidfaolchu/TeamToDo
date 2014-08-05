// javascripts/auth.js

// expose the config directly to the application using exports
var ids = {

	'facebookAuth' : {
		'clientID' 		: '271496833027468', 
		'clientSecret' 	: '65fa20c288bb319d151318381c18881f', 
		'callbackURL' 	: 'http://localhost:8080/auth/facebook/callback'
	},

	'twitterAuth' : {
		'consumerKey' 		: 'Ot4izux5735simiD1URtZw',
		'consumerSecret' 	: 'mGtSgJeNDbMjEdIKAa075R6rYA4gjO7MIhDbu0D0',
		'callbackURL' 		: 'http://localhost:8080/auth/twitter/callback'
	},

	'googleAuth' : {
		'clientID' 		: '658711144273-1k265e7hoeilrigmbnj2o45h7t53bmlf.apps.googleusercontent.com',
		'clientSecret' 	: 'CQpqSZAtvESjjyKW_cczk3c3',
		'callbackURL' 	: 'http://localhost:8080/auth/google/callback'
	}

}

module.exports = ids;