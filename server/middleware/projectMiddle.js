const Project= require('../.././app/models/project');
const jwt = require('jsonwebtoken');
var projectMiddle = function(req,res,next){
	var token = req.header('token');
	var decoded;

	try{

		decoded= jwt.verify(token,process.env.JWT_SECRET);
		Project.findOne({projectID:decoded.projectID,projectSecret:decoded.projectSecret}).then(function(project){
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