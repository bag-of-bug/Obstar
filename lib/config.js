var CONFIG = {
  'BOTS':[
    function(){
      if(isNaN(this.path)){
        this.path = CONFIG.BOT_PATHS[parseInt(Math.random()*CONFIG.BOT_PATHS.length)]
      }
      if(this.stillLvl){
        this.upgrade(CONFIG.BOTS_UPS[this.path.up ? this.path.up : 0][this.stillLvl]);
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
  'BOT_PATH':[
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
exports.config = {
  'MYSQL': false,
  'DB': {
    'ACC': false,
    'SHOP': false,
    'DEV': false,
    'LB': false
  },
  'KEY_ISNEEDED':  false, //dont apply if Mysql or DB.ACC is on flase
  'S_BEFORE_KICK': 120,   // the nb of seconds before kicking someone afk on the death screen
  'MAX_IP':        2,     // max tabs someone can play on
  'DES':           10,
  'DEAD_DELAY':    150,   // the nb off ms before the person can replay
  'KEEP_PLACE':    20,
  'SIZE_GET_POS':  40,
  'CONFIG':CONFIG
}
