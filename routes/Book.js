const express = require('express');
const passport = require('passport');
const router = express.Router();
var Book=require('../Models/Book.js'); //including model
var VerifyToken = require('../verifytoken'); //api middleware

router.get('/',VerifyToken,function(req,res){
	//req.userId
	
	Book.find({}).exec().then((results)=>{
		res.status(200).json({ data: results });
	}).catch((err)=>{
		res.status(400).json({ error: err });
	});
});


router.post('/',function(req,res){

	var newBook=new Book();
	newBook.Title=req.body.Title;
	newBook.Author=req.body.Author;
	newBook.Category=req.body.Category;
	newBook.save().then((results)=>{
		res.status(200).json({ data: results });
	}).catch((err)=>{
		res.status(400).json({ error: err });
	});
});


router.get('/:id',function(req,res){

	Book.find({_id:req.params.id}).exec().then((results)=>{
		res.status(200).json({ data: results });
	}).catch((err)=>{
			res.status(400).json({ error: err });
	});
});


router.put('/:id',function(req,res){
	  var query = Book.findOneAndUpdate({_id:req.params.id},{$set: {Title:req.body.Title}},{upsert:true});
		 query.exec().then((results)=> {
	     	res.status(200).json({ status:'success',data: results });
	    }).catch((err)=>{

	    	res.status(400).json({ status:'error',data: err });
	    });
	
});


router.delete('/:id',function(req,res){
	
	var query=Book.findOneAndRemove({_id:req.params.id});
	query.exec().then((results)=>{
		res.status(200).json({ data: results });
	}).catch((err)=>{
		res.status(400).json({ error: err });
	});
	
});


module.exports = router;