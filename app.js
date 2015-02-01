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
  res.send('UNDER CONSTRUCTION');
  places.find({},function(err,doc){
    if(err)
    {
      res.render('emptyindex');
    }
    else {
      if(doc.length>0)
      {
        res.render('index',{'places':doc});
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

app.get('/example',function(req,res){
  res.render('examples');
});

app.get('/about',function(req,res){
  res.render('about');
});
app.get('/top',function(req,res){
  places.top({},function(err,doc){
    if(err)
    {
      res.redirect('http://recentones.com');
    }
    else
    { 
      if(doc.length>0)
      {res.render('top',{'tops':doc});}
      else {
        res.redirect('http://recentones.com');
      }
    }

  });
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

//app.get('/m/:lang/geo/:city', function(req,res){
//    var lang = req.params.lang;
//    var vreqcity = req.params.city;
//    if (vreqcity === 'stpetersburg') {vreqcity = 'St.Petersburg'}
//    if (vreqcity === 'newyork') {vreqcity = 'New York'};
//    if (vreqcity === 'losangeles') {vreqcity = 'Los Angeles'}
//    var absolute = [];
//    var rooftop = [];
//    var terrace = [];
//    var cuisine = [];
//    tops.find({city : vreqcity,toptype : 1}, function(err,firsttypedocs){
//       console.log('got data for absolute');
//         absolute = firsttypedocs;
//         tops.find({city : vreqcity,toptype : 2}, function(err,secondtypedocs){
//            console.log('got data for rooftop');
//              rooftop = secondtypedocs;
//              tops.find({city : vreqcity,toptype : 3}, function(err,thirdtypedocs){
//                   terrace = thirdtypedocs;
//                   tops.find({city : vreqcity,toptype : 4},function(err,fourthtypedocs){
//                        cuisine = fourthtypedocs;
//                     
//                         res.render('mgeoindex', { 'city' : vreqcity , 'first' : absolute , 'second' : rooftop , 'third' : terrace , 'fourth' : cuisine });   
//                   });
//              });
//         });
//
//    });
//
//  
//
//});


//mobile version's end



//app.get('/:lang',function(req,res){
//  var lang = req.params.lang;
//  if (lang === 'en') {res.render('index')}
//  if (lang === 'ru') {res.render('indexru')}
//  if (lang === 'fr') {res.render('indexfr')}
//  if (lang === 'de') {res.render('indexde')}
//  if (lang === 'es') {res.render('indexes')}
//  if (lang === 'it') {res.render('indexit')} 
//});

//app.get('/:lang/contact', function(req,res){
//  var lang = req.params.lang;
//  if (lang === 'en') {res.render('contact')}
//  if (lang === 'ru') {res.render('contactru')}
//  if (lang === 'fr') {res.render('contactfr')}
//  if (lang === 'de') {res.render('contactde')}
//  if (lang === 'es') {res.render('contactes')}
//  if (lang === 'it') {res.render('contactit')} 
//});

app.post('/search', function(req,res){
  console.log("INTO SEARCH ");
  var vmixgenders = req.body.mixgenders;
  var vwifi = req.body.wifi;
  var vplacename = req.body.placename;
  var vprice = req.body.price;
  // ADD SEARCH CRITERIAS
  console.log('VPLACENAME IS:'+vplacename);
  if(vplacename != 0)
  {
    hostels.findOne({placename:vplacename},function(err,done){
      console.log("PLACENAME: ID DID SEARCH THE DB");
      if (hostels.length != 0)
        { console.log(" , FOUND SOMETHING AND GOING TO SEND IT TO YOU");
          res.render("srsingle",{"result":done});}
      else {
        console.log(" IT WAS EMPTY AND IM GOING TO RENDER");
        //NO EMPTYSR YET EXISTS , MUST BE CREATED
        res.render('emptysr');
      }
    });
  }
else 
  { var query;
    var count =0;
    if(vwifi===1)
      {query='wifi:1';count++}
    if(vmixgenders ===1 && count ===1)
      {query=query+',mixgenders:1';count++}
    if(vmixgenders ===1 && count ===0)
      {query=query+'mixgenders:1';count++}
    if(vprice!=0 && count>1)
      {query=query+',vprice:'+vprice;count++}
    if(vprice!=0 && count===0)
      {query=query+'vprice:'+vprice;count++}
    if(count>0)
    {console.log(query);
      eval('hostels.find({'+query+'},function(err,hostels){console.log(" ID DID SEARCH THE DB");if (hostels.length != 0){ cosnole.log(" , FOUND SOMETHING AND GOING TO SEND IT TO YOU");res.render("sr",{"hostels":hostels});}else {console.log(" IT WAS EMPTY AND IM GOING TO RENDER");//NO EMPTYSR YET EXISTS , MUST BE CREATEDres.render("emptysr");}});');}
  else {
    hostels.find({},function(err,hostels){
          console.log(" ID DID SEARCH THE DB");
          if (hostels.length != 0)
            { console.log(" , FOUND SOMETHING AND GOING TO SEND IT TO YOU");
              res.render("sr",{"results":hostels});}
          else {
            console.log(" IT WAS EMPTY AND IM GOING TO RENDER");
            //NO EMPTYSR YET EXISTS , MUST BE CREATED
            res.render('emptysr');
          }
        });
  }
}
});

//app.get('/emptysr',function(req,res){
//  res.render('emptysr');
//}); 

app.get('/hostels/:hostel',function(req,res){
  var word=req.params.hostel ;
  if (word === null) {
    if (req.session.mail)
        {res.render('indexreg',{'pfrname':req.session.lgn});}
         else {
        res.render('index');
        }
  }
  else {
    hostels.findOne({placename:word},function(err,done){
      if (err) {
        //SCREAM
      }
      else {
        if(done)
        {if (done.pano === 1)
               {
                 if(done.offrqntt ===0)
                 {res.render('noofferspp',{"hostel":done})}
               else {
                res.render('pp',{"hostel":done,"offers":done.offers});
              }
              }
                else {
                  console.log('PANO IS ZERO and oq: '+done.offrqntt+' '+done.placename+' '+done.ownclients);
                  if (done.offrqntt === 0)
                  {
                    res.render('noofferspp',{"hostel":done});
                  }
                  else{
                  res.render('epp',{"hostel":done,"offers":done.offers});
                 }
                }}
       else {
        res.redirect('http://topandviews.ru');
       }
      }
    });
  }
});

console.log('THIRD BREAKPOINT');

//
//app.get('/:lang/geo/:city/new', function(req,res){
//   var nlang = req.params.lang;
//   var ncity = req.params.city;
//   var nnmbr = 0 ;
//   places.find({city : ncity}, {limit : 0 ,sort: {yearnow: -1}},function(err,newdoc) {
//       //, {limit : 0 ,sort: {yearnow: -1}}
//       function cnt (value,index,array) {
//        nnmbr++
//       } 
//       newdoc.forEach(cnt);
//       console.log(nnmbr,newdoc);
//
//  if (nlang === 'en') {res.render('new',{city : ncity,news : newdoc,pnumber : nnmbr})}
//  if (nlang === 'ru') {res.render('newru',{city : ncity,news : newdoc,pnumber : nnmbr})}
//  if (nlang === 'fr') {res.render('newfr')}
//  if (nlang === 'de') {res.render('newde',{city : ncity,news : newdoc,pnumber : nnmbr})}
//  if (nlang === 'es') {res.render('newes')}
//  if (nlang === 'it') {res.render('newit')} 
//
//   });
//});

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

app.get('/upload', function(req,res) {
      if(lguser.admin != undefined)
      {
        res.render('upload');
      }
      else
      {console.log('got request on /upload');
      res.render('uploadauth');}
	    });

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


app.post('/orders/simulate',function(req,res){
  //ORDERCOUNT must go here, this is begining of getting statistic together. Orders taken, objects added, visitors etc.
  console.log('going to simulate an order');
  vregistered = parseInt(req.body.registered);
  vhostelid = parseInt(req.body.hostel);
  vofferid =parseInt(req.body.offerid);
  vfyear = parseInt(req.body.fyear);
  vfmonth = parseInt(req.body.fmonth);
  vfday = parseInt(req.body.fday);
  vtoyear = parseInt(req.body.toyear);
  vtomonth = parseInt(req.body.tomonth);
  vtoday = parseInt(req.body.today);
  vnights = parseInt(req.body.nights);
  //DONT FORGET ABOUT "OUTER" FIELD
   if (vofferid === 'test')
   {
     vphonep = 1;
     vmail = 'test@test.com';
     vphone = 79237364453;
     vregistered = 0;
     vhostelid = testcount;
     vofferid = offer1;
     vfyear = 2014;
     vfmonth = 11;
     vfday = 07;
     vtoyear = 2014;
     vtomonth = 12;
     vtoday = 10;
     vnights = 3; 
    orders.insert({hostelid:vhostelid,offerid:vofferid,registered:vregistered,mail:vmail,phonep:vphonep,phone:vphone,fyear:vfyear,fmonth:vfmonth,fday:vfday,toyear:vtoyear,tomonth:vtomonth,today:vtoday,nights:vnights,confirmed:0,reqip:req.ip,outer:0});
    hostels.findOne({hostelid:vhostelid},function(err,done){
      if (err)
      {
        //SCREAM
      }
      else
      {
        eval('var enq = done.offers.'+vofferid+'.enquiries;');
        enq++;
        hostels.update({hostelid:vhostelid},{$set:{offers:{vofferid:{enquiries:enq}}}});
         res.redirect('http://topandviews.ru/admin/orders');
      }
    });
   }
   else {
  orders.insert({hostelid:vhostelid,offerid:vofferid,registered:vregistered,mail:'test@test.ru',phonep:1,phone:'+8293847293524',fyear:vfyear,fmonth:vfmonth,fday:vfday,toyear:vtoyear,tomonth:vtomonth,today:vtoday,nights:vnights,confirmed:0,reqip:req.ip,outer:0});
   hostels.findOne({hostelid:vhostelid},function(err,done){
      if (err)
      {
        //SCREAM
      }
      else
      {
        eval('var enq = done.offers.'+vofferid+'.enquiries;');
        enq++;
        hostels.update({hostelid:vhostelid},{$set:{offers:{vofferid:{enquiries:enq}}}});
         res.redirect('http://topandviews.ru/admin/orders');
      }
    });
   }
});



app.post('/enquery/:hostel', function(req,res){
  console.log('GOT INTO ENQUERY !!!');
  //all the hostelclient magic happens here
  var x = parseInt(req.params.hostel);
  var y = parseInt(req.body.price);
  console.log(x+' '+y);
  //z = req.param('coco');
  var z = req.body.coco;
  console.log(z);
  
  switch ( z ) {
   case ("enquiries"):
   var month = parseInt(req.body.month);
   var day = parseInt(req.body.day);
   var dd = new Date();
   var yearnow = dd.getUTCFullYear();
   console.log("month is: "+month+", day is: "+day+", yearnow is: "+yearnow+", hostelid is: "+x+",price is: "+y);
   //USED TO GET ORDERS DETAILS WHEN CLICKING ON THE DAY IN THE CALENDAR
  orders.find({hostelid:x,offerid:y,fmonth:month,fday:day,fyear:yearnow},function(err,results){
    console.log("found :"+JSON.stringify(results));
    res.send(results);
  });
   break;
   case ("calendar"):
   var month = parseInt(req.body.month)+1;
   var year = parseInt(req.body.year);
   console.log(month);
   console.log(year);
   console.log('GOT INTO CALENDAR');
     //USED FOR PRIMARY DATA GET , TO COLOR THE DAYS IN THE CALENDAR, NOTHING IS DONE WITH "NIGHTS" FIELD YET 16.12.2014
     // used to form calendar in hostel web client , obviously (<16.12.2014)
     // nights parameter must be used to form a class by an offerid name which then can be light up in web intrface calendar to see the length of stay
     orders.find({hostelid:x,offerid:y,fmonth:month,fyear:year},function(err,docs){
      if (err) {res.send('ERROR')}
      else {
        if(!docs || docs.length <1)
        {// THIS IS FOR TESTING , ONLY ELSE BLOCK SHOULD BE LEFT
          orders.find({hostelid:x,offerid:y},function(errr,lftv){
            console.log(lftv);
          });
        }
        else
        {console.log(JSON.stringify(docs));
                res.send(docs);}}
     });
   break;
   case ("remove"):
    //used to remove an offer 
    
    var vmail = req.body.mail;
    var vp = req.body.p;
    users.findOne({mail:vmail},function(err,done){
      if (err)
      {
        //SCREAM
      }
      else if (done){
        if(bcrypt.compareSync(vp,done.phr))
          {
           hostels.findOne({hostel:x},function(err,result){
      var offrcnt =  result.offrqntt;
      if (offrcnt > 0){
      offrcnt--;
      hostels.update({hostelid:x},{$set:{offrqntt:offrcnt}});
      eval("hostels.update({hostelid:x},{$set:{offers:{offer"+y+":undefined}}});");
      hostels.findOne({hotelid:x},function(err,result){
        offrcnt++;
        eval("if (result.offer"+offrcnt+" === undefined){console.log('OFFER SUCCESFULY DELETED');}else {console.log('OFFER SEEMS TO STILL BE PRESENT: '+results.offer"+offrcnt+");}");
      });
    }
      else 
        //WHAT SHOUD BE DONE IN THIS CASE ? 
        {res.send("NOTHING TO BE DELETED")}
    });
     //SHOULD ANYTHING BE SENT TO CLIENT TO CONFIRM ??? 
          }
        else{
          //MAKE THIS BEAUTIFULL LATER
          res.send('WRONG PASS/LOG');
        }
      }
      else {}
    });
    
   break;
   case ("add"):
    //used to create an offer
    //OFFERS MUST BE CONFIRMED 
    //var voffrprc=req.body.offrprc;
    var vcapacity = req.body.capacity;
    hostels.findOne({hostelid:x},function(err,result){
      var offrcnt = result.offrqntt;
       offrcnt++;
       console.log('OFFRCNT ID: '+offrcnt);
      eval("hostels.update({hostelid:x},{$set:{offrqntt:"+offrcnt+",offers:{offer"+offrcnt+":{name:offer"+y+",price:"+y+",capacity:"+vcapacity+",enquiries:0}}}});");
    });
    res.redirect('http://topandviews.ru/manage/'+x);

   break;
   case ("removeownclient"):
    //used to remove clients enquieries which didn't come through our booking system 
    var venqid = req.body.enqid;
    orders.update({enqid:venqid},{$set:{confirmed:2}});
   break;
   case ("addownclient"):
    //used to create a client enquiries which are not comming through our system
    //DANGEROUS ASYNC BEHAVIOR - ENQNUM MIGHT NOT BE SET IN TIME TO FORM VENQID
  var enqnum;
  hostels.find({hostelid:x},function(err,result){
    if (err)
    {console.log('DB ERROR WHILE LOOKUP FOR ADDOWNCLIENT');}
    else
    {
      if(result.length != 0)
      {enqnum = results.ownclients; }
      else{
        //WHAT ELSE ? 
      }
    }
  });

  var venqid = enqnum++;
  //var vofferid= req.params.price; - already set as "y"
  var vfyear = req.body.fyear;
  var vfmonth = req.body.fmonth;
  var vfday = req.body.fday;
  var vtoyear = req.body.toyear;
  var vtomonth = req.body.tomonth;
  var vtoday = req.body.today;
  var vnights = req.body.nights;
   orders.insert({hostelid:vhostelid,offerid:y,registered:vregistered,mail:vmail,phonep:vphonep,phone:vphone,fyear:vfyear,fmonth:vfmonth,fday:vfday,toyear:vtoyear,tomonth:vtomonth,today:vtoday,nights:vnights,confirmed:1,reqip:req.ip,outer:1,enqid:venqid});
   hostels.find({hostelid:x},function(err,result){
    if (err)
    {
      //WHAT ??
    }
   else
   {
    if(result.length != 0)
    {
      var vownclients = result.ownclients;
      vownclients++;
      hostel.update({hostelid:x},{$set:{ownclients:vownclients}});
    }
   else {
    //WHAT?
   }
   }
   });
   break;
   case ("confirm"):
    //used to confirm a request for a room came through our system
    var venqid = req.body.enqid;
    orders.find({enqid:venqid},function(err,result){
      if (err)
         {
           //WHAT ??
         }
      else
         {
          if(result.length != 0)
             { 
               if (result.registered != 0)
               {var vuserid = result.registered}
               var vofferid = result.offerid;
               var vouter = results.outer;
                  hostels.find({hostelid:x},function(err,doc){
                    if(err)
                    {
                      //DO SMTH
                    }
                    else {
                      if(doc.length != 0)
                        {
                          //!!! CHECK IF ENOUGH CAPACITY
                         eval("var vcapacity = doc."+vofferid+".capacity;");
                         if (vcapacity > 0) 
                                    {
                                  //ADD CHECK IF OUTER
                                  if (vouter === 1){
                                      var vaccepted = doc.enquiries.accepted;
                                      var vownclients = doc.ownclients;
                                      vownclients++;
                                      vcapacity--;
                                      vaccepted++;
                                      hostel.update({hostelid:x},{$set:{vofferid:{capacity:vcapacity},ownclients:vownclients,enquires:{accepted:vaccepted}}});
                                      orders.update({enqid:venqid},{$set:{confirmed:1}});
                                       }
                                  else {

                                      var vaccepted = doc.enquiries.accepted;
                                      vcapacity--;
                                      vaccepted++;
                                      hostel.update({hostelid:x},{$set:{vofferid:{capacity:vcapacity},enquires:{accepted:vaccepted}}});
                                      orders.update({enqid:venqid},{$set:{confirmed:1}});
                                      users.find({userid:vuserid},function(err,someuser){
                                        if (err)
                                        {
                                          //DO SOMETHING
                                        }
                                        else
                                        {
                                          if(someuser.length != 0)
                                          {
                                            var vuaccepted = someuser.enquiries.accepted;
                                            vuaccepted++;
                                            users.update({userid:vuserid},{$set:{enquiries:{accepted:vuaccepted}}});
                                          }
                                          else
                                          {
                                            //DO SOMETHING
                                          }
                                        }
                                      });
                                    }
                                  }
                          else {
                            // HAPPENS WHEN TWO PEOPLE ORDER AND ONE IS MORE LUCKY THAN THE OTHER
                            res.send("OFFER IS NOT AVALIABLE")
                          }
                        } 
                      else{
                        //DO SMTH
                      }
                    }
                  });
                 
             }//if result.length !=0
          else 
              {
               //WHAT?
              }
         }
    });
   break;
   case ("dismiss"):
    //used to dismiss a request for a room came through our system
     var venqid = req.body.enqid;
    orders.update({enqid:venqid},{$set:{accepted:2}});
   break;
   case("clientenquery"):
   //ENQUERY COMMING FROM PP
     if(req.session && req.session.mail)
     {
       var totalordnum = orders.find().toArray();
       if (totalordnum.length>0)
       {
        var venqid = totalordnum++;
        orders.insert({enqid:venqid,mail:req.session.mail,accepted:0,hostelid:x,message:vmessage})
       }
     }
     else
     {}
   break;
   default:
   //ADD SOME TYPE OF ERROR HERE
   break;
  }
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
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
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