
/*
 * GET home page.
 */
var crypto = require('crypto');
var User = require('./user.js');
var Post = require('./post.js');
var Image = require('./image.js');
var posts = [];;
var fs = require('fs');

module.exports = function(app) {
  app.get('/', function(req, res){
    Post.get(null, function(err, posts) {
      if (err) {
        posts = [];
      }
      res.render('index', 
        { title: '首页',
          posts: posts,  
        });
    });
  });
  app.get('/reg', function(req, res){
    res.render('reg', { title: '注册' });
  });
  app.get('/login', function(req, res){
    if (req.session.user){
      req.flash('success',req.session.user.name+' 您已登录，现跳转至用户页面');
      res.redirect('/u/'+req.session.user.name);
    } 
    else{
      console.log("用户未登录");
      res.render('login', { title: '登录' });
    }
  });

  app.get('/test', function(req, res) { 
    res.render('test', { title: '测试页面' });
  });

  var User = require('./user.js'); 
  app.post('/reg', function(req, res) { 
    //检验用户两次输入的口令是否一致
    if (req.body['password-repeat'] != req.body['password']) 
  {
    req.flash('error', '两次输入的口令不一致');
    return res.redirect('/reg'); 
  }
  //生成口令的散列值
  var md5 = crypto.createHash('md5');
  var password = md5.update(req.body.password).digest('base64');
  var newUser = new User({ name: req.body.username, password: password,});
  console.log('user='+newUser.name);
  //检查用户名是否已经存在
  User.get(newUser.name, function(err, user) {
    if (user)
    err = '该用户已经存在';
  if (err) {
    req.flash('error', err); 
    return res.redirect('/reg');
  }
  //如果不存在则新增用户 
  newUser.save(function(err) {
    if (err) {
      req.flash('error', err); return res.redirect('/reg');
    }
    req.session.user = newUser; 
    req.flash('success', '注册成功'); 
    res.redirect('/');
  }); 
  //建立用户本地文件夹
  fs.mkdirSync('../users/'+newUser.name,'0700');
  });
  });
  app.post('/login', function(req, res) { 
    if (req.session.user){
      req.flash('success',req.session.user+' 您已登录，已跳转至用户页面');
      res.redirect('/u/'+req.session.user.name);
      console.log("用户已登录:"+req.session.user.name);
    } 
    else{
      console.log("用户未登录");
    }
  //生成口令的散列值
  var md5 = crypto.createHash('md5');
  var password = md5.update(
    req.body.password).digest('base64');
  User.get(req.body.username, function(err, user) { 
    if (!user) {
      req.flash('error', '用户不存在');
      return res.redirect('/login');
    }
    if (user.password != password) { 
      req.flash('error', '用户口令错误'); 
      return res.redirect('/login');
    }
    req.session.user = user; 
    req.flash('success', '登入成功'); 
    res.redirect('/');
  });
  });
  app.post('/logout', function(req, res) { 
    req.session.user = null; 
    req.flash('success', '登出成功'); 
    res.redirect('/');
  });


  app.post('/post', checkLogin);
  app.post('/u/:user/post', checkLogin);
  app.post('/post',postinfo); 
  app.post('/u/post',postinfo); 
  function postinfo(req, res) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post,req.body['imgsrc'],0); 
    var img = req.body['imgsrc'];
    console.log("img="+img);
    post.save(function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      req.flash('success', '发表成功'); 
      Post.get(null, function(err, posts) {
        if (err) {
          posts = [];
        }
        res.render('index', 
          { 
            posts: posts  
          });
      });
      res.redirect('/u/' + currentUser.name);
    }); 
  };

  /*删除*/
  app.post('/u/:user/deletepost', checkLogin);
  app.post('/deletepost', checkLogin);
  app.post('/u/:user/deletepost', delpostinfo);
  app.post('/deletepost', delpostinfo);
  function delpostinfo(req, res){
    console.log('start delete posts');
    console.log("to delete id="+req.body.postid);
    Post.remove(req.body.postid,function(err,result){
    if(err){
      console.log("err="+err);
      req.flash('error', err);
      res.send("reslt","删除错误");
    }else{
      console.log("success"+result);
      res.send("reslt",result+"");
    }
    });
  };

 

  app.get('/u/:user', function(req, res) { 
    if (!req.session.user) {
      req.flash('error', '未登入');
      return res.redirect('/login'); 
    }
    User.get(req.params.user, function(err, user) {
      if (!user) {
        req.flash('error', '用户不存在'); 
        return res.redirect('/');
      }
      Post.get(user.name, function(err, posts) {
        if (err) { 
          req.flash('error', err);
          return res.redirect('/');
        }
        res.render('user', {
          title: user.name,
          posts: posts,
        });
      }); 
    });
  });
  /**图片文件上传保存*/
  function imgupload(req, res,next) {
    console.log(req.body);
    console.log(req.body.file);
    console.log(req.files);
    console.log("send back:"+req.files.file[0].path);
    /*
    console.log("filename"+filename);
    var target = './users/'+req.session.user.name+"/"+filename;
    console.log("target"+target);
    req.flash('img',tmppath);*/
    var tmppath = req.files.file[0].path;
    var filename = tmppath.substr(5,tmppath.length);
    fs.rename("./"+req.files.file[0].path,"./public/userimg/"+filename , function(err) {
      if(err)
        req.flash('error', '文件接收错误');
    });
    res.send("/userimg/"+filename);
  };
  app.post('/file/uploader', imgupload);
  app.post('/u/file/uploader',imgupload); 

  /**文件上传测试*/
  app.post('/img', function(req, res,next) {
    var imge = new Image("../public/images/1.png","../public/images/11.png",400,50)
    console.log("imgae="+imge);
    imge.trans();
    res.render('test', { title: '测试页面' });
  });



};
function checkLogin(req, res, next) { 
  if (!req.session.user) {
    req.flash('error', '未登入');
    return res.redirect('/login'); 
  }
  next();
}
function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', '已登入');
    return res.redirect('/');
  }
  next(); 
}
