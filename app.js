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
  , places = db.get('places'),top = db.get('top');
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
app.use(express.static(path.join(__dirname, 'public')));
//app.use(sessions({
//  cookieName: 'session',
//  secret:'2342kjhkj2h3i2uh32j3hk2jDKLKSl23kh42u3ih4',
//  duration:4320 * 60 *1000,
//  activeduration:1440 * 60 * 1000,
//  httpOnly: true
//}));

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


//app.get('/hostel', function(req,res) {
//  console.log('JESUS !!!');
//  res.render('hostel');
//});

//app.get('/logout',function(req,res){
//  console.log('trying to logout');
//  req.session.reset();
//  console.log(JSON.stringify(req.session));
//  res.redirect('/');
//});


 //app.get('/index',function(req,res){
 //  var incomming = req.headers.host;

 // if (incomming === 'topandviews.ru') {
 //   console.log(' serving RU');
 //   res.render('index');
 // } 
  
 // if (incomming === 'topandviews.co.uk') {
 //   console.log(' serving CO.UK');
 //   res.render('index');
 // }

 // if (incomming === 'topandviews.com') {
 //   console.log(' serving COM');
 //   res.render('index');
 //    }
//});

  
//SUBDOMAIN MAGIC 


//app.get('*', function(req,res,next) { 
//  var d = new Date();
//  if(req.headers.host === 'm.topandviews.com')  //if it's a sub-domain
//   {console.log(d+' got a mobile version request on .com from '+req.ip);
//    req.url = '/m' + req.url; 
//    console.log(req.url); //append some text yourself
//  next();} 
 

 // if(req.headers.host === 'm.topandviews.co.uk')  //if it's a sub-domain
 //   {console.log(d+' got a mobile version request on co.uk from '+req.ip);
 //   req.url = '/m' + req.url;  //append some text yourself
 //   console.log(req.url);
 //   next();} 
     
  
 // if(req.headers.host === 'm.topandviews.ru')  //if it's a sub-domain
 //   {console.log(d+' got a mobile version request on .ru from  '+req.ip);
 //   req.url = '/m' + req.url ;  //append some text yourself
 //   console.log(req.url);
 //   next();}
 //   
 //   else {next();}

//}); 



app.get('/',function(req,res) {
  
  console.log('entered "/" route');
  console.log('User-Agent: ' + req.headers['user-agent']);
  var userAgent=req.headers['user-agent'];
  var uacheck = userAgent.indexOf("iPhone") != -1 ;
  console.log(uacheck);
  var d = new Date();
  //res.send('UNDER CONSTRUCTION');
  places.find({},{ limit:9,sort : { regdate : -1 } },function(err,doc){
    if(err)
    {
      res.render('emptyindex');
    }
    else {
      if(doc.length>0)
      {
        //res.render('index',{'places':doc});
        res.render('index',{'doc':JSON.stringify(doc)});
      }
      else{
        res.render('emptyindex');
      }
    }
  });

  //if(uacheck === true) {
  //  res.render('mindex');
  //}
  ////MIGH ADD AN ELSE
  //else
  //{if(req.headers.host === 'topandviews.ru') 
  //    {console.log(d+' request on .ru from '+req.ip);
  //     if (req.session.admin === 1) {
  //      res.render('adminindex',{'prfname':req.session.lgn});
  //     }
  //     else if(req.session.hostel === 1) {
  //      res.render('hostelindex',{'pfrname':req.session.lgn,'hostelid':req.session.hostelid});
  //     }
  //     else if (req.session.mail != undefined && req.session.lgn != undefined)
  //      {res.render('indexreg',{'prfname':"Привет, "+req.session.lgn+"!"});
  //  console.log('!!! REGISTERED USER CAME BACK !!!');}
  //     else {
  //     res.render('index');}
  //   }
  //  if(req.headers.host === 'topandviews.com') 
  //    {res.redirect('http://topandviews.ru')}
  //   
  //  if(req.headers.host === 'topandviews.co.uk') 
  //    {res.redirect('http://topandviews.ru')}}
   
});

app.get('/dropplaces',function(req,res){
    places.remove({},function(err,done){
    if(err)
    {
      res.send('98');
    }
    else {
      res.send('SUCCESS');
    }
    });
  });
app.get('/droptop',function(req,res){
    top.remove({},function(err,done){
    if(err)
    {
      res.send('98');
    }
    else {
      res.send('SUCCESS');
    }
    });
  });

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
      { console.log(doc);
        res.render('top',{'doc': JSON.stringify(doc)});}
      else {
        res.render('emptytop');
      }
    }

  });
});

app.get('/places/:id',function(req,res){
  var vpid = parseInt(req.params.id);
  places.fincOne({pid:vpid},function(err,doc){
    if(err){
      res.render('404');
    }
    else {
      if(doc.length>0)
      {
        res.render('place',{'doc':doc});
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
  res.send('intel');
});

app.get('/admax',function(req,res){
  res.render('admin');
});

app.get('/admin/addrating',function(req,res){
  res.render('addrating');
});
app.get('/admin/ratinglist',function(req,res){
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
});

app.get('/admin/redactrating/:id',function(req,res){
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

   top.update({rid:vrid},{$set:{ratingname:vrn,web:vweb,places:{1:vp1,2:vp2,3:vp3,4:vp4,5:vp5,6:vp6,7:vp7,8:vp8,9:vp9,10:vp10},pids:{1:vpid1,2:vpid2,3:vpid3,4:vpid4,5:vpid5,6:vpid6,7:vpid7,8:vpid8,9:vpid9,10:vpid10}}});
   res.redirect('http://recentones.com/admin/ratinglist');
});

app.post('/admin/removerating/:id',function(req,res){
  var vrid = parseInt(req.params.id);
  //AUTH NEEDED
  top.remove({rid:vrid},function(err,done){
    if(err){
      res.send('DB RM ERR');
    }
    else {
      res.redirect('http://recentones.com/admin/ratinglist');
    }
  });
});

app.post('/admin/addrating',function(req,res){
  if(!req.body.ratingname)
  {
    res.send('RATINGNAME ABSENT')
  }
  else {
    top.find({},{ limit:1,sort : { rid : -1 } },function(err,doc){
      if(err)
      {
        //call houston
      }
    else {
      var dd= new Date();
      var vday = dd.getDay().toString();
      if (vday.length<2){
        vday='0'+vday;
      }
      var vmonth = dd.getMonth()+1;
      vmonth = vmonth.toString();
      if (vmonth.length<2){
        vmonth='0'+vmonth;
      }
      var vyear = dd.getUTCFullYear().toString();
      var fulldate = vyear+vmonth+vday;
      fulldate = parseInt(fulldate);
      if(doc.length>0){
       var newid = doc.rid+1;
       top.insert({ratingname:req.body.ratingname,regdate:fulldate,web:'www.ya.ru',rid:newid,places:{1:'Один',2:'Два',3:'Три',4:'Четыре',5:'Пять',6:'Шесть',7:'Семь',8:'Восемь',9:'Девять',10:'Десять'},pids:{1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10}});
       res.redirect('http://recentones.com/admin/ratinglist');
      }
      else
      {
       top.insert({ratingname:req.body.ratingname,regdate:fulldate,web:'www.ya.ru',rid:1,places:{1:'Один',2:'Два',3:'Три',4:'Четыре',5:'Пять',6:'Шесть',7:'Семь',8:'Восемь',9:'Девять',10:'Десять'},pids:{1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,10:10}});
       res.redirect('http://recentones.com/admin/ratinglist');
      }
    }
    });
  }
});

app.get('/admin/placelist',function(req,res){
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
});

app.get('/admin/addplace',function(req,res){
  res.render('addplace');
});

app.post('/admin/addplace',function(req,res){

});

//REGISTRATION
//app.get('/rrregisterrr',function(req,res){
//     res.render('register');
//});

//app.post('/newuser',function(req,res){
//    //THOSE USERS ARE NORMAL PEOPLE, HOSTEL STUF WILL BE REGISTERED THROUGH ADMIN
//    var vmail = req.body.mail; 
//    var vu = req.body.u; //NEEDED TO WRITE COMMENTS, DONT ASK AT REGISTRATION
//    if (vu.length === 0 )
//      {vu = 0;}
//    var vp = bcrypt.hashSync(req.body.p,bcrypt.genSaltSync(10));
//    var ms = {};
//    ms.trouble=1;
//    ms.mtext='email incorrect';
//    // MUST INCLUDE enquiries - all  - accepted WHEN WRITING TO THE DB
//    // CHECK MAIL BEFOR WRTING
//    function validateEmail(email) { 
//    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//    return re.test(email);
//} 
//    if (validateEmail(vmail) === true) {
//    users.find({mail:vmail},function(err,doc){
//      if (err)
//      {
//        //DO SMTH
//      }
//      else {
//        if(doc.length === 0)
//        { var now = new Date();
//          var gmonth = now.getMonth();
//          var gyear = now.getUTCFullYear();
//          var gday = now.getDay();
//          users.insert({mail:vmail,phr:vp,lgn:vu,hostel:0,enquiries:{all:0,accepted:0},regdate:{year:gyear,month:gmonth,day:gday}});
//          users.findOne({mail:vmail},function(err,docdoc){
//            console.log('FOUND AFTER INSERTING NEW USER :'+JSON.stringify(docdoc));
//            if (err){
//              //DO SMTH
//            }
//            else{
//               if (docdoc) {
//                req.session = docdoc;
//                ms.trouble =0;
//                ms.mtext='success';
//                // INDEX MUST BE DIFFERENT FOR REGISTERD ONES, IT IS TEMPORARY THE SAME
//                console.log('SOMEBODY REGISTERED');
//                res.send(ms);
//               }
//               else {
//                  ms.mtext ='fail';
//                  res.send(ms);
//               }
//            }
//          });
//        }
//        else {
//           ms.mtext='email exists'
//           res.send(ms);
//        }
//      }// end of err's else
//    });
//    }   
//    else {
//      // INCORRECT EMAIL, SO WE SEND A NOTIFICATION
//      res.send(ms);
//    }
//
//    });
    

//LOGIN MECHANICS
//app.post('/check',function(req,res){
//  //CHECK FOR PASSPORT PRIOR TO HOSTEL CHECK, SORT THIS OUT AFTER ALPHA
//  //"LASTIMEONLINE" MUST BE ADDED AFTER ALPHA
//  vphr=req.body.phr;
//  vlgn=req.body.lgn; // email
//  console.log(vphr+" , "+vlgn);
//  //adding a marker to send to client
//  // MARKER MECHANICS IS NOT PRESENT YET , NEEDS TO BE IMPLEMENTED
//   var  ms = {};
//  ms.trouble=1;
//  ms.mtext='db';
//  //end of marker
//  users.findOne({mail:vlgn},function(err,confirmed){
//    if (err)
//      {res.send(ms);}
//    else 
//    {
//      if (confirmed)
//      {console.log('we have found :'+JSON.stringify(confirmed));
//         if(confirmed.hostel === 1) //HOSTEL LOGED IN , SERVE HOSTELCLIENT
//            {
//              if (bcrypt.compareSync(vphr,confirmed.phr))
//               {
//                console.log('PASSWORD IS GOOD, EXTRACTING INFO FROM HOSTELS DB');
//               var x = confirmed.hostelid;
//              hostels.findOne({hostelid:x},function(err,done){
//                console.log(JSON.stringify(done));
//                if (err)
//                {
//                  console.log('----------DB ERROR-----------');
//                }
//                else {
//                  if (done)
//                  {req.session = confirmed;
//                    ms.trouble=0;
//                    ms.mtext= 'success';
//                   ms.mhostel = done.hostelid;
//                   res.send(ms);
//
//                  //
//                   // console.log('SUCCESFULLY EXTRACTED :'+JSON.stringify(done));
//                   //  if (done.country === "russia")
//                   // { 
//                   //    console.log('GOING TO SERVE RUS');
//                   //    req.session = confirmed;
//                   //   if(done.offrqntt === 0)
//                   //   {console.log('RUS OFFER');
//                   //     res.render('index');
//                   //   }
//                   //   else
//                   //   {
//                   //     var offridlst = done.offers;
//                   //     res.render('hosteladminru',{'offers':offridlst,'hostel':done});}
//                   // //
//                   // }
//                   // else {
//                   //    
//                   //    req.session = confirmed;
//                   //   if(done.offrqntt === 0)
//                   //   {res.render('nooffershosteladminen',{'hostel':done});}
//                   //   else
//                   //   {
//                   //     var offridlst = done.offers;
//                   //     res.render('hosteladminen',{'offers':offridlst,'hostel':done});}
//                   // }
//                  }  
//                  else
//              {
//                //DO SOMETHING
//              } 
//              }
//              
//            });
//            }
//            else
//            {
//              ms.mtext='wrong pas';
//              res.send(ms);
//              //WRONG PASSWORD
//            }
//         }
//         else
//          //USER LOGED IN 
//         {
//          if(bcrypt.compareSync(vphr,confirmed.phr))
//          {
//          
//          req.session = confirmed;
//          console.log("THAT'S WHAT I WROTE TO HIS COOKIES: "+JSON.stringify(req.session));
//          ms.trouble = 0;
//          ms.mtext= 'success';
//          res.send(ms);
//           }
//           else {
//            ms.mtext='wrong pas';
//              res.send(ms);
//              //WRONG PASSWORD
//           }
//         }
//      }
//      else {
//        ms.mtext='wronguser'
//        res.send(ms);
//      }
//    }
//  });
//});

//app.get('/full',function(req,res) {
//  if(req.headers.host === 'topandviews.ru') 
//    {console.log(d+' request on .ru from '+req.ip);
//     res.render('index');}
//  if(req.headers.host === 'topandviews.com') 
//    {console.log(d+' request on .com from '+req.ip);
//     res.render('index');}
//  if(req.headers.host === 'topandviews.co.uk') 
//    {console.log(d+' request on .co.uk from '+req.ip);
//     res.render('index');}
//});


//done with subdomains

//full version starts here, mobile will be below


//ADMIN SECTION FOR DB CONTROL
//app.get('/admin',function(req,res){
//  if (lguser.admin) {
//   var oc;
//   orders.count({},function(err,c){
//    if (err)
//    {}
//  else {
//    oc= c;
//
//  }
//  });
//  var hc; 
//  hostels.count({},function(err,c){
//    if (err)
//    {}
//  else {
//    hc= c;
//    var uc ;
//  users.count({},function(err,c){
//    if (err)
//    {}
//  else {
//    uc= c;
//    var huc; users.count({hostel:1},function(err,c){
//    if (err)
//    {}
//  else {
//    huc= c;
//    res.render('admingeneral',{'orders':oc,'hostels':hc,'users':uc,'husers':huc});
//  }
//  });
//  }
//  });
//  }
//  });
//
//  }
//  else {
// res.render('adminauth');
//}
//});

//app.post('/alogin',function(req,res){
//  var p = 'testtest';
//  var l = 'testtest';
//
//  if(req.body.p === p && l === req.body.l && req.session.mail)
//  {
//    req.session.admin = 1;
//    users.update({mail:req.session.mail},{$set:{admin:1}});
//    console.log(req.session);
//    res.redirect('http://topandviews.ru/admin');
//    }
//else
//{res.redirect('http://topandviews.ru');}
//});

app.get('/admin/:section',function(req,res){
   switch (req.params.section) {
    case('hostels'):
      places.find({},function(err,docs){
        res.render('adminplaces',{'docs' : docs});
      });
    break;
    case('users'):
      top.find({},function(err,docs){
        res.render('admintops',{'docs' : docs});
      });
    break;
   }
});

//app.get('/admin/:section',function(req,res){
//  if (lguser.admin){
//  switch (req.params.section) {
//    case ('orders'):
//      orders.find({},function(err,docs){
//        if (err) {res.send('error');}
//        else {
//             if (docs != {})
//                           {
//                           console.log(docs);
//                           res.render('adminorders',{'docs' : docs});
//                            }
//      
//              else {
//                    res.send('empty db');
//                   }
//              }
//    });
//    break;
//    case('hostels'):
//      hostels.find({},function(err,docs){
//        res.render('adminhostels',{'docs' : docs});
//      });
//    break;
//    case('users'):
//      users.find({hostel:0},function(err,docs){
//        res.render('adminusers',{'docs' : docs});
//      });
//    break;
//    case('hostelusers'):
//      users.find({hostel:1},function(err,docs){
//        res.render('adminhostelusers',{'docs' : docs});
//      });
//    break;
//    case('addhosteluser'):
//      res.render('newhosteluser');
//    break;
//    default:
//    //ERROR HERE OR SOMETHING
//    break;
//  }
// }
// else {
//   res.redirect('http://topandviews.ru');
// }
//});

app.post('/admin/hostels/add',function(req,res){
  // AUTH NEDDED
  console.log('DDING HOSTEL USER');
  if (
    req.body.hostelid === undefined||
    req.body.mail === undefined||
    req.body.pc === undefined||
    req.body.cname === undefined||
    req.body.cphone === undefined||
    req.body.regdate === undefined)
  {res.send('ERROR: Some fields were empty');}
else
  {var vhostelid = req.body.hostelid;
     var vmail = req.body.mail;
     var vp = bcrypt.hashSync(req.body.pc,bcrypt.genSaltSync(10));
     var vcname = req.body.cname;
     var vcphone = req.body.cphone;
     var vregdate = req.body.regdate;
     console.log(vhostelid+" "+vcname+" "+vcphone+" "+vregdate);
     var ms={};
     ms.trouble= 0;
     users.insert({hostelid:vhostelid,hostel:1,contact:{name:vcname,phone:vcphone},mail:vmail,phr:vp,regdate:vregdate});
     res.send(ms);}


});
console.log('FIRST BREAKPOINT');

//app.get('/admin', function(req,res) {
//  res.render('adminauth',{'message' : null});
//});

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
 console.log('SECOND BREAKPOINT');
//app.get('/upload', function(req,res) {
//      console.log('got request on /upload');
//      res.render('uploadauth');
//      });

//app.post('/uploadauth', function(req,res){
//  var masterlogin = 'tooleetoo676';
//  var masterpassword = 'cloderstam555';
//  var login = req.body.login;
//  var pass = req.body.password;
//
//  if (masterlogin !== login || masterpassword !== pass ) 
//                                                        {
//                                                          res.render('uploadauth');
//                                                        }
//  else 
//      {
//        res.render('upload');
//      }                                                      
//
//});  

// MOBILE VERSION STARTS HERE

//app.get('/m/',function(req,res){
//  console.log('got to /m/ section, render depending on req.headers.host');
//  if (req.headers.host === 'm.topandviews.ru') {res.render('mindex')}
//  if (req.headers.host === 'm.topandviews.com') {res.render('mindex')}
//  if (req.headers.host === 'm.topandviews.co.uk') {res.render('mindex')}  
//});

//app.get('/m/:lang/*',function (req,res,next){
//  var checklang = req.params.lang;
//  if (checklang === 'ru' ||checklang ===  'en' ||checklang ===  'es' ||checklang ===  'fr' ||checklang ===  'de' ||checklang ===  'it')
//    {next()}
//  else {res.render('my404')}
//});


//app.get('/m/:lang/geo', function(req,res){
//  var lang = req.params.lang;
//  if (lang === 'ru'){res.render('mgeoru');} 
//   if (lang === 'en'){res.render('mgeo');} 
//   if (lang === 'de'){res.render('mgeode');} 
//   if (lang === 'fr'){res.render('mgeofr');} 
//   if (lang === 'es'){res.render('mgeoes');} 
//   if (lang === 'it'){res.render('mgeoit');} 
//});

//app.get('/m/:lang', function(req,res){
//  console.log('got into /m/:lang route')
//   var lang = req.params.lang;
//   if (lang === 'ru'){res.render('mindexru');} 
//   if (lang === 'en'){res.render('mindex');} 
//   if (lang === 'de'){res.render('mindexde');} 
//   if (lang === 'fr'){res.render('blank');} 
//   if (lang === 'es'){res.render('blank');} 
//   if (lang === 'it'){res.render('blank');} 
//});


//mobile version's end



//EMPTY ORDERS
app.post('/drop/:part',function(req,res){
  if(req.session.admin === 1)
  {
    var pp = 'secureshit';
  switch(req.params.part)
  {
    case('orders'):
     if(req.body.p ===  pp)
      {orders.remove({});
        console.log('ORDERS DB DROPPED FROM '+ req.ip);
        res.redirect('http://topandviews.ru/admin/orders');
      }
    break;
    case('users'):
     if(req.body.p ===  pp)
     {users.remove({});
     console.log('USERS DB DROPPED FROM '+ req.ip);
     res.redirect('http://topandviews.ru/admin/users');}
    break;
    case('hostelusers'):
     if(req.body.p ===  pp)
     {users.remove({hostel:1});
     console.log('HOSTEL USERS DB DROPPED FROM '+ req.ip);
     res.redirect('http://topandviews.ru/admin/hostelusers');}
    break;
    case('hostels'):
     if(req.body.p ===  pp)
     {var hid = req.body.hid;
      hostels.remove({hostelid:hid},function(err){
        if (!err)
        {
          console.log('HOSTELID '+ hid+' DROPPED FROM '+ req.ip);
           res.redirect('http://topandviews.ru/admin/hostels');
        }
       else
        {res.send('there was an error');}
      });}
    break;
  }
 }
 else
  {res.redirect('http://topandviews.ru');}
});

app.post('/drop/users/mail',function(req,res){
  var vmail = req.params.mail;
  users.remove({mail:vmail});
  res.send('done');
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

console.log('FOURTH BREAKPOINT');

//UPDATE HOSTELS MECHANICS (STILL PLACES NEEDS AN UPDATE)
app.post('/admin/update', function(req,res) {
 
 // UPDATES variable should be introduced, incremets each update on a place

 // var vplacename = req.body.placename ,
 // vnameru = req.body.nameru,
 // vnameen = req.body.nameen,
 // vtelephone = req.body.telephone,
 // vwww = req.body.www,
 // vppredir = req.body.ppredir,
 // vworkinghours = req.body.workinghours,
 // vrooftopbool = req.body.rooftop,
 // vterracebool = req.body.terrace,
 // vfid = req.body.fid ,
 // foid = req.body.oid ,
 // vmid = req.body.mid ,
 // vcity = req.body.city,
 // vcountry = req.body.country,
 // vyearnow = req.body.yearnow,
 // vyearfounded = req.body.yearfounded,
 // vadressru = req.body.adressru,
 // vadressen = req.body.adressen;


  if(req.files.images.length > 0) {
    var data = JSON.stringify(req.files);
    res.send(req.files.images[1]);
  }
  else 
    {res.send('empty files');
  }

    

//	places.update({placename: vplacename},{
//nameru : vnameru,
//nameen : vnameen,
//telephone : vtelephone,
//www : vwww,
//ppredir : vppredir,
//mainpreview : vmainpreview,
//cigarsbool : vcigarsbool,
//shishabool : vshishabool,
//workinghours : vworkinghours,
//rooftopbool : vrooftopbool,
//terracebool : vterracebool,
//fid : vfid,
//mid : vmid,
//oid : foid,
//toptype : vtoptype,
//glbtype : vglbtype,
//city : vcity,
//country : vcountry,
//yearnow : vyearnow,
//type : vtype,
//yearfounded : vyearfounded,
//images : photonum,
//});
//
//    console.log(vplacename+' has been updated')
//	res.redirect(vppredir);

  
});
console.log('FIFTH BREAKPOINT');
//app.post('/testupload', function(req,res){
//    var firstfield = req.body.textupload;
//    var secondfield = req.files.fileupload.name;
//    if (secondfield != 0) {console.log(secondfield);}
//    else {
//    	console.log('its fucking empty , bro !');
//         }
//    vteset ="/public/images/places/" + req.files.fileupload.name;
//    console.log(vteset);
//});


//app.post('/search', function(req,res){
//
//	var query = req.body.search;
//	console.log('searching for '+query);
//	var docs = [];
//	places.find({placename:query}, function(err,docs){
//       console.log(docs);
//       res.render('searchresults', {'searchresults': docs});
//       // placename:query});
//    });
// });

app.post('/uploadauth', function(req,res){
  var masterlogin = 'test';
  var masterpassword = 'test';
  var login = req.body.login;
  var pass = req.body.password;
  console.log(pass);
  console.log(login);
  console.log("JESUS");
  if (masterlogin != login || masterpassword != pass ) 
                                                        {
                                                          res.render('uploadauth');
                                                        }
  else 
      {
        res.render('upload');
      }                                                      

});  


app.post('/admin/simulateplace',function(req,res){
   places.find({},{limit:1,sort:{pid:-1}},function(err,doc){
     if(err){
      res.send('db error');
     }
     else {
       if(doc.length>0){
         var newid = parseInt(doc.pid)+1;
         places.insert({
         placenameru : 'Тестхостел',
         placenameen : 'Testhostel',
         aderssru: 'Какаятосраная наб. дом 10 к.3 кв. 12',
         adressen: 'Somefucking emb. 10 bld.3 flat 12',
         pid: newid,
         mainpreview:'/bootstrap/images/nopreview.png',
         xml:'/bootstrap/images/emptypano.xml'
         });
         res.redirect('http://recentones.com/admin/placelist');
         console.log('PLACE SIMULATED');
       }
       else{
         places.insert({
         placenameru : 'Тестхостел',
         placenameen : 'Testhostel',
         aderssru: 'Какаятосраная наб. дом 10 к.3 кв. 12',
         adressen: 'Somefucking emb. 10 bld.3 flat 12',
         pid: 1,
         mainpreview:'/bootstrap/images/nopreview.png',
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