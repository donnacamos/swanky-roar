/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const ObjectId = require('mongodb').ObjectId

module.exports = function (app, db) {
  
  app.route('/api/threads/:board')
  .post((req, res)=>{
  let data = req.body
  let dbInfo = {board: req.params.board, text: data.text, created_on: new Date, bumped_on: new Date, reported: false, 
                delete_password: data.delete_password, reply_count: 0, replies: []}
  db.collection('message_board').insert(dbInfo, function(err, result){
  })
    res.redirect('https://swanky-roar.glitch.me/b/'+req.params.board+'/')
  })
  ;
    
 
   app.route('/api/replies/:board')
    .post((req,res)=>{
      db.collection('message_board').findOneAndUpdate({_id:ObjectId(req.body.thread_id)},{$inc:{replycount:1},
            $push:{replies:{text:req.body.text,created_on:new Date,reported:false,delete_password:req.body.delete_password,_id:ObjectId()}},
            $set:{bumped_on:new Date}},{upsert:false},function(err,result){
        res.redirect('https://swanky-roar.glitch.me/b/'+result.value.board+'/')
      })
    
    })
  
  app.route('/api/threads/:board')
    .get((req,res)=>{
      db.collection('message_board').find({board:req.params.board},{delete_password:0,reported:0}).toArray(function(err,result){
        res.send(result)
      })
    }) 
  
   app.route('/api/replies/:board')
    .get((req,res)=>{
      db.collection('message_board').findOne(ObjectId(req.query.thread_id),{delete_password:0,reported:0},function(err,result){
        console.log(result)
        res.send(result)
      })
    }) 
  
  app.route('/api/threads/:board')
    .delete((req,res)=>{
      db.collection('message_board').remove({_id:ObjectId(req.body.thread_id),delete_password:req.body.delete_password},function(err,result){
        if(result.result.n==0){
          res.send('incorrect password')
        }else{
          res.send('success')
        }
      })
    }) 
  
  app.route('/api/replies/:board')
    .delete((req,res)=>{
      console.log(req.body)
      db.collection('message_board').update({replies:{$elemMatch:{_id:ObjectId(req.body.reply_id),delete_password:req.body.delete_password}}},
                    {$set:{"replies.$.text":'deleted'}},function(err,result){
        if(result.result.n==0){
          res.send('incorrect password')
        }else{
          res.send('success')
        }
      })
    }) 
  
  app.route('/api/threads/:board')
    .put((req,res)=>{
      db.collection('message_board').update({_id:ObjectId(req.body.report_id)},{$set:{reported:true}},(err,result)=>{
        if(result.result.n==0){
          res.send('failed')
        }else{
          res.send('success')
        }
      })    
    })
  
    app.route('/api/replies/:board')
    .put((req,res)=>{
      db.collection('message_board').update({replies:{$elemMatch:{_id:ObjectId(req.body.reply_id)}}},{$set:{"replies.$.reported":true}},
                   (err,result)=>{
        if(result.result.n==0){
          res.send('failed')
        }else{
          res.send('success')
        }
      })    
    })

};