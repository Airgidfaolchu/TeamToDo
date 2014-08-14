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
	},

	'forcedotcom' : {
		'clientID' 		: '3MVG9A_f29uWoVQtasngcsw63V7X0K4s58RnAVHC_OQ3OfVPvqnwgXqID0MS4G8NjnTGGKwEAO6nnrXa8l0CE',
		'clientSecret' 	: '6866168812093138166',
		'callbackURL' 	: 'http://localhost:8080/auth/forcedotcom/callback'
	}

}

module.exports = ids;