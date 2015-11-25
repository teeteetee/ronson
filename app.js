var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sessions = require('client-sessions');
var Cookies = require('cookies');
var bcrypt = require('bcrypt');
var nodemailer = require("nodemailer");
var ObjectID = require('mongodb').ObjectID;
var http = require('http');
//var gm = require('gm').subClass({imageMagick: true}); - crashes , no binaries found
var gm = require('gm');

var mongo = require('mongodb');
var db = require('monk')('localhost/tav'),users = db.get('users'),user_messages = db.get('user_messages');
// POSTS and OBJECTS BELONGS TO MALESHIN PROJECT DELETE WHEN PUSHING TOPANDVIEWS TO PRODUCTION
var fs = require('fs-extra');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
//app.use(require('connect').bodyParser());
app.use(express.bodyParser());
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

//DATA VALIDATION
// half of this shit doesnt work and fucks the thing up, needs to be tested
function is_tmstmp(input){
  var re = /^\d{10}$/;
  console.log(re.test(input)+' tesing TIMESTAMP');
  return re.test(input);
}
function is_uid(input){
  var re = /^[a-zA-Z0-9]{24}$/;
  console.log(re.test(input)+' tesing UID');
  return re.test(input);
}
function is_single(input){
  var re = /^\d{1}$/;
  console.log(re.test(input)+' tesing SINGLE');
  return re.test(input);
}
function is_multiple(input){
  var re = /^\d+$/;
  console.log(input+' = '+re.test(input)+' tesing MULTIPLE');
  return re.test(input);
}
function is_author(input){
  var re = /^[a-zA-Z\u0400-\u04FF\-. ’'‘ÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ]+$/;
  console.log(re.test(input)+' tesing AUTHOR');
  return re.test(input);
}
function is_title(input){
  var re = /^[a-zA-Z0-9\u0400-\u04FF\-_ ?!¡#&:¿’'‘ÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ]+$/;
  console.log(re.test(input)+' tesing TITLE');
  return re.test(input);
}
function is_nick(input){
  //TODO length limit
  var re = /^[a-zA-Z0-9\u0400-\u04FF\-_ ’'‘ÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ]+$/;
  console.log(re.test(input)+' tesing NICK');
  return re.test(input);
}
function rm_st_sc(input){
  return input.replace(/<script>|<\/script>|<style>|<\/style>|style=/g,' ');
}
function is_link(input){
  //var re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
  //return re.test(input);
  console.log('TODO fix is_link');
  return true;
}
function is_email(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
    } 

// will be used on writes mostly

//END OF DATA VALIDATION
 



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
  console.log('SESSION? - '+JSON.stringify(req.session));
  if(req.session) {
  users.findOne({email:req.session.email}, function (err,done) {
    if(err) {
     res.render('index',{'user':0});
    }
    else if(done != null){
      delete done.phr;
      req.session = done;
      res.render('index',{'user':done});
    }
      else {
     res.render('index',{'user':0});
    }
  });
 }
 else {
  res.render('index',{'user':0});
 }
});

app.get('/dropusers',function (req,res){
  users.remove({});
  user_messages.remove({});
  res.redirect('/');
});

app.get('/showum',function (req,res){
  user_messages.find({},function(err,done){
    res.send(done);
  });
});

app.get('/profile',function (req,res){
  if(req.session.email){
    users.findOne({email:req.session.email},function (err,done){
      if(err){
        console.log(err);
        res.redirect('/');
      }
      else if(done!=null){
        res.render('profile',{'user':JSON.stringify(done)})
      }
      else{
        res.redirect('/');
      }
    });
  }
  else {
    res.redirect('/');
  }
});

app.get('/messages',function (req,res){
  if(req.session.email){
    user_messages.findOne({user:req.session._id},{fields:{msgstore:1}},function(err,done){
            if(err){
              //err page ?
              res.redirect('/');
              console.log('QUERY ERR');
            }
            else {
              if(done){
                  if(done.msgstore)
                  {
                  var more = done.msgstore.length > 10 ? 1:0;
                  done.msgstore = done.msgstore.length > 10 ? done.msgstore.slice(done.msgstore.length-11,done.msgstore.length-1) : done.msgstore;
                  console.log(done);
                  res.render('messages',{'user':req.session._id,'lst_tmstmp':req.session.lst_msg,'messages':done.msgstore,'more':more,'lang':req.session.lang});
                  }
                  else {
                   res.render('messages',{'user':req.session._id,'lst_tmstmp':0,'messages':0,'lang':req.session.lang});
                  }
              }
              else {
                res.redirect('/');
                console.log('DOCUMENT ERR');
              }
            }
          });
  }
  else {
    res.render('404');
  }
});

app.post('/getusers',function (req,res){
  users.find({},{limit:20,sort:{regdate:1}}, function (err,done) { 
        if(err) {
         res.send(0);
        }
        else {
          var ms = {};
          ms.userlist = done;
          res.send(ms);
        }
      });
});

app.get('/verify/:token',function (req,res){
  users.findOne({token:req.params.token},function (err,done1){
    if(err){}
      else {
        if(done1 != null)
        { console.log('confirming'); 
          users.update({_id:done1._id},{$set:{confirmed:1}},function (err,done2){
           if(err)
            {
              //TO DO ERROR
              console.log(err);
            }
          else {
            done1.confirmed=1;
            req.session = done1;
            delete req.session.phr;
            console.log('confirmed'); 
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

app.post('/reveri',function (req,res){
  if(req.body.email) {
    users.findOne({email:req.body.email},function (err,done){
      if(err){
        //TO DO err
      }
      else if(done === null) {
         ms.trouble =1;
         ms.mtext='no user';
         res.send(ms);
      }
      else if(done.confirmed)
      {
        ms.trouble =0;
         ms.mtext='success';
         res.send(ms);
      }
      else if(!done.confirmed) {
        var mailOptions = {
                     from: "Email Verification <no-reply@intplove.com>", // sender address 
                     to: req.body.email, // list of receivers 
                     subject: "Email verification", // Subject line 
                     //text: "Click on the link to verify your email",
                     html: "<b>Follow the link to verify your email </b> <a href='http://intplove.com/verify/"+done.token+"'>http://intplove.com/verify/"+done.token+"</a>" // html body 
                 }
                 // send mail with defined transport object 
                 console.log('sending message');
                 smtpTransport.sendMail(mailOptions, function(error, response){
                  var ms = {};
                     if(error){
                         console.log(error);
                         console.log('reporting');
                         ms.trouble =0;
                         ms.mtext='success';
                         res.send(ms);
                     }else{
                         console.log("Message sent");
                         console.log('reporting');
                         ms.trouble =0;
                         ms.mtext='success';
                         res.send(ms);
                     }
                     smtpTransport.close(); // shut down the connection pool, no more messages 
                 });
      }
    });
                  
  }
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
              users.insert({confirmed:0,name:req.body.uname,age:req.body.uage,gender:req.body.ugen,city:req.body.ucity,city_name:req.body.ucity_name,about:req.body.uabout,email:req.body.uemail,phr:vp,regdate:Date.now(),token:vtoken,lang:'ru',userpic:0},function (err,done){
                if(err){
                  console.log(err);
                }
                else {
                  user_messages.insert({user:done._id.toString(),msgstore:[],lst_tmstmp:Date.now(),msgcount:0});
                   var mailOptions = {
                     from: "Email Verification <no-reply@intplove.com>", // sender address 
                     to: req.body.uemail, // list of receivers 
                     subject: "Email verification", // Subject line 
                     //text: "Click on the link to verify your email",
                     html: "<b>Follow the link to verify your email </b> <a href='http://intplove.com/verify/"+vtoken+"'>http://intplove.com/verify/"+vtoken+"</a>" // html body 
                 }
                 // send mail with defined transport object 
                 console.log('sending message');
                 smtpTransport.sendMail(mailOptions, function(error, response){
                  var ms = {};
                     if(error){
                         console.log(error);
                         console.log('reporting');
                         req.session={confirmed:0,name:req.body.uname,age:req.body.uage,gender:req.body.ugen,city:req.body.ucity,about:req.body.uabout,email:req.body.uemail,phr:vp,regdate:Date.now(),token:vtoken,lang:'ru',userpic:0};
                         ms.trouble =0;
                         ms.mtext='success';
                         res.send(ms);
                     }else{
                         console.log("Message sent");
                         console.log('reporting');
                         req.session={confirmed:0,name:req.body.uname,age:req.body.uage,gender:req.body.ugen,city:req.body.ucity,about:req.body.uabout,email:req.body.uemail,phr:vp,regdate:Date.now(),token:vtoken,lang:'ru',userpic:0};
                         ms.trouble =0;
                         ms.mtext='success';
                         res.send(ms);
                     }
                     smtpTransport.close(); // shut down the connection pool, no more messages 
                 });
                }
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

app.post('/ntfc_m',function (req,res){
  var ms ={};
  ms.newmsg = 0;
  user_messages.findOne({user:req.session._id},{fields:{msgstore:1}},function(err,done){
            if(err){
              console.log('QUERY ERR');
              res.send(ms);
            }
            else {
              if(done){
                  if(done.msgstore.length)
                  {
                   if(!done.msgstore[done.msgstore.length-1].read)
                   {
                    var count = 0;
                    done.msgstore.forEach(function(element){
                        count += element.read ? 0 : 1;
                    });
                    ms.newmsg=count;
                    res.send(ms);}
                 else
                 {res.send(ms);}
                  }
                  else {
                   res.send(ms); 
                  }
              }
              else {
                res.send(ms);
              }
            }
          });
});

app.post('/moremsg',function (req,res){
  var iter = req.body.iter;
  var ms ={};
  ms.trouble=1;
  user_messages.findOne({user:req.session._id},{fields:{msgstore:1}},function(err,done){
            if(err){
              console.log('QUERY ERR');
              res.send(ms);
            }
            else {
              if(done){
                  if(done.msgstore)
                  {
                  var end = 11+10*iter>=done.msgstore.length?0:done.msgstore.length-(11+10*iter);
                  console.log('end: '+end);
                  var more =11+10*iter>=done.msgstore.length?0:1;
                  console.log('more: '+more);
                  done.msgstore = done.msgstore.slice(end,done.msgstore.length-(1+10*iter));
                  ms.trouble = 0;
                  ms.more = more;
                  ms.msgstore = done.msgstore;
                  res.send(ms);
                  }
                  else {
                   res.send(ms);
                  }
              }
              else {
                console.log('DOCUMENT ERR');
                res.send(ms);
              }
            }
          });
});

app.post('/msg',function (req,res){
 if(req.session._id) {
  console.log(req.body.txtbody);
  var msg ={};
  msg.sndr = req.session._id;
  //msg.textbody = req.body.txtbody.replace("\n","<br />");
  msg.textbody = req.body.txtbody.length>2700?req.body.txtbody.replace(/\n/g, '<br />').slice(0,2700):req.body.txtbody.replace(/\n/g, '<br />');
  console.log(msg.textbody);
  msg.tmstmp = Date.now();
  msg.read = 0;
  msg.userpic = req.session.userpic;
  msg.name = req.session.name;
   user_messages.update({user:req.body.rcvr},{$push:{msgstore:msg},$inc:{msgcount:1},$set:{lst_tmstmp:msg.tmstmp}});
  res.send('ok');
 }
 else {
  res.send(0);
 }
});

app.post('/stlstmsg',function (req,res){
  user_messages.update({"user":req.session._id,"msgstore.tmstmp" : parseInt(req.body.tmstmp)}, {$set : {"msgstore.$.read" : 1}});
  res.send('ok');
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

app.get('/session',function (req,res){
  res.send(req.session);
});

app.post('/signin',function (req,res){
  vphr=req.body.phr;
  vlgn=req.body.lgn; // email
  console.log(vphr+" , "+vlgn);
   var  ms = {};
  ms.trouble=1;
  ms.mtext='db';
  users.findOne({email:vlgn},function(err,confirmed){
    if (err)
      {res.send(ms);}
    else 
    {
      if(confirmed === null) 
      {
        ms.mtext='no user';
              res.send(ms);
      }
      else if (confirmed)
      {console.log('we have found :'+JSON.stringify(confirmed));
         
          if(bcrypt.compareSync(vphr,confirmed.phr))
          {
          req.session.email = confirmed.email;
          req.session.confirmed = confirmed.confirmed;
          req.session.name = confirmed.name;

          console.log("THAT'S WHAT I WROTE TO HIS COOKIES: "+JSON.stringify(req.session));
          ms.trouble = 0;
          ms.mtext= 'success';
          res.send(ms);
           }
           else {
            console.log('wrong pass');
            ms.mtext='wrong pas';
              res.send(ms);
              //WRONG PASSWORD
           }
         
      }
      else {
        ms.mtext= 'success';
          res.send(ms);
      }
    }
  });
});

//------------


app.post('/usrp',function (req,res) {
  console.log('upl!');
  if(req.session.email){
      if (req.files) 
    { 
      function upload(filepath,imageid){
                   console.log('into upload');
                   var oldPath = filepath;
                   console.log('UPLOAD 1 step, oldPath:'+ oldPath);
                   var newPath = __dirname +"/public/userpics/"+ imageid;
                   console.log('UPLOAD 2 step, newPath:' + newPath );
                    fs.readFile(oldPath , function(err, data) {
                      fs.writeFile(newPath, data, function(err) {
                          fs.unlink(oldPath, function(){
                              if(err) throw err;
                              gm(newPath).size(function (err, size) {
                                if(err){
                                  console.log(err);
                                }
                                else if(size.width>1024||size.height>1024){
                                  console.log('image is too large, going to resize ( '+size.width+'x'+size.height+' )');
                                  if(size.width>size.height){
                                    gm(newPath).resize(1024).write(newPath,function (err){
                                      if(err) {console.log(err);}
                                      else{
                                        var dest = '/userpics/'+imageid;
                                         res.render('crop',{'imgsrc':dest});
                                      }
                                    });
                                  }
                                  else {
                                    gm(newPath).resize(null,1024).write(newPath,function (err){
                                      if(err) {console.log(err);}
                                      else{
                                        var dest = '/userpics/'+imageid;
                                         res.render('crop',{'imgsrc':dest});
                                      }
                                    });
                                  }
                                }
                                else {
                                  var dest = '/userpics/'+imageid;
                                  res.render('crop',{'imgsrc':dest});
                                }
                              });  //resize
                          });//unlink temp
                    }); //write new
                 }); //read from temp
                 }
      upload(req.files.userpic.path,req.files.userpic.name);
   }
   else {
    console.log('problem with files');
    res.redirect('/');
   }}
   else {
    console.log('somebody messing with us?');
    res.redirect('/');
   }
});

app.post('/search',function(req,res){
  //confirmed:0,name:req.body.uname,age:req.body.uage,gender:req.body.ugen,city:req.body.ucity,city_name:req.body.ucity_name,about:req.body.uabout,email:req.body.uemail,phr:vp,regdate:Date.now(),token:vtoken,lang:'ru',userpic:0
  var query ={};
  if(req.body.user_location) {
    query.city = req.body.user_location;
  }
  if(req.body.gender) {
    query.gender = req.body.user_location;
  }
  if(req.body.ageform) {
    query.age={};
    query.age['$gte']=parseInt(req.body.agefrom);
  }
  if(req.body.ageto) {
    if(!query.age){
      query.age ={};
    }
    query.age['$lte']=parseInt(req.body.ageto);
  }
  console.log(JSON.stringify(query));
  var ms={};
  users.find(query,function(err,done){
    if(err){
      console.log('query err: '+err);
      res.send(ms);
    }
    else {
    ms =done;
    console.log(ms);
    res.send(ms);
    }
  })
});



app.post('/userp/crop',function (req,res){
  console.log('INTO CROP');
  console.log(req.body);
  if(req.session && req.session.email && is_email(req.session.email) && req.session._id && is_uid(req.session._id) && req.body.x1 && is_multiple(parseInt(req.body.x1)) && req.body.x2 && is_multiple(parseInt(req.body.x2)) && req.body.y1 && is_multiple(parseInt(req.body.y1)) && req.body.y2 && is_multiple(parseInt(req.body.y2)) && req.body.img)
    { var imgname = req.body.img.substring(10);
      var fullimgname = __dirname +"/public/userpics/"+ imgname;
      var output_path = __dirname +"/public/userpics/"+req.session._id+".png"; 
      var output_path_small = __dirname +"/public/userpics/"+req.session._id+"_small.png";
      console.log('############# 1 #############');
       path.exists(output_path, function(exists) { 
        console.log('############# 2 #############');
          if (exists) {
            console.log('############# 3 EXISTS #############');
            rm_images(res,req.session.email,parseInt(req.body.x1),parseInt(req.body.y1),parseInt(req.body.x2),parseInt(req.body.y2),output_path,fullimgname,output_path_small,make_userpic);
            }
            else{
              console.log('############# 3 #############');
               make_userpic(res,req.session.email,parseInt(req.body.x1),parseInt(req.body.y1),parseInt(req.body.x2),parseInt(req.body.y2),fullimgname,output_path,output_path_small);
            }
       });//PATH EXISTS USERPIC
    }
  else {
    //TODO REMOVE UPLOADED PIC
    console.log('CROP FAIL, REDIRECT');
    res.redirect('/');
  }
  });

function rm_images(res,_mail,x1,y1,x2,y2,output_path,fullimgname,output_path_small,callback) {
  console.log('############# 4 #############');
  fs.unlink(output_path, function(err){
    if(err) throw err;
    console.log('############# 5 #############');
        //fs.unlink(fullimgname, function(err){
        //  if(err) throw err;
        //  console.log('############# 6 #############');
                fs.unlink(output_path_small, function(err){
                  if(err) throw err;
                  console.log('############# 6 #############');
                  callback(res,_mail,x1,y1,x2,y2,fullimgname,output_path,output_path_small);
                });
              });
           //});
}

function make_userpic(res,_mail,x1,y1,x2,y2,fullimgname,output_path,output_path_small) {
  gm(fullimgname).size(function (err, size) {
    console.log('############# 4 #############');
                 if (err)
                   {//console.log(size.width > size.height ? 'wider' : 'taller than you');
                    console.log(err);
                   }
                 else if(size.width<300 || size.height<300) {
                  console.log('USERPIC ERR: TO SMALL');
                  var ms={};
                  ms.trouble = 1;
                  res.send(ms);
                 }
                 else {
                  console.log('############# 5 #############');
                  //gm(fullimgname).autoOrient().crop(x2, y2, x1, y1).resizeExact(300, 300).density(300, 300).write(output_path, function (err) {
                   gm(fullimgname).autoOrient().crop(x2, y2, x1, y1).resizeExact(300, 300).density(300, 300).write(output_path, function (err) {
                     if (err)
                      { console.log(err);
                        var ms={};
                        ms.trouble = 1;
                        res.send(ms);
                      }
                    else {
                      console.log('############# 6 #############');
                       gm(output_path).resizeExact(100, 100).write(output_path_small, function (err) {
                         if (err)
                          { console.log(err);
                            var ms={};
                            ms.trouble = 1;
                             res.send(ms);
                          }
                        else {
                          fs.unlink(fullimgname, function(err){
                            if(err) throw err;
                            console.log('############# 6 #############');
                            console.log('MK_USERPIC DONE;');
                            users.update({email:_mail},{$set:{userpic:1}});
                            var ms={};
                            ms.trouble=0;
                            res.send(ms);
                          });
                        }
                       });//CREATE _small 
                    }
                   });//CROP&RESIZE UPLOADED IMAGE
                 }
               });
}


//------------

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