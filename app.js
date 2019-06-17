var express         =     require('express');
 var passport          =     require('passport');
  var FacebookStrategy  =     require('passport-facebook').Strategy;
 var TwitterStrategy = require('passport-twitter').Strategy;
 var session           =     require('express-session');
var cookieParser      =     require('cookie-parser');
 var bodyParser        =     require('body-parser');
  var config            =     require('./configuration/config');
 var mysql             =     require('mysql');
 var async = require('async');
 var app               =     express();
 var urllib = require('urllib');
 var fs = require('fs');
var connection  = require('express-myconnection'); 

var routes = require('./routes');
var http = require('http');
var path = require('path');

//var detail = require('./routes/detail'); 




app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    
    connection(mysql,{
        
        host: 'localhost', //'localhost',
        user: 'root',
        password : '',
        port : 3306, //port mysql
        database:'mmf'

    },'pool') //or single

);


//Define MySQL parameter in Config.js file.
/*const pool = mysql.createPool({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database
});*/

//Define MySQL parameter in Config.js file.
/*var connection = mysql.createConnection({
  host     : config.host,
  user     : config.username,
  password : config.password,
  database : config.database
});

//Connect to Database only if Config.js parameter is set.

if(config.use_database==='true')
{
    connection.connect();
}*/
/*
var connection  = require('express-myconnection'); 
app.use(
    
    connection(mysql,{
        
        host: 'localhost', //'localhost',
        user: 'root',
        password : '',
        port : 3306, //port mysql
        database:'employee'

    },'pool') //or single

);*/

// Passport session setup.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});





// Use the FacebookStrategy within Passport.
  //console.log("test fb");

passport.use(new FacebookStrategy({
    clientID: config.facebook_api_key,
    clientSecret:config.facebook_api_secret ,
    callbackURL: config.callback_url
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
       //console.log(profile);
      //  pool.query("INSERT into emp(user_id,empname,age) VALUES('"+profile.id+"','"+profile.displayName+"',5)");
      //if(config.use_database) {
        // if sets to true
        connection.query("SELECT * from emp where user_id='"+profile.id+"'", (err,rows) => {
          if(err) throw err;
          if(rows && rows.length === 0) {
              console.log("There is no such user, adding now");
              connection.query("INSERT into emp(user_id,empname,age) VALUES('"+profile.id+"','"+profile.displayName+"',5)");
          } else {
              console.log("User already exists in database");
          }
        });
     // }
      return done(null, profile);
    });
  }
));

passport.use(new TwitterStrategy({
    consumerKey: config.twitter_api_key,
    consumerSecret:config.twitter_api_secret ,
    callbackURL: config.callback_urltwt
  },
  function(token, tokenSecret, profile, done) {
    process.nextTick(function () {
      //Check whether the User exists or not using profile.id
      //if(config.use_database==='true') {
      connection.query("SELECT * from emp where user_id='"+profile.id+"'",function(err,rows,fields){
        if(err) throw err;
        if(rows.length===0)
          {
            console.log("There is no such user, adding now");
            connection.query("INSERT into emp(user_id,empname) VALUES('"+profile.id+"','"+profile.username+"')");
          }
          else
            {
              console.log("User already exists in database");
            }
          });
     // }
      return done(null, profile);
    });
  }
));



//social login refferance url : https://codeforgeek.com/facebook-login-using-nodejs-express/ http://www.passportjs.org/docs/  

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', key: 'sid'}));
app.use(passport.initialize());
app.use(passport.session());
//app.use(express.favicon());
///app.use(express.json());
app.use(bodyParser.json());
//app.use(express.urlencoded());
app.use(express.methodOverride());

app.get('/', routes.index);



/*app.get('/', routes.index, function(req, res){
  console.log(res);
  res.render('index',{page_title:"Home Page",data:res});
  //res.render('social', { user: req.user });
});*/


/*app.get('/social', function(req, res){
  res.render('social', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
  res.render('account', { user: req.user });
});

app.get('/auth/facebook', passport.authenticate('facebook',{scope:'email'}));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect : '/', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
passport.authenticate('twitter', { successRedirect : '/', failureRedirect: '/login' }),
function(req, res) {
res.redirect('/');
});

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}*/
//app.use(app.router);
app.listen(4300);
