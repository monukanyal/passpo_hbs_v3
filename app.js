const express = require('express');
var app = express();
const path = require('path');
const md5=require('md5');
const mv = require('mv');  //its for chokidar
//var morgan = require('morgan'); //http request logger
const flash = require('connect-flash');
const mongoose=require('mongoose');
const chokidar = require('chokidar');
const fileUpload = require('express-fileupload');
//const Song=require('./Models/Songs.js'); //including model
var compression = require('compression');
const exphbs  = require('express-handlebars');
app.engine('hbs', exphbs({extname:'hbs',defaultLayout: 'layout1',layoutsDir:__dirname+'/views/layouts', helpers:{
    math: function(lvalue, operator, rvalue) {lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    }
  }}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// var helmet = require('helmet');
// app.use(helmet());
/*---------------------------

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url ="mongodb://Esfera:esfera456@ds133547.mlab.com:33547/esferasoft";

------------------------------*/

var port =process.env.PORT || 8080;
var http=require('http').Server(app);
var io=require('socket.io')(http);
       http.listen(port);

// var rn = require('random-number');
// var gen = rn.generator({
//   min:  0
// , max:  100
// , integer: true
// })
// var randomColor = require('randomcolor'); // import the script 

const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
var User=require('./Models/user.js');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn('/');

/*------Mongoose Connection setup----------*/
//mongoose.connect('mongodb://localhost/esferasoft', { useMongoClient: true }); //locally
mongoose.connect('mongodb://esfera:esfera@ds251277.mlab.com:51277/passpo', { useMongoClient: true });  //live
mongoose.Promise = global.Promise;
const MongoStore = require('connect-mongo')(session);
/*------Mongoose Connection setup End----------*/

/*---------------passport start------------------*/
passport.use(new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
},
  function(username, password, done) {
    password=md5(password);
    console.log(username);
    console.log(password);

    User.findOne({ email:username,password:password }, function(err, userdata) {
      console.log(userdata);
      console.log(err);
      if (err) { return done(err); }
      if (!userdata) {
        return done(null, null);
      }
      return done(null, userdata);
    });
  }
));

/*passport.use(new LocalStrategy(

  function(username, password, done) {
     password=md5(password);
      MongoClient.connect('mongodb://localhost/esferasoft', function(err, db) {
        //console.log(err);
          if (err) throw err;
          var query = { email: username,password:password };
          db.collection("users").find(query).toArray(function(err, user) {
            if (err) { return done(err); }
            console.log(user);
            //console.log(err);
              if (user.length<=0) {

                return done(null, null);
              }
              else
              {

               return done(null, user);
              }
              
            db.close();

          });
    });

  }
));*/

passport.use(new GoogleStrategy({
    clientID: "859074425212-eqri6b6ftrqieb02go89k819gajrp9d7.apps.googleusercontent.com",
    clientSecret: "vfBjj4VLh-YEhjDq12c9Pnyj",
    //callbackURL: "https://young-lowlands-73461.herokuapp.com/auth/google/callback"
    callbackURL: "http://localhost:8080/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {

  var query=User.findOne({ email:profile.emails[0].value });
     query.exec().then((userdata)=>{
      if (!userdata) {
          var newUser=new User();
          newUser.Name=profile.displayName;
          newUser.email=profile.emails[0].value;
          newUser.password='';
          newUser.logintype='google';
          newUser.save().then((results)=>{
              return done(null, results);
          }).catch((err)=>{
            res.status(400).json({ error: err });
          });
      }
      else
      {
        return done(null, userdata);
      }
       
  }).catch((err)=>{
      return done(null,null);
  });
}

));


FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: "1577219845726179",
    clientSecret: "e85a6c092d15cfb3249d1a8945411006",
    callbackURL: "https://young-lowlands-73461.herokuapp.com/auth/facebook/callback",
    profileFields: ['id', 'emails', 'name']
  },
  function(accessToken, refreshToken, profile, done) {

       var query=User.findOne({ email:profile.emails[0].value });
     query.exec().then((userdata)=>{
      if (!userdata) {
          var newUser=new User();
          newUser.Name=profile.name.givenName;
          newUser.email=profile.emails[0].value;
          newUser.password='';
          newUser.logintype='fb';
          newUser.save().then((results)=>{
              return done(null, results);
          }).catch((err)=>{
            res.status(400).json({ error: err });
          });
      }
      else
      {
        return done(null, userdata);
      }
       
  }).catch((err)=>{
      return done(null,null);
  });



  }
));

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


LineStrategy = require('passport-line').Strategy;
passport.use(new LineStrategy({
    channelID:"1574984661",
    channelSecret:"6774f29a866088ed14210becd49d3cfd",
    callbackURL: "http://localhost:8080/auth/line/callback"
  },
  function(accessToken, refreshToken, profile, done) {
     
    var query=User.findOne({ email:profile.id });
     query.exec().then((userdata)=>{

      if (!userdata) {
          var newUser=new User();
          newUser.Name=profile.displayName;
          newUser.email=profile.id;
          newUser.password='';
          newUser.logintype='line';
          newUser.save().then((results)=>{
              return done(null, results);
          }).catch((err)=>{
            res.status(400).json({ error: err });
          });
      }
      else
      {
        return done(null, userdata);
      }
       
  }).catch((err)=>{
      return done(null,null);
  });

  }
));

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

/*------------passport strategy end--------------------------*/

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
app.use(compression()); //use compression 
app.use(favicon(path.join(__dirname, 'public', 'fav.png')));
app.use(fileUpload());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(cookieParser());

app.use(
  session({
    secret: 'shhhhhhhhh',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ url: 'mongodb://esfera:esfera@ds251277.mlab.com:51277/passpo' }),
     ttl: 1 * 24 * 60 * 60 
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/static', express.static(path.join(__dirname, 'public')))

//app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

/*------routes Define---------------------*/
const routes = require('./routes/index.js');
const Users = require('./routes/user.js');
const Book = require('./routes/Book.js');

app.use('/', routes);
app.use('/dashboard', Users);
app.use('/books', Book);

/*---------routes end---------------------*/

/*--chokiii---*/
//var paths="/Users/macmini/Downloads/alldownloads"  //mac
/*var paths="/home/ip-d/Downloads/alldownloads"  //ubuntu
var j=0;
chokidar.watch(paths, {usePolling: true,
  interval: 100,
  atomic:true }).on('all', function(event, file) {
    //console.log(event+' :'+file);

   if (path.extname(file) === '.mp3') {    
      var newfile=file.replace(path.basename(file), "");
        console.log("Mp3 path: " + newfile);
        console.log("event: " + event);
      
      if(event=="add" || event =="change" || event =="addDir") 
      {
         
            //console.log("Mp3 basename: " + path.basename(file)) ;
             mv(file, "./public/audio/"+path.basename(file), {clobber: false},function(err) {
                console.log(err);
                if(err!=null)
                {
                      if(err['code']=='EEXIST')
                      {
                        console.log('already exist file');
                      }
                
               }
               else
                {
                   //db update 
                   //console.log('db updating');
                   var newSong=new Song();
                      newSong.Title=path.basename(file);
                      newSong.filepath=path.basename(file);
                      newSong.Category='Normal';
                      newSong.save().then((results)=>{
                        // console.log('db updated:'+results);
                      }).catch((err)=>{
                        console.log('db updated err:'+err);
                      });
                }
                
              });
  
              
        }
        // else if (event == 'unlink')
        // {     
        //    console.log("removing MP3");
        //      //movieService.removeData(file);
     
        // }
   }
});*/
  /*---chokiii end--*/

/*io.on('connection', function(socket){

     // console.log('socket started');
      socket.on('req_fetchinfo', function(room){
            socket.join(room);
            var value=gen();
             //var color=randomColor();
            io.to(room).emit('get_fetchinfo',value);
      });
});*/
        

// error handler 
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)
 
  // handle CSRF token errors here 
  res.status(403)
  res.send('Something is wrong in request,Please try again later');
})


