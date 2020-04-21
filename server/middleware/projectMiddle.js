const Project= require('../.././app/models/project');
const jwt = require('jsonwebtoken');
var projectMiddle = function(req,res,next){
	var projectID = req.query.projectID;
	var redirectURL = req.query.redirectURL;
	try{

		Project.findOne({projectID:projectID,redirectURLs:redirectURL}).then(function(project){
			if(project){
				req.project=project;
				next();
			}
			else{
				return Promise.reject();
			}
		}).catch(function(e){
			res.status(401).send({message:'Unauthorised Project'});
		});

	}catch(e){
		res.status(401).send({message:'Unauthorised Project'});
	}
};

module.exports=projectMiddle;