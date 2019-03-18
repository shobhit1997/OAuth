const mongoose=require('mongoose');
const jwt = require('jsonwebtoken');
const config=require('../../server/config/config');
var Schema=mongoose.Schema;

var ProjectSchema = new Schema({
	projectID : {
		type : String,
		required:true,
		unique:true
	},
	projectSecret : {
		type : String,
		required:true,
		unique:true
	},
	name : {
		type: String,
		required:true,
		unique:true
	},
	redirectURL:{
		type:String,
		required:true
	},
	loginURL:{
		type:String
	},
	createdBy:{
		type:Schema.ObjectId,
		required:true
	},
	createdAt: { type: Date, default: Date.now }
});



module.exports=mongoose.model('Project',ProjectSchema);

