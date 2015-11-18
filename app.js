var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');
var bcrypt = require('bcrypt');
var nodemailer = require("nodemailer");

var mongo = require('mongodb');
var db = require('monk')('localhost/tav'),users = db.get('users');
// POSTS and OBJECTS BELONGS TO MALESHIN PROJECT DELETE WHEN PUSHING TOPANDVIEWS TO PRODUCTION
var fs = require('fs-extra');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
//app.use(require('connect').bodyParser());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.compress());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 2540000000 }));
app.use(sessions({
  cookieName: 'session',
  secret:'2342kjhkj2h3i2uh32j3hk2jDKLKSl23kh42u3ih4',
  duration:4320 * 60 *1000,
  activeduration:1440 * 60 * 1000,
  httpOnly: true,
  domain:'intplove.com'
}));

var smtpTransport = nodemailer.createTransport({
    service: "Yandex",
    auth: {
        user: "no-reply@intplove.com",
        pass: "szidilxeyhlwccnu"
    }
});

app.get('/sendit/:email',function (req,res){
  var mailOptions = {
    from: "Email Verification ✔ <no-reply@intplove.com>", // sender address 
    to: req.params.email, // list of receivers 
    subject: "Hello ✔", // Subject line 
    text: "Hello world ✔", // plaintext body 
    html: "<b>Hello world ✔</b>" // html body 
}

// send mail with defined transport object 
smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
        console.log(error);
        res.send(0);
    }else{
        console.log("Message sent: " + response.message);
        res.send("Message sent: " + response.message);
    }
 
    // if you don't want to use this transport object anymore, uncomment following line 
    //smtpTransport.close(); // shut down the connection pool, no more messages 
});

});
 



app.get('*', function(req,res,next) {   var d = new Date();
  if(req.headers.host === 'api.recentones.com')  //if it's a sub-domain
   {console.log(d+' got an api request from '+req.ip);
    req.url = '/api' + req.url; 
    console.log(req.url); //append some text yourself
  next();}
  else if(req.headers.host === 'm.recentones.com')  //if it's a sub-domain
   {req.url = '/m' + req.url; 
    console.log(req.url); //append some text yourself
     next();}
  else if (req.ip === '188.226.189.180') {
    console.log("c'est moi");
    next();
  } 
  else{
   console.log('-------------- REQUEST --------------')
   console.log('User-Agent: ' + req.headers['user-agent']);
   console.log('URL: '+req.url);
   console.log(req.ip);
    next();}
   });
 

app.get('/',function(req,res) {
  var ms={};
  var usr = 0;
  if(req.session) {
  usr = req.session;
  users.findOne({email:req.session.email}, function (err,done) {
    if(err) {
     res.render('index',{'user':0});
    }
    else if(done != null){
      res.render('index',{'user':0});
    }
      else {
     res.render('index',{'user':usr});
    }
  });
 }
 else {
  res.render('index',{'user':0});
 }
});

app.post('/getusers',function (err,done){
  users.find({},{limit:20,sort:{regdate:1}}, function (err,done) { 
        if(err) {
         res.render('index',{'user':0});
        }
        else {}
      });
});

app.get('/verify/:token',function (req,res){
  users.findOne({token:req.params.token},function (err,done){
    if(err){}
      else {
        if(done != null)
        { 
          done.confirmed=1;
          users.insert(done,function (err,done){
           if(err)
            {
              //TO DO ERROR
            }
          else {
            res.redirect('/');
          }
          });
        }
      else {
         res.redirect('/');
      }
      }
  });
});


app.post('/new',function (req,res){

function is_email(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
    } 
var rand = function() {
                  return Math.random().toString(36).substr(2); // remove `0.`
              };
              var token_gen = function() {
                  return rand() + rand(); // to make it longer
              };
//-------------------------------//
     var ms = {};
    if (is_email(req.body.uemail) === true) {
      console.log('checked email');
    users.findOne({email:req.body.uemail},{fields:{email:1}},function(err,doc){
      if (err)
      {
        //DO SMTH
      }
      else {
        console.log('no err');
        if(doc === null )
        {     
              console.log('creating token');
              var vtoken = token_gen();
              var vp = bcrypt.hashSync(req.body.p,bcrypt.genSaltSync(10));

              console.log('writing to users: \n confirmed:0,\nname: '+req.body.uname+',\nage:'+req.body.uage+',\ngender:'+req.body.ugen+',\ncity: '+req.body.ucity+',\nabout:'+req.body.uabout+',\nemail:'+req.body.uemail+',\npassword: '+vp+',\nregdate: '+Date.now()+',\ntoken:'+vtoken+',\nlang:"ru",\nuserpic:0');
              users.insert({confirmed:0,name:req.body.uname,age:req.body.uage,gender:req.body.ugen,city:req.body.ucity,about:req.body.uabout,email:req.body.uemail,password:vp,regdate:Date.now(),token:vtoken,lang:'ru',userpic:0});
              
                 var mailOptions = {
                     from: "Email Verification <no-reply@intplove.com>", // sender address 
                     to: req.body.uemail, // list of receivers 
                     subject: "Email verification", // Subject line 
                     text: "Click on the link to verify your email"
                     //,html: "<b>Hello world ✔</b>" // html body 
                 }
                 // send mail with defined transport object 
                 console.log('sending message');
                 smtpTransport.sendMail(mailOptions, function(error, response){
                  var ms = {};
                     if(error){
                         console.log(error);
                         console.log('reporting');
                         req.session.mail=req.body.uemail;
                         ms.trouble =0;
                         ms.mtext='success';
                         res.send(ms);
                     }else{
                         console.log("Message sent");
                         console.log('reporting');
                         req.session.mail=req.body.uemail;
                         ms.trouble =0;
                         ms.mtext='success';
                         res.send(ms);
                     }
                     smtpTransport.close(); // shut down the connection pool, no more messages 
                 });
          }
        else {
           ms.mtext='email exists'
           res.send(ms);
        }
      }// end of err's else
    });
    }   
    else {
      // INCORRECT EMAIL, SO WE SEND A NOTIFICATION
      res.send(ms);
    }
});

app.get('/seeuser',function (req,res){
  users.find({},function (err,done){
    res.send(done);
  });
});

app.get('/dropusers',function (req,res){
  users.remove();
  res.redirect('/');
});

app.post('/signin',function(req,res){
  vphr=req.body.phr;
  vlgn=req.body.lgn; // email
  console.log(vphr+" , "+vlgn);
   var  ms = {};
  ms.trouble=1;
  ms.mtext='db';
  temp
  users.findOne({mail:vlgn},function(err,confirmed){
    if (err)
      {res.send(ms);}
    else 
    {
      if(confirmed === null) 
      {
        ms.mtext='no user';
              res.send(ms);
      }
      else if (confirmed.confirmed)
      {console.log('we have found :'+JSON.stringify(confirmed));
         
          if(bcrypt.compareSync(vphr,confirmed.phr))
          {
          
          req.session.mail = confirmed.mail;
          req.session._id = confirmed._id;
          console.log("THAT'S WHAT I WROTE TO HIS COOKIES: "+JSON.stringify(req.session));
          ms.trouble = 0;
          ms.mtext= 'success';
          res.send(ms);
           }
           else {
            ms.mtext='wrong pas';
              res.send(ms);
              //WRONG PASSWORD
           }
         
      }
      else if (!confirmed.confirmed) {
        ms.mtext= 'success';
          res.send(ms);
      }
    }
  });
});

app.get('/logout',function (req,res){
  req.session.reset();
  res.redirect('/');
});



/// catch 404 and forwarding to error handler
app.use(function(req, res) {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('404');
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
app.listen(80,'188.166.52.72');
// zero downtime with naught
if (process.send) process.send('online');
process.on('message', function(message) {
  if (message === 'shutdown') {
    //Do whatever you need to do before shutdown (cleanup, saving stuff, etc.)
    process.exit(0);
  }
});