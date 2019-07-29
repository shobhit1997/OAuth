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
		let projectSecret=req.query.projectSecret;
		var project=await Project.findOne({projectID,projectSecret});
		if(project){
			res.send({loginURL:project.loginURL});
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
	      	if(!error && response.statusCode==200){
	      		let profile_id=body.student_id||body.faculty_id;
	      		let name=body.first_name;
	      		let username = body.username;
	      		var token = jwt.sign({token:body.token,client:req.project.createdBy,profile_id,username,name},process.env.JWT_SECRET).toString();
        	 	res.send({redirectURL:req.project.redirectURL+'?code='+token});
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
			      		res.send(body);
			      	}
			      	else if(!error && response.statusCode==406){
			      		res.status(406).send({message:"Incorrect Credentials"});
			      	}
			      	else{
			      		console.log(error);
			      		res.status(400).send({message:"Bad Request"});
			      	}
			      }
			    );
			}
			else{
				res.status(401).send();
			}

		}catch(e){
			res.status(401).send(e);
		}
		
	});

module.exports=router;
