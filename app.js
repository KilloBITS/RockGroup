/* global __dirname */
var http = require("http");
var mysql = require('mysql');
var express = require('express');
var bParser = require('body-parser');
var session = require('express-session');
var SessionStore = require('express-mysql-session');
var favicon = require('serve-favicon');
var InstagramAPI = require('instagram-api');
var Twitter = require('twitter');
var router = express.Router();
var multiparty = require('multiparty');
//instagramm
var accessToken = '1040684835.1677ed0.fe461460d0ca4f7091b8ceca9d8ef33b';
var instagramAPI = new InstagramAPI(accessToken);

// instagram 
instagramAPI.userSelf().then(function(result) {
    // console.log(result.data); // user info 
    // console.log(result.limit); // api limit 
    // console.log(result.remaining) // api request remaining
  
}, function(err){
    console.log(err); // error info 
});

var client = new Twitter({
  consumer_key: 'NfCwQ0oqdTsHEdbvv2kPFXyBV',
  consumer_secret: 'OYuRCgf1VtDjjLzXYpJ4o113Lrdr8856hCyo6HXwhPX7gTUst6',
  access_token_key: '883733690135740416-lunnK5k7r0kaJK56loxg45OQeN099zw',
  access_token_secret: 'h93BXxRsQEdp2oRHgoRyLMWZ18eNoJEcAPsb1DLsnbl4h'
});

var app = express();
//Подключение к БД
   var options = {
      host: '127.0.0.1',
      user: 'GameAdmin',
      password: '159357',
      database: 'rockgroup',
      port: 3306
   };

var connection = mysql.createConnection(options);

app.use(session({
    secret: 'mySecretKey',
    saveUninitialized: true,
    resave: true
}));

app.use(bParser.urlencoded({extended: true}));
app.use(bParser.json());
app.use(express.static(__dirname + '/public/'));
/*app.use(favicon(__dirname + '/public/favicon.ico'));*/
const Folder = __dirname + '/public/media/';
const fs = require('fs');
var image = []; 
function insta(){
  image = []
  instagramAPI.userMedia("1040684835", accessToken).then(function(result){ 
      for (var i = 0; i < (result.data).length; i++) {
        var a = result.data[i];
        image.push(a.images.standard_resolution.url);
      } 
  });
}
insta();

var tweetsData = [];
function tweets(){
  client.get('search/tweets', {q: 'Pro100y_4elovek'}, function(error, tweets, response) {
    if (!error) {
      for (var ii = 0; ii < tweets.statuses.length; ii++) {
        tweetsData.push(tweets.statuses[ii])
      }
    }
  });
}
tweets();

//шаблоны
var NotLoginPassword = '{"Code":"450","error":"Неверный логин или пароль."}';
var BlockedAccaunt = '{"Code":"450","error":"Ваш аккаунт заблокирован. :("}';
var NotCaptcha = '{"Code":"450","error":"Неверная капча."}';
var DoubleUser = '{"Code":"450","error":"пользователь с таким ником уже сувществует!"}';
var NotDoublePassword = '{"code":"400","Error":"пароли не совпадают!"}';


//Вспомогательные функции времени
function serv_date(){
    Data = new Date();
    Year = Data.getFullYear();
    Month = Data.getMonth();
    Day = Data.getDate();
    Hour = Data.getHours();
    Minutes = Data.getMinutes();
    Seconds = Data.getSeconds();
    return 'date:['+Year+'-'+Month+'-'+Day+']| time['+Hour+":"+Minutes+":"+Seconds+"]";
}

//GET запросс на главную страницу 
app.get('/', function (req, res){
    var audio = [];
    fs.readdir(Folder, (err, files) => {
        for (var i = 0; i < files.length; i++){
            audio.push(files[i]);  
        }
    })        
    
    var news = [];
    connection.query("SELECT * FROM news ORDER BY timedate DESC", function(error,result) {
        if(news.length < result.length){
            for (var i = 0; i < result.length; i++){
    				news.push(result[i]);
    			}
        }
        res.render('index.ejs', { news: news, audio: audio, image: image, tweets: JSON.stringify(tweetsData)} );
    });      
});


setInterval(function(){
  connection.query("SELECT * FROM news ORDER BY timedate DESC", function(error,result) {});      
  tweetsData = [];
  image = [];
  insta();
  tweets();
}, 600000);

const fileUpload = require('express-fileupload');
app.use(fileUpload()); 
app.post('/uploadnews', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  let sampleFile = req.files.sampleFile;

  sampleFile.mv('public/image/news/'+req.files.sampleFile.name, function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });

    var name = req.body.newsname;
    var text = req.body.news;
    var link = req.body.fulllink;
    var filename = req.files.sampleFile.name;
    var now = new Date();
    connection.query("INSERT INTO news (`name`, `mintext`, `img`, `link`, `timedate`) VALUES ('"+name+"','"+text+"','"+filename+"','"+link+"','"+now+"')"); 
});

app.post('/uploadaudio', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
    let sampleFile = req.files.sampleFile;
  sampleFile.mv('public/media/'+ req.files.sampleFile.name, function(err) {
    if (err){
      return res.status(500).send(err); 
    }else
      return res.send('File uploaded!');;
  });    
});

app.post('/addalbum', function(req, res){
var name = req.body.name;
var album = req.body.album;
var now = new Date();

     connection.query("INSERT INTO music(`name`, `dates`, `musicname`) VALUES ('"+album+"','"+now+"','"+name+"')", function(error,result) {
        res.end("good");
     }); 
});

app.post('/addnewalbum', function(req, res){
  var name = req.body.name;
  connection.query("INSERT INTO albums(`name`) VALUES ('"+name+"')", function(error,result) {
    res.end("good");
  }); 
});


app.post('/audioinformation', function(req, res){
var name = req.body.name;
  connection.query("SELECT * FROM `music` WHERE musicname='"+name+"'", function(error,result) {
      res.end(JSON.stringify(result));
  });   
});

app.post('/deletenews', function(req, res){
var name = req.body.name;
var deldata = [];
  connection.query("SELECT * FROM `news` WHERE name='"+name+"'", function(error,result) {
  deldata.push(result);
    connection.query("DELETE FROM `news` WHERE name='"+deldata[0][0].name+"'", function(error,result) {
      if(!error){
        var filePath = 'public/image/news/'+deldata[0][0].img; 
        fs.unlinkSync(filePath);
        res.end("good");
      }    
    }); 
  });   
});

app.post('/deletealbums', function(req, res){
var name = req.body.name;
var deldata = [];
  connection.query("SELECT * FROM `albums` WHERE name='"+name+"'", function(error,result) {
  deldata.push(result);
    connection.query("DELETE FROM `albums` WHERE name='"+deldata[0][0].name+"'", function(error,result) {
      if(!error){
        res.end("good");
      }    
    }); 
  });   
});

app.post('/deleteaudio', function(req, res){
var name = req.body.name;
var deldata = [];

  connection.query("SELECT * FROM `music` WHERE musicname='"+name+"'", function(error,result) {
    deldata.push(result);
    connection.query("DELETE FROM `music` WHERE musicname='"+deldata[0][0].musicname+"'", function(error,result) {
      if(!error){
        var filePath = 'public/media/'+deldata[0][0].musicname; 
        fs.unlinkSync(filePath);
        res.end("good");
      }    
    }); 
  });   
});


app.get('/authAdminUser', function(req, res){
  res.render('auth.ejs')
})


app.get('/admin', function (req, res) {
var login = req.query['name'];
var pass = req.query['pass'];
var news = [];
connection.query("SELECT * FROM news ORDER BY timedate DESC", function(error,result) {
  if(news.length < result.length){
      for (var i = 0; i < result.length; i++){
      news.push(result[i]);
    }
  }
}); 

  connection.query("SELECT * FROM admin WHERE login='"+req.query['name']+"'", function (error, result){
    if(JSON.stringify(result) !== "[]"){
      if(req.query['pass'] === result[0].pass || req.query['name'] === result[0].login){
        connection.query("SELECT * FROM albums", function (error, result){
          var albums = [];
          for (var alb = 0; alb <  result.length; alb++) {
            albums.push(result[alb]);
          }
          fs.readdir(Folder, (err, files) => {
            var audios = [];
              for (var i = 0; i < files.length; i++){
                  audios.push(files[i]);  
              }
              res.render('admin.ejs', {album: albums, news: news, audio: audios});
          })
        });        
      }else{
        res.render('error.ejs');
      }   
    }else{
      res.render('error.ejs');
    }
  })
});


app.get('*', function(req, res){
   res.render('error404.ejs')
});

app.listen(3000, function(){
    console.log('port 3000');
});