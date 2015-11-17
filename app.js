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
var db = require('monk')('localhost/tav'),insidemsg = db.get('insidemsg'),temp_users = db.get('temp_user'),users = db.get('users');
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
        user: "testtrialtest@yandex.ru",
        pass: "testingstuff"
    }
});

app.get('/sendit/:email',function (req,res){
  var mailOptions = {
    from: "Fred Foo ✔ <foo@blurdybloop.com>", // sender address 
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
 
app.get('/transitions',function(req,res){
  res.render('transitions');
});


app.get('/',function(req,res) {
  res.send('hello intplove');
});


app.post('/admin/insidemsg/remove',function(req,res){
  console.log('removing a message');
  var vmid = parseInt(req.body.mid);
  var pas = req.body.pas;
  if (pas != 'withoutthesecurity' || !vmid) {
    res.redirect('http://recentones.com');
  }
  else 
  { var ms={};
    ms.trouble=1;
    ms.mtext = 'db';
    insidemsg.remove({mid:vmid},function(err,done){
      if(err){
        res.send(ms);
      }
      else {
        ms.trouble=0;
        res.send(ms);
      }
    });
  }

});

app.post('/admin/insidemsg',function(req,res){
  console.log('creating message;');
  var vheading = req.body.heading;
  var vtextbody = req.body.textbody;
  var d = new Date();
  var vday = d.getDate().toString();
  var vmonth = d.getMonth()+1;
  vmonth = vmonth.toString();
  var vyear = d.getUTCFullYear().toString();
  console.log('beginning');
  if (vday.length===1){
         vday='0'+vday;
       }
  if (vmonth.length===1){
         vmonth='0'+vmonth;
       }
  var vregdateint= vyear+vmonth+vday;
  vregdateint = parseInt(vregdateint);
  var ms = {};
  ms.trouble=1;
  ms.mtext = 'db';
  console.log('middle');
  insidemsg.find({},{limit:1,sort:{mid:-1}},function(err,doc){
    if(err)
    {
      //clap your hands
      res.send(ms);
    }
   else {
    if(doc.length>0){
      console.log('end');
         var newid = doc[0].mid;
         newid++;
         console.log(newid);
         insidemsg.insert({mid: newid,heading: vheading,textbody: vtextbody,regdateint: vregdateint,regdate:{day:vday,month:vmonth,year:vyear}});
      ms.trouble=0;
      res.send(ms);
       }
       else {
         insidemsg.insert({mid: 1,heading: vheading,textbody: vtextbody,regdateint: vregdateint,regdate:{day:vday,month:vmonth,year:vyear}});
         ms.trouble=0;
      res.send(ms);
       }
   }
  });
});

app.get('/admax',function(req,res){
  console.log("CHECKING COOKIES: "+JSON.stringify(req.session)+" "+req.session.lgn);
  var lguser={};
   if(req.session.sKK76d === 'porC6S78x0XZP1b2p08zGlq')
   {
    var vratingnum;
   top.count({},function(err,c){
    if (err)
    {}
  else {
    vratingnum= c;

  }
  });
  var vplacenum; 
  places.count({},function(err,c){
    if (err)
    {}
  else {
    vplacenum= c;
    var vinterested ;
  clientmail.count({},function(err,c){
    if (err)
    {}
  else {
    vinterested= c;
    var vaccepts; 
    clients.count({},function(err,c){
    if (err)
    {}
  else {
    vaccepts= c;
    var market;
    adminplaces.count({},function(err,c){
      if(err)
      {}
      else
        market = c;
     {console.log(c);
      insidemsg.find({},{sort:{mid:-1}},function(err,c){
        if(err)
      {}
      else{
              res.render('admin',{'ratingnum':vratingnum,'placenum':vplacenum,'interested':vinterested,'accepts':vaccepts,'market':market,'doc':c});

      }
      });
 }
    });
  }
  });
  }
  });
  }
  });
}

   else {
   res.render('auth');
 }

});


app.post('/admin/removeap/:pid',function(req,res){
  var pas = req.body.uu;
  var vpid = parseInt(req.params.pid);
  if (pas != 'withoutthesecurity' || !vpid) {
    res.redirect('http://recentones.com');
  }
  else 
  { var ms={};
    ms.trouble=1;
    ms.mtext = 'db';
    adminplaces.remove({pid:vpid},function(err,done){
      if(err){
        res.send(ms);
      }
      else {
        ms.trouble=0;
        res.send(ms);
      }
    });}
});

app.post('/admax',function(req,res){
  if (checkip(req.ip)) {    
    console.log('BANNED IP REQUESTING ADMIN');
    res.redirect('http://ya.ru');
  }
  var pp = req.body.pass;
  var ll = req.body.ll;
  console.log(pp+' '+ll);
  var ppe = 'dangerous';
  var lle = 'quitedangerous';
  if(pp === ppe && ll === lle && req.ip === '188.226.189.180') {
//---------------admin cookies-------------------

          req.session.sKK76d = 'porC6S78x0XZP1b2p08zGlq';
          res.redirect('http://recentones.com/admax');
//---------------admin cookies end-----------------
  }
  else {
    if(adminrequestip === req.ip)
    {
      if(attempt === 3)
      {
        console.log('IP BANNED :'+req.ip);
        ban.push(req.ip);
      }
      else{
        var leftattempt = 3 - attempt;
        vmessage="<h5 style='color:#c35;'> Осталось "+leftattempt+" попытки ввода</h5>";
        attempt++;
        res.render('auth',{'message':vmessage});
      }
    }
    else
    {adminrequestip = req.ip;
     var leftattempt = 3 - attempt;
     vmessage="<h5 style='color:#c35;'> Осталось "+leftattempt+" попытки ввода</h5>";
        attempt++;
        res.render('auth',{'message':vmessage});
    }
  }
});

app.get('/admin/addrating',function(req,res){
  if(req.ip === '188.226.189.180' || req.session.sKK76d === 'porC6S78x0XZP1b2p08zGlq')
  {res.render('addrating');}
  else{
    res.redirect('http://ya.ru');
  }
});

app.get('/admin/addcl',function(req,res){
  if(req.ip === '188.226.189.180' || req.session.sKK76d === 'porC6S78x0XZP1b2p08zGlq')
  {res.render('addcl');}
  else{
    res.redirect('http://ya.ru');
  }
});

app.post('/admin/addcl',function(req,res){

});

app.post('/admin/removecl/:cid',function(req,res){
  var pas = req.body.uu;
  var cid = parseInt(req.params.cid);
  if (pas != 'withoutthesecurity' && cid) {
    res.redirect('http://recentones.com');
  }
  else 
  {var vpid = parseInt(req.params.cid);
    var ms={};
    ms.trouble=1;
    ms.mtext = 'db';
    clients.remove({clid:cid},function(err,done){
      if(err){
        res.send(ms);
      }
      else {
        ms.trouble=0;
        res.send(ms);
      }
    });}
});

app.get('/admin/ratinglist',function(req,res){
  if(req.ip === '188.226.189.180'  || req.session.sKK76d === 'porC6S78x0XZP1b2p08zGlq')
  {
    top.find({},function(err,doc){
    if(err)
    {
      res.send('DB ERR')
    }
    else {
      if(doc.length>0)
      {
         res.render('ratinglist',{'doc':doc});
      }
      else{
         res.send('NO RARINGS - EMPTY DB');
      }
    }
  });
  }
  else{
    res.redirect('http://ya.ru');
  }
});

app.get('/admin/clientlist',function(req,res){
  if(req.ip === '188.226.189.180'  || req.session.sKK76d === 'porC6S78x0XZP1b2p08zGlq')
  {
    clients.find({},function(err,done){
    if(err)
    {
      res.send('DB ERR')
    }
    else {
      console.log(done);
      if(done.length>0)
      {
         res.render('clientlist',{'doc':done});
      }
      else{
         res.send('NO RARINGS - EMPTY DB');
      }
    }
  });
  }
  else{
    res.redirect('http://ya.ru');
  }
});

app.get('/admin/cmlist',function(req,res){
  if(req.ip === '188.226.189.180'  || req.session.sKK76d === 'porC6S78x0XZP1b2p08zGlq')
  {
    clientmail.find({},function(err,doc){
    if(err)
    {
      res.send('DB ERR')
    }
    else {
      if(doc.length>0)
      {
         res.render('cmlist',{'doc':doc});
      }
      else{
         res.send('EMPTY DB');
      }
    }
  });
  }
  else{
    res.redirect('http://ya.ru');
  }
});

app.get('/admin/redactrating/:id',function(req,res){
  if(req.ip === '188.226.189.180'  || req.session.sKK76d === 'porC6S78x0XZP1b2p08zGlq')
  {
    var vrid = parseInt(req.params.id);
   top.findOne({rid:vrid},function(err,doc){
    if(err){
      //call houston
    }
    else{
      console.log(doc);
      res.render('redactrating',{'doc':doc});
    }
   });
  }
  else{
    res.redirect('http://ya.ru');
  }
});

app.post('/admin/redactrating/:id',function(req,res){
   var vrid=parseInt(req.params.id);
   var vrn = req.body.ratingname,
       vweb = req.body.web,
       vp1 = req.body.r1,
       vp2 = req.body.r2,
       vp3 = req.body.r3,
       vp4 = req.body.r4,
       vp5 = req.body.r5,
       vp6 = req.body.r6,
       vp7 = req.body.r7,
       vp8 = req.body.r8,
       vp9 = req.body.r9,
       vp10 = req.body.r10,
       vpid1 = parseInt(req.body.pid1),
       vpid2 = parseInt(req.body.pid2),
       vpid3 = parseInt(req.body.pid3),
       vpid4 = parseInt(req.body.pid4),
       vpid5 = parseInt(req.body.pid5),
       vpid6 = parseInt(req.body.pid6),
       vpid7 = parseInt(req.body.pid7),
       vpid8 = parseInt(req.body.pid8),
       vpid9 = parseInt(req.body.pid9),
       vpid10 = parseInt(req.body.pid10);
   var dd= new Date();
      var vday = dd.getDate().toString();
      if (vday.length===1){
        vday='0'+vday;
      }
      var vmonth = dd.getMonth()+1;
      vmonth = vmonth.toString();
      if (vmonth.length===1){
        vmonth='0'+vmonth;
      }
      var vyear = dd.getUTCFullYear().toString();
      var fulldate = vyear+vmonth+vday;
      fulldate = parseInt(fulldate);
   top.update({rid:vrid},{$set:{ratingname:vrn,lastredact:fulldate,web:vweb,places:{1:vp1,2:vp2,3:vp3,4:vp4,5:vp5,6:vp6,7:vp7,8:vp8,9:vp9,10:vp10},pids:{1:vpid1,2:vpid2,3:vpid3,4:vpid4,5:vpid5,6:vpid6,7:vpid7,8:vpid8,9:vpid9,10:vpid10}}});
   res.redirect('http://recentones.com/admin/ratinglist');
});

app.post('/admin/removerating/:id',function(req,res){
  var pas = req.body.uu;
  if (pas != 'withoutthesecurity') {
    res.redirect('http://recentones.com');
  }
  else 
  {var vrid = parseInt(req.params.id);
    var ms={};
    ms.trouble=1;
    ms.mtext = 'db';
    top.remove({rid:vrid},function(err,done){
      if(err){
        res.send(ms);
      }
      else {
        ms.trouble=0;
        res.send(ms);
      }
    });}
});



//EMPTY DB (STILL PLACES NEEDS CORRECTION) NAND DELETE PICTURES
app.post('/admin/clear',function(req,res){
  console.log(req.ip+" ENTERED /CLEAR");
  var clearpass = 'proventobewrong';
  if(req.body.token = clearpass) {
    places.remove({},function (err,done){
      console.log('all records deleted');
      res.send('all records deleted');
    });

     var removepath =  __dirname +"/public/images/places"; 
    fs.remove(removepath, function(err){
      if (err) {return console.error(err);}

         console.log("/PLACES DELETED ")
    });
  }

  else {
    res.send('ERROR');}
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