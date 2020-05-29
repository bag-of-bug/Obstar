const fs = require("fs");
const util = require("util");
var log_file_err=fs.createWriteStream(__dirname + '/error.log',{flags:'a'});
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err.stack);
  log_file_err.write(util.format('Caught exception: '+err) + '\n');
});

var c            = require('./lib/config.js').config;
var Vec          = require('victor');
var USERS = c.MYSQL ? require('mysql').createPool(require('./lib/AlexMysql.js').info) : 0;
if (USERS) {
  USERS.getConnection(function(err) {
    if (err) throw err;
    console.log("connect database");
});
}
///
var http = require('http');
var server = http.createServer(function(request, response) {
    response.writeHead(404);
    response.end();
});
var WebSocket = require('ws');
var ws        = (function(){

  let PROTO = require('./public/SHARE/SocketSchema.js');

  function income(socket,packet){
    if(socket.main){
      socket.main.request++;
    }
    let data = PROTO.decode(packet);
    ///
    if(data.error){
      kick(socket,data.error);
      return;
    }
    switch(data.type){
      case 'ping':
        if(socket.main){
          socket.main.heartbeats = 0;
        }
      case 'init':{
        if(socket.main){
          break;
        }
        socket.id = Controller.askConnection(data.data, socket._socket.remoteAddress);
        socket.main = new loop(socket);
        break;
      };
      case 'keydown':{
        socket.main.request -= .5;
        let tank = Controller.getPlayer(socket.id);
        if(!Controller.getPlayer(socket.id)){ break; }
        switch(data.data.key){
          case 'a':
          case 'w':
          case 's':
          case 'd':
          case 'arrw':
          case 'arrs':
          case 'arra':
          case 'arrd':
          case 'mouseL':
          case 'mouseR':
            tank.inputs[data.data.key] = 1;
            break;
          case 'c':
          case 'e':
            tank.inputs[data.data.key] = !tank.inputs[data.data.key]*1
            break;
        }
        break;
      };
      case 'keyup':{
        socket.main.request -= .5;
        let tank = Controller.getPlayer(socket.id);
        if(!Controller.getPlayer(socket.id)){ break; }
        switch(data.data.key){
          case 'a':
          case 'w':
          case 's':
          case 'd':
          case 'arrw':
          case 'arrs':
          case 'arra':
          case 'arrd':
          case 'mouseL':
          case 'mouseR':{
            tank.inputs[data.data.key] = 0;
            break;
          };
          case 'enter':{
            let ans = Controller.respawn(socket.id);
            let tank = Controller.getPlayer(socket.id);
            if(!tank && ! ans){ break; }
            talk(socket,'UpdateUp',tank.upNb);
            break;
          };
        }
        break;
      };
      case 'mousemove':{
        let tank = Controller.getPlayer(socket.id);
        if(!Controller.getPlayer(socket.id)){ break; }
        if(tank.botMod){break;}
        tank.dir = data.data.dir;
        tank.inputs.mouse_x = data.data.x*tank.screen;
        tank.inputs.mouse_y = data.data.y*tank.screen*0.5625;
        break;
      };
      case 'upgrade':{
        let tank = Controller.getPlayer(socket.id);
        if(!tank){ break; }
        tank.upgrade(data.data.up);
        talk(socket,'UpdateUp',tank.upNb);
        break;
      };
      case 'upClass':{
        let tank = Controller.getPlayer(socket.id);
        if(!tank){ break; }
        tank.upClass(data.data.up);
      };
      case 'com':{
        socket.main.request+=4;
        let ans = Controller.command(socket.id,data.data);
        if(ans){
          talk(socket,'comResponse',ans);
        }
        break;
      };
      case 'chat':{
        socket.main.request+=4;
        if(socket.main.chat){
          talk(socket,'chatUpdate', [['','Please wait a little.']]);
          break;
        }
        socket.main.chat+=20;
        Controller.chat.add(socket.id,data.data);
        break;
      };
    }
  };

  function loop(socket){
    this.socket = socket;
    this.strikes = 0;
    this.dead = 0;
    this.request = 0;
    this.heartbeats = 0;
    this.run = 1;
    this.chat = 0;
    this.gameloop = function(){
      if(!this.run){return;}
      if(this.chat){
        this.chat--;
      }
      let id = Controller.clients[this.socket.id];
      let ms = 30;
      ///
      switch(id){
        case 'Waiting':{
          ms = 200;
          break;
        }
        case 'ERR_GAMEMODE':
        case 'ERR_DOUBLE_IP':
        case 'ERR_BROKEN_KEY':
        case 'ERR_SERVER_FULL':
        case 'ERR_SERVER_OFF':
        case 'ERR_REQUESTS_DELAY':
        case 'ERR_PACKET_LENGTH':
        case 'ERR_HEARTBEATS_LOST':
        case 'ERR_DOUBLE_ACC':
        case 'ERR_PACKET_TYPE':{
          console.log(id);
          kick(this.socket,id);
          break;
        }
        default:{
          let buff = Controller.getBuffer(socket.id);
          if(buff){
            talk(this.socket,'GameUpdate',buff);
          } else {
            ms = 200;
          }
          let mess = Controller.chat.get(socket.id);
          if(mess){
            talk(this.socket,'chatUpdate',mess);
          }
          break;
        }
      }
      ///
      setTimeout((it)=>{it.gameloop()},ms,this);
    };
    this.longloop = function(){
      if(!this.run){return;}
      ///REQUEST
      if(this.request >= 50){
        kick(this.socket,'ERR_REQUESTS_DELAY')
        return;
      } else {
        this.request = 0;
        this.strikes = 0;
      }
      ///DEAD
      let play = Controller.getPlayer(socket.id);
      if(this.dead>c.S_BEFORE_KICK){
        kick(this.socket,'ERR_SERVER_OFF');
        return;
      }
      if(play){
        if(play.dead){
          this.dead++;
        } else {
          this.dead = 0;
        }
      };
      ///HEARTBEATS
      if(this.heartbeats >= 10){
        kick(this.socket,'ERR_HEARTBEATS_LOST');
      } else {
        talk(this.socket,'ping',0);
        let ui = Controller.getUi(this.socket.id);
        if(ui){
          talk(this.socket,'UiUpdate',ui);
        }
      }
      this.heartbeats++;
      /////
      setTimeout((it)=>{it.longloop()},1000,this);
    };
    this.gameloop();
    this.longloop();
  };

  function talk(socket,type,data){
    socket.send(PROTO.encode(type,data));
  };

  function kick(socket,reason){
    if(socket.main){
      socket.main.run = 0;
    };
    console.log('KICKED id:'+socket.id+'//'+reason)
    socket.send(PROTO.encode('kick',reason));
    Controller.disconnect(socket.id, socket._socket.remoteAddress);
    setTimeout((s)=>{s.close()},100,socket);
  }

  let wss = new WebSocket.Server({server});
  wss.on('connection', function(socket){
    socket.id = 'Waiting';
    socket.on('message', (packet)=>{income(socket,packet)});
    socket.on('close', () => {})
  });
  return wss;
})();
server.listen(process.env.PORT || 8080, () => {
    console.log(`Server started on port ${server.address().port}`);
});

const TanksConfig = require('./public/SHARE/TanksConfig.js');
const cc = (()=>{
  return new function(){
    this.Reset = "\x1b[0m";
    this.Bright = "\x1b[1m";
    this.Dim = "\x1b[2m";
    this.Underscore = "\x1b[4m";
    this.Blink = "\x1b[5m";
    this.Reverse = "\x1b[7m";
    this.Hidden = "\x1b[8m";

    this.FgBlack = "\x1b[30m";
    this.FgRed = "\x1b[31m";
    this.FgGreen = "\x1b[32m";
    this.FgYellow = "\x1b[33m";
    this.FgBlue = "\x1b[34m";
    this.FgMagenta = "\x1b[35m";
    this.FgCyan = "\x1b[36m";
    this.FgWhite = "\x1b[37m";

    this.BgBlack = "\x1b[40m";
    this.BgRed = "\x1b[41m";
    this.BgGreen = "\x1b[42m";
    this.BgYellow = "\x1b[43m";
    this.BgBlue = "\x1b[44m";
    this.BgMagenta = "\x1b[45m";
    this.BgCyan = "\x1b[46m";
  }
})()
///
const FRICTION = 0.964;
const CLASS = TanksConfig.class;
const CLASS_TREE = TanksConfig.tree;
var CONFIG = {
  'BOTS':[
    function(){
      if(isNaN(this.path)){
        this.path = CONFIG.BOT_PATHS[parseInt(Math.random()*CONFIG.BOT_PATHS.length)]
      }
      if(this.stillLvl){
        this.upgrade(CONFIG.BOT_UPS[this.path.up ? this.path.up : 0][this.stillLvl]);
      }
      if(this.shield && this.xp<25000){
        this.shield--;
        this.inputs.e = 0;
        return;
        if(!this.dir){
          this.dir = Math.random()*Math.PI*2;
        }
      }
      this.upClass(this.path.class[this.classLvl]);
      if(!this.DETEC){
        this.DETEC = new Detector(this,this.x,this.y,this.screen/2,['Player','Objects','Bullet'],0,1)
        this.DETEC.team = this.team;
      } else {
        this.DETEC.size = this.screen/2;
        this.DETEC.x = this.x;
        this.DETEC.y = this.y;
      };
      if(!this.botMod){
        this.botMod = 'search';
      } else {
        let all = this.DETEC.selectAll;
        if(all.Objects.length+all.Player.length+all.Bullet.length > 0 && !this.running){
          let tresh = CONFIG.botThreshold;
          let farm = 0, run = 0, attack = 0;
          farm = Math.min(all.Objects.length,5)/tresh.farm
          for(let obj of all.Bullet){
            let dis = this.screen/Math.sqrt(Math.pow(this.x-obj.x,2)+Math.pow(this.y-obj.y,2))
            run+=obj.pene*obj.damage*dis;
          }
          for(let obj of all.Player){
            let dis = this.screen/Math.sqrt(Math.pow(this.x-obj.x,2)+Math.pow(this.y-obj.y,2))
            run+=obj.hp*dis*obj.damage/tresh.playerRun;
          }
          run/=this.hp*Math.max(1,this.level/10)*tresh.run;
          if(this.DETEC.select.constructor.name == 'Player'){
            other = this.DETEC.select;
            attack += Math.min(Math.pow(other.xp/tresh.attackxpBase,1.4),tresh.attackxpMax)/tresh.attackxpDivide*Math.max(1,this.level/other.level)*(1/(1+other.hp/tresh.attackHp))*(1/(1+this.DETEC.dis/tresh.attackDis))*this.hp/tresh.attack;
          }
          this.run = run;
          this.attack = attack;
          this.farm = farm;
          if(run>=attack && run>tresh.minRun){
            if(run>=farm){
              this.botMod = 'run';
            } else {
              this.botMod = 'farm';
            }
          } else if(farm>=attack){
            this.botMod = 'farm';
          } else {
            this.botMod = 'attack';
          }
          if(run+attack+farm <= 0){
            this.botMod = 'search';
          }
        } else {
          if(!this.running){
            this.botMod = 'search';
          }
        }
      }
      ///
      if(this.botMod == 'run'){
        if(this.running){
          this.running--;
        } else {
          this.running = 10;
        }
      }
      ///
      if(this.spin && Math.random()<=0.002) {
        this.spin = -this.spin;
      }
      let dir = 0;
      let len = 0.35+this.up.MSpeed-(this.level/155);
      this.inputs.e = 1;
      switch(this.botMod){
        case 'farm':{
          this.spin = 0;
          let oldDis = this.screen;
          let selected = 0;
          for(let obj of this.DETEC.selectAll.Objects){
            let dis = Math.sqrt(Math.pow(this.x-obj.x,2)+Math.pow(this.y-obj.y,2)*2);
            if(dis<oldDis){
              oldDis = dis;
              selected = obj;
            }
          };
          if(!selected){break;}
          if(oldDis>CONFIG.botThreshold.farmDis*len+this.size+selected.size){
            dir = Math.atan2(selected.y-this.y,selected.x-this.x);
            this.autoDir = dir;
          } else {
            this.autoDir = Math.atan2(selected.y-this.y,selected.x-this.x);
            len = 0;
          }
          break;
        };
        case 'run':{
          let med = 0;
          let x = 0;
          let y = 0;
          for(let bull of this.DETEC.selectAll.Bullet){
            let dis = this.screen/Math.sqrt(Math.pow(this.x-bull.x,2)+Math.pow(this.y-bull.y,2)*2)/CONFIG.botThreshold.runDis;
            med+=bull.pene*bull.damage*dis;
            x+=bull.x*bull.pene*bull.damage*dis;
            y+=bull.y*bull.pene*bull.damage*dis;
          };
          for(let bull of this.DETEC.selectAll.Player){
            let dis = this.screen/Math.sqrt(Math.pow(this.x-bull.x,2)+Math.pow(this.y-bull.y,2)*2)/CONFIG.botThreshold.runDis;
            med+= bull.hp/CONFIG.botThreshold.runHp*bull.damage*dis;
            x+=bull.x*bull.hp/CONFIG.botThreshold.runHp*bull.damage*dis;
            y+=bull.y*bull.hp/CONFIG.botThreshold.runHp*bull.damage*dis;
          };
          if(!med){
            dir = Math.PI-this.autoDir;
            break;
          }
          y/=med;
          x/=med;
          if(!this.spin){
            this.spin = Math.sign(Math.random()*10-5);
          }
          let dis = Math.sqrt(Math.pow(this.x-x,2)+Math.pow(this.x-x,2));
          this.autoDir = Math.atan2(y-this.y,x-this.x);
          dir = Math.PI+this.autoDir;
          dir += this.spin*Math.PI*Math.min(1,Math.sqrt(dis/this.screen))/1.9;
          break;
        };
        case 'attack':{
          if(!this.spin){
            this.spin = Math.sign(Math.random()*10-5);
          }
          let other = this.DETEC.select;
          dis = Math.sqrt(Math.pow(this.x-other.x,2)+Math.pow(this.y-other.y,2));
          this.autoDir = Math.atan2(other.y+other.vec.y*dis/12-this.y,other.x+other.vec.x*dis/12-this.x);
          dir = this.spin*Math.PI*Math.min(1,100/dis)/2.5 + this.autoDir;
          break;
        };
        case 'search':
        default:{
          if(!this.spin){
            this.spin = Math.sign(Math.random()*10-5);
          }
          let dis = Math.sqrt((this.x*this.x)+(this.y*this.y));
          dir = Math.atan2(this.y,this.x);
          dir-=Math.PI*Math.min(1,(dis/this.map.width));
          this.autoDir = dir;
          this.inputs.e = 0;
          break;
        };
      }
      this.dir = Math.atan2(
        Math.sin(this.dir)+(Math.sin(this.autoDir)-Math.sin(this.dir))*0.3,
        Math.cos(this.dir)+(Math.cos(this.autoDir)-Math.cos(this.dir))*0.3
      );
      //this.name = this.botMod+' '+parseInt(this.farm*100)+' '+parseInt(this.attack*100)+' '+parseInt(this.run*100)
      ///
      dir = Math.atan2(Math.sin(dir),Math.cos(dir));
      let tresh = Math.PI/3;
      let vdir = dir+Math.PI;
      let hdir = Math.abs(dir);
      let motion = new Vec(0,0);
      if(Math.abs(Math.PI*.5-vdir)<=tresh){motion.y-=len;}
      if(Math.abs(Math.PI*1.5-vdir)<=tresh){motion.y+=len;}
      if(Math.abs(Math.PI-hdir)<=tresh){motion.x-=len;}
      if(hdir<=tresh){motion.x+=len;}
      if(motion.length() > 0){
        this.vec.add(motion.norm().multiply(new Vec(len,len)));
        if(this.alpha<1){
          this.alpha+=Math.min(1,CLASS[this.class].alpha*10);
        }
        if(this.shield){
          this.shield = 0;
        }
      }
      ///
      this.vec.x*=FRICTION;
      this.vec.y*=FRICTION;
      this.x+=this.vec.x;
      this.y+=this.vec.y;
      ///
      if(this.x<-this.map.width/2){
        this.x = -this.map.width/2;
        this.vec.x = 0;
      };
      if(this.y<-this.map.height/2){
        this.y = -this.map.height/2;
        this.vec.y = 0;
      };
      if(this.x> this.map.width/2){
        this.x = this.map.width/2;
        this.vec.x = 0;
      };
      if(this.y> this.map.height/2){
        this.y = this.map.height/2;
        this.vec.y =  0;
      };
      if(this.DETEC){
        this.DETEC.reset();
      }
      if(this.size<=0){this.inputs.e = 0;}
      //this.inputs.c = 1;
    }
  ],
  'BOT_NAMES':'./name.js',
  'BOT_PATHS':[
    {
      class:['Twin','Triple','Treble'],
    },
    {
      class:['Twin','Triple','Penta Shot'],
    },
    {
      class:['Twin','Quad Shot','Octo Shot'],
    },
    {
      class:['Twin','Quad Shot','Cyclone']
    },
    {
      class:['Sniper','Trapper','Fortress'],
    },
    {
      class:['Sniper','Assasin','Ranger'],
      up: 1
    },
    {
      class:['Sniper','Assasin','Sprayer'],
      up: 1
    },
  ],
  'BOT_UPS':[
    [1,3,4,3,1,4,3,3,3,
     2,2,1,6,6,3,4,2,1,
     2,6,1,1,0,0,7,2,1],
     ///SNIPER
    [1,1,3,3,4,4,2,2,2,
      2,3,4,2,3,4,1,1,4,
      1,1,3,3,4,0,0,0,4]
  ],
  'botThreshold':{
    farm: 300,
    attack: 11,
    attackHp: 20,
    attackDis: 15,
    attackxpBase: 90,
    attackxpDivide: 45000,
    attackxpMax: 45000,
    run: 350,
    playerRun: 9,
    minRun: .012,
    runHp: 60,
    stand: 50,
    runDis: 1,
    farmDis: 700
  },
  ///
  'BOSS':[
    [
      function(){
        if(!this.DETEC){
          this.DETEC = new Detector(this,this.x,this.y,this.screen,['Player'],0,1)
          this.DETEC.team = this.team;
          this.detected = [];
        } else {
          this.DETEC.size = this.screen;
          this.DETEC.x = this.x;
          this.DETEC.y = this.y;
          this.detected = [];
          for(let n of this.DETEC.selectAll.Player){
            let dis = Math.sqrt(Math.pow(n.x-this.x,2)+Math.pow((n.y-this.y)/0.5625,2))/n.level;
            if(dis<n.screen/30){
              this.detected.push(n);
            }
          }
        };
        this.dir += 0.01;
        let dis = Math.sqrt((this.x*this.x)+(this.y*this.y))*2.2;
        let motion = new Vec(.15,0).rotate(Math.atan2(this.y,this.x) - Math.PI*Math.min(1,(dis/this.map.width)));
        this.vec.add(motion)
        this.vec.x*=FRICTION;
        this.vec.y*=FRICTION;
        this.x+=this.vec.x/10;
        this.y+=this.vec.y/10;
        ///
        if(this.x<-this.map.width/2){
          this.x = -this.map.width/2;
          this.vec.x = 0;
        };
        if(this.y<-this.map.height/2){
          this.y = -this.map.height/2;
          this.vec.y = 0;
        };
        if(this.x> this.map.width/2){
          this.x = this.map.width/2;
          this.vec.x = 0;
        };
        if(this.y> this.map.height/2){
          this.y = this.map.height/2;
          this.vec.y =  0;
        };
        if(this.DETEC){
          this.DETEC.reset();
        }
      },
      function(){
        this.hit = Math.max(0,this.hit-1);
        if(this.destroy>1){
          this.x+=this.vec.x;
          this.y+=this.vec.y;
          this.destroy-=1;
          this.alpha = (this.destroy-1)/DES;
          this.size *= 1.04;
          return;
        }
        this.xp = this.prize;
        ///
        this.motion();
        if(this.detected.length || Math.random()>.6){
          this.up.BPene = this.detected.length*.9;
          this.shoot();
        }
        ///
      },
      'Summoner'
    ],
  ],
  'PETS':[
    function(play){
      this.showDir = Math.atan2((play.y+play.inputs.mouse_y)-this.y,play.x+play.inputs.mouse_x-this.x)
      if(!this.delay){
        let dir = Math.random()*Math.PI*2;
        this.pos = {
          x:Math.cos(dir)*(play.size*2),
          y:Math.sin(dir)*(play.size*2)
        };
        this.delay = 20 + parseInt(Math.random()*150);
      } else {
        this.delay -= 1;
      }
      ////
      this.dir = Math.atan2(play.y+play.vec.y*3+this.pos.y-this.y,play.x+play.vec.x*3+this.pos.x-this.x);
      this.speed = 0.6+play.vec.length()/16;
      ////
      this.vec.add(new Vec(this.speed,0).rotate(this.dir))
      let fr = 1-(1-FRICTION)*2;
      this.vec.x*=fr;
      this.vec.y*=fr;
      this.x+=this.vec.x;
      this.y+=this.vec.y;
    }
  ]
}
CONFIG.BOT_NAMES = require(CONFIG.BOT_NAMES).name;
///
class quadTree{
  constructor(x,y,w,h,max){
    this.points = [];
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.divide = 0;
    this.max = max;
  }
  insertToOther(x,y,size,data){
    this.ne.insert(x,y,size,data);
    this.nw.insert(x,y,size,data);
    this.se.insert(x,y,size,data);
    this.sw.insert(x,y,size,data);
  }
  insert(x,y,size,data){
    if(!this.checkIn(x,y)){return;}
    if(this.divide){
      this.ne.insert(x,y,size,data);
      this.nw.insert(x,y,size,data);
      this.se.insert(x,y,size,data);
      this.sw.insert(x,y,size,data);
      return;
    }
    if(this.points.length>=this.max){
      this.ne = new quadTree(this.x+this.w/2,this.y,this.w/2,this.h/2,this.max);
      this.nw = new quadTree(this.x,this.y,this.w/2,this.h/2,this.max);
      this.se = new quadTree(this.x+this.w/2,this.y+this.h/2,this.w/2,this.h/2,this.max);
      this.sw = new quadTree(this.x,this.y+this.h/2,this.w/2,this.h/2,this.max);
      //for(let p of this.points){
      this.ne.insert(x,y,size,data);
      this.nw.insert(x,y,size,data);
      this.se.insert(x,y,size,data);
      this.sw.insert(x,y,size,data);
      //}
      this.divide = 1;
      return;
    }
    this.points.push({'x':x,'y':y,'size':size,'data':data});
  }
  checkIn(x,y){
    if(x<this.x){return 0;}
    if(x>this.x+this.w){return 0;}
    if(y<this.y){return 0;}
    if(y>this.y+this.h){return 0;}
    return 1;
  }
  query(func,data,log = 0){
    if(func({'x':this.x,'y':this.y,'w':this.w,'h':this.h},data)){
      let send = [];
      for(let p of this.points){
        if(func({'x':p.x,'y':p.y,'w':0,'h':0},data)){
          send.push(p);
        }
      }
      if(this.divide){
        Array.prototype.push.apply(send, this.ne.query(func,data));
        Array.prototype.push.apply(send, this.nw.query(func,data));
        Array.prototype.push.apply(send, this.se.query(func,data));
        Array.prototype.push.apply(send, this.sw.query(func,data));
        return send;
      }
      return this.points;
    }
    return [];
  }
}
class Main {
  constructor(){
    this.encodeInst = require('./public/SHARE/SocketSchema.js').encode;
    this.scoresLimit = 100;
    this.maxPseudoLength = 16;
    this.maxServer = 5;
    this.server = {
      'ffa':[],
      '2team':[],
      '4team':[],
      'boss':[]
    };
    this.ipConnect = {};
    this.clients = [];
    this.chat = (function(){
      let chatRoom = [];
      let clientMess = [0];
      let client = this.clients;

      function add(id,data){
        if(data[0] == '/'){
          com(id,data);
          return;
        }
        if(client[id].chat){
          for(let c of clientMess){
            if(c && c.gr == clientMess[client[id].chat].gr){
              c.mess.push([clientMess[client[id].chat].c+clientMess[client[id].chat].name,data]);
            }
          }
        }
      }
      function com(id,data){
        let arr = data.split(' ');
        switch(arr[0]){
          case '/join':{
            let name = Controller.getPlayer(id).name;
            if(client[id].chat){
              delete clientMess[client[id].chat];
              client[id].chat = 0;
            }
            if(arr[1] && arr[1].length){
              for(let i = 0; i<=clientMess.length; i++){
                if(clientMess[i] == null && !client[id].chat){
                  clientMess[i] = {
                    gr: arr[1],
                    name: name,
                    c: 'ccf ',
                    mess: []
                  };
                  client[id].chat = i;
                }
                if(clientMess[i] && clientMess[i].gr == arr[1]){
                  clientMess[i].mess.push(['',name+' has join the chat !']);
                }
              }
            };
            break;
          };
          case '/name':{
            if(client[id].chat){
              clientMess[client[id].chat].mess.push(['',clientMess[client[id].chat].gr]);
            }
            break;
          };
          case '/quit':{
            if(client[id].chat){
              delete clientMess[client[id].chat];
              client[id].chat = 0;
            }
            break;
          };
          case '/color':{
            if(client[id].chat){
              if (arr[1].length == 6 && arr[1].match(/[0-9A-Fa-f]/g).length == 6){
                clientMess[client[id].chat].c = arr[1]+' ';
              }
            }
            break;
          };
        }
      }
      function get(id){
        if(client[id].chat && clientMess[client[id].chat].mess.length){
          let r = clientMess[client[id].chat].mess;
          clientMess[client[id].chat].mess = [];
          return r;
        }
      }
      function rm(id){
        delete clientMess[id];
      }

      return {
        add: add,
        get: get,
        rm: rm
      }
    }.bind(this))()
    if(USERS && c.DB.DEV) this.devs = {};
    if(USERS && c.DB.LB){
      this.scores = 0;
      this.highestScoreId = 0;
      USERS.query('SELECT score, id FROM wrs ORDER BY score c.DESC LIMIT '+this.scoresLimit,function(err,lead){
        if(err) throw err;
        this.scores = new Array(lead.length).fill(0).map((x,y)=>{return {id:lead[y].id,score:lead[y].score}});
        this.scores.forEach((item) => {
          if(item.id>this.highestScoreId){
            this.highestScoreId = item.id;
          }
        });
      }.bind(this));
    }
  }
  askConnection(data,ip){
    var clientId = this.clients.length;
    for(let i = 0; i<this.clients.length; i++){
      if(typeof this.clients[i] === 'undefined'){
            var clientId = i;
        break;
      }
    }
    this.clients[clientId] = 'Waiting';
    ///
    var connect = (data,ip)=>{
      /// ERR_GAMEMODE
      switch(data.gm){
        case 'ffa':
        case '2team':
        //case '4team':
        break;
        default: Controller.clients[clientId]='ERR_GAMEMODE';
        return;
      }
      /////
      if(!(0 <= data.name.length <= Controller.maxPseudoLength)){
        data.name = "unnamed";
      }
      /// ERR_DOUBLE_IP
      if(typeof Controller.ipConnect[ip] === 'undefined'){
        Controller.ipConnect[ip] = 1;
      } else {
        if(Controller.ipConnect[ip]<c.MAX_IP){
          Controller.ipConnect[ip]++;
        } else {
          Controller.clients[clientId]='ERR_DOUBLE_IP';
          return;
        }
      }
      ///try to connect///
      for(let s of Controller.server[data.gm]){
        if(!s){continue;}
        let ans = s.ask(data);
        if(!ans){
          continue;
        } else {
          Controller.clients[clientId] = ans;
          return;
        }
      }
      /// ERR_SERVER_FULL
      let server = Controller.newServer(data.gm);
      let serverAns = server.ask(data);
      Controller.clients[clientId]=serverAns;
    }
    ///
    if(USERS && c.DB.ACC){
      USERS.query('SELECT * FROM acc WHERE userKey = ?',[data.key],function(err,user,fields){
        /// ERR_BROKEN_KEY
        var brokenKey = 0;
        if(!user || !user.length){
          if(c.KEY_ISNEEDED){
            Controller.clients[clientId]='ERR_BROKEN_KEY';
            return;
          } else {
            brokenKey = 1;
          }
        }
        ///check pet///
        if(!brokenKey){
          try {
            user[0].userData = JSON.parse(user[0].userData);
            if(!user[0].userData.own.pets[data.pet]) data.pet = -1;
          } catch {
            data.pet = -1
          }
        } else {
          data.pet = -1;
        }
        ///
        connect(data,ip);
        ///
      });
    } else {
      connect(data,ip)
    }
    return clientId;
  }
  command(id,com){
    if(!USERS || !c.DB.DEV) return;
    if(!com.length || typeof this.clients[id] !== 'object'){return;}
    com = com.split(" ");
    if(com[0] == 'disconnect'){
      if(this.clients[id].dev){
        //delete this.devs[this.clients[id].dev];
        this.clients[id].dev = 0;
        return 'disconnected successfully';
      }
    }
    if(com[0] == 'connect'){
      if(com[1] && /*!this.devs[com[1]] &&*/ !this.clients[id].dev){
        USERS.query('SELECT * FROM devs WHERE password = ?',[com[1]],function(err,result,fields){
          if(err){throw err;}
          if(result.length){
            this.devs[result[0].password] = result[0].level;
            this.clients[id].dev = result[0].password;
            let p = Controller.getPlayer(this.clients[id])
          }
        }.bind(this))
      }
      return;
    };
    ///
    if(this.clients[id].dev && this.devs[this.clients[id].dev]){
      let p = Controller.getPlayer(id);
      switch(this.devs[this.clients[id].dev]){
        case 3:{
          if(com[0] == 'player' && !isNaN(parseInt(com[1]))){
            p = this.server[this.clients[id].GM][this.clients[id].sId].INSTANCE.players[parseInt(com[1])];
            if(!p){
              return 'Can not find the player id';
            }
            com.splice(0,2);
          }
          if(com[0] == 'obj' && !isNaN(parseInt(com[1]))){
            p = this.server[this.clients[id].GM][this.clients[id].sId].INSTANCE.objs[parseInt(com[1])];
            if(!p){
              return 'Can not find the obj id';
            }
            com.splice(0,2);
          }
          switch(com[0]){
            case 'setXp-2':{
              if(!p.dev) return;
              let xp = parseInt(com[1]);
              if(isNaN(xp)){break;}
              if(xp>=0){
                p.xp = xp;
                return 'xp set to "'+xp+'"';
              }
              break;
            };
            case 'invisible':{
              if(!p.dev){return;}
              p.dev.invisible = (com[1] == 'on') ? 1 : (com[1] == 'off') ? 0 : p.dev.invisible;
              if(p.dev.invisible){
                p.alpha = 0;
              } else {
                p.alpha = 1;
              }
              return 'mode invisible '+((!p.dev.invisible) ? 'activated' : 'deactivated');
              break;
            };
            case 'collision':{
              if(!p.dev) return;
              p.dev.ghost = (com[1] == 'on') ? 0 : (com[1] == 'off') ? 1 : p.dev.ghost;
              return 'collision '+((!p.dev.ghost) ? 'activated' : 'deactivated');
              break;
            };
            case 'mess':{
              if(!p.dev) return;
              com.shift();
              let c = com.join(' ');
              if(c.length && !p.bot){
                p.mess.push(c);
                return `message sent : "${c}"`;
              }
              return;
              break;
            };
            case 'broadcast':{
              com.shift();
              let c = com.join(' ');
              if(c.length){
                for(let i of this.server[this.clients[id].GM][this.clients[id].sId].INSTANCE.players){
                  if(i && isNaN(i) && !i.bot){
                    i.mess.push(c);
                  }
                }
                return `broadcast sent : "${c}"`;
              }
            };
            case 'resetLevel':{
              if(!p.dev) return;
              p.stillLvl = 0;
              p.level = 0;
              return 'level reseted';
            };
            case 'mapResize':{
              if(!isNaN(com[1]) && !isNaN(com[2])){
                this.server[this.clients[id].GM][this.clients[id].sId].newMap = {
                  width: parseInt(com[1]),
                  height: parseInt(com[2])
                }
                return `Map resized to w: ${parseInt(com[1])} h: ${parseInt(com[2])}`;
              }
              break;
            };
            case 'stick':{
              if(!p.dev) return;
              let s = this.server[p.id.GM][p.id.sId].INSTANCE;
              if(s[com[1]] && s[com[1]][com[2]] && isNaN(s[com[1]][com[2]])){
                p.dev.stick = [
                  com[1],
                  com[2]
                ];
                return `obj sticked ${com[1]} ${com[2]}`;
              }
              return "can't find the entity."
              break;
            };
            case 'destick':{
              if(!p.dev) return;
              p.dev.stick = null;
              break;
            };
            case 'summonRandBoss':{
              this.server[p.id.GM][p.id.sId].createBoss();
            };
          }
        };
        case 2:{
          switch(com[0]){
            case 'color':{
              if(!p.dev) return;
              switch(com[1]){
                case '0':case '1':case'2':case '3': case'4':case'5':case'6':case'7':case '8':{
                  p.dev.color = parseInt(com[1])+1;
                  return 'color changed for "'+com[1]+'"';
                }
              }
              break;
            };
            case 'resetColor':{
              if(!p.dev) return;
              p.dev.color = 0;
              return 'color reseted';
              break;
            };
            case 'shield':{
              if(!p.dev) return;
              let s = parseInt(com[1]);
              if(isNaN(s)){break;}
              if(s<=6000 && s>10){
                p.shield = s;
                return 'shield activated for "'+s+'" ms'
              }
              break;
            };
            case 'size':{
              let s = parseInt(com[1]);
              if(isNaN(s)){break;}
              if(s<91 && s>-10){
                if(!p.dev){
                  p.size = s;
                } else {
                  p.dev.size = s;
                }
                return 'size set to "'+s+'"';
              }
              break;
            };
            case 'getBots':{
              let mes = [];
              for(let i of this.server[this.clients[id].GM][this.clients[id].sId].INSTANCE.players){
                if(i && i.bot){
                  let m = '', id = i.id.oId.toString(), name = i.name.replace(/([^a-z0-9]+)/gi, '-');
                  m += `id: ${id}`+(' '.repeat(4-id.length));
                  m += `name: ${name} `+(' '.repeat(17-name.length));
                  m += `score: ${i.xp}`;
                  mes.push(m);
                }
              }
              return mes;
              break;
            };
            case 'getPlayers':{
              let mes = [];
              for(let i of this.server[this.clients[id].GM][this.clients[id].sId].INSTANCE.players){
                if(i && !i.bot){
                  let m = '', id = i.id.oId.toString(), name = i.name.replace(/([^a-z0-9]+)/gi, '-');
                  m += `id: ${id}`+(' '.repeat(4-id.length));
                  m += `name: ${name} `+(' '.repeat(17-name.length));
                  m += `score: ${i.xp}`;
                  mes.push(m);
                }
              }
              return mes;
              break;
            };
            case 'getPos':{
              return `x: ${parseInt(p.x)} y: ${parseInt(p.y)}`;
            };
            case 'getObj':{
              let mes = [];
              let dis = (x,y) => {
                return Math.sqrt(x*x+y*y);
              }
              for(let i of this.server[this.clients[id].GM][this.clients[id].sId].INSTANCE.objs){
                if(typeof i === 'object' && dis(p.x+p.inputs.mouse_x-i.x,p.y+p.inputs.mouse_y-i.y)<i.size){
                  let m = '', id = i.id.oId.toString();
                  m += `id: ${id}`+(' '.repeat(5-id.length));
                  m += `type: ${i.type} `
                  mes.push(m);
                }
              }
              return mes;
              break;
            };
            case 'tp':{
              if(!isNaN(com[1]) && !isNaN(com[2])){
                p.x = parseInt(com[1]); p.y = parseInt(com[2]);
                return `Position set to x: ${parseInt(p.x)} y: ${parseInt(p.y)}`;
              }
              break;
            }
          }
        };
        case 1:{
          switch(com[0]){
            case 'setXp':{
              if(!p.dev) return;
              let xp = parseInt(com[1]);
              if(isNaN(xp)){break;}
              if(xp<=45000 && xp>=0){
                p.xp = xp;
                return 'xp set to "'+xp+'"';
              }
              break;
            };
            case 'class':{
              if(!p.dev) return;
              com.shift();
              let c = com.join(' ');
              if(CLASS[c] && p.class != c && !CLASS[c].boss){
                if(CLASS[c].boss){
                  return 'you can\'t be a boss !'
                }
                p.class = c;
                p.droneCount = 0;
                p.necro = CLASS[c].necro;
                p.shootTimer = new Array(CLASS[c].canons.length).fill(0);
                return 'class set to "'+c+'"';
              }
              break;
            };
            case 'setHp':{
              p.hp = Math.max(0,Math.min(p.maxHp,(isNaN(com[1]) ? p.maxHp : parseInt(com[1]))));
              return 'Hp set to '+(isNaN(com[1]) ? p.maxHp : parseInt(com[1]));
              break;
            };
          }
          break;
        };
      }
    }
  }
  newServer(gameMode){
    let s;
    switch(gameMode){
      case 'ffa':s = new Sffa(this.server[gameMode].length);break;
      case '2team':s = new S2team(this.server[gameMode].length);break;
      case '4team':s = new S4team(this.server[gameMode].length);break;
      case 'boss':s = new Sboss(this.server[gameMode].length);break;
    }
    console.log(cc.Bright+cc.BgGreen+':NEW SERVER //'+cc.Reset+' '+gameMode+':'+this.server[gameMode].length);
    this.server[gameMode].push(s);
    return s;
  }
  insertLB(name,score,tank,gm,key){
    if(!USERS || !c.DB.LB) return;
    if(this.scores && score){
      for(let i = this.scores.length-1; i>=0; i--){
        if(score>this.scores[i].score && ((i==0) ? true : score<=this.scores[i-1].score)){
          this.highestScoreId++;
          this.scores.splice(i,0,{score: score, id: this.highestScoreId});
          USERS.query('INSERT INTO wrs VALUES(NULL,?,?,?,?,?,NOW())',[name,score,tank,gm,key],function(err){if (err) throw err})
          if(this.scores.length>this.scoresLimit){
            USERS.query('DELETE FROM wrs WHERE id = ?',[this.scores[this.scores.length-1].id],function(err){if(err) throw err;})
            this.scores.pop();
          }
          break;
        } else if(score<=this.scores[i].score){
          break;
        }
      }
    }
  }
  getBuffer(id){
    let p = this.clients[id];
    if(!p){
      return 'Waiting';
    }
    return this.server[p.GM][p.sId].getBuffer(p.oId);
  }
  getUi(id){
    let p = this.clients[id];
    if(!p || typeof(p) != 'object'){
      return;
    }
    return this.server[p.GM][p.sId].getUi(p.oId);
  }
  getPlayer(id){
    if(typeof this.clients[id] !== 'object'){
      return;
    }
    let p = this.clients[id];
    return this.server[p.GM][p.sId].INSTANCE.players[p.oId];
  }
  disconnect(id,ip){
    let p = this.clients[id];
    delete this.clients[id];
    if(this.ipConnect[ip]>1){
      this.ipConnect[ip]--;
    } else {
      delete this.ipConnect[ip];
    }
    if(typeof p !== 'object'){return;}
    ///
    if(p.dev){
      //delete this.devs[p.dev];
    }
    if(p.chat){
      this.chat.rm(p.chat);
    }
    ///
    let tank =  this.server[p.GM][p.sId].INSTANCE.players[p.oId];
    if(!p.dev && isNaN(p.dev)) this.insertLB(tank.name,tank.xp,tank.class,p.GM,p.key);
    tank.state.disconnect = 1;
  }
  respawn(id){
    if(typeof this.clients[id] !== 'object'){
      return;
    }
    let p = this.clients[id];
    let tank = this.getPlayer(id);
    if(!tank) return;
    let xp = this.server[p.GM][p.sId].respawn(p.oId);
    if(xp && !p.dev && isNaN(p.dev)) this.insertLB(tank.name,tank.xp,tank.class,p.GM,p.key);
  }
}
///SERVER///
class Sffa {
  constructor(id){
    let POW = 2.5;
    let MXLVL = 25000;
    this.XPLVL = new Array(30).fill(0).map((x,i)=>{
      if(i == 0){
        return 0;
      }
      let a = 30/Math.pow(MXLVL,1/POW)
      return Math.min(MXLVL,parseInt(Math.pow((i+1)/a,POW)));
    })
    this.gm = "ffa";
    this.id = id;
    this.bufTimer = 0;
    this.BUFFER = {};
    this.INSTANCE = {
      "players":[],
      "objs":[],
      "bullets":[],
      "detectors": []
    };
    this.obj = {
      "sqr":{"0":0,"1":0,"max0":220,"max1":18},
      "tri":{"0":0,"1":0,"max0":80,"max1":12},
      "pnt":{"0":0,"1":0,"max0":25,"max1":15},
      "Bpnt":{'1':0,'max1':3},
      "Bsqr":{'1':0,'max1':2},
      "Btri":{'1':0,'max1':2},
      "bull":{'1':0,'max1':20},
    };
    this.maxPlayer = 24;
    this.print = 1;
    this.leader = [];
    this.map = {
      width: 9020,
      height: 9020
    }
    this.newMap = {
      width: 9020,
      height: 9020
    };
    this.timestamp = 0;
    this.bots = [];
    setTimeout((it)=>{it.Init(); it.update()},100,this);
  }
  Init(){
    for(let i = 0; i<500; i++){
      this.generate(0);
    }
    this.createAi();
    setTimeout(function(it){it.generate()},300,this);
  }
  generate(go = 1){
    if(this.destroy){return;}
    const RNG = Math.random();
    ///SQUARE///
    if(RNG<1){
      let obj = this.obj.sqr;
      if(obj[0]<obj.max0){this.createObj("sqr",0); obj[0]++;}
      if(obj[1]<obj.max1 && Math.random()<0.26){this.createObj("sqr",1); obj[1]++;}
    }
    ///TRIANGLE///
    if(RNG<0.7){
      let obj = this.obj.tri;
      if(obj[0]<obj.max0){this.createObj("tri",0); obj[0]++;}
      if(obj[1]<obj.max1 && Math.random()<0.26){this.createObj("tri",1); obj[1]++;}
    }
    ///PENTAGONE///
    if(RNG<0.5){
      let obj = this.obj.pnt;
      if(obj[0]<obj.max0){this.createObj("pnt",0); obj[0]++;}
      if(obj[1]<obj.max1 && Math.random()<0.2){this.createObj("pnt",1); obj[1]++;}
    }
    ///BULL///
    if(RNG<0.1){
      let obj = this.obj.bull;
      if(obj[1]<obj.max1){this.createObj("bull",0); obj[1]++;}
    }
    ///BETA PENTAGONE///
    if(RNG>0.98){
      let obj = this.obj.Bpnt;
      if(obj[1]<obj.max1){this.createObj("Bpnt",1); obj[1]++;}
    }
    ///BETA SQUARE///
    if(RNG>0.992){
      let obj = this.obj.Bsqr;
      if(obj[1]<obj.max1){this.createObj("Bsqr",1); obj[1]++;}
    }
    ///BETA TRIANGLE///
    if(RNG>0.992){
      let obj = this.obj.Btri;
      if(obj[1]<obj.max1){this.createObj("Btri",1); obj[1]++;}
    }
    ///BOSSES///
    if(RNG>0.99){

    }
    if(go){
      setTimeout(function(it){it.generate()},400,this)
    };
  }
  createObj(type,pos){
    let ppp = -1;
    if(pos){
      switch(type){
        case 'sqr':
        case 'Bsqr':
          ppp = [this.map.width/4,this.map.height/4,350];
        break;
        case 'tri':
        case 'Btri':
          ppp = [-this.map.width/4,-this.map.height/4,350];
        break;
        case 'pnt':
        case 'Bpnt':
          ppp = [0,0,450];
        break;
      }
    }
    if(type == 'bull'){ppp = 'bull';}
    for(let i=0; i<=this.INSTANCE.objs.length; i++){
      if(!this.INSTANCE.objs[i]){
        this.INSTANCE.objs[i] = (new Objects(type,ppp,{"GM":this.gm,"sId":this.id,"oId":i},this.map));
        break;
      } else if(!isNaN(this.INSTANCE.objs[i])){
        this.INSTANCE.objs[i]--
      }
    }
  }
  createAi(){
    for(let i = 10; i<20; i++){
      let bot = new Player(
        {"GM":this.gm,"sId":this.id,"oId":i},
        0,
        0,
        CONFIG.BOT_NAMES[parseInt(Math.random()*(CONFIG.BOT_NAMES.length-1))],
        1,
        this.XPLVL
      );
      bot.motion = CONFIG.BOTS[0].bind(bot);
      bot.bot = 1;
      bot.xp = 5000+parseInt(Math.random()*60000)
      this.INSTANCE.players[i] = bot;
      this.bots.push(i);
      this.respawn(i,1,1);
    }
  }
  createBullet(bullet,origine){
    bullet.team = origine.dev.color ? origine.dev.color-1 : 1;
    bullet.map = this.map;
    for(let i = 0; i<=this.INSTANCE.bullets.length; i++){
      if(!this.INSTANCE.bullets[i]){
        bullet.id = {'GM':'ffa','sId':this.id,'oId':i};
        this.INSTANCE.bullets[i] =  bullet;
        break;
      } else {
        if(!isNaN(this.INSTANCE.bullets[i])){
          this.INSTANCE.bullets[i] -= 1;
        }
      }
    }
  }
  update(){
    let stop = 1;
    let playerCount = 0;
    for(let i of this.INSTANCE.players){
      if(i && !i.bot){
        playerCount++;
        stop = 0;
      }
    }
    if(stop){
      this.destroy = 1;
      console.log(cc.Bright+cc.BgYellow+'DELETED SERVER //'+cc.Reset+' '+this.gm+':'+this.id);
      delete Controller.server[this.gm][this.id];
      return;
    }
    ///MAP///
    if(Math.abs(this.map.width-this.newMap.width)>0.1){
      this.map.width += (this.newMap.width-this.map.width)*.1;
    } else {
      this.map.width = this.newMap.width;
    }
    if(Math.abs(this.map.height-this.newMap.height)>0.1){
      this.map.height += (this.newMap.height-this.map.height)*.1;
    } else {
      this.map.height = this.newMap.height;
    }
    ///BOTS///
    let botNeeded = Math.max(0,10-playerCount);
    if(botNeeded){
      for(let b of this.bots){
        let bot = this.INSTANCE.players[b];
        if(bot && bot.dead == 1 && botNeeded){
          this.respawn(b,0,1);
          botNeeded --;
        }
      }
    }
    ///LEAD+ ADD TO QT///
    this.timestamp++;
    let qt = new quadTree(-this.map.width/2-1000,-this.map.height/2-1000,this.map.width+2000,this.map.height+2000,6);
    this.leader = [];
    for(let c in this.INSTANCE){
      for(let j in this.INSTANCE[c]){
        let i = this.INSTANCE[c][j];
        if(!isNaN(i)){
          if(i){
            i--;
          } else {
            delete this.INSTANCE[c][j];
          }
          continue;
        } else if(!i) continue;
        if(c === 'players' && !i.destroy){
          if(this.leader.length){
            for(let l = Math.min(this.leader.length-1,9); l>=0; l--){
              if(this.leader.length<9){
                ///
                if(this.leader[l].xp<i.xp){
                  if(!l || this.leader[l-1].xp>=i.xp){
                    this.leader.splice(l,0,i);
                    break;
                  }
                } else if(l == this.leader.length-1){
                  this.leader.push(i);
                  break;
                }
                ///
              } else if(this.leader[l].xp<i.xp && (!l || this.leader[l-1].xp>=i.xp)){
                this.leader.splice(l,0,i);
                this.leader.pop();
                break;
              }
            }
          } else {
            this.leader.push(i);
          }
        }
        if(i.destroy == 1){
          if(c == "players"){
            if(i.state.disconnect){
              this.INSTANCE[c][j].delete();
            } else {
              continue;
            }
          }
          if(c == "objs"){this.INSTANCE[c][j].delete();}
          if(c == 'bullets'){this.INSTANCE[c][j] = c.KEEP_PLACE; continue;}
          delete this.INSTANCE[c][j];
        } else {
          if(i.getPlace == 1){
            i.size+=c.SIZE_GET_POS;
          }
          qt.insert(i.x,i.y,i.size,i);
        }
      }
    }
    ///COLLISION///
    for(let c in this.INSTANCE){
      for(let obj of this.INSTANCE[c]){
        if(typeof obj === "undefined" || !isNaN(obj)){continue;}
        if(obj.getPlace == 0){
          continue;
        }
        if(obj.destroy>=1){continue;}
        let collide = qt.query(function (rect,circle){
            var distX = Math.abs(circle.x - rect.x-rect.w/2);
            var distY = Math.abs(circle.y - rect.y-rect.h/2);

            if (distX > (rect.w/2 + circle.r)) { return false; }
            if (distY > (rect.h/2 + circle.r)) { return false; }

            if (distX <= (rect.w/2)) { return true; }
            if (distY <= (rect.h/2)) { return true; }

            var dx=distX-rect.w/2;
            var dy=distY-rect.h/2;
            return (dx*dx+dy*dy<=(circle.r*circle.r));
        },{'x':obj.x,'y':obj.y,'r':(obj.DETEC && obj.DETEC.enabled ? obj.DETEC.size : obj.size)*2})
        for(let i in collide){
          let other = collide[i].data;
          if(other.getPlace == 0 || obj.getPlace == 0){
            continue;
          }
          if(other.destroy>=1){continue;}
          if(obj.id.oId == other.id.oId && obj.constructor.name == other.constructor.name){continue;}
          let dis = Math.sqrt(Math.pow(other.x-obj.x,2)+Math.pow(other.y-obj.y,2));
          if(isNaN(other.getPlace) || isNaN(obj.getPlace)){
            if(obj.DETEC && obj.DETEC.enabled){
              if(dis <= obj.DETEC.size+other.size){
                obj.DETEC.collision(other,{dis:dis})
              }
            } else if(other.DETEC && other.DETEC.enabled){
              if(dis <= obj.size+other.DETEC.size){
                other.DETEC.collision(obj,{dis:dis})
              }
            }
          }
          if(dis <= obj.size+other.size){
            if(obj.size > other.size || obj.x+obj.y >= other.x+other.y){
              let otherCLASS = other.constructor.name;
              let objCLASS = obj.constructor.name;
              ///
              if(other.getPlace || obj.getPlace){
                if(other.getPlace && objCLASS == 'Player'){
                  other.getPlace = 0;
                }
                if(obj.getPlace && otherCLASS == 'Player'){
                  obj.getPlace = 0;
                }
                continue;
              }
              if(obj.x == other.x && obj.y == other.y){
                obj.x+=Math.random()-.5;
                obj.y+=Math.random()-.5;
              }
              ///
              let objOption = {};
              let otherOption = {};
              if(objCLASS == 'Bullet'){
                otherOption.pene = obj.pene;
              }
              if(otherCLASS == 'Bullet'){
                objOption.pene = other.pene;
              }
              other.collision(obj,otherOption);
              obj.collision(other,objOption);
              if(objCLASS == 'Bullet'){
                if(other.destroy && other.prize){
                  if(this.INSTANCE.players[obj.origine.oId]){
                    this.INSTANCE.players[obj.origine.oId].xp+=other.prize;
                    this.INSTANCE.players[obj.origine.oId].coins+= other.coinReward || 0;
                    if(otherCLASS == 'Player' && !this.INSTANCE.players[obj.origine.oId].bot){
                      this.INSTANCE.players[obj.origine.oId].mess.push('You killed '+ other.name);
                    }
                  }
                }
              }
              if(otherCLASS == 'Bullet' && obj.prize){
                if(obj.destroy){
                  if(this.INSTANCE.players[other.origine.oId]){
                    this.INSTANCE.players[other.origine.oId].xp+=obj.prize;
                    this.INSTANCE.players[other.origine.oId].coins+=obj.coinReward || 0;
                    if(objCLASS == 'Player' && !this.INSTANCE.players[other.origine.oId].bot){
                      this.INSTANCE.players[other.origine.oId].mess.push('You killed '+ obj.name);
                    }
                  }
                }
              }
              if(obj.destroy){
                break;
              }
            }
          }
        }
      }
    }
    this.INSTANCE.detectors = [];
    ///BUFFING///
    for(let p of this.INSTANCE.players){
      if(p && p.pet){
        this.INSTANCE.bullets[p.pet.id.oId] = 20;
        if(p.alpha) qt.insert(p.pet.x,p.pet.y,p.size,p.pet);
      }
    }
    this.BUFFER = [];
    for(let id in this.INSTANCE.players){
      let player = this.INSTANCE.players[id];
      if(player.bot){
        continue;
      }

      var x = player.x-player.screen/2-200, y = player.y-player.screen/2*0.5625-200;
      var w = player.screen+400, h = player.screen*0.5625+400;

      this.BUFFER[id] = {
        x:x,
        y:y,
        w:w,
        h:h
      }
      this.BUFFER[id].main = player;
      this.BUFFER[id].rest = qt.query(function(a,b) {
        return(
          ((a.x + a.w) >= b.x) &&
          (a.x <=(b.x + b.w)) &&
          ((a.y + a.h) >= b.y) &&
          (a.y <= (b.y + b.h))
        );
      },
      {'x':x-200,'y':y-200,'w':w+400,'h':h+400});
    }
    ///UPDATE///
    for(let c in this.INSTANCE){
      for(let o in this.INSTANCE[c]){
        let obj = this.INSTANCE[c][o];
        if(typeof obj === "undefined" || !isNaN(obj)){continue;}
        if(obj.destroy == 1){
          if(c == "players"){
            if(obj.dead>1){
              obj.dead--;
            }
            if(obj.murder == -1){
              continue;
            }
            let murder = this.INSTANCE[obj.murder[0]][obj.murder[1].oId];
            if(typeof(murder) === "undefined" || !isNaN(murder) || murder.destroy){
              obj.murder = -1;
              continue;
            }
            obj.x+=(murder.x-obj.x)*0.1;
            obj.y+=(murder.y-obj.y)*0.1;
          }
          continue;
        }
        if(obj.getPlace == 1){
          delete obj.getPlace;
          obj.size -= c.SIZE_GET_POS;
        } else if(obj.getPlace == 0){
          obj.delete();
          delete this.INSTANCE[c][o];
          continue;
        }
        obj.update();
      }
    }
    ///
    setTimeout(function(it){it.update()},20,this);
  }
  respawn(id, force = 0,bot = 0){
    let tank = this.INSTANCE.players[id];
    if(!tank || (!force && !tank.destroy) || tank.dead>1) return;
    ///
    let mXp = this.XPLVL[this.XPLVL.length-1];
    let x, y, xp = force ? tank.xp : tank.xp<=mXp ? Math.min(tank.xp,parseInt(Math.pow( tank.xp / (mXp/Math.pow( mXp*.6, 1/.9 )),.9))) : mXp*.6;
    while(1){
      x = 200+Math.random()*(this.map.width-400)-this.map.width/2;
      y = 200+Math.random()*(this.map.height-400)-this.map.height/2;
      let dis = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
      if(dis>1100){
        dis = Math.sqrt(Math.pow(this.map.width/4-x,2)+Math.pow(this.map.height/4-y,2))
        if(dis>800){
          dis = Math.sqrt(Math.pow(-this.map.width/4-x,2)+Math.pow(-this.map.height/4-y,2))
          if(dis>800){
            tank.x = x;
            tank.y = y;
            break;
          }
        }
      }
    }
    let newTank = new Player(tank.id,x,y,tank.name,tank.team,this.XPLVL);
    if(bot){
      newTank.motion = CONFIG.BOTS[0].bind(newTank);
      newTank.bot = 1;
      if(Math.random()<0.1){
        newTank.name = CONFIG.BOT_NAMES[parseInt(Math.random()*(CONFIG.BOT_NAMES.length-1))];
      }
    }
    ///
    newTank.xp = xp;
    newTank.coins = tank.coins || 0;
    this.INSTANCE.players[id] = newTank;
    ///
    if(tank.pet){
      newTank.pet = tank.pet;
      newTank.pet.x = newTank.x;
      newTank.pet.y = newTank.y;
      newTank.pet.pet = 1;
      let newId = 0;
      while(this.INSTANCE.bullets[newId]){
        newId++;
      }
      newTank.pet.id = {"GM":this.gm,"sId":this.id,"oId":newId};
      this.INSTANCE.bullets[newId] = 20;
    }
    ///
    return tank.xp;
  }
  getBuffer(id){
    let RAW = this.BUFFER[id];
    if(!RAW){
      return;
    }
    if(!RAW.main){
      return;
    }
    let buff = {
      len: 56+(RAW.main.name.length*2)+(RAW.main.canDir.length*2),
      instances:[]
    };
    buff.head = {
      timestamp: this.timestamp,
      width:     this.map.width,
      height:    this.map.height,
      screen:    RAW.main.screen,
      xp:        RAW.main.xp,
      still:     RAW.main.dead ? 0 : RAW.main.level-RAW.main.stillLvl,
      cLvl:      RAW.main.dead ? 0 : parseInt((RAW.main.level)/10)
    };
    ///
    let lvl = RAW.main.level, xp = RAW.main.xp, arr = RAW.main.XPLVL;
    buff.head.level = (!lvl ? 1 : ((lvl>=arr.length-1) ? lvl : lvl+Math.max(Math.min(1,(xp-arr[lvl-1])/(arr[lvl]-arr[lvl-1])),0)));
    ///
    buff.main = {
      states: [!!RAW.main.hit*1,
               !!RAW.main.inputs.c*1,
               !!RAW.main.dead*1,
               !!RAW.main.shield*1,0,0],
      class:  RAW.main.class,
      color:  RAW.main.dev.color ? RAW.main.dev.color-1 : 0,
      x:      RAW.main.x,
      y:      RAW.main.y,
      vx:     RAW.main.vec.x,
      vy:     RAW.main.vec.y,
      dir:    RAW.main.inputs.c ? RAW.main.autoDir : RAW.main.dir,
      size:   RAW.main.size,
      alpha:  RAW.main.alpha,
      hp:     RAW.main.hp/RAW.main.maxHp,
      name:   RAW.main.name,
      nameC:  0,
      recoil: RAW.main.recoil,
      canDir: RAW.main.canDir ? RAW.main.canDir : []
    };
    for(let i of RAW.rest){
      let obj = i.data;
      if(obj.getPlace == 0){
        continue;
      }
      if(
        ((obj.x) <= RAW.x) ||
        ((obj.y) <= RAW.y) ||
        ((obj.x) >= (RAW.x+RAW.w)) ||
        ((obj.y) >= (RAW.y+RAW.h))
      ){continue;}
      ///
      if(obj.BUFF.timestamp !== this.timestamp){
        let raw;
        switch(obj.constructor.name){
          case 'Player':{
            obj.BUFF.len = 37+(obj.name.length*2)+(obj.canDir.length*2);
            raw = {
              construc: 'Players',
              id: obj.id.oId,
              states: [!!obj.hit*1,
                       !!obj.shield*1,
                       0,0,0,0,!!obj.bot*1],
              class:  obj.class,
              color:  obj.dev.color ? obj.dev.color-1 : 1,
              x:      obj.x,
              y:      obj.y,
              vx:     obj.vec.x,
              vy:     obj.vec.y,
              dir:    obj.dir,
              size:   obj.size,
              alpha:  obj.alpha,
              hp:     Math.max(0,obj.hp/obj.maxHp),
              xp:     obj.xp,
              name:   obj.name,
              nameC:  0,
              recoil: obj.recoil,
              canDir: obj.canDir ? obj.canDir : []
            }
            break;
          };
          case 'Objects':{
            obj.BUFF.len = 19;
            raw = {
              construc: 'Objects',
              id: obj.id.oId,
              states: [!!obj.hit*1,!!obj.extra*1,0,0,0,0,0],
              shape:   obj.type,
              hp:     Math.max(0,obj.hp/obj.maxHp),
              x:      obj.x,
              y:      obj.y,
              size:   obj.size,
              alpha:  obj.alpha,
            };
            break;
          };
          case 'Bullet':{
            if(obj.origine.oId != RAW.main.id.oId){
              ////
              obj.BUFF.len = 21;
              raw = {
              construc: 'Bullets',
              id:     obj.id.oId,
              states: [!!obj.pet*1,0,0,0,0,0,0],
              type:   parseInt(obj.type),
              x:      obj.x,
              y:      obj.y,
              size:   obj.size,
              color:  (obj.type == 3) ? 9 : obj.team,
              alpha:  obj.alpha,
              dir:    obj.showDir
            };
            }
            break;
          };
        }
        if(raw){
          raw.len = obj.BUFF.len;
          obj.BUFF.data = new Int8Array(Controller.encodeInst('Instance',raw));
          obj.BUFF.timestamp = this.timestamp;
        }
      }
      ///
      switch(obj.constructor.name){
        case 'Player':{
          if(!obj.alpha){
            continue;
          }
          if(RAW.main.id.oId == obj.id.oId){
            continue;
          }
          break;
        };
        case 'Bullet':{
          if(obj.origine.oId == RAW.main.id.oId){
            let raw = new Int8Array(Controller.encodeInst('Instance',{
              len: 21,
              construc: 'Bullets',
              id: obj.id.oId,
              states: [!!obj.pet*1,0,0,0,0,0,0],
              type:   parseInt(obj.type),
              x:      obj.x,
              y:      obj.y,
              size:   obj.size,
              color:  (obj.type == 3) ? 9 : RAW.main.dev.color ? RAW.main.dev.color-1 :  0,
              alpha:  obj.alpha,
              dir:    obj.showDir
            }));
            buff.len+=raw.length;
            buff.instances.push(raw);
            continue;
          }
          break;
        }
      }
      buff.len+=obj.BUFF.data.length;
      buff.instances.push(obj.BUFF.data);
    };
    return buff;
  }
  getUi(id){
    let buff = {
      len:3,
      leader:[],
      map:[],
      mess:[]
    };
    for(let i of this.leader){
      buff.len+= 7+i.name.length*2;
      buff.leader.push({
        xp:i.xp,
        name:i.name,
        nameC: 0,
        team: i.dev.color ? i.dev.color-1 : ((i.id.oId == id) ? 0 : i.team)
      })
    };
    for(let i of this.INSTANCE.players[id].mess){
      buff.len+= 1+i.length*2;
      buff.mess.push(i);
    };
    this.INSTANCE.players[id].mess = [];
    return buff;
  }
  ask(data){
    let name = data.name;
    let pet = (data.pet>-1) ? new Bullet(0,0,0,0,0,0) : null;
    if(pet){
      pet.update = CONFIG.PETS[0].bind(pet);
      pet.type = data.pet;
      pet.team = 1;
    }
    ///
    for(let i = 0; i<=this.maxPlayer; i++){
      if(typeof(this.INSTANCE.players[i]) === "undefined"){
        let tank = new Player(
            {"GM":this.gm,"sId":this.id,"oId":i},
            0,
            0,
            name,
            1,
            this.XPLVL
          );
        tank.userKey = data.key;
        if(pet){ tank.pet = pet; pet.origine = tank.id; }
        this.INSTANCE.players[i] = tank;
        this.respawn(i,1);
        console.log('NEW PLAYER gm: '+this.gm+' serve-Id: '+this.id+' player id: '+i);
        return tank.id;
        break;
      }
    }
    return;
  }
};
class S2team {
  constructor(id){
    let POW = 2.5;
    let MXLVL = 30000;
    this.XPLVL = new Array(30).fill(0).map((x,i)=>{
      if(i == 0){
        return 0;
      }
      let a = 30/Math.pow(MXLVL,1/POW)
      return Math.min(MXLVL,parseInt(Math.pow((i+1)/a,POW)));
    })
    this.gm = "2team";
    this.id = id;
    this.bufTimer = 0;
    this.BUFFER = {};
    this.INSTANCE = {
      "players":[],
      "objs":[],
      "bullets":[],
    };
    this.obj = {
      "sqr":{"0":0,"1":0,"max0":160,"max1":18},
      "tri":{"0":0,"1":0,"max0":60,"max1":12},
      "pnt":{"0":0,"1":0,"max0":18,"max1":15},
      "Bpnt":{'1':0,'max1':3},
      "Bsqr":{'1':0,'max1':2},
      "Btri":{'1':0,'max1':2},
      "bull":{'1':0,'max1':20}
    };
    this.bots = [];
    this.boss = null;
    this.team = [0,0];
    this.maxPlayer = 24;
    this.print = 1;
    this.map = {
      width: 8000,
      height: 8000
    };
    this.leader = [];
    this.newMap = {
      width: 7600,
      height: 76000
    };
    this.timestamp = 0;
    this.droneQt = 10;
    this.baseSize = 600;
    for(let i = 1; i<=this.droneQt; i++){
      let bull = new Bullet(
        {"GM":this.gm,"sId":this.id,"oId":-1},
        -this.map.width/2+this.baseSize/2,
        this.map.height*i/(this.droneQt+1)-this.map.height/2,
        0,
        0,
      );
      bull.id = {"GM":this.gm,"sId":this.id,"oId":this.INSTANCE.bullets.length};
      bull.team = 0;
      bull.ox = bull.x;
      bull.oy = bull.y
      bull.alone = 1;
      bull.life = -1;
      bull.type = 1.4;
      bull.maxspeed = .75;
      bull.pene = 200;
      bull.damage = .1;
      bull.weight = 2;
      bull.size = 20;
      bull.map = this.map;
      this.INSTANCE.bullets.push(bull);
    }
    for(let i = 1; i<=this.droneQt; i++){
      let bull = new Bullet(
        {"GM":this.gm,"sId":this.id,"oId":-1},
        this.map.width/2-this.baseSize/2,
        this.map.height*i/(this.droneQt+1)-this.map.height/2,
        0,
        0,
      );
      bull.id = {"GM":this.gm,"sId":this.id,"oId":this.INSTANCE.bullets.length};
      bull.team = 1;
      bull.ox = bull.x;
      bull.oy = bull.y
      bull.alone = 1;
      bull.life = -1;
      bull.type = 1.4;
      bull.maxspeed = .75;
      bull.pene = 200;
      bull.damage = .1;
      bull.weight = 2;
      bull.size = 20;
      bull.map = this.map
      this.INSTANCE.bullets.push(bull);
    }
    setTimeout((it)=>{it.Init(); it.update()},1,this);
  }
  generate(go = 1){
    if(this.destroy){return;}
    const RNG = Math.random();
    ///SQUARE///
    if(RNG<1){
      let obj = this.obj.sqr;
      if(obj[0]<obj.max0){this.createObj("sqr",0); obj[0]++;}
      if(obj[1]<obj.max1 && Math.random()<0.26){this.createObj("sqr",1); obj[1]++;}
    }
    ///TRIANGLE///
    if(RNG<0.7){
      let obj = this.obj.tri;
      if(obj[0]<obj.max0){this.createObj("tri",0); obj[0]++;}
      if(obj[1]<obj.max1 && Math.random()<0.26){this.createObj("tri",1); obj[1]++;}
    }
    ///PENTAGONE///
    if(RNG<0.5){
      let obj = this.obj.pnt;
      if(obj[0]<obj.max0){this.createObj("pnt",0); obj[0]++;}
      if(obj[1]<obj.max1 && Math.random()<0.2){this.createObj("pnt",1); obj[1]++;}
    }
    ///BULL///
    if(RNG<0.1){
      let obj = this.obj.bull;
      if(obj[1]<obj.max1){this.createObj("bull",0); obj[1]++;}
    }
    ///BETA PENTAGONE///
    if(RNG>0.99){
      let obj = this.obj.Bpnt;
      if(obj[1]<obj.max1){this.createObj("Bpnt",1); obj[1]++;}
    }
    ///BETA SQUARE///
    if(RNG>0.992){
      let obj = this.obj.Bsqr;
      if(obj[1]<obj.max1){this.createObj("Bsqr",1); obj[1]++;}
    }
    ///BETA TRIANGLE///
    if(RNG>0.992){
      let obj = this.obj.Btri;
      if(obj[1]<obj.max1){this.createObj("Btri",1); obj[1]++;}
    }
    ///BOSSES///
    if(RNG>0.9999){
      if(!this.boss && Math.random()>0.3){this.createBoss()}
    }
    if(go){
      setTimeout(function(it){it.generate()},400,this)
    };
  }
  Init(){
    for(let i = 0; i<1000; i++){
      this.generate(0);
    }
    this.createAi();
    setTimeout(function(it){it.generate()},300,this);
  }
  createObj(type,pos){
    let ppp = -1;
    if(pos){
      switch(type){
        case 'sqr':
        case 'Bsqr':
          ppp = [this.map.width/4,this.map.height/4,350];
        break;
        case 'tri':
        case 'Btri':
          ppp = [-this.map.width/4,-this.map.height/4,350];
        break;
        case 'pnt':
        case 'Bpnt':
          ppp = [0,0,450];
        break;
      }
    }
    if(type == 'bull'){ppp = 'bull';}
    for(let i=0; i<=this.INSTANCE.objs.length; i++){
      if(!this.INSTANCE.objs[i]){
        this.INSTANCE.objs[i] = (new Objects(type,ppp,{"GM":this.gm,"sId":this.id,"oId":i},this.map));
        break;
      } else if(!isNaN(this.INSTANCE.objs[i])){
        this.INSTANCE.objs[i]--
      }
    }
  }
  createAi(){
    let team = parseInt(Math.random()*2);
    for(let i = 10+team; i<13+team; i++){
      let bot = new Player(
        {"GM":this.gm,"sId":this.id,"oId":i},
        0,
        0,
        CONFIG.BOT_NAMES[parseInt(Math.random()*(CONFIG.BOT_NAMES.length-1))],
        i%2,
        this.XPLVL
      );
      this.team[i%2]+=1;
      bot.motion = CONFIG.BOTS[0].bind(bot);
      bot.bot = 1;
      bot.xp = 5000+parseInt(Math.random()*60000)
      this.INSTANCE.players[i] = bot;
      this.bots.push(i);
      this.respawn(i,1,1);
    }
  }
  createBoss(){
    for(let i = 0; i<=this.maxPlayer; i++){
      if(typeof(this.INSTANCE.players[i]) === "undefined" && !this.boss){
        ///
        let randDir = Math.PI*2*Math.random();
        let boss = new Player(
          {"GM":this.gm,"sId":this.id,"oId":i},
          Math.cos(randDir)*this.map.width/4,
          Math.sin(randDir)*this.map.width/4,
          CONFIG.BOSS[0][2],
          9,
          this.XPLVL
        );
        boss.hp = 20000;
        boss.maxHp = 20000;
        boss.boss = 1;
        boss.size = 64;
        boss.class = 'Summoner';
        boss.screen = CLASS[boss.class].screen;
        boss.prize = 100000;
        boss.xp    = 100000;
        boss.shield = 0;
        boss.motion = CONFIG.BOSS[0][0].bind(boss);
        boss.update = CONFIG.BOSS[0][1].bind(boss);
        this.boss = boss;
        this.INSTANCE.players[i] = boss;
        ///
      } else if(this.INSTANCE.players[i] && !this.INSTANCE.players[i].bot){
        this.INSTANCE.players[i].mess.push('Tremble at the sight of the '+ CONFIG.BOSS[0][2]+' !');
      }
    }
  }
  createBullet(bullet,origine){
    bullet.team = origine.team;
    if(origine.dev.color){
      bullet.color = origine.dev.color;
    }
    bullet.map = this.map;
    for(let i = 0; i<=this.INSTANCE.bullets.length; i++){
      if(!this.INSTANCE.bullets[i]){
        bullet.id = {'GM':this.gm,'sId':this.id,'oId':i};
        this.INSTANCE.bullets[i] =  bullet;
        break;
      } else {
        if(!isNaN(this.INSTANCE.bullets[i])){
          this.INSTANCE.bullets[i] -= 1;
        }
      }
    }
  }
  update(){
    let stop = 1;
    for(let i of this.INSTANCE.players){
      if(i && !i.bot){
        stop = 0;
        break;
      }
    }
    if(stop){
      this.destroy = 1;
      console.log(cc.Bright+cc.BgYellow+'DELETED SERVER //'+cc.Reset+' '+this.gm+':'+this.id);
      delete Controller.server[this.gm][this.id];
      return;
    }
    ///
    for(let b of this.bots){
      let bot = this.INSTANCE.players[b];
      if(bot && bot.dead == 1){
        this.respawn(b,0,1);
      }
    }
    if(this.boss){
      if(this.boss.destroy == 1){
        this.boss.state.disconnect = 1;
        this.boss = null;
      }
    }
    ///
    this.timestamp++;
    let qt = new quadTree(-this.map.width/2-1000,-this.map.height/2-1000,this.map.width+2000,this.map.height+2000,6);
    this.leader = [];
    for(let c in this.INSTANCE){
      for(let j in this.INSTANCE[c]){
        let i = this.INSTANCE[c][j];
        if(!isNaN(i)){
          if(i){
            i--;
          } else {
            delete this.INSTANCE[c][j];
          }
          continue;
        } else if(!i) continue;
        if(c === 'players' && !i.destroy && !i.boss){
          if(this.leader.length){
            for(let l = Math.min(this.leader.length-1,9); l>=0; l--){
              if(this.leader.length<9){
                ///
                if(this.leader[l].xp<i.xp){
                  if(!l || this.leader[l-1].xp>=i.xp){
                    this.leader.splice(l,0,i);
                    break;
                  }
                } else if(l == this.leader.length-1){
                  this.leader.push(i);
                  break;
                }
                ///
              } else if(this.leader[l].xp<i.xp && (!l || this.leader[l-1].xp>=i.xp)){
                this.leader.splice(l,0,i);
                this.leader.pop();
                break;
              }
            }
          } else {
            this.leader.push(i);
          }
        }
        if(i.destroy == 1){
          if(c == "players"){
            if(i.state.disconnect){
              if(!this.boss) this.team[this.INSTANCE[c][j].team] --;
              this.INSTANCE[c][j].delete();
            } else {
              continue;
            }
          }
          if(c == "objs"){this.INSTANCE[c][j].delete();this.INSTANCE[c][j] = c.KEEP_PLACE; continue;}
          if(c == 'bullets'){this.INSTANCE[c][j] = c.KEEP_PLACE; continue;}
          delete this.INSTANCE[c][j];
        } else {
          if(i.getPlace == 1){
            i.size+=c.SIZE_GET_POS;
          }
          qt.insert(i.x,i.y,i.size,i);
        }
      }
    }
    ///
    for(let c in this.INSTANCE){
      for(let obj of this.INSTANCE[c]){
        if(typeof obj === "undefined" || !isNaN(obj)){continue;}
        if(obj.getPlace == 0){
          continue;
        }
        if(obj.destroy>=1){
          continue;
        } else {
          if(c == 'players' || c == 'bullets'){
            switch(obj.team){
              case 0:{
                if(obj.x>this.map.width/2-this.baseSize){
                  obj.collision(0,{base:1})
                  continue;
                }
                break;
              };
              case 1:{
                if(obj.x<-this.map.width/2+this.baseSize){
                  obj.collision(0,{base:1})
                  continue;
                }
                break;
              };
            }
          }
        }
        let collide = qt.query(function (rect,circle){
            var distX = Math.abs(circle.x - rect.x-rect.w/2);
            var distY = Math.abs(circle.y - rect.y-rect.h/2);

            if (distX > (rect.w/2 + circle.r)) { return false; }
            if (distY > (rect.h/2 + circle.r)) { return false; }

            if (distX <= (rect.w/2)) { return true; }
            if (distY <= (rect.h/2)) { return true; }

            var dx=distX-rect.w/2;
            var dy=distY-rect.h/2;
            return (dx*dx+dy*dy<=(circle.r*circle.r));
        },{'x':obj.x,'y':obj.y,'r':(obj.DETEC && obj.DETEC.enabled ? obj.DETEC.size : obj.size)*2})
        for(let i in collide){
          let other = collide[i].data;
          if(other.getPlace == 0 || obj.getPlace == 0){
            continue;
          }
          let otherCLASS = other.constructor.name;
          let objCLASS = obj.constructor.name;
          ///
          if(other.destroy>=1){continue;}
          if(objCLASS == 'Detector' && otherCLASS == 'Detector'){continue;}
          if(obj.id.oId == other.id.oId && objCLASS == otherCLASS){continue;}
          let dis = Math.sqrt(Math.pow(other.x-obj.x,2)+Math.pow(other.y-obj.y,2));
          if((isNaN(other.getPlace) || isNaN(obj.getPlace)) && (other.team != obj.team)){
            if(obj.DETEC && obj.DETEC.enabled){
              if(dis <= obj.DETEC.size+other.size){
                obj.DETEC.collision(other,{dis:dis})
              }
            } else if(other.DETEC && other.DETEC.enabled){
              if(dis <= obj.size+other.DETEC.size){
                other.DETEC.collision(obj,{dis:dis})
              }
            }
          }
          ///
          if(dis <= obj.size+other.size){
            if(obj.size > other.size || obj.x+obj.y >= other.x+other.y){
              if(other.getPlace || obj.getPlace){
                if(other.getPlace && objCLASS == 'Player'){
                  other.getPlace = 0;
                }
                if(obj.getPlace && otherCLASS == 'Player'){
                  obj.getPlace = 0;
                }
                continue;
              }
              let objOption = {};
              let otherOption = {};
              if(obj.x == other.x && obj.y == other.y){
                obj.x+=Math.random()-.5;
                obj.y+=Math.random()-.5;
              }
              if(objCLASS != 'Objects' && otherCLASS != 'Objects' && obj.team == other.team){
                objOption.noDam = 1;
                otherOption.noDam = 1;
              }
              if(objCLASS == 'Bullet'){
                otherOption.pene = obj.pene;
              }
              if(otherCLASS == 'Bullet'){
                objOption.pene = other.pene;
              }
              other.collision(obj,otherOption);
              obj.collision(other,objOption);
              if(objCLASS == 'Bullet'){
                if(other.destroy && other.prize){
                  if(this.INSTANCE.players[obj.origine.oId]){
                    this.INSTANCE.players[obj.origine.oId].xp+=other.prize;
                    if(otherCLASS == 'Player' && !this.INSTANCE.players[obj.origine.oId].bot){
                      this.INSTANCE.players[obj.origine.oId].mess.push('You killed '+ other.name);
                    }
                  }
                }
              }
              if(otherCLASS == 'Bullet' && obj.prize){
                if(obj.destroy){
                  if(this.INSTANCE.players[other.origine.oId]){
                    this.INSTANCE.players[other.origine.oId].xp+=obj.prize;
                    if(objCLASS == 'Player' && !this.INSTANCE.players[other.origine.oId].bot){
                      this.INSTANCE.players[other.origine.oId].mess.push('You killed '+ obj.name);
                    }
                  }
                }
              }
              if(obj.destroy){
                break;
              }
            }
          }
        }
      }
    }
    this.INSTANCE.detectors = [];
    ///BUFFING///
    for(let p of this.INSTANCE.players){
      if(p && p.pet){
        this.INSTANCE.bullets[p.pet.id.oId] = 20;
        if(p.alpha) qt.insert(p.pet.x,p.pet.y,p.size,p.pet);
      }
    }
    this.BUFFER = [];
    for(let id in this.INSTANCE.players){
      let player = this.INSTANCE.players[id];
      if(player.bot || player.boss){
        continue;
      }

      var x = player.x-player.screen/2-200, y = player.y-player.screen/2*0.5625-200;
      var w = player.screen+400, h = player.screen*0.5625+400;

      this.BUFFER[id] = {
        x:x,
        y:y,
        w:w,
        h:h
      }
      this.BUFFER[id].main = player;
      this.BUFFER[id].rest = qt.query(function(a,b) {
        return(
          ((a.x + a.w) >= b.x) &&
          (a.x <=(b.x + b.w)) &&
          ((a.y + a.h) >= b.y) &&
          (a.y <= (b.y + b.h))
        );
      },
      {'x':x-200,'y':y-200,'w':w+400,'h':h+400});
    }
    ///UPDATE///
    for(let c in this.INSTANCE){
      for(let o in this.INSTANCE[c]){
        let obj = this.INSTANCE[c][o];
        if(typeof obj === "undefined" || !isNaN(obj)){continue;}
        if(obj.destroy == 1){
          if(c == "players"){
            if(obj.dead>1){
              obj.dead--;
            }
            if(obj.murder == -1){
              continue;
            }
            let murder = this.INSTANCE[obj.murder[0]][obj.murder[1].oId];
            if(typeof(murder) === "undefined" || !isNaN(murder) || murder.destroy){
              obj.murder = -1;
              continue;
            }

            obj.x+=(murder.x-obj.x)*0.1;
            obj.y+=(murder.y-obj.y)*0.1;
          }
          continue;
        }
        if(obj.getPlace == 1){
          delete obj.getPlace;
          obj.size -= c.SIZE_GET_POS;
        } else if(obj.getPlace == 0){
          obj.delete();
          delete this.INSTANCE[c][o];
          continue;
        }
        obj.update();
      }
    }
    ///
    setTimeout(function(it){it.update()},20,this);
  }
  respawn(id, force = 0, bot = 0){
    let tank = this.INSTANCE.players[id];
    if(!tank){
      return;
    }
    if(!force && !tank.destroy){return;}
    if(tank.dead>1){return;}
    let x = tank.team ? this.map.width/2-this.baseSize*Math.random() : -this.map.width/2+this.baseSize*Math.random();
    let y = 200+Math.random()*(this.map.height-400)-this.map.height/2;
    let mXp = this.XPLVL[this.XPLVL.length-1];
    let xp = force ? tank.xp : tank.xp<mXp ? parseInt(Math.pow(tank.xp/(mXp/Math.pow(mXp*.6,1/.8)),.8)) : mXp*.6;
    let newTank = new Player(tank.id,x,y,tank.name,tank.team,this.XPLVL);
    if(bot){
      newTank.motion = CONFIG.BOTS[0].bind(newTank);
      newTank.bot = 1;
      if(Math.random()<0.1){
        newTank.name = CONFIG.BOT_NAMES[parseInt(Math.random()*(CONFIG.BOT_NAMES.length-1))];
      }
    }
    ///
    newTank.xp = xp;
    newTank.coins = tank.coins || 0;
    ///
    if(tank.pet){
      newTank.pet = tank.pet;
      newTank.pet.x = newTank.x;
      newTank.pet.y = newTank.y;
      newTank.pet.pet = 1;
      let newId = 0;
      while(this.INSTANCE.bullets[newId]){
        newId++;
      }
      newTank.pet.id = {"GM":this.gm,"sId":this.id,"oId":newId};
      this.INSTANCE.bullets[newId] = 20;
    }
    ///
    this.INSTANCE.players[id] = newTank;
    return tank.xp;
  }
  getBuffer(id){
    let RAW = this.BUFFER[id];
    if(!RAW){
      return;
    }
    if(!RAW.main){
      return;
    }
    let buff = {
      len: 56+(RAW.main.name.length*2)+(RAW.main.canDir.length*2),
      instances:[]
    };
    buff.head = {
      timestamp: this.timestamp,
      width:     this.map.width,
      height:    this.map.height,
      screen:    RAW.main.screen,
      xp:        RAW.main.xp,
      still:     RAW.main.dead ? 0 : RAW.main.level-RAW.main.stillLvl,
      cLvl:      parseInt((RAW.main.level)/10)
    };
    ///
    let lvl = RAW.main.level, xp = RAW.main.xp, arr = RAW.main.XPLVL;
    buff.head.level = (!lvl ? 1 : ((lvl>=arr.length-1) ? lvl : lvl+Math.max(Math.min(1,(xp-arr[lvl-1])/(arr[lvl]-arr[lvl-1])),0)));
    ///
    buff.main = {
      states: [!!RAW.main.hit*1,
               !!RAW.main.inputs.c*1,
               !!RAW.main.dead*1,
               !!RAW.main.shield*1,0,0],
      class:  RAW.main.class,
      color:  RAW.main.dev.color ? RAW.main.dev.color-1 : RAW.main.team,
      x:      RAW.main.x,
      y:      RAW.main.y,
      vx:     RAW.main.vec.x,
      vy:     RAW.main.vec.y,
      dir:    RAW.main.inputs.c ? RAW.main.autoDir : RAW.main.dir,
      size:   RAW.main.size,
      alpha:  RAW.main.alpha,
      hp:     RAW.main.hp/RAW.main.maxHp,
      name:   RAW.main.name,
      nameC:  0,
      recoil: RAW.main.recoil,
      canDir: RAW.main.canDir ? RAW.main.canDir : []
    };
    for(let i of RAW.rest){
      let obj = i.data;
      if(obj.getPlace == 0){
        continue;
      }
      if(
        ((obj.x) <= RAW.x) ||
        ((obj.y) <= RAW.y) ||
        ((obj.x) >= (RAW.x+RAW.w)) ||
        ((obj.y) >= (RAW.y+RAW.h))
      ){continue;}
      ///
      if(obj.BUFF.timestamp !== this.timestamp){
        let raw;
        switch(obj.constructor.name){
          case 'Player':{
            obj.BUFF.len = 37+(obj.name.length*2)+(obj.canDir.length*2);
            raw = {
              construc: 'Players',
              id: obj.id.oId,
              states: [!!obj.hit*1,
                       !!obj.shield*1,
                       0,0,0,0,!!obj.bot*1],
              class:  obj.class,
              color:  obj.dev.color ? obj.dev.color-1 : obj.team,
              x:      obj.x,
              y:      obj.y,
              vx:     obj.vec.x,
              vy:     obj.vec.y,
              dir:    obj.dir,
              size:   obj.size,
              alpha:  obj.alpha,
              hp:     Math.max(0,obj.hp/obj.maxHp),
              xp:     obj.xp,
              name:   obj.name,
              nameC:  0,
              recoil: obj.recoil,
              canDir: obj.canDir ? obj.canDir : []
            }
            break;
          };
          case 'Objects':{
            obj.BUFF.len = 19;
            raw = {
              construc: 'Objects',
              id: obj.id.oId,
              states: [!!obj.hit*1,!!obj.extra*1,0,0,0,0,0],
              shape:   obj.type,
              hp:     obj.hp/obj.maxHp,
              x:      obj.x,
              y:      obj.y,
              size:   obj.size,
              alpha:  obj.alpha,
            }
            break;
          };
          case 'Bullet':{
            obj.BUFF.len = 21;
            raw = {
              construc: 'Bullets',
              id: obj.id.oId,
              states: [!!obj.pet*1,0,0,0,0,0,0],
              type:   parseInt(obj.type),
              x:      obj.x,
              y:      obj.y,
              size:   obj.size,
              color:  obj.color ? obj.color-1 : obj.team,
              alpha:  obj.alpha,
              dir:    obj.showDir
            }
            break;
          };
        }
        raw.len = obj.BUFF.len;
        obj.BUFF.data = new Int8Array(Controller.encodeInst('Instance',raw));
        obj.BUFF.timestamp = this.timestamp;
      }
      ///
      switch(obj.constructor.name){
        case 'Player':{
          if(!obj.alpha){
            continue;
          }
          if(RAW.main.id.oId == obj.id.oId){
            continue;
          }
        };
      }
      buff.len+=obj.BUFF.data.length;
      buff.instances.push(obj.BUFF.data);
    };
    return buff;
  }
  getUi(id){
    let buff = {
      len:3,
      leader:[],
      map:[],
      mess:[]
    };
    for(let i of this.leader){
      buff.len+= 7+i.name.length*2;
      buff.leader.push({
        xp:i.xp,
        name:i.name,
        nameC: 0,
        team: i.dev.color ? i.dev.color-1 : i.team
      })
    };
    for(let i of this.INSTANCE.players[id].mess){
      buff.len+= 1+i.length*2;
      buff.mess.push(i);
    };
    this.INSTANCE.players[id].mess = [];
    return buff;
  }
  ask(data){
    let name = data.name;
    let pet = (data.pet>-1) ? new Bullet(0,0,0,0,0,0) : null;
    if(pet){
      pet.update = CONFIG.PETS[0].bind(pet);
      pet.type = data.pet;
    }
    ///
    let index = -1,team0 = 0, team1 = 0;
    for(let i = 0; i<=this.maxPlayer; i++){
      if(typeof(this.INSTANCE.players[i]) === "undefined" && index==-1){
        index = i;
      } else if(this.INSTANCE.players[i] && !isNaN(this.INSTANCE.players[i].team)){
        switch (this.INSTANCE.players[i].team) {
          case 0:{
            team0++;
            break;
          }
          case 1:{
            team1++;
            break;
          }
        }
      }
    }
    if(index>=0){
      let id = {"GM":this.gm,"sId":this.id,"oId":index};
      let tank = new Player(
        id,
        0,
        0,
        name,
        (team1==team0) ? parseInt(Math.random()+.5) : (team0 < team1) ? 0 : 1,
        this.XPLVL
      );
      if(pet){ tank.pet = pet; pet.origine = tank.id; pet.team = tank.team;}
      this.INSTANCE.players[index] = tank;
      this.respawn(index,1);
      console.log('NEW PLAYER gm: '+this.gm+' serve-Id: '+this.id+' player id: '+index);
      return id;
    }
    return;
  }
};
///INSTANCE///
class Player {
  constructor(id,x,y,name,team,xpLvl){
    this.XPLVL = xpLvl;
    this.mlx = this.XPLVL[this.XPLVL.length-3]/Math.pow(this.XPLVL[this.XPLVL.length-3],1/1.8);
    this.BUFF = {
      timestamp: -1,
    };
    this.extraView = 0;
    this.dev = {
      size: 0,
      stick: 0
    };
    this.id = id;
    this.name = name;
    this.mess = [];
    this.class = "Basic";
    this.classLvl = 0;
    this.team = team;
    this.hit = 0;
    this.xp = 0;
    this.coins = 0;
    this.userKey = 0;
    this.maxHp = 150;
    this.hpregan = [0,0];
    this.hp = this.maxHp;
    this.prize = 100;
    this.autoDir = 0;
    this.dead= 0,
    this.state = {
      "disconnect": 0,
    };
    this.shield = 6000;
    this.inputs = {
      "mouse_x":0,
      "mouse_y":0,
      "mouseL":0,
      "mouseR":0,
      "w":0,
      "a":0,
      "s":0,
      "d":0,
      "f":0,
      'arrw':0,
      'arrs':0,
      'arra':0,
      'arrd':0,
      "e":0,
      "n":0
    };
    this.destroy = 0;
    this.shootTimer = [0,0];
    ///
    this.map = Controller.server[this.id.GM][this.id.sId].map
    this.x = x;
    this.y = y;
    this.vec = new Vec(0,0)
    this.dir = 0;
    this.canDir = [];
    this.timer = 0;
    ///
    this.size = 25;
    this.alpha = 1;
    this.screen = 1280;
    this.level = 0;
    this.stillLvl = 0;
    this.droneCount = 0;
    this.damage = 7;
    this.murder = -1;
    this.up = {
      "MSpeed": 0, //0
      "Reload": 1, //1
      "BSpeed": 1, //2
      "BPene": 1,  //3
      "BDamage": 1,//4
      "BodyDam": 1,//5
      "HpUp":0,    //6
      "HpRegan":1  //7
    }
    this.upNb = [0,0,0,0,0,0,0,0];
    this.recoil = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  }
  respawn(){

  }
  delete(){

  }
  motion(){
    let key = this.inputs;
    let motion = new Vec(0,0);
    let len = 0.35+this.up.MSpeed-(this.level/155);
    if(!this.state.disconnect){
      if(key.w || key.arrw){motion.y-=len;}
      if(key.s || key.arrs){motion.y+=len;}
      if(key.a || key.arra){motion.x-=len;}
      if(key.d || key.arrd){motion.x+=len;}
    }
    if(motion.length() > 0){
      this.vec.add(motion.norm().multiply(new Vec(len,len)));
      if(this.alpha<1 && !this.dev.invisible){
        this.alpha+=Math.min(1,CLASS[this.class].alpha*10);
      }
      if(this.shield){
        this.shield = 0;
      }
    }
    this.vec.x*=FRICTION;
    this.vec.y*=FRICTION;
    this.x+=this.vec.x;
    this.y+=this.vec.y;
    this.autoDir += .015;
    if(this.x<-this.map.width/2){
      this.x = -this.map.width/2;
      this.vec.x = 0;
    };
    if(this.y<-this.map.height/2){
      this.y = -this.map.height/2;
      this.vec.y = 0;
    };
    if(this.x> this.map.width/2){
      this.x = this.map.width/2;
      this.vec.x = 0;
    };
    if(this.y> this.map.height/2){
      this.y = this.map.height/2;
      this.vec.y =  0;
    };
  }
  shoot(){
    if(CLASS[this.class].DETEC){
      if(!this.DETEC){
        let detec = CLASS[this.class].DETEC;
        this.DETEC = new Detector(this,this.x,this.y,detec.size,detec.type,detec.all)
        this.DETEC.team = this.team;
      } else {
        this.DETEC.x = this.x;
        this.DETEC.y = this.y;
      }
    } else if(false){
      this.DETEC = 0;
    }
    ////
    if(this.state.disconnect){
      return;
    }
    for(let r in CLASS[this.class].canons){
      if(typeof this.shootTimer[r] === 'undefined'){this.shootTimer[r] = 0;}
      let can = CLASS[this.class].canons[r];
      let reloadMax = Math.round(can.reload*this.up.Reload);
      let reload = this.shootTimer[r];
      let maxD = CLASS[this.class].maxDrone;
      var autoDir, shoot;
      let ra = this.size/35;
      if(can.autoDir){
        if(this.DETEC.select){
          this.DETEC.enabled = 0;
          let other = this.DETEC.select;
          let dis = Math.sqrt(Math.pow(this.x-other.x,2)+Math.pow(this.y-other.y,2));
          if(!other.destroy && other.alpha && dis<=CLASS[this.class].DETEC.maxDis){
            autoDir = Math.atan2(other.y+other.vec.y*dis/12-this.y,other.x+other.vec.x*dis/12-this.x);
            this.canDir[r] = autoDir;
            shoot = 1;
          } else {
            this.DETEC.reset();
            this.DETEC.enabled = 1;
            this.canDir[r] = this.autoDir;
            shoot = 0;
          }
        } else {
          this.canDir[r] = this.autoDir;
        }
      };
      ///
      if((this.inputs.e || this.inputs.mouseL || can.auto)
      &&((maxD && can.life == -1) ? this.droneCount<maxD : true)
      &&((can.autoShoot) ? shoot : true)){
        ///
        if(this.shield){
          this.shield = 0;
        }
        ///
        if(reload == Math.floor(can.offTime*reloadMax)){
          ///
          if(this.alpha<1 && !this.dev.invisible){
            this.alpha+=Math.min(1,CLASS[this.class].alpha*30);
          }
          ///
          let dir = can.autoDir ? autoDir : this.dir+can.offdir;
          let exitSpeed = can.exitSpeed ? can.exitSpeed : 40;
          let offx = can.offx*ra;
          let len = (can.canonLength*.93)*ra-((this.up.BSpeed*can.speed)*exitSpeed*2);
          let offlen  = Math.sqrt(Math.pow(len,2)+(offx*offx));
          let offdir  = Math.atan(offx/len);
          let x = this.x+Math.cos(dir+offdir)*(offlen)//-can.size*ra);
          let y = this.y+Math.sin(dir+offdir)*(offlen)//-can.size*ra);
          let Bull = new Bullet(this.id,x,y,dir+Math.random()*can.rand-can.rand/2,this.up.BSpeed*can.speed,exitSpeed);
              Bull.type = (can.type ? can.type : 0);
              Bull.class = this.class;
              Bull.pene = this.up.BPene*can.pene;
              Bull.life = (can.life ? can.life : 130);
              Bull.damage = this.up.BDamage*can.damage;
              Bull.size = this.boss ? can.size : can.size*ra;
              Bull.weight = can.weight;
          Controller.server[this.id.GM][this.id.sId].createBullet(Bull,this)
          this.vec.add(new Vec(can.back,0).rotate(dir-Math.PI));
          if(maxD && can.life  == -1){
            this.droneCount++;
          }
          ///
          this.recoil[parseInt(r)] = 1;
          setTimeout((x,r) => {x.recoil[r] = 0},33,this,parseInt(r))
        }
        ///
        if(this.shootTimer[r] == 0){
          this.shootTimer[r]+=1;
          continue;
        }
      } else {
        if(reload < Math.floor(can.offTime*reloadMax)){
          this.shootTimer[r] = 0;
        }
      }
      ///
      if(reload>0 && reload<reloadMax){
        this.shootTimer[r] += 1;
      } else if(reload >= reloadMax){
        this.shootTimer[r] = 0;
      }
    }
  }
  upgrade(data){
    if(this.destroy){return;}
    if(this.level-this.stillLvl <= 0){
      return 1;
    }
    switch(data){
      case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:
        if(this.upNb[data] >= 6){
          break;
        }
        this.stillLvl+=1;
        this.upNb[data]+=1;
        let nb = -1;
        let re = 0;
        for(let i in this.up){
          nb++;
          if(nb != data){continue;}
          switch(i){
            case "HpRegan":this.up[i] += 0.28;break;
            case "Reload": this.up[i] -= 0.092;break;
            case "BSpeed": this.up[i] += 0.11;break;
            case "BDamage": this.up[i] += .2;break;
            case "BPene": this.up[i] += 1.25;break;
            case "MSpeed":this.up[i] += 0.020;break;
            case "HpUp": this.maxHp += 110; this.hp = parseInt(this.hp*(this.maxHp/(this.maxHp-100)));break;
            case "BodyDam":this.damage += 1.8;break;
          }
          break;
        }
    }
  }
  upClass(data){
    if(this.destroy){return;}
    let tanks = [];
    for(let i = 0; i < parseInt((1+this.level)/10); i++){
      if(CLASS_TREE[i][this.class]){
        tanks = tanks.concat(CLASS_TREE[i][this.class]);
      }
    }
    if(tanks.includes(data)){
      this.classLvl++;
      this.class = data;
      this.droneCount = 0;
      this.necro = CLASS[this.class].necro;
      this.shootTimer = new Array(CLASS[this.class].canons.length).fill(0);
    } else {
      return;
    }
  }
  collision(other,option = {}){
    if(this.dev.ghost){return;}
    if(option.type){
      switch (option.type) {
        case 'god':
          this.vec.add(new Vec(this.x-other.x,this.y-other.y).norm().multiply(new Vec(0.6,0.6)));
          return;
          break;
      }
    }
    if(option.base){
      this.alpha = 1;
      this.destroy = c.DES;
      this.dead = c.DEAD_DELAY;
      return;
    }
    let oldHp = this.hp;
    switch(other.constructor.name){
      case "Player":
        this.vec.add(new Vec(this.x-other.x,this.y-other.y).norm().multiply(new Vec(0.3,0.3)));
        if(option.noDam || this.shield){break;}
        this.hp-=other.damage;
        this.hit = 2;
        if(this.hp <= 0){
          this.dead = c.DEAD_DELAY;
          this.murder = ["players",other.id];
          this.destroy = c.DES;
          other.xp += this.prize;
          if(this.coinReward) other.coins+=this.coinReward;
          if(!other.bot){
            other.mess.push('You killed '+this.name);
          }
        }
        break;
      case "Objects":
        let len = (this.vec.length()<0.5) ? 2 : .5;
        this.vec.add(new Vec(this.x-other.x,this.y-other.y).norm().multiply(new Vec(len,len)));
        if(this.necro && other.type == 'sqr' && this.droneCount<CLASS[this.class].maxDrone+this.upNb[1]){
          this.droneCount++;
          let Bull = new Bullet(this.id,other.x,other.y,Math.random()*Math.PI*2,this.up.BSpeed*this.necro.speed,0);
              Bull.type = this.necro.type;
              Bull.class = this.class;
              Bull.necro = this.necro.necro;
              Bull.pene = this.up.BPene*this.necro.pene;
              Bull.life = -1;
              Bull.damage = this.up.BDamage*this.necro.damage;
              Bull.size = other.size;
              Bull.weight = this.necro.weight;
          Controller.server[this.id.GM][this.id.sId].createBullet(Bull,this);
          return;
        }
        if(this.shield){return;}
        this.hp-=other.damage;
        this.hit = 2;
        if(this.hp <= 0){this.dead = c.DEAD_DELAY; this.murder = ["objs",other.id];this.destroy = c.DES}
        break;
      case 'Bullet':
        if(option.noDam){break;}
        if(other.origine.oId == this.id.oId){
          return;
        }
        if(this.bot){
          this.lastBullet = other.origine;
        }
        this.vec.add(new Vec(this.x-other.x,this.y-other.y).norm().multiply(new Vec(other.weight/3,other.weight/3)));
        if(this.shield){return;}
        this.hp-=other.damage*Math.max(1,other.pene/5);
        this.hit = 2;
        if(this.hp <= 0){this.dead = c.DEAD_DELAY; this.murder = ["players",other.origine]; this.destroy = c.DES;}
        break;
    }
    if(this.alpha<1 && !this.dev.invisible){
      this.alpha = Math.min(1,this.alpha+(oldHp-this.hp)/this.maxHp*5)
    }
  }
  update(){
    this.hit = Math.max(0,this.hit-1);
    if(this.pet){
      this.pet.update(this);
      this.pet.alpha = this.alpha;
      this.pet.size = this.size;
    }
    if(this.destroy>1){
      this.x+=this.vec.x;
      this.y+=this.vec.y;
      this.destroy-=1;
      this.alpha = (this.destroy-1)/c.DES;
      this.size *= 1.04;
      this.screen = 2194;
      return;
    } else {
      if(this.hp <= 0){
        this.destroy = c.DES;
        this.dead = 1;
      }
      if(this.hpregan[0] > this.hp){
        this.hpregan[0] = this.hp;
        this.hpregan[1] = 0;
      } else {
        this.hpregan[0] = this.hp;
      }
      if(this.hp < this.maxHp){
        this.hpregan[1]+=this.up.HpRegan/990000;
        this.hp += (parseInt(this.hpregan[1]*this.maxHp*10))/10;
        this.hp = Math.min(this.maxHp,this.hp);
      } else {
        this.hp = this.maxHp;
      }
    }
    ///
    if(CLASS[this.class].alpha){
      this.alpha = Math.max(0,this.alpha-CLASS[this.class].alpha);
    } else if(!this.dev.invisible){this.alpha = 1}
    this.motion();
    if(this.inputs.c){
      this.dir = this.autoDir;
    }
    this.shoot();
    ///
    if(this.xp>=this.XPLVL[this.level]){
      if(this.level == 18 || this.level == 27){
        this.stillLvl++;
      }
      this.hp+=3;
      this.maxHp+=3;
      this.level++;
    }
    if(this.shield){
      this.shield--;
    }
    if(this.state.disconnect){
      this.hp-=this.maxHp/1000;
      if(this.hp<=0){
        this.destroy = c.DES;
      }
    }
    this.size = 28+this.dev.size+Math.floor(this.level/2.8);
    this.screen = this.extraView+CLASS[this.class].screen+this.level*22;
    if(this.xp != this.oldXp){
      this.oldXp = this.xp;
      if(this.xp == 666666 && !this.mess_cursed_score && !this.bot){
        this.mess_cursed_score = 1;
        this.mess.push('/img mc_cursed_score.png');
      }
      if(this.xp<this.XPLVL[this.XPLVL.length-3]){
        this.prize = parseInt(Math.min(this.XPLVL[this.XPLVL.length-3],Math.pow(this.xp/this.mlx,1.8)));
      } else {
        this.prize = parseInt(this.XPLVL[this.XPLVL.length-3]+(this.xp-this.XPLVL[this.XPLVL.length-3])/10);
      }
    }
    if(this.class == 'Rocket' && !this.mess_im_speed && this.upNb[0] == 6 && this.upNb[1] == 6){
      this.mess_im_speed = 1;
      this.mess.push('/img mc_im_speed.png');
    }
    ///
    if(this.dev.stick){
      let obj = Controller.server[this.id.GM][this.id.sId].INSTANCE[this.dev.stick[0]][this.dev.stick[1]];
      if(obj && isNaN(obj) && !obj.destroy){
        obj.x += (this.x+this.inputs.mouse_x-obj.x)*0.2;
        obj.y += (this.y+this.inputs.mouse_y-obj.y)*0.2;
      } else {
        this.dev.stick = null;
      }
    }
  }
}
class Objects {
  constructor(type,pos,id,map){
    this.BUFF = {
      timestamp: -1,
    };
    this.coinReward = parseInt(Math.random()+.02);
    this.type = type;
    this.id = id;
    this.size = 20;
    this.collideId = Math.random();
    this.hp = 20;
    this.damage = 4;
    this.alpha = 1;
    this.hit = 0;
    this.spawnRad = 400;
    this.marge = 200;
    this.weight = 1;
    switch(pos){
      case -1:
        while(1){
          this.x = this.marge+Math.random()*(map.width-this.marge*2)-map.width/2;
          this.y = this.marge+Math.random()*(map.height-this.marge*2)-map.height/2;
          let dis = Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))
          if(dis>1000){
            dis = Math.sqrt(Math.pow(map.width/4-this.x,2)+Math.pow(map.height/4-this.y,2))
            if(dis>700){
              dis = Math.sqrt(Math.pow(-map.width/4-this.x,2)+Math.pow(-map.height/4-this.y,2))
              if(dis>700){
                break;
              }
            }
          }
        }
        this.pos = 0;
        break;
      case 'bull':
        while(1){
          this.x = Math.random()*1400-700
          this.y = Math.random()*1400-700
          let dis = Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))
          if(dis < 700 && dis>650){
            break;
          }
        }
        this.pos = 1;
        break;
      default:
        let dir = Math.random()*Math.PI*2;
        this.x = Math.min(map.width/2-this.marge,
                 Math.max(-map.width/2+this.marge,
                          pos[0]+Math.sin(dir)*(Math.random()*pos[2])));
        this.y = Math.min(map.height/2-this.marge,Math.max(-map.height/2+this.marge,pos[1]+Math.cos(dir)*(Math.random()*pos[2])));
        this.pos = 1;
        break;
    }
    this.maxspeed = 0.30;
    switch(this.type){
      case "sqr": this.size = 20;this.hp = 13;this.prize = 15;break;
      case "tri": this.size = 18;this.hp = 25;this.prize = 50;this.maxspeed=.26;break;
      case "pnt": this.size = 42;this.hp = 190;this.prize = 100+parseInt(Math.random()*100);this.maxspeed= 0.08;this.weight = 4;this.damage=5;break;
      case "Bpnt": this.size = 115;this.hp = 9000;this.prize = 3000;this.maxspeed=0.01;this.weight = 100;break;
      case "Bsqr": this.size = 90;this.hp = 8000;this.prize = 2000;this.maxspeed=0.01;this.weight = 100;break;
      case "Btri": this.size = 72;this.hp = 7000;this.prize = 1000;this.maxspeed=0.01;this.weight = 100;break;
      case "bull": this.size = 12;this.hp = 15; this.prize = 12; this.maxspeed = .42;this.damage = 7;
                   this.DETEC = new Detector(this,this.x,this.y,500,type = ['Player']);break;
    }
    this.coinReward *= parseInt(this.prize/10);
    switch(this.type){
      case 'pnt':
      case 'Bpnt':
      case 'Bsqr':
      case 'Btri':
        this.getPlace = 1;
      break;
    }
    if(this.type == 'bull'){
      if(Math.random()<0.15){
        this.size = 23;
        this.hp = 32;
      }
    }
    if(Math.random()<0.00004){
      this.extra = 1;
      this.hp = 10000;
      this.prize = 50000;
      this.weight = 100;
    }
    this.map = map;
    this.maxHp = this.hp;
    //
    this.rotationDir = Math.sign(Math.random()-0.5);
    this.vec = new Vec(this.maxspeed,0).rotate(Math.random()*Math.PI*2);
    this.destroy = 0;
    this.rx = this.x;
    this.ry = this.y;
    this.rotationVal = 0.002+Math.random()*0.0005;
    this.TOSEND = {
      "public":{}
    }
  }
  delete(){
    Controller.server[this.id.GM][this.id.sId].obj[this.type][this.pos] -= 1;
  }
  collision(other,option = {}){
    let len = (this.vec.length()*this.weight<0.4) ? 2 : .4;
    switch(other.constructor.name){
      case "Player":
        if(other.necro && this.type == 'sqr' && other.droneCount<CLASS[other.class].maxDrone+other.upNb[1]){
          this.destroy = 1;
          return;
        }
        this.vec.add(new Vec(this.x-other.x,this.y-other.y).norm().multiply(new Vec(len,len)));
        this.hp-=other.damage;
        this.hit = 2;
        if(this.hp <= 0){this.destroy = c.DES;other.xp += this.prize;other.coins+=this.coinReward}
        break;
      case "Objects":
        if(other.type == 'bull'){
          this.vec.add(new Vec(this.x-other.x,this.y-other.y).norm().multiply(new Vec(0.1,0.1)));
          return;
        }
        this.vec.add(new Vec(this.x-other.x,this.y-other.y).norm().multiply(new Vec(len,len)));
        break;
      case 'Bullet':
        if(other.necro && this.type == 'sqr'){
          let play = Controller.server[other.origine.GM][other.origine.sId].INSTANCE.players[other.origine.oId];
          if(play.droneCount<CLASS[play.class].maxDrone+play.upNb[1]){
            this.destroy = 1;
            return;
          }
        }
        this.hp-= ((option.pene>1) ? option.pene : option.pene/2)*other.damage;
        this.hit = 2;
        if(this.hp <= 0){this.destroy = c.DES;}
        if(this.type[0] == 'B'){
          break;
        }
        this.vec.add(new Vec(this.x-other.x,this.y-other.y).norm().multiply(new Vec(0.4,0.4)));
        break;
    }
  }
  update(){
    this.hit = Math.max(0,this.hit-1);
    if(this.destroy>1){
      this.x+=this.vec.x/this.weight;
      this.y+=this.vec.y/this.weight;
      this.destroy-=1;
      this.alpha = this.destroy/c.DES;
      this.size += 1+this.size*.01;
      return;
    }
    this.vec.rotate(this.rotationVal);
    this.vec.limit(this.maxspeed/2,FRICTION)
    this.x+=this.vec.x/this.weight;
    this.y+=this.vec.y/this.weight;
    if(this.DETEC){
      if(this.DETEC.select){
        if(this.DETEC.select.destroy || this.DETEC.select.god){
          this.DETEC.reset();
        } else {
          let v = new Vec(0.28,0).rotate(Math.atan2(this.DETEC.select.y-this.y,this.DETEC.select.x-this.x))
          this.vec.add(v)
          this.DETEC.enabled = 0;
        }
      } else if(Math.sqrt(Math.pow(this.x-this.rx,2)+Math.pow(this.y-this.ry,2)) > 120){
        let v = new Vec(0.28,0).rotate(Math.atan2(this.ry-this.y,this.rx-this.x))
        this.vec.add(v);
      } else {
        this.DETEC.enabled = 1;
      }
      this.DETEC.x = this.x;
      this.DETEC.y = this.y;
    }

    if(this.x<-this.map.width/2){
      this.x = -this.map.width/2;
      this.vec.x = 0;
    };
    if(this.y<-this.map.height/2){
      this.y = -this.map.height/2;
      this.vec.y = 0;
    };
    if(this.x> this.map.width/2){
      this.x = this.map.width/2;
      this.vec.x = 0;
    };
    if(this.y> this.map.height/2){
      this.y = this.map.height/2;
      this.vec.y =  0;
    };
  }
}
class Bullet {
  constructor(origine,x,y,direction,speed,exitSpeed){
    this.BUFF = {
      timestamp: -1,
    };
    this.id = 0;
    this.origine = origine;
    this.class = 0;
    this.life = 130;
    this.team = 0;
    this.type = 0;
    this.pene = 1;
    this.weight = 0;
    this.damage = 0;
    this.size = 10;
    this.x = x;
    this.y = y;
    this.alpha = 1;
    this.map = {};
    this.map.width = 10000;
    this.map.height = 10000;
    this.dir = direction;
    this.showDir = 0;
    this.maxspeed = speed;
    this.speed = speed;
    this.destroy = 0;
    this.vec = new Vec(speed*exitSpeed,0).rotate(direction);
  }
  collision(other,option = {}){
    if(option.type){
      switch (option.type) {
        case 'god':
          if(this.origine.oId == other.id.oId){
            return;
          }
          this.vec.add(new Vec(this.x-other.x,this.y-other.y).norm().multiply(new Vec(this.speed*2+1,this.speed*2+1)));
          return;
          break;
      }
    }
    if(option.base){
      this.destroy = c.DES;
    }
    if(other){
      switch(other.constructor.name){
        case "Player":
           if(option.noDam){break;}
          if(this.origine.oId == other.id.oId){
            return;
          }
          this.vec.add(new Vec(this.x-other.x,this.y-other.y).norm().multiply(new Vec(this.weight,this.weight)));
          this.pene -= Math.max(1,this.pene/5);
          if(this.pene <= 0){this.destroy = c.DES}
          break;
        case "Objects":
          this.vec.add(new Vec(this.x-other.x,this.y-other.y).norm().multiply(new Vec(this.weight,this.weight)));
          if(this.necro && other.type == 'sqr'){
            let play = Controller.server[this.origine.GM][this.origine.sId].INSTANCE.players[this.origine.oId];
            if(play.droneCount<CLASS[play.class].maxDrone+play.upNb[1]){
              play.droneCount++;
              let Bull = new Bullet(play.id,other.x,other.y,Math.random()*Math.PI*2,play.up.BSpeed*play.necro.speed,0);
                  Bull.type = play.necro.type;
                  Bull.class = play.class;
                  Bull.necro = play.necro.necro;
                  Bull.pene = play.up.BPene*play.necro.pene;
                  Bull.life = -1;
                  Bull.damage = play.up.BDamage*play.necro.damage;
                  Bull.size = other.size;
                  Bull.weight = play.necro.weight;
              Controller.server[play.id.GM][play.id.sId].createBullet(Bull,play);
              return;
            }
          }
          this.pene -= Math.max(this.pene/2,1);
          if(this.pene <= 0){this.destroy = c.DES}
          break;
        case 'Bullet':
          if(other.origine.oId == this.origine.oId){
            if((parseInt(this.type) == 1 || parseInt(this.type) == 3) && this.type == other.type){
              this.vec.add(new Vec(this.x-other.x,this.y-other.y).norm().multiply(new Vec(this.weight,this.weight)));
            }
            return;
          } else  {
          }
          if(option.noDam || this.type == 1.4){break;}
          this.pene-=option.pene;
          if(this.pene <= 0){this.destroy = c.DES;}
          break;
      }
    }
    if(this.destroy && this.life == -1){
      let play = Controller.server[this.origine.GM][this.origine.sId].INSTANCE["players"][this.origine.oId];
      if(play){
        play.droneCount--;
      }
    }
  }
  update(){
    if(this.destroy>1){
      this.x+=this.vec.x;
      this.y+=this.vec.y;
      this.destroy-=1;
      this.alpha = (this.destroy)/c.DES;
      this.size *= 1.03;
      return;
    }
    ///
    let play;
    if(!this.alone){
      play = Controller.server[this.origine.GM][this.origine.sId].INSTANCE.players[this.origine.oId];
      if(typeof play === "undefined"){
        this.destroy = c.DES;
        return;
      } else {
        if(play.destroy > 1 || play.dead || play.state.disconnect || play.class != this.class){
          this.destroy = c.DES;
          return;
        }
      }
    }
    ///
    switch(this.type){
      case 0: break;
      //normal//drone
      case 1:{
        this.showDir = this.dir;
        if(!this.comingDir){
          this.comingDir = 0;
        }
        this.speed = this.maxspeed;
        ///
        if(!this.DETEC){
          this.DETEC = new Detector(play,this.x,this.y,300,['Player','Objects'])
          this.DETEC.team = this.team
        } else {
          this.DETEC.x = this.x;
          this.DETEC.y = this.y;
        }
        ///
        if(play.inputs.mouseR){
          let dir = Math.PI+Math.atan2((play.y+play.inputs.mouse_y)-this.y,play.x+play.inputs.mouse_x-this.x)
          this.dir = dir;
        } else if(play.inputs.mouseL || play.inputs.e){
          let dir = Math.atan2((play.y+play.inputs.mouse_y)-this.y,play.x+play.inputs.mouse_x-this.x)
          this.dir = dir;
        } else  {
          if(this.DETEC.select){
            this.DETEC.enabled = 0;
            let other = this.DETEC.select;
            let dis = Math.sqrt(Math.pow(this.x-other.x,2)+Math.pow(this.y-other.y,2));
            let playdis = Math.sqrt(Math.pow(other.x-play.x,2)+Math.pow(other.y-play.y,2));
            if(dis<300 && !other.destroy && playdis < play.screen/4 && other.alpha){
              this.dir = Math.atan2(other.y-this.y,other.x-this.x);
              break;
            } else {
              this.DETEC.reset();
              this.DETEC.enabled = 1;
            }
          }
          let playDis = Math.sqrt(Math.pow(this.x-play.x,2)+Math.pow(this.y-play.y,2))
          if(playDis < play.size*3.5){
            this.speed = .08;
            if(Math.random()>.999){
              this.comingDir += Math.PI/2;
            }
            let dir = Math.atan2(play.y+Math.sin(play.autoDir*2+this.comingDir)*play.size*3-this.y,
            play.x+Math.cos(play.autoDir*2+this.comingDir)*play.size*3-this.x);
            this.dir = dir;
            break;
          }
          let dir = Math.atan2((play.y)-this.y,play.x-this.x)
          this.dir = dir;
          this.comingDir = this.dir;
        }
        break;
      };
      //xcontrol//
      case 1.1:{
        this.showDir = this.dir;
        if(!this.comingDir){
          this.comingDir = 0;
        }
        this.speed = this.maxspeed;
        if(play.droneCount == -1){
          this.destroy =c.DES;
        }
        ///
        if(!this.DETEC){
          this.DETEC = new Detector(play,this.x,this.y,300,['Player','Objects'])
          this.DETEC.team = this.team
        } else {
          this.DETEC.x = this.x;
          this.DETEC.y = this.y;
        }
        ///
        if(this.DETEC.select){
          this.DETEC.enabled = 0;
          let other = this.DETEC.select;
          let dis = Math.sqrt(Math.pow(this.x-other.x,2)+Math.pow(this.y-other.y,2));
          let playdis = Math.sqrt(Math.pow(other.x-play.x,2)+Math.pow(other.y-play.y,2));
          if(dis<300 && !other.destroy && playdis < play.screen/4 && other.alpha){
            this.dir = Math.atan2(other.y-this.y,other.x-this.x);
            break;
          } else {
            this.DETEC.reset();
            this.DETEC.enabled = 1;
          }
        }
        let playDis = Math.sqrt(Math.pow(this.x-play.x,2)+Math.pow(this.y-play.y,2))
        if(playDis < play.size*3){
            this.speed = .08;
            if(Math.random()>.999){
              this.comingDir += Math.PI/2;
            }
            let dir = Math.atan2(play.y+Math.sin(play.autoDir*2+this.comingDir)*play.size*3-this.y,
            play.x+Math.cos(play.autoDir*2+this.comingDir)*play.size*2.5-this.x);
            this.dir = dir;
            break;
          }
        let dir = Math.atan2((play.y)-this.y,play.x-this.x)
        this.dir = dir;
        this.comingDir = this.dir;
        break;
      };
      //battleShip xcontrol//
      case 1.2:{
        this.showDir = this.vec.angle();
        this.speed = this.maxspeed;
        ///
        if(!this.DETEC){
          this.DETEC = new Detector(play,this.x,this.y,1400,['Player','Objects'])
          this.DETEC.team = this.team
        } else {
          this.DETEC.x = this.x;
          this.DETEC.y = this.y;
        }
        ///
        if(this.DETEC.select){
          this.DETEC.enabled = 0;
          let other = this.DETEC.select;
          let dis = Math.sqrt(Math.pow(this.x-other.x,2)+Math.pow(this.y-other.y,2));
          if(!other.destroy && other.alpha){
            this.dir = Math.atan2(other.y-this.y,other.x-this.x);
            break;
          } else {
            this.DETEC.reset();
            this.DETEC.enabled = 1;
          }
        }
        break;
      };
      //battleShip control//
      case 1.3:{
        this.showDir = this.vec.angle();
        ///
        if(play.inputs.mouseR){
          let dir = Math.PI+Math.atan2((play.y+play.inputs.mouse_y)-this.y,play.x+play.inputs.mouse_x-this.x)
          this.dir = dir;
        } else {
          let dir = Math.atan2((play.y+play.inputs.mouse_y)-this.y,play.x+play.inputs.mouse_x-this.x)
          this.dir = dir;
        }
        break;
      };
      //Base drone//
      case 1.4:{
        this.showDir = this.dir;
        if(!this.comingDir){
          this.comingDir = 0;
        }
        if(!this.autoDir){this.autoDir = 0;}
        this.autoDir+=.012;
        this.speed = this.maxspeed;
        this.pene = 200;
        ///
        if(!this.DETEC){
          this.DETEC = new Detector(this,this.x,this.y,1200,['Player'])
          this.DETEC.team = this.team
        } else {
          this.DETEC.x = this.x;
          this.DETEC.y = this.y;
        }
        ///
        if(this.DETEC.select){
          this.DETEC.enabled = 0;
          let other = this.DETEC.select;
          let dis = Math.sqrt(Math.pow(this.x-other.x,2)+Math.pow(this.y-other.y,2));
          let basedis = Math.sqrt(Math.pow(other.x-this.ox,2)+Math.pow(other.y-this.oy,2));
          if(basedis<1800 && !other.destroy){
            this.dir = Math.atan2(other.y-this.y,other.x-this.x);
            break;
          } else {
            this.DETEC.reset();
            this.DETEC.enabled = 1;
          }
        }
        let baseDis = Math.sqrt(Math.pow(this.x-this.ox,2)+Math.pow(this.y-this.oy,2))
        if(baseDis < 320){
          this.speed = .07;
          if(Math.random()>.999){
            this.comingDir += Math.PI/2;
          }
          let dir = Math.atan2(this.oy+Math.sin(this.autoDir+this.comingDir)*300-this.y,
          this.ox+Math.cos(this.autoDir+this.comingDir)*300-this.x);
          this.dir = dir;
          break;
        }
        this.dir = Math.atan2(this.oy-this.y,this.ox-this.x);
        break;
      };
      ///////////////trap
      case 2:{
        if(!this.first){
          this.first = 1;
          this.showDir = Math.random()*Math.PI*2;
          this.speed+=Math.random()*.2;
        }
        this.showDir += this.vec.length()/100
        ;
        this.speed*=.82;
        break;
      }
      ///////////////square
      case 3:{
        this.showDir = this.dir;
        if(!this.comingDir){
          this.comingDir = 0;
        }
        this.speed = this.maxspeed;
        ///
        if(!this.DETEC){
          this.DETEC = new Detector(play,this.x,this.y,300,['Player','Objects'])
          this.DETEC.team = this.team
        } else {
          this.DETEC.x = this.x;
          this.DETEC.y = this.y;
        }
        ///
        if(play.inputs.mouseR){
          let dir = Math.PI+Math.atan2((play.y+play.inputs.mouse_y)-this.y,play.x+play.inputs.mouse_x-this.x)
          this.dir = dir;
        } else if(play.inputs.mouseL || play.inputs.e){
          let dir = Math.atan2((play.y+play.inputs.mouse_y)-this.y,play.x+play.inputs.mouse_x-this.x)
          this.dir = dir;
        } else  {
          if(this.DETEC.select){
            this.DETEC.enabled = 0;
            let other = this.DETEC.select;
            let dis = Math.sqrt(Math.pow(this.x-other.x,2)+Math.pow(this.y-other.y,2));
            let playdis = Math.sqrt(Math.pow(other.x-play.x,2)+Math.pow(other.y-play.y,2));
            if(dis<300 && !other.destroy && playdis < play.screen/4 && other.alpha){
              this.dir = Math.atan2(other.y-this.y,other.x-this.x);
              break;
            } else {
              this.DETEC.reset();
              this.DETEC.enabled = 1;
            }
          }
          let playDis = Math.sqrt(Math.pow(this.x-play.x,2)+Math.pow(this.y-play.y,2))
          if(playDis < play.size*3.5){
            this.speed = .08;
            if(Math.random()>.999){
              this.comingDir += Math.PI/2;
            }
            let dir = Math.atan2(play.y+Math.sin(play.autoDir*2+this.comingDir)*play.size*3-this.y,
            play.x+Math.cos(play.autoDir*2+this.comingDir)*play.size*2.5-this.x);
            this.dir = dir;
            break;
          }
          let dir = Math.atan2((play.y)-this.y,play.x-this.x)
          this.dir = dir;
          this.comingDir = this.dir;
        }
        break;
      };
      ///bigCheese
      case 3.1:{
        if(isNaN(this.comingDir)){
          this.comingDir = Math.PI*2*Math.random();
          this.randPos = play.size*(Math.random()*1+2)
        }
        this.showDir = this.vec.angle();
        ///
        if(play.detected.length >= 1){
          let tar, minDis = play.screen;
          for(let n of play.detected){
            let dis = Math.sqrt(Math.pow(n.x-this.x,2)+Math.pow(n.y-this.y,2));
            if(dis<=minDis){
              minDis = dis;
              tar = n;
            }
          }
          if(tar && !tar.destory){
              this.speed = this.maxspeed;
              this.dir = Math.atan2(tar.y-this.y,tar.x-this.x);
              break;
            }
        }
        /// else
        let playDis = Math.sqrt(Math.pow(this.x-play.x,2)+Math.pow(this.y-play.y,2))
        if(playDis < play.size*4){
          this.speed = Math.max(this.speed*.99,.05);
          if(Math.random()>.9995){
            this.comingDir += Math.PI*.8;
            this.speed = this.maxspeed*2;
          }
          let dir = Math.atan2(play.y+Math.sin(this.comingDir)*this.randPos-this.y,
                               play.x+Math.cos(this.comingDir)*this.randPos-this.x);
          this.dir = dir;
          this.comingDir-=0.01
        } else {
          let dir = Math.atan2(play.y-this.y,play.x-this.x)
          this.dir = dir;
          this.speed = this.maxspeed;
        }
        ///
        break;
      };
    }
    this.vec.add(new Vec(this.speed,0).rotate(this.dir))
    this.vec.x*=FRICTION;
    this.vec.y*=FRICTION;
    this.x+=this.vec.x;
    this.y+=this.vec.y;
    ///
    if(this.life == -1){
      if(this.x<-this.map.width/2){
        this.x = -this.map.width/2;
        this.vec.x = 0;
      };
      if(this.y<-this.map.height/2){
        this.y = -this.map.height/2;
        this.vec.y = 0;
      };
      if(this.x> this.map.width/2){
        this.x = this.map.width/2;
        this.vec.x = 0;
      };
      if(this.y> this.map.height/2){
        this.y = this.map.height/2;
        this.vec.y =  0;
      };
      return;
    };
    if(this.life==0){
        this.destroy = c.DES;
    } else {
        this.life -= 1;
    }
  }
}
class Detector {
  constructor(from,x,y,size,type,self = 0,all = 0){
    this.enabled = 1;
    this.self = self;
    this.from = from;
    this.id = from.id;
    this.x = x;
    this.y = y;
    this.select = 0;
    this.selectAll = {
      Objects:[],
      Bullet:[],
      Player:[]
    };
    this.size = size;
    this.type = type;
    this.dis = size;
    this.all = all;
    this.construc = type.length;
  }
  collision(other, option = {}){
    if(this.all){
      if(this.type.includes(other.constructor.name) && other.alpha && !other.shield){
        if(other.constructor.name == 'Bullet'){
          if(this.id.oId != other.origine.oId){
            this.selectAll[other.constructor.name].push(other);
          }
        } else if(other.constructor.name == 'Player'){
          if(this.id.oId != other.id.oId){
            this.selectAll[other.constructor.name].push(other);
          }
        } else {
          this.selectAll[other.constructor.name].push(other);
        }
      }
    }
    ////
    if(!this.self){
      if(other.constructor.name == this.from.constructor.name && other.id.oId == this.from.id.oId){
        return;
      }
    }
    if(this.type.includes(other.constructor.name) && other.alpha && !other.shield){
      if(other.constructor.name == 'Bullet' && this.id.oId == other.origine.oId){
        return;
      }
      let index = this.type.indexOf(other.constructor.name);
      if(index<this.construc){
        this.dis = option.dis
        this.select = other;
        this.construc = index;
      } else if(index==this.construc){
        if(this.dis>option.dis){
          this.dis = option.dis;
          this.select = other;
        }
      }
    }
  }
  reset(){
    this.dis = this.size;
    this.construc = this.type.length
    if(this.all){
      this.selectAll = {
        Objects:[],
        Bullet:[],
        Player:[]
      };
    }
  }
}
///
var Controller = new Main();
