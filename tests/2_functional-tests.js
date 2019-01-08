/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

let newID=''
let replyID=''

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Post new thread', function(done){
      chai.request(server)
      .post('/api/threads/test')
      .send({
      text:'this is a test',
      delete_password:'test'
      })
        .end(function(err, res){
      console.log(res.body)
      assert.equal(res.status, 200)
      assert.isObject(res.body, 'response should be an object');
        done();
      });
      });
    });
    
     suite('GET', function() {
      test('new threads', function(done) {
       chai.request(server)
        .get('/api/threads/test')
        .end(function(err, res){
          newID=res.body[0]._id
          assert.equal(res.status, 200); 
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0],'text')
          assert.property(res.body[0],'created_on')
          assert.property(res.body[0],'bumped_on')
          assert.property(res.body[0],'replycount')
          assert.property(res.body[0],'replies')
          done();
      });
      });
    });
    
    suite('POST', function() {
      test('Post new reply', function(done) {
       chai.request(server)
        .post('/api/replies/test')
        .send({
           thread_id:newID,
           text:'this is a test',
           delete_password:'test'
         })
        .end(function(err, res){
          assert.equal(res.status, 200); 
          assert.isObject(res.body, 'response should be an object');
          done();
      });
      });
    });
    
    suite('GET', function() {
      test('Get new replies', function(done) {
       chai.request(server)
        .get('/api/replies/test') 
        .query({
           thread_id:newID,
         })
        .end(function(err, res){
          //console.log(res.body.replies)
          replyID=res.body.replies[0]._id
          assert.equal(res.status, 200); 
          assert.isObject(res.body, 'response should be an object');
          done();
      });
      });
      
    });
    
    suite('PUT', function() {
      test('Report reply', function(done) {
       chai.request(server)        
        .put('/api/replies/test')
        .send({thread_id:newID,
               reply_id:replyID
               })
        .end(function(err, res){
          assert.equal(res.status, 200); 
          assert.equal(res.text, 'success','response should be success'); 
          done();
      });
      });
      
    });
    
    suite('DELETE', function() {
      test('Delete reply', function(done) {
       chai.request(server)        
        .delete('/api/replies/test')
        .send({thread_id:newID,
               reply_id:replyID,
               delete_password:'test'
               })
        .end(function(err, res){
          assert.equal(res.status, 200); 
          assert.equal(res.text, 'success','response should be success');
          done();
      });
      });
      
      test('Delete thread', function(done) {
       chai.request(server)
        .delete('/api/threads/test')
        .send({thread_id:newID,
               delete_password:'test'})
        .end(function(err, res){
          assert.equal(res.status, 200); 
          assert.equal(res.text, 'success','response should be success');
          done();
      });
      });
      
    });
    
  }); 

});
