
/*
 * GET users listing.
 */

var mongodb = require('../db');
var Mydate = require('../tools/mydate.js');
var time =null;
function Post(username, post, imgsrc,time,id) { 
  this.user = username;
  this.post = post;
  this.imgsrc = imgsrc;
  this.id = id;
  if(time)
  {
    this.time=time;
  }
  else
  {
    this.time = new Date().Format("yyyy-MM-dd hh:mm:ss");
  }
}
module.exports = Post;
Post.prototype.save = function save(callback) { // 存入 Mongodb 的文档
  var post = {
    user: this.user, post: this.post, time: this.time, imgsrc: this.imgsrc,
  };
  console.log(post.imgsrc);
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    // 读取 posts 集合
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      // 为 user 属性添加索引
      collection.ensureIndex('user');
      // 写入 post 文档
      collection.insert(post, {safe: true}, function(err, post) {
        mongodb.close();
        callback(err, post);
      });
    }); 
  });
};
Post.get = function get(username, callback) { 
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function(err, collection) {
      if (err) { 
        mongodb.close(); 
        return callback(err);
      }
      var query = {};
      if (username) {
        query.user = username;
      }
      collection.find(query).sort({time: -1}).toArray(function(err, docs) { 
        mongodb.close();
        if (err) {
          callback(err, null); 
        }
        var posts = []; 
        docs.forEach(function(doc, index) {
          var imgarry = null;
          if(doc.imgsrc){
            imgarry = new String(doc.imgsrc).split(",");
          }
          else{
            imgarry = new Array();
          }
        console.log('postimg='+imgarry);
        var post = new Post(doc.user, doc.post,imgarry ,doc.time,doc._id);
        console.log("postid"+post._id);
        posts.push(post);
        });
        callback(null, posts); });
    });
  });
};

Post.remove = function (id,callback){
  var BSON = require('mongodb').BSONPure;
  var obj_id = BSON.ObjectID.createFromHexString(id);
  var query = {};
  query._id=obj_id;
  var EventEmitter = require('events').EventEmitter;
  var event = new EventEmitter();
  event.on('deleteDate', function() { 
    console.log("remove database");
    mongodb.open(function(err, db) {
      if (err) {
        return callback(err);
      }
      db.collection('posts', function(err, collection) {
        if (err) {
          mongodb.close();
          return callback(err);
        }

        console.log("remove post.id="+query._id);
        collection.remove(query,{safe:true},function(err,result){
          console.log(result);
          mongodb.close();
          callback(err,result);
        });
      });

    });
  });
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('posts', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }

      console.log("find post.id="+query._id);
      //var async = require('async');

      /*找出记录，先删除图片文件 然后删除数据库记录*/
      /*async.series([
        function (){
        collection.find(query).sort({time: -1}).toArray(function(err, docs) { 
        mongodb.close();
        if (err) {
        callback(err, null); 
        }
        var posts = []; 
        docs.forEach(function(doc, index) {
        var imgarry = null;
        if(doc.imgsrc){
        var fs = require('fs');
        imgarry = new String(doc.imgsrc).split(",");
        for(var i =0 ; i < imgarry.length;i++)
        {
        if(imgarry[i]){
        var remove = function(){
        console.log("unlink-"+"./public"+imgarry[i]);
        var file= "./public"+imgarry[i];
        var lastfile="./public"+imgarry[imgarry.length-1];
        fs.unlink(file,function(err){
        if(err)
        {
        console.log("ERR"+err);
        return callback(err);
        }else{


        console.log("SUCCESS to remove"+file);
        }
        });
        }
        remove();
        }
        }
        }

        });
        });
        },
        function(){
        console.log("remove database");
        collection.remove(query,{safe:true},function(err,result){
        console.log(result);
        mongodb.close();
        callback(err,result);
        });
        }
        ],function(err, values) {
        if(err){
        callback(err);
        }
        });*/



      collection.find(query).sort({time: -1}).toArray(function(err, docs) { 
        mongodb.close();
        if (err) {
          callback(err, null); 
        }
        var posts = []; 
        docs.forEach(function(doc, index) {
          var imgarry = null;
          if(doc.imgsrc){
            var fs = require('fs');
            imgarry = new String(doc.imgsrc).split(",");
            for(var i =0 ; i < imgarry.length;i++)
            {
              if(imgarry[i]){
                var remove = function(){
                  console.log("unlink-"+"./public"+imgarry[i]);
                  var file= "./public"+imgarry[i];
                  var lastfile="./public"+imgarry[imgarry.length-1];
                  fs.unlink(file,function(err){
                    if(err)
                  {
                    console.log("ERR"+err);
                    return callback(err);
                  }else{
                    if(file==lastfile){
                      event.emit('deleteDate');
                    }
                    console.log("SUCCESS to remove"+file);
                  }
                  });
                }
                remove();
              }
            }
          }

        });
      });                 


    });
  });
};




