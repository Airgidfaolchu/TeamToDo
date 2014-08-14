var ObjectId = require('mongodb').ObjectID;

module.exports = function(app, passport) {

    // ROUTES ===============================================================

    // show the home page (will also have the login links)
    app.get('/', function(req, res) {
        res.render('index.jade');
    });

    // DASHBOARD SECTION =========================
    app.get('/dashboard', isLoggedIn, function(req, res) {
        user: req.user
        var db = req.app.settings.db;

        /*
         *	Get a list of the first 10 people from the toDoAppTasks collection
         *  and pass them to the dashboard page.
         */
        db.collection('toDoAppProject', function(err, projectsCollection) {
            if (err) throw err;

            projectsCollection.find().limit(10).toArray(function(err, resultsArray) {
                if (err) {
                    throw err
                };

                res.render('dashboard.jade', {
                    projectsArray: resultsArray
                });
            })
        });

    });

    // LOGOUT ==============================
    app.get('/logout', isLoggedIn, function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // PROFILE =============================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.jade', {
            user: req.user
        });
    });

    // ADD PROJECTS =============================
    app.post('/addProject', isLoggedIn, function(req, res) {
        var db = req.app.settings.db;
        console.log('addProject is working');
        // Get the value of the project form input field
        var projectNames = req.param('project');

        // If the input field is blank then just redirect the user back to /
        if (!projectNames) {
            res.redirect('/dashboard');
        } else {

            /*
             *	Insert a new document into the toDoAppTasks collection. The document
             *	has a field called name, the value of which is the value of the project
             *	input field
             */

            db.collection('toDoAppProject', function(err, projectsCollection) {
                projectsCollection.insert({
                    name: projectNames
                }, {
                    w: 1
                }, function(err, result) {
                    if (err) throw err;

                    /*
                     *	Now that we have added a new project redirect the user back to the
                     *	dashboard (/)
                     */
                    res.redirect('/dashboard');
                });
            });
        }
    });

    app.get('/projectsNames', isLoggedIn, function(req, res) {

        var db = req.app.settings.db;

        // Get the "id" query parameter
        var projectsID = req.param('id');

        if (!projectsID) {
            res.render('/dashboard');
        } else {
            // Convert the "id" to an ObjectId
            var projectsObjectID = new ObjectId(projectsID);

            // Store the "id" up on the users session, this allows us to keep a "note" of
            // what project we are dealing with.
            req.session.projectsOID = projectsID;

            db.collection('toDoAppTasks', function(err, tasksCollection) {
                tasksCollection.find({
                    project: projectsObjectID
                }).limit(50).toArray(function(err, resultsArray) {
                    if (err) throw err;

                    res.render('projectsNames', {
                        tasksArray: resultsArray
                    });
                });
            });


        }
    });
    // ADD TASK
    app.post('/addTask', isLoggedIn, function(req, res) {

        var db = req.app.settings.db;
        var task = req.param('task');

        // Get the projects ID that we stored on the users session (so we know what user we are
        // dealing with) and create an ObjectId object
        var projectsObjectID = new ObjectId(req.session.projectsOID);

        if (!task) {
            res.redirect('/projectsNames?id=' + req.session.projectsOID);
        } else {
            db.collection('toDoAppTasks', function(err, tasksCollection) {
                if (err) throw exception;

                tasksCollection.insert({
                    task: task,
                    project: projectsObjectID
                }, {
                    w: 1
                }, function(err, result) {
                    if (err) throw err;

                    res.redirect('/projectsNames?id=' + req.session.projectsOID);
                });
            });
        }
    });
    // ADD TASK =========================================
    app.get('/deleteTask', isLoggedIn, function(req, res) {

        var db = req.app.settings.db;
        var taskID = req.param('id');

        if (!taskID) {
            res.redirect('/projectsNames?id=' + req.session.projectsOID);
        } else {
            var taskObjectID = new ObjectId(taskID);

            db.collection('toDoAppTasks', function(err, tasksCollection) {
                tasksCollection.remove({
                    _id: taskObjectID
                }, {
                    w: 1
                }, function(err, result) {
                    if (err) throw err;

                    res.redirect('/projectsNames?id=' + req.session.projectsOID);
                });
            });
        }
    });
    // EDIT TASK =========================================
    app.get('/editTask', isLoggedIn, function(req, res) {
        var db = req.app.settings.db;
        var taskID = req.param('id');
        var newTask = req.param('taskField');

        if (!taskID) {
            res.redirect('/projectsNames?id=' + req.session.projectsOID);
        } else {
            var taskObjectID = new ObjectId(taskID);

            db.collection('toDoAppTasks', function(err, tasksCollection) {
                tasksCollection.update({
                    _id: taskObjectID
                }, {
                    $set: {
                        task: newTask
                    }
                }, function(err, result) {
                    if (err) throw err;

                    res.redirect('/projectsNames?id=' + req.session.projectsOID);
                });
            });
        }
    });
    // EDIT PROJECT ==========================================
    app.get('/editProject', isLoggedIn, function(req, res) {
        var db = req.app.settings.db;
        var projectID = req.param('id');
        var newProject = req.param('projectField');

        if (!projectID) {
            res.redirect('/dashboard?id=' + req.session.projectsOID);
        } else {
            var projectObjectID = new ObjectId(projectID);

            db.collection('toDoAppProject', function(err, projectsCollection) {
                projectsCollection.update({
                    _id: projectObjectID
                }, {
                    $set: {
                        project: newProject
                    }
                }, function(err, result) {
                    if (err) throw err;

                    res.redirect('/dashboard?id=' + req.session.projectsOID);
                });
            });
        }
    });
    // DELETE PROJECT =======================================
    app.get('/deleteProject', isLoggedIn, function(req, res) {
        var db = req.app.settings.db;
        var projectID = req.param('id');

        if (!projectID) {
            res.redirect('/dashboard?id=' + req.session.projectsOID);
        } else {
            var projectObjectID = new ObjectId(projectID);

            db.collection('toDoAppProject', function(err, projectsCollection) {
                projectsCollection.remove({
                    _id: projectObjectID
                }, {
                    w: 1
                }, function(err, result) {
                    if (err) throw err;

                    res.redirect('/dashboard?id' + req.session.projectsOID);
                });
            });
        }
    });

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function(req, res) {
        res.render('login.jade', {
            message: req.flash('loginMessage')
        });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard', // redirect to the secure dashboard section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.jade', {
            message: req.flash('signupMessage')
        });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard', // redirect to the secure dashboardsection
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/auth/facebook', passport.authenticate('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/dashboard',
            failureRedirect: '/'
        }));

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/auth/twitter', passport.authenticate('twitter', {
        scope: 'email'
    }));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/dashboard',
            failureRedirect: '/'
        }));


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/dashboard',
            failureRedirect: '/'
        }));

    // salesforce ---------------------------------

    app.get('/auth/forcedotcom', passport.authenticate('forcedotcom'));

    app.get('/auth/forcedotcom/callback',
        passport.authenticate('forcedotcom', {
            successRedirect: '/dashboard',
            failureRedirect: '/'
        }));


    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.jade', {
            message: req.flash('loginMessage')
        });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/dashboard', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', {
        scope: 'email'
    }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect: '/dashboard',
            failureRedirect: '/'
        }));

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', {
        scope: 'email'
    }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect: '/dashboard',
            failureRedirect: '/'
        }));


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', {
        scope: ['profile', 'email']
    }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect: '/dashboard',
            failureRedirect: '/'
        }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user = req.user;
        /*		var db 				= req.app.settings.db;
		db.local.remove();
		db.facebook.remove();							--I need to merge the two db perhaps
		db.twitter.remove();
		db.google.remove();*/
        user.local.email = undefined;
        user.local.password = undefined;
        user.facebook.id = undefined;
        user.facebook.token = undefined;
        user.facebook.email = undefined;
        user.facebook.name = undefined;
        user.twitter.id = undefined;
        user.twitter.token = undefined;
        user.twitter.displayName = undefined;
        user.twitter.username = undefined;
        user.google.id = undefined;
        user.google.token = undefined;
        user.google.email = undefined;
        user.google.name = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}