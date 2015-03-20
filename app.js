var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');
var bcrypt = require('bcrypt');

var mongo = require('mongodb');
var db = require('monk')('localhost/tav')
  , places = db.get('places'),top = db.get('top'),clientmail = db.get('clientmail'),clients = db.get('clients');
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

//var lguser = {};
//app.use(function(req,res,next){
//  console.log("CHECKING COOKIES: "+JSON.stringify(req.session)+" "+req.session.lgn);
//   if(req.session.admin === 1){
//    lguser = req.session;
//    next();}
//   else if(req.session.hostel === 1) 
//    {lguser = req.session;
//      next();}
//   else {
//   if(req.session && req.session.lgn){
//     users.findOne({mail:req.session.mail},function(err,user){
//      console.log('found user: '+JSON.stringify(user));
//      if(err){
//        next();
//      }
//      else {
//        if(user.length>0 && user.hostel != 1){
//        lguser = user;
//        delete lguser.phr;
//        delete lguser._id;
//        delete lguser.enquiries;
//        delete lguser.regdate;
//        req.session = lguser;
//        console.log('USER WITH COOOOOKIEES !');
//        next();}
//      else {next();}
//      } 
//     });
//   }
//   else {
//    next();
//   }
// }
//});

//app.get('/logout',function(req,res){
//  console.log('trying to logout');
//  req.session.reset();
//  console.log(JSON.stringify(req.session));
//  res.redirect('/');
//});


//SUBDOMAIN MAGIC 


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
  var userAgent=req.headers['user-agent'];
  var uacheck = userAgent.indexOf("iPhone") != -1 ;
  console.log(uacheck);
  var d = new Date();
  //res.send('UNDER CONSTRUCTION');
  places.find({},{ limit:5,sort : { founddateint : -1 } },function(err,doc){
    if(err)
    {
      res.render('emptyindex');
    }
    else {
      if(doc.length>0)
      { var months = ["Январь","Февраль","Март","Апрель","Июнь","Июль","Август","Сентябрь","Октыбрь","Ноябрь","Декабрь"];
        var mnum = d.getMonth();
        var mnumprocessed= mnum+1;
        if(doc.length === 5)
        {doc = doc.splice(0, 4);
          console.log('SENDING '+doc.length+'DOCUMENTS');
                res.render('index',{'doc':JSON.stringify(doc),'more':1,'month':months[mnum],'currentmonth':mnumprocessed});}
        else {
         res.render('index',{'doc':JSON.stringify(doc),'more':0,'month':months[mnum],'currentmonth':mnumprocessed}); 
        }
      }
      else{
        res.render('emptyindex');
      }
    }
  });
});

  app.post('/more',function(req,res){
    console.log(req.body.mult);
    var lastpid = parseInt(req.body.mult);
    var ms= {};
    ms.trouble = 1;
    ms.mtext = 'db';
    console.log(lastpid)
    //places.find({pid: { $gt : lastpid }},{ limit:5,sort:{pid:1} },function(err,doc){
      places.find({pid:{$lt: lastpid}},{limit:5,sort:{founddateint:-1}},funciton(err,doc){
    if(err)
    {
      res.send(ms);
    }
    else {
      console.log('MORE DOC IS:'+doc);
      if(doc.length === 0)
      {
        ms.trouble = 1;
        ms.more = 0;
        ms.mtext = 'empty';
        res.send(ms);
      }
      else if(doc.length===5)
      { 
        doc = doc.splice(0, 4);
        ms.trouble = 0;
        ms.more = 1;
        ms.mdata = doc;
        res.send(ms);
      }
      else{
        ms.trouble = 0;
        ms.more = 0;
        ms.mdata = doc;
        res.send(ms);
      }
    }
  });
  });

app.post('/m/keepintouch',function(req,res,next){
  req.url='/keepintouch';
  next();
});

app.post('/keepintouch',function(req,res){
  var cmail = req.body.cm;
  function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
 }  
    var ms = {};
    ms.trouble = 1;
    ms.mtext = 'spelling';
    if (validateEmail(cmail) === true) {
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
     clientmail.find({},{ limit:1,sort : { cid : -1 } },function(err,doc){
      if(doc.length>0)
      { 
        var newid = doc[0].cid+1;
        clientmail.insert({cid:newid,mail:cmail,regdate:fulldate});
        ms.trouble=0;
        res.send(ms);
      }
      else {
        clientmail.insert({cid:1,mail:cmail,regdate:fulldate});
        ms.trouble=0;
        res.send(ms);
      }
    });
}
    else {
      res.send(ms);
    }
});

app.get('/admin/simulateclient',function(req,res){
 clients.insert({clid:1,nameru:'Одесса-мама',msnum:0});
 clients.find({},function(err,done){
  if(err)
  {
    res.send('DB ERROR');
  }
  else {
    res.render('clientlist',{'doc':done});
  }
 });
});

app.get('/conf/:cid',function(req,res){
  var cid = parseInt(req.params.cid);
  clients.findOne({clid:cid},function(err,client){
   if(err)
   {
    // HANDLE ERROR
   }
   else {
    if(client){
      res.render('confirmation',{'doc':client});
    }
    else {
      res.render('404');
    }
   }
  });
}); 


app.post('/conf/:cid',function(req,res){
  console.log('going to insert message');
  var cid = parseInt(req.params.cid);
  clients.findOne({clid:cid},function(err,client){
    if(err)
   {
     // HANDLE ERROR
   }
   else {
    if(client){
      //GET DATA
      //PUSH IT  TO DB
      var ms = {};
      ms.trouble = 1;
      console.log(req.body);
      var cdate = req.body.cdate;
      var ctime = req.body.ctime;
      var ccontact = req.body.contact;
      var ccomment = req.body.comments;
      var newmsnum = client.msnum+1;
      // -- date --
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
      fulldate = parseInt(fulldate)
      // -- date --
      console.log(ccontact);
      if(!cdate || !ctime || !ccontact)
      {
        ms.mtext('data');
        res.send(ms);
      }
      else {
        //eval("clients.update({clid:cid},{$set:{msnum:newmsnum,ms"+newmsnum+":{regdate:fulldate,shdate:cdate,shtime:ctime,comment:ccomment,contact:ccontact}});");
        var tempobj = {regdate:fulldate,shdate:cdate,shtime:ctime,comment:ccomment,contact:ccontact};
        if(newmsnum>1){
          var updmessages = client.messages;
          updmessages.push(tempobj);
          console.log(updmessages);
                    clients.update({clid:cid},{$set:{msnum:newmsnum,messages:updmessages}});
                    ms.trouble = 0;
                    res.send(ms);
        }
        else
          {        var updmessages = [];
                   updmessages.push(tempobj);
                    clients.update({clid:cid},{$set:{msnum:newmsnum,messages:updmessages}});
                    ms.trouble = 0;
                    res.send(ms);}
    }
  }
    else {
      console.log('CONFIRMATION POST ERROR');
      ms.mtext = 'db';
      res.send(ms);
    }
   }
  })
});

app.get('/msg/:cid',function(req,res){
  if(req.ip === '188.226.189.180' || req.session.sKK76d === 'porC6S78x0XZP1b2p08zGlq')
    { var cid = parseInt(req.params.cid);
      clients.findOne({clid:cid},function(err,done){
        if(err)
        {
          //HANDLE
        }
        else {
          console.log('in msg'+JSON.stringify(done));
          res.render('clientmessages',{'placename':done.nameru,'doc':done.messages});
        }
        });
    }
  else {
    res.redirect('http://yandex.ru');
  }
});


app.get('/m',function(req,res){
  places.find({},{ limit:9,sort : { founddateint: -1 } },function(err,doc){
    if(err)
    {
      res.render('memptyindex');
    }
    else {
      if(doc.length>0)
      {
        //res.render('index',{'places':doc});
        res.render('mindex',{'doc':JSON.stringify(doc)});
      }
      else{
        res.render('memptyindex');
      }
    }
  });
});

app.get('/m/top',function(req,res){
  top.find({},function(err,doc){
    if(err)
    {
      res.redirect('http://recentones.com');
    }
    else
    { 
      if(doc.length>0)
      { 
        res.render('mtop',{'doc': JSON.stringify(doc)});}
      else {
        res.render('emptytop');
      }
    }

  });
});

app.get('/m/search',function(req,res){
  res.render('msearch');
});

app.get('/m/misc/:mid',function(req,res){
  var id = parseInt(req.params.mid);
  switch (id) {
    case(1):
    res.render('mcontacts');
    break
    case(2):
    res.render('mcontacts');
    break
    case(3):
    res.render('mcontacts');
    break
    default:
    res.render('mindex');
    break
  }
});

app.get('/m/places/:id',function(req,res){
  var vpid = parseInt(req.params.id);
  places.findOne({pid:vpid},function(err,doc){
    if(err){
      res.render('404');
    }
    else {
      if(doc)
      {
        res.render('apiplace',{'doc':doc});
      }
      else {
        res.render('404')
      }
    }
  });
});

app.get('/api/places/:id',function(req,res){
  var vpid = parseInt(req.params.id);
  places.findOne({pid:vpid},function(err,doc){
    if(err){
      res.render('404');
    }
    else {
      console.log(doc.length);
      if(doc)
      {
        res.render('apiplace',{'doc':doc});
      }
      else {
        res.render('404')
      }
    }
  });
});

app.get('/api/recent',function(req,res){
  console.log('API REQUEST: LIST');
  places.find({},{ limit:9,sort : { founddateint : -1 } },function(err,doc){
     var ms ={};
     ms.trouble = 1;
     ms.mtext = 'db';
    if(err)
    {
      res.send(ms);
    }
    else {
      if(doc.length>0)
      {
        ms.trouble = 0;
        ms.data = doc;
        res.send(ms);
      }
      else{
        ms.mtext = 'empty';
        res.send(ms);
      }
    }
  });
});

app.get('/dropplaces',function(req,res){
  if(req.ip === '188.226.189.180' || req.session.sKK76d === 'porC6S78x0XZP1b2p08zGlq')
    {places.remove({},function(err,done){
        if(err)
        {
          res.send('98');
        }
        else {
          res.send('SUCCESS');
        }
        });}
  else {
    res.redirect('http://yandex.ru');
  }
  });

app.post('/removecm',function(req,res){

     var ms={};
     var pas = req.body.ps;

     if(pas === 'removethatshit')
    {clientmail.remove({},function(err,done){
        ms.trouble = 1;
        if(err)
        {
          res.send(ms);
        }
        else {
          ms.trouble = 0;
          res.send(ms);
        }
        });}
      else {
       ms.trouble=1;
       res.send(ms);
      }
  });

app.post('/removecl',function(req,res){

     var ms={};
     var pas = req.body.ps;

     if(pas === 'removethatshit')
    {clients.remove({},function(err,done){
        ms.trouble = 1;
        if(err)
        {
          res.send(ms);
        }
        else {
          ms.trouble = 0;
          res.send(ms);
        }
        });}
      else {
       ms.trouble=1;
       res.send(ms);
      }
  });

//app.get('/droptop',function(req,res){
//  if(req.ip === '188.226.189.180' || req.session.sKK76d === 'porC6S78x0XZP1b2p08zGlq')
//    {top.remove({},function(err,done){
//        if(err)
//        {
//          res.send('98');
//        }
//        else {
//          res.send('SUCCESS');
//        }
//        });}
//    else {
//      res.redirect('http://yandex.ru');
//    }
//  });

app.get('/example',function(req,res){
  res.render('examples');
});

app.get('/about',function(req,res){
  res.render('about');
});
app.get('/top',function(req,res){
  top.find({},function(err,doc){
    if(err)
    {
      res.redirect('http://recentones.com');
    }
    else
    { 
      if(doc.length>0)
      { 
        res.render('top',{'doc': JSON.stringify(doc)});}
      else {
        res.render('emptytop');
      }
    }

  });
});

app.get('/misc/:mid',function(req,res){
  var id = parseInt(req.params.mid);
  switch (id) {
    case(1):
    res.render('contacts');
    break
    case(2):
    res.render('manifesto');
    break
    case(3):
    res.render('partnership');
    break
    default:
    res.render('index');
    break
  }
});

app.get('/places/:id',function(req,res){
  var vpid = parseInt(req.params.id);
  places.findOne({pid:vpid},function(err,doc){
    if(err){
      console.log('DB ERROR');
      res.render('404');
    }
    else {
      console.log(doc);
      if(doc)
      { 
        if(doc.pano === 1)
        res.render('place',{'doc':doc});
        else {
          res.render('emptyplace',{'doc':doc});
        }
      }
      else {
        res.render('404')
      }
    }
  });
});

app.get('/search',function(req,res){
  res.render('search');
});

app.post('/srch',function(req,res){
  var query = req.body.query;
  console.log(query);
  var ms = {};
  ms.trouble = 1;
  ms.mtext = 'db'
  places.find({placename:query},function(err,doc){
   if(err){
     res.send(ms);
   }
   else {
    console.log('doc is: '+doc);
    if(doc.length>0)
    { 
      ms.trouble = 0;
      res.send(JSON.stringify(doc));
    }
    else {
      ms.mtext='empty';
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
    res.render('admin',{'ratingnum':vratingnum,'placenum':vplacenum,'interested':vinterested,'accepts':vaccepts});
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

ban=[];
function clearban() {
   if(ban.length>0)
   {console.log(ban[0]+' CLEARED FROM BAN');
      ban.splice(0,1);}
   else {
    console.log('EMPTY BAN');
   }
}
setInterval(clearban,900000); 

var adminrequestip='0';
var attempt=0;

function checkip(ip) {
  for (var i = 0;i<ban.length;i++) {
    if(ip === ban[i]) {
      return true
    }
  }
  return false
}
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
          res.render('admin');
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

app.post('/admin/removeplace/:id',function(req,res){
  var pas = req.body.uu;
  if (pas != 'withoutthesecurity') {
    res.redirect('http://recentones.com');
  }
  else 
  {var vpid = parseInt(req.params.id);
    var ms={};
    ms.trouble=1;
    ms.mtext = 'db';
    places.remove({pid:vpid},function(err,done){
      if(err){
        res.send(ms);
      }
      else {
        ms.trouble=0;
        res.send(ms);
      }
    });}
});

app.post('/admin/addrating',function(req,res){
  if(!req.body.ratingname)
  {
    res.send('RATINGNAME ABSENT')
  }
  else {
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

    top.find({},{ limit:1,sort : { rid : -1 } },function(err,doc){
      if(err)
      {
        //call houston
      }
    else {
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
      if(doc.length>0){
       var newid = doc[0].rid+1;
       //top.insert({ratingname:req.body.ratingname,regdate:fulldate,web:'www.ya.ru',rid:newid,places:{1:'Один',2:'Два',3:'Три',4:'Четыре',5:'Пять',6:'Шесть',7:'Семь',8:'Восемь',9:'Девять',10:'Десять'},pids:{1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10}});
       top.insert({ratingname:vrn,rid:newid,lastredact:fulldate,regdate:fulldate,web:vweb,places:{1:vp1,2:vp2,3:vp3,4:vp4,5:vp5,6:vp6,7:vp7,8:vp8,9:vp9,10:vp10},pids:{1:vpid1,2:vpid2,3:vpid3,4:vpid4,5:vpid5,6:vpid6,7:vpid7,8:vpid8,9:vpid9,10:vpid10}});
       res.redirect('http://recentones.com/admin/ratinglist');
      }
      else
      {
       //top.insert({ratingname:req.body.ratingname,regdate:fulldate,web:'www.ya.ru',rid:1,places:{1:'Один',2:'Два',3:'Три',4:'Четыре',5:'Пять',6:'Шесть',7:'Семь',8:'Восемь',9:'Девять',10:'Десять'},pids:{1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10}});
       top.insert({ratingname:vrn,rid:1,lastredact:fulldate,regdate:fulldate,web:vweb,places:{1:vp1,2:vp2,3:vp3,4:vp4,5:vp5,6:vp6,7:vp7,8:vp8,9:vp9,10:vp10},pids:{1:vpid1,2:vpid2,3:vpid3,4:vpid4,5:vpid5,6:vpid6,7:vpid7,8:vpid8,9:vpid9,10:vpid10}});
       res.redirect('http://recentones.com/admin/ratinglist');
      }
    }
    });
  }
});

app.get('/admin/placelist',function(req,res){
  if(req.ip === '188.226.189.180'  || req.session.sKK76d === 'porC6S78x0XZP1b2p08zGlq')
  {
    places.find({},function(err,doc){
    if(err)
    {
      res.send('DB ERR')
    }
    else {
      if(doc.length>0)
      {
         res.render('placelist',{'doc':doc});
      }
      else{
         res.send('NO PLACES - EMPTY DB');
      }
    }
  });
  }
  else{
    res.redirect('http://ya.ru');
  }
});

app.get('/admin/addplace',function(req,res){
  if(req.ip === '188.226.189.180'  || req.session.sKK76d === 'porC6S78x0XZP1b2p08zGlq')
  {res.render('addplace');}
  else{
    res.redirect('http://ya.ru');
  }
});

app.post('/admin/addplace',function(req,res){

});


//done with subdomains





console.log('FIRST BREAKPOINT');


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
 



//UPDATE HOSTELS PAGE (STILL PACES NEEDS AN UPDATE)
app.post('/adminsr/updatepage', function(req,res) {
	var placenametest = req.body.placename;

	places.findOne({hname: placenametest}, function(err,singleplace){
       var placedata = JSON.stringify(singleplace,null,2);
        var nameeng = singleplace.nameen;
        var updateplacename = singleplace.placename;
		res.render('update', {'jsondata' : placedata,'nameeng':nameeng, 'placename': updateplacename});
	});
	
});




//app.post('/uploadauth', function(req,res){
//  var masterlogin = 'test';
//  var masterpassword = 'test';
//  var login = req.body.login;
//  var pass = req.body.password;
//  console.log(pass);
//  console.log(login);
//  console.log("JESUS");
//  if (masterlogin != login || masterpassword != pass ) 
//                                                        {
//                                                          res.render('uploadauth');
//                                                        }
//  else 
//      {
//        res.render('upload');
//      }                                                      
//
//});  


app.post('/admin/simulateplace',function(req,res){
   places.find({},{limit:1,sort:{pid:-1}},function(err,doc){
     if(err){
      res.send('db error');
     }
     else {
       console.log('DOC LENGTH: '+doc.length)
       var d = new Date();
       var vday = d.getDate().toString();
       var vmonth = d.getMonth()+1;
       var vyear = d.getUTCFullYear();
       if (vday.length===1){
         vday='0'+vday;
         vday=parseInt(vday);
       }
       vmonth = vmonth.toString();
       if (vmonth.length===1){
         vmonth='0'+vmonth;
       }
       vmonth=parseInt(vmonth);
       if(doc.length>0){
         var newid = doc[0].pid;
         newid++;
         places.insert({
         placename:['Тестхостел','Testhostel','testhostel','тестхостел'],
         placenameru : 'Тестхостел',
         placenameen : 'Testhostel',
         regdate:{day:vday,month:vmonth,year:vyear},
         founddateint:20140301,
         founddate:{day:'01',month:'02',year:'2014'},
         adressru: 'Какаятосраная наб. дом 10 к.3 кв. 12',
         adressen: 'Somefucking emb. 10 bld.3 flat 12',
         contacts:{phone:'+7XXXXXXXXXX',www:'http://recentones.com/bobo'},
         pid: newid,
         pano:1,
         mainpreview:'/bootstrap/images/sample1.jpg',
         xml:'/bootstrap/images/emptypano.xml'
         });
         res.redirect('http://recentones.com/admin/placelist');
         console.log('PLACE SIMULATED');
       }
       else{
         places.insert({
         placename:['Тестхостел','Testhostel','testhostel','тестхостел'],
         placenameru : 'Тестхостел',
         placenameen : 'Testhostel',
         founddateint:20140301,
         regdate:{day:vday,month:vmonth,year:vyear},
         founddate:{day:'01',month:'02',year:'2014'},
         adressru: 'Какаятосраная наб. дом 10 к.3 кв. 12',
         adressen: 'Somefucking emb. 10 bld.3 flat 12',
         contacts:{phone:'+7XXXXXXXXXX',www:'http://recentones.com/bobo'},
         pid: 1,
         pano:1,
         mainpreview:'/bootstrap/images/sample1.jpg',
         xml:'/bootstrap/images/emptypano.xml'
         });
         res.redirect('http://recentones.com/admin/placelist');
         console.log('PLACE SIMULATED');
       }
     }
   });
});

app.post('/admin/simulateemptyplace',function(req,res){
   places.find({},{limit:1,sort:{pid:-1}},function(err,doc){
     if(err){
      res.send('db error');
     }
     else {
       console.log('DOC LENGTH: '+doc.length)
       var d = new Date();
       var vday = d.getDate();
       var vmonth = d.getMonth()+1;
       var vyear = d.getUTCFullYear();
       if(doc.length>0){
         var newid = doc[0].pid;
         newid++;
         places.insert({
         placename:['Тестхостел','Testhostel','testhostel','тестхостел'],
         placenameru : 'Тестхостел',
         placenameen : 'Testhostel',
         founddateint:20140301,
         founddate:{day:'01',month:'02',year:'2014'},
         regdate:{day:vday,month:vmonth,year:vyear},
         adressru: 'Какаятосраная наб. дом 10 к.3 кв. 12',
         adressen: 'Somefucking emb. 10 bld.3 flat 12',
         contacts:{phone:'+7XXXXXXXXXX',www:'http://recentones.com/bobo'},
         pid: newid,
         pano:0,
         mainpreview:'/bootstrap/images/sample1.jpg',
         xml:'/bootstrap/images/emptypano.xml'
         });
         res.redirect('http://recentones.com/admin/placelist');
         console.log('PLACE SIMULATED');
       }
       else{
         places.insert({
         placename:['Тестхостел','Testhostel','testhostel','тестхостел'],
         placenameru : 'Тестхостел',
         placenameen : 'Testhostel',
         founddateint:20140301,
         founddate:{day:'01',month:'02',year:'2014'},
         regdate:{day:vday,month:vmonth,year:vyear},
         adressru: 'Какаятосраная наб. дом 10 к.3 кв. 12',
         adressen: 'Somefucking emb. 10 bld.3 flat 12',
         contacts:{phone:'+7XXXXXXXXXX',www:'http://recentones.com/bobo'},
         pid: 1,
         pano:0,
         mainpreview:'/bootstrap/images/sample1.jpg',
         xml:'/bootstrap/images/emptypano.xml'
         });
         res.redirect('http://recentones.com/admin/placelist');
         console.log('PLACE SIMULATED');
       }
     }
   });
});



app.post('/testnopanoupload',function(req,res){
  var vplacename = 'testhostel';
  var vhostelid = 1;
  var vppredir = 'http://topandviews.ru/hostels/testhostel';

  if(req.body.custom) {
    vplacename = req.body.placename;
    vhostelid = req.body.hostelid;
    vppredir = 'http://topandviews.ru/hostels/'+vplacename;
  }

  hostels.insert({placename :vplacename,
         nameru : 'Тестхостел',
         nameen : 'Testhostel',
         aderssru: 'Какаятосраная наб. дом 10 к.3 кв. 12',
         adressen: 'Somefucking emb. 10 bld.3 flat 12',
         coord: [37.5996429,55.7508191],
         skype: 'SKYPELOG',
         vk : 'http://vk.com',
         fb : 'http://ya.ru',
         tw: 'http://google.com',
         wifi:'yes',
         telephone : '+782764236452',
         www : 'http://d3.ru',
         ppredir : vppredir,
         hostelid:vhostelid,
         fid : 1,
         mid : 1,
         oid : 1,
         city : 'moscow',
         country : 'russia',
         yearnow : 2014,
         sepgenders:'yes',
         subdist:'300',
         neartrnsp:'sub',
         pano : 0,
         offrqntt : 0,
         enquiries : {all:0,accepted:0},
         ownclients : 0

         });
    hostels.findOne({hostelid:vhostelid},function(err,found){
     if(err)
     {
      console.log('ERROR from DB while executing findOne');
      res.redirect('http://topandviews.ru/admin')
     }
   else{
    if(found.city)
    {
      console.log('----------SUCCESFULY SIMULATED SUBMITION--------------');
      res.redirect(vppredir);
    }
    else {
      console.log('returned empty doc after submission');
      res.redirect('http://topandviews.ru/admin');
    }
   }
    });
     
});
//app.post('/upload',function(req,res) {
//	console.log('UPLOAD SEQUENCE');
// 
////AUTH NEEDED HERE/ Something simple like hardcoded passphrase, can be passed through req.body
//if(req.body.pano === 0){
//    if(
//    req.body.hid === undefined ||
//    req.body.nameru === undefined||
//    req.body.nameen === undefined||
//    req.body.coord === undefined||
//    req.body.postn === undefined||
//     req.body.telephone === undefined||
//    req.body.www === undefined||
//    req.body.ppredir === undefined||
//    req.body.fid === undefined ||
//    req.body.oid === undefined ||
//    req.body.mid  === undefined ||
//    req.body.city  === undefined||
//    req.body.country === undefined||
//    req.body.yearnow  === undefined||
//    req.body.adressru === undefined||
//    req.body.adressen === undefined||
//    erq.body.wifi === undefined||
//    req.body.vk  === undefined||
//    req.body.fb === undefined||
//    req.body.tw === undefined||
//    req.body.skype === undefined||
//    req.body.placename  === undefined
//    )
//      
//    {
//      res.send('Some of the fields were empty, try again. If you see this tell IT to rewrite this so it would not submit the form until fuly cmpleted, and check if there is security');
//     }
//   else {
//       
//      var vhid = req.body.hid,
//      vnameru = req.body.nameru,
//          vnameen = req.body.nameen,
//          vtelephone = req.body.telephone,
//          vwww = req.body.www,
//          vctype = req.body.ctype,
//          vpostn = req.body.postn,
//          vcoord = req.body.coord,
//          vppredir = req.body.ppredir,
//          vfid = req.body.fid ,
//           foid = req.body.oid ,
//           vmid = req.body.mid ,
//          vcity = req.body.city,
//          vvk = req.body.vk,
//          vfb = req.body.fb,
//          vtw = req.body.tw,
//          vskype = req.body.skype,
//          vwifi  = req.body.wifi,
//          vcountry = req.body.country,
//          vyearnow = req.body.yearnow,
//           vadressru = req.body.adressru,
//           vadressen = req.body.adressen;
//
//      hostels.insert({placename : vplacename,
//         nameru : vnameru,
//         nameen : vnameen,
//         aderssru: vadressru,
//         adressen: vadressen,
//         coord: vcoord,
//         postn: vpostn,
//         vk : vvk,
//         fb : vfb,
//         tw: vtw,
//         skype:vskype,
//         wifi:vwifi,
//         telephone : vtelephone,
//         www : vwww,
//         ppredir : vppredir,
//         hostelid:vhid,
//         fid : vfid,
//         mid : vmid,
//         oid : foid,
//         city : vcity,
//         country : vcountry,
//         yearnow : vyearnow,
//         pano : 0,
//         offrqntt : 0,
//         enquiries : {all:0,accepted:0},
//         ownclients : 0,
//
//         });
//   }
//}
//else
//{if (req.body.hid === undefined||
//  req.body.nameru === undefined||
//  req.body.nameen === undefined||
//  req.body.coord === undefined||
//  req.body.postn === undefined||
//   req.body.telephone === undefined||
//  req.body.www === undefined||
//  req.body.ppredir === undefined||
//  req.files.mainpreview.name === undefined||
//  req.body.fid === undefined ||
//  req.body.oid === undefined ||
//  req.body.mid  === undefined ||
//  req.body.city  === undefined||
//  req.body.country === undefined||
//  req.body.yearnow  === undefined||
//  req.body.adressru === undefined||
//  req.body.adressen === undefined||
//  req.body.vk  === undefined||
//    req.body.fb === undefined||
//    req.body.tw === undefined||
//    req.body.wifi === undefined||
//    req.files.xml.name === undefined||
//  req.body.placename  === undefined||
//  req.body.xmlqntt === undefined||
//  req.body.imgqntt === undefined)
//  //ctype is for how close it is to the citycenter
// //wi-fi and parking should be added
//  {res.send('Something wrong with your data, try again');}
//
//     //else{
//     //          //it was else{return true;}
//     //    
//     //              return true;
//     //         }
//     else{
//          console.log('GOING TO CHECK IMAGES')
//         if ( imgcheck(photonum) === true )
//         
//             {var checkdir = __dirname +"/public/images/places/"
//         fs.ensureDir(checkdir, function(err) {
//         if (err === null){
//         console.log(checkdir+'exists');}
//         });
//         var photonum = req.body.imgqntt;
//         var vplacename = req.body.placename;
//         for (i=0;i<photonum;i++) {
//           eval('var vimg_'+i+';');
//           console.log(i+' VARIABLE CREATED');
//         }
//         
//         var vmainpreviewimg;
//         var vxmlfile;
//         
//                   
//                  function upload(filepath,imageid,fieldid){
//                var oldPath = filepath;
//                console.log('UPLOAD 1 step, oldPath:'+ oldPath);
//              var newPath = __dirname +"/public/images/places/" +vplacename+"/"+ imageid;
//                  console.log('UPLOAD 2 step, newPath:' + newPath );
//              fs.readFile(oldPath , function(err, data) {
//                  fs.writeFile(newPath, data, function(err) {
//                      fs.unlink(oldPath, function(){
//                          if(err) throw err;
//                          res.send('UPLOAD '+imageid+"file uploaded to: " + newPath);
//                          fieldid = newPath;  });
//                  }); 
//              }); 
//              };
//           
//                function imgcheck (n) {
//                  var mistakes = 0;
//                  console.log('into IMAGECHECK');
//                  for (i=0;i<n;i++) {
//                    eval('if (req.files.images['+i+'].name == null) {mistakes++}');
//                    console.log('checked req.files.images['+i+'] , mistakes :'+mistakes);
//                  }
//                  if (mistakes>0) {return false;}
//             console.log('FILES:OK');}
//
//
//             
//             function uploadloop(n) {
//               console.log('UPLOADLOOP START,'+n+' images will be processed');
//                for(i=0;i<n;i++) {
//                 eval("upload(req.files.images["+i+"].path,req.files.images["+i+"].name,vimg_"+i+");");
//                }
//                console.log('UPLOADLOOP EXIT');
//             }
//             function uploadloopxml(n) {
//               console.log('XMLUPLOADLOOP START,'+n+' files will be processed');
//                for(i=0;i<n;i++) {
//                 eval("upload(req.files.images["+i+"].path,req.files.images["+i+"].name,vimg_"+i+");");
//                }
//                console.log('UPLOADLOOP EXIT');
//             }
//              
//              var newplace = __dirname +"/public/images/places/" +vplacename;
//             fs.mkdirs(newplace , function(err){
//                      if (err) {return console.error(err);}
//                       console.log('NEW FOLDER CREATED , MOVING FILES');
//                       uploadloop(photonum);
//                       upload(req.files.mainpreview.path,req.files.mainpreview.name,vmainpreviewimg);
//                       upload(req.files.xml.path,req.files.xml.name,vxmlfile);
//                       });
//         
//         
//           
//
//         
//         	var vhid = req.body.hid,
//          vnameru = req.body.nameru,
//         	vnameen = req.body.nameen,
//         	vtelephone = req.body.telephone,
//         	vwww = req.body.www,
//          vcoord = req.body.coord,
//         	vppredir = req.body.ppredir,
//         	vmainpreview = "/images/places/"+req.body.placename+"/"+ req.files.mainpreview.name,
//         	vfid = req.body.fid ,
//           foid = req.body.oid ,
//           vmid = req.body.mid ,
//         	vcity = req.body.city,
//          vwifi = req.body.wifi,
//         	vcountry = req.body.country,
//         	vyearnow = req.body.yearnow,
//           vadressru = req.body.adressru,
//           vadressen = req.body.adressen,
//           vxmlqntt = req.body.xmlqntt,
//           vxml = "/images/places/"+req.body.placename+"/" + req.files.xml.name;
//         
//            console.log(vplacename);
//            console.log(vxml);
//
//             
//         
//           
//         	// CTYPE MUST BE ADDED - TELLS DISTANCE FROM THE CENTER
//         
//         	hostels.insert({hostelid:vhid,
//            placename : vplacename,
//         nameru : vnameru,
//         nameen : vnameen,
//         aderssru: vadressru,
//         adressen: vadressen,
//         coord: vcoord,
//         postn: vpostn,
//         vk : vvk,
//         fb : vfb,
//         tw: vtw,
//         wifi:vwifi,
//         telephone : vtelephone,
//         www : vwww,
//         ppredir : vppredir,
//         mainpreview : vmainpreview,
//         fid : vfid,
//         mid : vmid,
//         oid : foid,
//         city : vcity,
//         country : vcountry,
//         yearnow : vyearnow,
//         xml : vxml,
//         imgqntt : photonum,
//         xmlqntt : vxmlqntt,
//         offrqntt : 0,
//         enquiries : {all:0,accepted:0},
//         ownclients : 0,
//
//
//         });
//         
//         	
//         	
//         
//               var docs;
//             hostelss.find({placename:vplacename},function(err,docs){
//                 console.log('wrote to the places collection:' + docs);
//                 });
//           
//         
//            // news.find({placename:vplacename},function(err,docs){
//            //     console.log('wrote to the news collection:' + docs);
//            //     });
//            
//         
//         	
//         	console.log('UPLOAD DONE! REDIRECTING TO PP')
//         	res.redirect(vppredir);
//         }
//         
//         	else { 
//         
//         		console.log('SHITTY FILES, UPLOAD ABORTED');
//         		res.redirect('/');
//         };
//     }
//  }//ELSE OF (pano===0)
//});



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