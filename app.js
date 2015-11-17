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
var db = require('monk')('localhost/tav'),temp_users = db.get('temp_user'),users = db.get('users');
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
  httpOnly: true
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
  res.render('index');
  var ms={};
  users.find({},{limit:20,sort: {regdate: 1}}, function (err,done) {
    if(err) {
     res.render('index',{'done':0});
    }
    else if(!done.length){
     res.render('index',{'done':0});
    }
    }
      else {
     res.render('index',{'done':JSON.stringify(done)});
    }
      }
  });
});

app.get('/verify/:token',function (req,res){
  temp_users.findOne({token:req.params.token},function (err,done){
    if(err){}
      else {
        if(done.length)
        {
          users.insert(done,function (err,done){
           if(err)
            {
              //TO DO ERROR
            }
          else {
            temp_users.remove({token:req.params.token});
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

var rand = function() {
    return Math.random().toString(36).substr(2); // remove `0.`
};
var token_gen = function() {
    return rand() + rand(); // to make it longer
};
var vtoken = token_gen();
var vp = bcrypt.hashSync(req.body.p,bcrypt.genSaltSync(10));

temp_users.insert({name:req.body.uname,age:req.body.uage,gender:req.body.ugen,city:req.body.ucity,about:req.body.uabout,email:req.body.uemail,password:vp,regdate:Date.now(),token:vtoken,lang:req.body.lang,userpic:0});

   var mailOptions = {
       from: "Email Verification <no-reply@intplove.com>", // sender address 
       to: req.body.uemail, // list of receivers 
       subject: "Email verification", // Subject line 
       text: "Click on the link to verify your email"
       //,html: "<b>Hello world ✔</b>" // html body 
   }
   // send mail with defined transport object 
   smtpTransport.sendMail(mailOptions, function(error, response){
    var ms = {};
       if(error){
           console.log(error);
           ms.trouble=1;
           res.send(ms);
       }else{
           console.log("Message sent");
           ms.trouble=0;
           res.send(ms);
       }
       smtpTransport.close(); // shut down the connection pool, no more messages 
   });

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