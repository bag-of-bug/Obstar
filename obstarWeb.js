
const fs = require("fs");
const util = require("util");
var log_file_err=fs.createWriteStream(__dirname + '/web_error.log',{flags:'a'});

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err.stack);
  log_file_err.write(util.format('Caught exception: '+err) + '\n');
});

var http         = require('http');
var express      = require('express');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var Vec          = require('victor');

var app          = express();
var c = require('./lib/config.js').config;
var USERS = c.MYSQL ? require('mysql').createPool(require('./lib/webMysql.js').info) : 0;
///
var LEADERBOARD = [];
var SHOP = {HIDE:1};
var SHOPPER = {};
///
if(USERS){
  USERS.getConnection(function(err) {
    if (err) throw err;
    console.log("connect database");
  });
  if(c.DB.LB){
    let updateLB = ()=>{
      USERS.query('SELECT score, name, tank, gm, DATE_FORMAT(date, "%d-%m-%Y") AS date FROM wrs ORDER BY score DESC',function(err,leader){
        if (err) throw(err);
        LEADERBOARD = leader;
      })
    };
    updateLB();
    setInterval(updateLB,120000);
  }
  if(c.DB.SHOP){
    let updateShop = ()=>{
      USERS.query('SELECT class, id, label, price FROM shop',function(err,shop){
        if (err) throw(err);
        shop.forEach((item)=>{
          SHOP[item.class] = SHOP[item.class] || [];
          SHOP[item.class][item.id] = {
            label: item.label,
            price: item.price,
          }
        })
      })
    };
    updateShop();
    setInterval(updateShop,120000);
  } else {
    SHOP.HIDE = 1
  }
}
///
var generateKey = (()=>{
  let str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
  return (length)=>{
    return new Array(length).fill(0).map((x)=>{return str[parseInt(Math.random()*str.length)]}).join('');
  }
})()
var basicKey = '0'.repeat(25);
///
app.use( express.static(__dirname+'/public'));
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use( cookieParser() );


app.get('/favicon.ico', async function(req,res){res.status(404).end()});
app.get('*', function(request, respond){
    let id = parseInt(Math.random()*1000);
    var KEY = request.cookies.obstarkey || 1;
    /// get the acc///
    if(USERS && c.DB.AC){
      USERS.query('SELECT * FROM acc WHERE userKey LIKE ?',[KEY],function(err,result,fields){
        if(result && result.length && result[0]){ ///   THERE IS AN ACC  ///
          USERS.query("UPDATE acc SET lastConnection = NOW() WHERE userKey = ?",[KEY],function(err){if(err){throw(err)}});
          respond.cookie('obstarkey',KEY,{expires: new Date(253402300000000),sameSite:'Lax'});
          let sendData = {
            key:KEY,
            leader: LEADERBOARD,
            shop: SHOP
          };
          respond.render('index.ejs', {data:JSON.stringify(sendData)});
          return;
        } else {           /// there is no acc :-(///
          let newkey = generateKey(25);
          USERS.query("INSERT INTO acc VALUES (NULL,?,?,?,NOW(),255000)",[
            newkey,
            JSON.stringify({own:{pets:{}}}),
            request.connection.remoteAddress
          ]);
          respond.cookie('obstarkey',newkey,{expires: new Date(253402300000000),sameSite:'Lax'});
          let sendData = {
            key:newkey,
            leader: LEADERBOARD,
            shop: SHOP
          };
          respond.render('index.ejs', {data:JSON.stringify(sendData)});
          return;
        }
      });
    } else {
      let sendData = {
        key: basicKey,
        leader: LEADERBOARD,
        shop: SHOP
      };
      respond.render('index.ejs', {data:JSON.stringify(sendData)});
    }
});
app.post('/userData', function(req,res){
  if(USERS && c.DB.ACC){
    USERS.query('SELECT userData, coins FROM acc WHERE userKey = ?',[req.body.userKey],function(err,result,fields){
      if(result.length){
        let data = JSON.parse(result[0].userData);
        data.coins = result[0].coins;
        res.status(200).send(JSON.stringify(data));
      } else {
        res.status(200).send('none');
      }
    });
  } else {
    res.status(200).send('none');
  }
});
app.post('/buy',function(req,res){
  if(!USERS || !c.DB.ACC || !c.DB.SHOP){
    res.status(200).send('no obj');
    return;
  }
  if(SHOPPER[req.body.userKey]){
    res.status(200).send('already');
    return;
  } else {
    SHOPPER[req.body.userKey] = 1;
  }
  if(isNaN(parseInt(req.body.id)) || !req.body.class || !SHOP[req.body.class] || !SHOP[req.body.class][req.body.id]){
    delete SHOPPER[req.body.userKey];
    res.status(200).send('no obj');
    return;
  }
  var obj = SHOP[req.body.class][req.body.id], objC = req.body.class, objId = req.body.id;
  USERS.query('SELECT userData, coins FROM acc WHERE userKey = ?',[req.body.userKey],function(err,result,fields){
    if(result.length && result[0].userData){
      let user = JSON.parse(result[0].userData);
      ///
      if(user.own && user.own[objC] && user.own[objC][objId]){
        delete SHOPPER[req.body.userKey];
        res.status(200).send('owned');
      } else if(obj.price <= result[0].coins){
        user.own = user.own || {};
        user.own[objC] = user.own[objC] || {};
        user.own[objC][objId] = 1;
        user.coins = result[0].coins-obj.price;
        let stringUser = JSON.stringify(user);
        USERS.query("UPDATE acc SET userData = ?, coins = ? WHERE userKey = ?",[stringUser,user.coins,req.body.userKey],function(err){
          if(err) throw(err);
          delete SHOPPER[req.body.userKey];
        });
        res.status(200).send(stringUser);
      } else {
        delete SHOPPER[req.body.userKey];
        res.status(200).send('no coins');
      }
    } else {
      delete SHOPPER[req.body.userKey];
      res.status(200).send('no user');
    }
  });
})
app.post('/play',function(request, respond){
  let sendData = {
    key:request.cookies.obstarkey || 0,
    gm:request.body.gm || 'ffa',
    name:request.body.name || 'unnamed',
    pet:request.body.pet
  }
  let pref = {
      name: (sendData.name == 'unamed') ? '' : sendData.name,
      pet:  sendData.pet || -1
    }
  respond.cookie('preference',pref,{expires: new Date(253402300000000), sameSite:'Strict'});
  respond.render('play.ejs', {data:JSON.stringify(sendData)});
});
var server    = http.createServer(app);
server.listen(process.env.PORT || 80, () => {
    console.log(`Server started on port ${server.address().port}`);
});
