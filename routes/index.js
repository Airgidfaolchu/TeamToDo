/*
 * Require the ObjectId object from the mongodb package. I use it later to
 * create ObjectId objects.
 */

var ObjectId = require('mongodb').ObjectID;

/*
 * GET dashboard page.
 */

exports.dashboard = function(req, res){
	var db = req.app.settings.db;

	/*
	 *	Get a list of the first 10 people from the toDoAppTasks collection
	 *  and pass them to the dashboard page.
	 */
	db.collection('toDoAppProject', function (err, projectsCollection) {
		if (err) throw err;

		projectsCollection.find().limit(10).toArray(function(err, resultsArray){
			if (err) {throw err};

			res.render('dashboard', { projectsArray: resultsArray });
		})
	});
};

/*
 * 	POST /addProject
 *
 *	This is called when someone submits the form on the index page to add a new
 *	project to the database. The new project is stored on the toDoAppTasks collection
 */
exports.addProject = function(req, res){
	var db = req.app.settings.db;

	// Get the value of the project form input field
	var projectName = req.param('project');

	// If the input field is blank then just redirect the user back to /
	if(!projectName) {
		res.redirect('/dashboard');
	} else {

		/*
		 *	Insert a new document into the toDoAppTasks collection. The document
		 *	has a field called name, the value of which is the value of the project
		 *	input field
		 */

		db.collection('toDoAppProject', function (err, projectsCollection) {
			projectsCollection.insert({name: projectName}, {w:1}, function (err, result) {
				if (err) throw err;

				/*
				 *	Now that we have added a new project redirect the user back to the
				 *	dashboard (/)
				 */
				res.redirect('/dashboard');
			});
		});
	}

};

/*
 * 	GET /projectsNames
 *
 *	This gets called when sone clicks on the name of a project in the dashboard (/) page.
 *	The link contains an query parameter called id which is equal to the projects _id field.
 */
exports.projectsNames = function(req, res) {
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

		db.collection('toDoAppTasks', function (err, projectsCollection) {
			projectsCollection.find({project: projectsObjectID}).limit(50).toArray(function (err, resultsArray){
				if (err) throw err;

				res.render('projectsNames', {tasksArray: resultsArray});
			});
		});

		
	}
	
};

exports.addTask = function(req, res) {
	var db = req.app.settings.db;
	var project = req.param('project');

	// Get the projects ID that we stored on the users session (so we know what user we are
	// dealing with) and create an ObjectId object
	var projectsObjectID = new ObjectId(req.session.projectsOID);

	if (!project) {
		res.redirect('/projectsNames?id='+req.session.projectsOID);
	} else {
		db.collection('toDoAppTasks', function (err, projectsCollection) {
			if (err) throw exception;

			projectsCollection.insert({project: project, project: projectsObjectID}, {w:1}, function(err, result) {
				if (err) throw err;

				res.redirect('/projectsNames?id='+req.session.projectsOID);
			});
		});
	}
};

exports.deleteTask = function (req, res) {
	var db = req.app.settings.db;
	var projectID = req.param('id');

	if (!projectID) {
		res.redirect('/projectsNames?id='+req.session.projectsOID);
	} else {
		var projectObjectID = new ObjectId(projectID);

		db.collection('toDoAppTasks', function (err, projectsCollection){
			projectsCollection.remove({_id: projectObjectID}, {w:1}, function (err, result) {
				if (err) throw err;

				res.redirect('/projectsNames?id='+req.session.projectsOID);
			});
		});
	}
	
}

exports.editTask = function (req, res) {
	var db = req.app.settings.db;
	var projectID = req.param('id');
	var newTask = req.param('projectField');

	if(!projectID) {
		res.redirect('/projectsNames?id='+req.session.projectsOID);
	} else {
		var projectObjectID = new ObjectId(projectID);

		db.collection('toDoAppTasks', function (err, projectsCollection){
			projectsCollection.update({_id: projectObjectID}, {$set: {project: newTask}}, function (err, result) {
				if (err) throw err;

				res.redirect('/projectsNames?id='+req.session.projectsOID);
			});
		});
	}
};
//Edit Projects
exports.editProject = function (req, res) {
	var db = req.app.settings.db;
    var projectID = req.param('id');
	var newProject = req.param('projectField');

	if(!projectID) {
		res.redirect('/dashboard?id='+req.session.projectsOID);
	} else {
		var projectObjectID = new ObjectId(projectID);

		db.collection('toDoAppProject', function (err, projectsCollection){
			projectsCollection.update({_id: projectObjectID}, {$set: {project: newProject}}, function (err, result) {
				if (err) throw err;

				res.redirect('/dashboard?id='+req.session.projectsOID);
			});
		});
	}
};
//Delete Projects
exports.deleteProject = function(req, res) {
	var db = req.app.settings.db;
	var projectID = req.param('id');

	if (!projectID) {
		res.redirect('/dashboard?id='+req.session.projectsOID);
	} else {
		var projectObjectID = new ObjectId(projectID);

		db.collection('toDoAppProject', function (err, projectsCollection){
			projectsCollection.remove({_id: projectObjectID}, {w:1}, function (err, result) {
				if (err) throw err;

				res.redirect('/dashboard?id='+req.session.projectsOID);
			});
		});
	}
	
});