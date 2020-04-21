const express=require('express');
const User= require('../.././app/models/user');
const Project= require('../.././app/models/project');
const projectMiddle=require('.././middleware/projectMiddle');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const request=require('request');
const crypto = require('crypto');
const router=express.Router();



router.route('/loginURL')
	.get(async function(req,res){
		let projectID=req.query.projectID;
		let redirectURL=req.query.redirectURL;
		var project=await Project.findOne({projectID,redirectURLs: redirectURL});
		if(project){
			res.send({loginURL:`http://oauthV2.shobhitagarwal.me/login?projectID=${projectID}&redirectURL=${redirectURL}`});
		}
		else{
			res.status(400).send();
		}
	});
router.route('/verifyProject')
	.get(async function(req,res){
		let projectID=req.query.projectID;
		let redirectURL=req.query.redirectURL;
		console.log(projectID);
		console.log(redirectURL);
		var project=await Project.findOne({projectID,redirectURLs:redirectURL});
		if(project){
			res.send(project);
		}
		else{
			res.status(400).send();
		}
	});
router.route('/login')
	.post(projectMiddle, async function(req,res){
		var values = {
	      username: `${req.body.username}`,
	      password: `${req.body.password}`
	    }
	    console.log(values);
	    request.post(
	      process.env.LoginAPI,
	      { json: true,
	        body: values },
	      async function (error, response, body) {
	      	console.log(error);
	      	console.log(body);
	      	// console.log();
	      	if(!error && response.statusCode==200){
	      		let profile_id=body.student_id||body.faculty_id;
	      		let group = body.group;
	      		let name=body.first_name;
	      		let username = body.username;
	      		var token = jwt.sign({group,token:body.token,client:req.project.createdBy,profile_id,username,name,projectID:req.project.projectID},process.env.JWT_SECRET).toString();
        	 	res.send({redirectURL:req.query.redirectURL+'?code='+token});
	      	}
	      	else if(!error && response.statusCode==406){
	      		res.status(406).send({message:"Incorrect Credentials"});
	      	}
	      	else{
	      		res.status(400).send({message:"Bad Request"});
	      	}
	      }
	    );
	});
router.route('/userinfo')
	.get(async function(req,res){
		let projectID=req.query.projectID;
		let projectSecret=req.query.projectSecret;
		let code=req.query.code;
		var decoded;
		console.log(req.query);
		try{
			decoded= jwt.verify(code,process.env.JWT_SECRET);
			console.log(decoded);
			let token=decoded.token;
			let createdBy=decoded.client;
			let profile_id=decoded.profile_id;
			let username = decoded.username;
			let name = decoded.name;
			let decodedprojectID = decoded.projectID;
			let group=decoded.group;
			if(decodedprojectID!=projectID){
				return res.status(400).send({message:"The code does not belong to the specified project ID"});
			}
			var project=await Project.findOne({projectID,projectSecret,createdBy});

			if(project){
				request.get(
			      process.env.ProfileAPI+profile_id,
			      {
			      	json: true,
			        headers:{
			        	Authorization: 'token '+token
			        } },
			      async function (error, response, body) {
			      	if(!error && response.statusCode==200){
					console.log(body);
						body.name=name;
						body.username=username;
						body.token=token;
						body.group=group;
			      		res.send(body);
			      	}
			      	else if(!error && response.statusCode==406){
			      		res.status(406).send({message:"Incorrect Code"});
			      	}
			      	else{
			      		console.log(error);
			      		res.status(400).send({message:"Bad Request"});
			      	}
			      }
			    );
			}
			else{
				res.status(403).send({message:"Invalid Code"});
			}

		}catch(e){
			res.status(401).send(e);
		}
		
	});

module.exports=router;
