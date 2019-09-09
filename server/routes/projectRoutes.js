const express=require('express');
const User= require('../.././app/models/user');
const Project= require('../.././app/models/project');
const authenticate=require('.././middleware/authenticate');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const router=express.Router();
router.route('/')
	.post(authenticate,async function(req,res){
		console.log(req.body);
		var project=new Project(req.body);
		project.createdBy=req.user._id;
		project.projectID=project.name+'.infoconnect.in';
		const hash = crypto.createHmac('sha256', process.env.SECRET)
                   .update(project.projectID)
                   .digest('hex');
        project.projectSecret=hash;
        var token = jwt.sign({projectID:project.projectID,projectSecret:project.projectSecret},process.env.JWT_SECRET).toString();
        project.loginURL='http://oauth.shobhitagarwal.me/login?q='+token;
		try{
			var project=await project.save();
			res.send(_.pick(project,['name','projectID','projectSecret','redirectURL']));

		}
		catch(e){
			res.status(406).send({message:'Retry with different name'});
		}

	})
	.get(authenticate,async function(req,res){
		var project=await Project.find({createdBy:req.user._id});
		res.send(project);
	})
	.delete(authenticate,async function(req,res){
		try{
			var project=await Project.findOne({_id:req.body._id,createdBy:req.user._id});
			if(project){
				await project.remove();
				res.send({message:"deleted"});
			}
			else{
				res.status(401).send({message:'You are not authorised to delete this resource'});
			}
		}
		catch(e){
			res.status(400).send();
		}
	});
module.exports=router;
