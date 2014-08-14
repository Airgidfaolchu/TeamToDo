/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose')
var passport = require('passport')
var flash = require('connect-flash');
var configDB = require('./public/javascripts/database.js');


mongoose.connect(configDB.url); // connect to our database for the user collection
require('./public/javascripts/passport')(passport); // pass passport for configuration

var app = express();

// Let's require the mongodb package
var mongo = require('mongodb');

// Get the MongoClient Object
var mongoClient = mongo.MongoClient;
// Connect to the datavase for the projects and tasks collections
var MONGODB_URI = process.env.CUSTOMCONNSTR_MONGODB_URI || 'mongodb://Attila:Hokicsapat@ds031628.mongolab.com:31628/shopping_db_v2';

// Connect to the db. The callback function will be passed two arguments: err - which
// will contain error information, and db - which will contain a connection to the
// mongodb Database
mongoClient.connect(MONGODB_URI, function(err, db) {
    if (!err) {
        console.log("We are connected to the DB");
        // Store the connection to the mongodb database on the aplication object
        // under the name db so that I can access in another file
        app.set('db', db);
    } else {
        throw err;
    }
});

// all environments
app.set('port', process.env.PORT || 8080);
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/public/images/favicon.ico')); 
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.cookieParser()); // read cookies (needed for auth)
app.use(express.bodyParser()); // get information from html forms

app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.session({
    secret: 'AttilaisthebestprogrammerIswear'
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
    app.locals.pretty = true;
}

// modularized routes ======================================================================
require('./public/javascripts/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});