var Canvas = document.getElementById("can");
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, Math.abs(r));
  this.arcTo(x+w, y+h, x,   y+h, Math.abs(r));
  this.arcTo(x,   y+h, x,   y,   Math.abs(r));
  this.arcTo(x,   y,   x+w, y,   Math.abs(r));
  this.closePath();
  return this;
}
const C = {
  "green": "#19e56e",
  "dkgreen": "#15ac54",
  "red":  "#e45548",
  "dkred": "#a1473e",
  "gray": "#8e8ca5",
  "dkgray": "#676480",
  "Grid": "#d8d8d8",
  "dkGrid": "#cccccc",
  "square": "#ccccb2",
  "dksquare": "#a3a38e",
  "trian" :"#c8b5b8",
  "dktrian": "#a58c90",
  "penta": "#b2b2cc",
  "dkpenta": "#8686ab",
  "xpBar": "#7ca0e8",
  "hpBar": "#c17079",
  "lvlBar":"#e0db51",
  "grayscale":"#333333",
  "stateC":[
    "#ee6c81",
    "#ee956c",
    "#ecee6c",
    "#a2ee6c",
    "#6ceea9",
    "#6ce3ee",
    "#6c8cee",
    "#b86cee"
  ],

  "HSL" : {
    "green": {"H":160,"S":70,"L":60},
    "dkgreen": {"H":160,"S":55,"L":45},
    "red": {"H":335,"S":70,"L":60},
    "dkred": {"H":335,"S":55,"L":45},
    "gray": {"H":245,"S":12,"L":60},
    "dkgray": {"H":245,"S":12,"L":45},
    "Grid": {"H":0,"S":0,"L":85},
    "dkGrid": {"H":0,"S":0,"L":75}
  },

  "RBG" : {
    "blue": {"R":62,"G":156,"B":195},
    "dkblue": {"R":25,"G":66,"B":84},
    "red": {"R":195,"G":59,"B":82},
    "dkred": {"R":82,"G":24,"B":43},
    "gray": {"R":188,"G":189,"B":191},
    "dkgray": {"R":126,"G":129,"B":133},
    "Grid": {"R":95,"G":96,"B":109},
    "dkGrid": {"R":42,"G":40,"B":51}
  }
}
var BUFFER = {
  "Main": {"dx": 12003,"dy": 5622, "state": 0},
  //"bullet":[[0,23,5],[0,56,32]]
}
const LineW = 4;
const Smooth = 0.2;
var socket = io.connect("http://localhost:8080");
var ctx = Canvas.getContext("2d");
var ratio = Math.max(Math.max(1280,window.innerWidth),Math.max(1280,window.innerHeight*(1/.5625)));
var screenW = 1920;
var oldScreen = 1920;
var motionScreen = 1920;
var mouse_x = 0;
var mouse_y = 0;
var mouseEnable = 1;
var oldDim, dim = 0;
var cX = 300;
var cY = 300;
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function mouseRect(x,y,w,h){
  return(
    mouse_x>x && mouse_y>y &&
    mouse_x<x+w && mouse_y<y+h
  )
}
function simpleNum(num){
  let snum = num.toString();
  switch(snum.length){
    case 1:
    case 2:
    case 3:return snum;break;
    case 4:return snum.slice(0,1)+" "+snum.slice(1,4);break;
    case 5:return snum.slice(0,2)+"."+snum.slice(2,3)+" k";break;
    case 6:return snum.slice(0,3)+"."+snum.slice(3,4)+" k";break;
    case 7:return snum.slice(0,1)+"."+snum.slice(1,2)+" M";break;
    case 8:return snum.slice(0,2)+"."+snum.slice(2,3)+" M";break;
  }
}
Canvas.oncontextmenu = function (e) {
    e.preventDefault();
};
Canvas.addEventListener("mousemove",function(e){
  mouse_x = e.clientX;
  mouse_y = e.clientY;
  let d = [mouse_x,mouse_y,window.innerWidth,window.innerHeight,ratio];
  window.socket.emit("mousemove",d);
});
window.addEventListener("resize",function(){
  ratio = Math.max(Math.max(1280,window.innerWidth),Math.max(1280,window.innerHeight*(1/.5625)));
  dim = window.innerWidth*window.innerHeight;

});
window.addEventListener("load",function(){
  dim = window.innerWidth*window.innerHeight;
  window.requestAnimationFrame(step);
});
window.addEventListener("keydown", function(e){
  switch(e.key){
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
    case "e":
    case "n":
      socket.emit("keyDown",e.key);
    break;
  }
});
window.addEventListener("keyup", function(e){
  switch(e.key){
    case "ArrowUp":
    case "ArrowDown":
    case "ArrowLeft":
    case "ArrowRight":
      socket.emit("keyUp",e.key);
      break;
  }
});
window.addEventListener("mousedown", function(e){
  preface.mouse = 1;
  if(!mouseEnable){return;}
  switch(e.button){
    case 0://socket.emit("keyDown","mouseL");break;
    case 2://socket.emit("keyDown","mouseR");break;
  }
});
window.addEventListener("mouseup", function(e){
  switch(e.button){
    case 0://socket.emit("keyUp","mouseL");break;
    case 2:MAIN.shoot(0);break;//socket.emit("keyUp","mouseR");break;
  }
});
socket.on("BUFFER", function(data){

  for(let Lay in data){
    if(Lay == "GUI"){continue;}
    for(let EL in INSTANCE[Lay]){
      if(typeof(data[Lay][EL]) === "undefined"){
        let obj = INSTANCE[Lay][EL];
        if(
          obj.x-obj.size>0 && obj.x+obj.size < screenW &&
          obj.y-obj.size>0 && obj.y+obj.size < screenW*0.5625
        ) {if(obj.dead){obj.dead -=0.05;}} else {delete INSTANCE[Lay][EL];}
      }
    }
  }
  for(let Lay in data){
    if(Lay == "GUI"){
      for(let EL in data.GUI){
        switch(EL){
          case "xp": preface.xp = data.GUI.xp;break;
          case "hp": preface.hp = data.GUI.hp;break;
          case "class": preface.class = data.GUI.class;break;
          case "lvl": preface.tankLvl[0] = data.GUI.lvl;break;
        }
      }
      continue;
    }
    for(EL in data[Lay]){
      let obj = data[Lay][EL];
      if(typeof(INSTANCE[Lay][EL]) === "undefined"){
        switch(Lay){
          case "0": INSTANCE[Lay][EL] = new Objects(obj.x,obj.y,EL.replace(/[0-9]/g, '')); break;
          case "1":
            switch(EL){
              case "Main": INSTANCE[Lay][EL] = new User();break;
              default:
                INSTANCE[Lay][EL] = new Player(obj.x,obj.y);
                INSTANCE[Lay][EL].changeClass(obj.class);
              ;break;
            }
          break;
          case "2":

            INSTANCE[Lay][EL] = new Bullet(obj.x,obj.y,EL.replace(/[0-9]/g, ''));
            INSTANCE[Lay][EL].dx += INSTANCE[1].Main.dx-INSTANCE[1].Main.gx;
            INSTANCE[Lay][EL].dy += INSTANCE[1].Main.dy-INSTANCE[1].Main.gy;
          break;
        }
      }
      for(DATA in obj){
        switch(DATA){
          case "shoot": for(let i in obj.shoot){INSTANCE[Lay][EL].canons[i].shoot();};break;
          case "hit": INSTANCE[Lay][EL].hit();break;
          case "class": INSTANCE[Lay][EL].changeClass(obj[DATA]);break;
          case "screen": motionScreen = obj.screen;
          default: INSTANCE[Lay][EL][DATA] = obj[DATA];break;
        }
      }
    }
  }
});
socket.on("upgrade",function(data){
  switch(data){
    case "HpUp":preface.state[0][1]++;break;
    case "HpRegan": preface.state[1][1]++;break;
    case "BodyDam": preface.state[2][1]++;break;
    case "MSpeed": preface.state[3][1]++;break;
    case "Reload": preface.state[4][1]++;break;
    case "BPene":preface.state[5][1]++;break;
    case "BDamage":preface.state[6][1]++;break;
    case "BSpeed":preface.state[7][1]++;break;
  }
  preface.posUp -= 1;
});

const CLASS = {
  "Basic":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 24;
      this.height = 60,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = 0;
    }
  },
  "Doble":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 22;
      this.height = 60,
      this.offx = -15;
      this.offdir = 0;
      this.openWidth = 0;
    }
    this.canons[1] = new function(){
      this.width = 22;
      this.height = 60,
      this.offx = 15;
      this.offdir = 0;
      this.openWidth = 0;
    }
  },
  "Sniper":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 25;
      this.height = 70,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = 0;
    }
  },
  "Rocket":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 23;
      this.height = 55,
      this.offx = 0;
      this.offdir = Math.PI*4/5;
      this.openWidth = 0;
    }
    this.canons[1] = new function(){
      this.width = 23;
      this.height = 55,
      this.offx = 0;
      this.offdir = -Math.PI*4/5;
      this.openWidth = 0;
    }
  },
  "Uzid":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 22;
      this.height = 60,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = 20;
    }
  },
  "Bolly":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 45;
      this.height = 58,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = 0;
    }
  },
  "Submachine":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 38;
      this.height = 55,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = 13;
    };
  },
  "Fire-box":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 14;
      this.height = 58,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = 6;
    };
    this.canons[1] = new function(){
      this.width = 32;
      this.height = 50,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = 18;
    };
  },
  "Vulcan":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 12;
      this.height = 58,
      this.offx = 10;
      this.offdir = 0;
      this.openWidth = 2;
    };
    this.canons[1] = new function(){
      this.width = 12;
      this.height = 58,
      this.offx = -10;
      this.offdir = 0;
      this.openWidth = 2;
    };
    this.canons[2] = new function(){
      this.width = 32;
      this.height = 50,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = 18;
    };
  },
  "Quade":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 24;
      this.height = 60,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = 0;
    };
    this.canons[1] = new function(){
      this.width = 24;
      this.height = 60,
      this.offx = 0;
      this.offdir = Math.PI*1/2;
      this.openWidth = 0;
    };
    this.canons[2] = new function(){
      this.width = 24;
      this.height = 60,
      this.offx = 0;
      this.offdir = Math.PI;
      this.openWidth = 0;
    };
    this.canons[3] = new function(){
      this.width = 24;
      this.height = 60,
      this.offx = 0;
      this.offdir = Math.PI*3/2;
      this.openWidth = 0;
    };
  },
  "Octop":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 26;
      this.height = 62,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = 0;
    };
    this.canons[1] = new function(){
      this.width = 26;
      this.height = 62,
      this.offx = 0;
      this.offdir = Math.PI*1/2;
      this.openWidth = 0;
    };
    this.canons[2] = new function(){
      this.width = 26;
      this.height = 62,
      this.offx = 0;
      this.offdir = Math.PI;
      this.openWidth = 0;
    };
    this.canons[3] = new function(){
      this.width = 26;
      this.height = 62,
      this.offx = 0;
      this.offdir = Math.PI*3/2;
      this.openWidth = 0;
    };
    this.canons[4] = new function(){
      this.width = 26;
      this.height = 62,
      this.offx = 0;
      this.offdir = Math.PI/4;
      this.openWidth = 0;
    };
    this.canons[5] = new function(){
      this.width = 26;
      this.height = 62,
      this.offx = 0;
      this.offdir = Math.PI*1/2+Math.PI/4;
      this.openWidth = 0;
    };
    this.canons[6] = new function(){
      this.width = 26;
      this.height = 62,
      this.offx = 0;
      this.offdir = Math.PI+Math.PI/4;
      this.openWidth = 0;
    };
    this.canons[7] = new function(){
      this.width = 26;
      this.height = 62,
      this.offx = 0;
      this.offdir = Math.PI*3/2+Math.PI/4;
      this.openWidth = 0;
    };
  },
  "Pilote":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 50;
      this.height = 48,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = -10;
    }
    this.canons[1] = new function(){
      this.width = 50;
      this.height = 48,
      this.offx = 0;
      this.offdir = Math.PI;
      this.openWidth = -10;
    }
  },
  "X-wing":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 50;
      this.height = 48,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = -10;
    }
    this.canons[1] = new function(){
      this.width = 50;
      this.height = 48,
      this.offx = 0;
      this.offdir = Math.PI*2/3;
      this.openWidth = -10;
    }
    this.canons[2] = new function(){
      this.width = 50;
      this.height = 48,
      this.offx = 0;
      this.offdir = Math.PI*4/3;
      this.openWidth = -10;
    }
  },
  "Thief":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 27;
      this.height = 75,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = 0;
    }
  },
  "Rogue":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 27;
      this.height = 78,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = 0;
    };
    this.canons[1] = new function(){
      this.width = 60;
      this.height = 42,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = -26;
    };
  },
  "Progressyve":new function(){
    this.canons = [];
    this.canons[0] = new function(){
      this.width = 55;
      this.height = 60,
      this.offx = 0;
      this.offdir = 0;
      this.openWidth = -15;
    };
  },
}
const CLASSTREE = {
  "0":{
    "Basic":["Doble","Sniper","Rocket","Uzid"]
  },
  "1":{
    "Doble":["Quade"],
    "Sniper":["Pilote","Thief"],
    "Rocket":[],
    "Uzid":["Submachine","Fire-box","Bolly"]
  },
  "2":{
    "Submachine":["Vulcan"],
    "Fire-box":[],
    "Quade":["Octop"],
    "Pilote":["X-wing"],
    "Bolly":[],
    "Thief":["Rogue","Progressyve"]
  },
  "3":{
    "Vulcan":[],
    "X-wing":[],
    "Octop":[],
    "Rogue":[],
    "Progressyve":[]
  }
}
function User(){
  this.c = [C.green,C.dkgreen,"green","dkgreen"];
  this.canonsC = [C.gray,C.dkgray, "gray", "dkgray"];
  this.gx = 0;
  this.gy = 0;
  this.dx = 0;
  this.dy = 0;
  this.MX = 0;
  this.MY = 0;
  this.motionX = 0;
  this.motionY = 0;
  this.x = screenW/2;
  this.y = screenW/2*0.5625;
  this.state = 0;
  this.timer = 0;
  this.dir = 0;
  this.size = 35;
  this.class = "Basic";
  this.canons = [new Canon(24,60)];
  function Canon(width = 0, height = 0, offx = 0, offdir = 0, openWidth = 0){
    this.height = height;
    this.offx = offx;
    this.offdir = offdir;
    this.width = width;
    this.openWidth = openWidth;
    this.recoil = 0;
    this.shoot = function(){
      if(this.recoil<=0){
        this.recoil +=0.1;
      }
    }
    this.update = function(){
      if(this.recoil > 0 && this.recoil<8){
        this.recoil+=(9-this.recoil)*0.4;
      } else if(this.recoil>=8){
        this.recoil = -this.recoil;
      } if(this.recoil < -0.1){
        if(this.recoil-(this.recoil-16)*0.05<0){
          this.recoil+= (-this.recoil)*0.2;
        } else {
          this.recoil = 0;
        }
      }
    }
    this.draw = function(size,x,y,dir,color){
      let c = document.createElement('canvas');
      c.height = 300;
      c.width = 300;
      cctx = c.getContext('2d');
      cctx.translate(150,150);
      cctx.rotate(dir+this.offdir);
      cctx.beginPath();
      cctx.moveTo(0,(this.offx-this.width/2)*size/70);
      cctx.lineTo(0,(this.offx+this.width/2)*size/70);
      cctx.lineTo((this.height-Math.abs(this.recoil))*size/70,(this.offx+this.width/2+this.openWidth/2)*size/70);
      cctx.lineTo((this.height-Math.abs(this.recoil))*size/70,(this.offx-this.width/2-this.openWidth/2)*size/70);
      cctx.closePath();
      cctx.lineWidth = LineW;
      cctx.lineJoin = "bevel";
      cctx.fillStyle = color[0];
      cctx.strokeStyle = color[1];
      cctx.fill();
      cctx.stroke();
      cctx.beginPath();
      cctx.arc(0,0,size/2,0,Math.PI*2);
      cctx.closePath();
      cctx.globalCompositeOperation = 'destination-out';
      cctx.fill();

      ctx.save();
      ctx.translate(x,y);
      ctx.drawImage(c,-150,-150);
      ctx.restore();
    }
  }
  this.changeClass = function(clas){
    if(this.class == clas){return;}
    this.class = clas;
    this.canons = [];
    let c = CLASS[clas];
    for(let i in c.canons){
      let can = c.canons[i];
      this.canons.push(new Canon(can.width,can.height,can.offx,can.offdir,can.openWidth));
    }
  }
  this.hit = async function(){
    if(this.state == 0){
      this.state = 2;
      let n = 0;
      while(n<=7){
        await sleep(16);

        if(n == 2){
          this.c[0] = "red";
          this.c[1] = "red";
          this.canonsC[0] = "red";
          this.canonsC[1] = "red";
        } else if(n == 5){
          this.c[0] = "white";
          this.c[1] = "white";
          this.canonsC[0] = "white";
          this.canonsC[1] = "white";
        } else {
          this.c[0] = C[this.c[2]];
          this.c[1] = C[this.c[3]];
          this.canonsC[0] = C[this.canonsC[2]];
          this.canonsC[1] = C[this.canonsC[3]];
        }

        n++;
      }
      this.state = 0;
      this.c[0] = C[this.c[2]];
      this.c[1] = C[this.c[3]];
      this.canonsC[0] = C[this.canonsC[2]];
      this.canonsC[1] = C[this.canonsC[3]];
    }
  }
  this.grid = function(){
    var gridW = 48;
    var h = screenW*.5625;
    ctx.beginPath()
    for(let x = -(this.gx-screenW/2)%gridW ; x<=screenW+(+this.gx%gridW) ; x+=gridW){
      ctx.moveTo(x,0);
      ctx.lineTo(x,h);
    }
    for(let y = -(this.gy-h/2)%gridW; y<=h+(+this.gy%gridW); y+=gridW){
      ctx.moveTo(0,y)
      ctx.lineTo(screenW,y)
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = C.dkGrid;
    ctx.stroke();
  }
  this.update = function(){
    this.gx += (this.dx-this.gx)*Smooth;
    this.gy += (this.dy-this.gy)*Smooth;
    this.motionX += (this.MX-this.motionX)*Smooth;
    this.motionY += (this.MY-this.motionY)*Smooth;
    this.dir = Math.atan2(mouse_y-window.innerHeight/2,mouse_x-window.innerWidth/2);
    if(this.state == 0){
      this.timer = 0;
      this.c[0] = C[this.c[2]];
      this.c[1] = C[this.c[3]];
      this.canonsC[0] = C[this.canonsC[2]];
      this.canonsC[1] = C[this.canonsC[3]];
    }
    if(this.state == 1){
      let l = 100-Math.abs(Math.sin(this.timer/16)*(90-C.HSL[this.c[2]].L));
      this.c[0] = "hsl("+C.HSL[this.c[2]].H+","+C.HSL[this.c[2]].S+"%,"+l+"%)";
      l = 100-Math.abs(Math.sin(this.timer/16)*(90-C.HSL[this.c[3]].L));
      this.c[1] = "hsl("+C.HSL[this.c[3]].H+","+C.HSL[this.c[3]].S+"%,"+l+"%)";
      l = 100-Math.abs(Math.sin(this.timer/16)*(90-C.HSL[this.canonsC[2]].L));
      this.canonsC[0] = "hsl("+C.HSL[this.canonsC[2]].H+","+C.HSL[this.canonsC[2]].S+"%,"+l+"%)";
      l = 100-Math.abs(Math.sin(this.timer/16)*(90-C.HSL[this.canonsC[3]].L));
      this.canonsC[1] = "hsl("+C.HSL[this.canonsC[3]].H+","+C.HSL[this.canonsC[3]].S+"%,"+l+"%)";
      this.timer+=1;
    }
    this.canons.forEach(function(e){
      e.update();
    });
  }
  this.draw = function(){
    if(preface.tankLvl[0] == -1){
      return;
    }
    for(let can in this.canons){
      this.canons[can].draw(this.size*2,screenW/2+this.motionX/Smooth,screenW*0.5625/2+this.motionY/Smooth,this.dir,this.canonsC);
    }
    ctx.beginPath()
    ctx.arc(screenW/2+this.motionX/Smooth,screenW*0.5625/2+this.motionY/Smooth,this.size,0,Math.PI*2)
    ctx.fillStyle = this.c[0];
    ctx.strokeStyle = this.c[1];
    ctx.lineWidth = LineW;
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "red";
    ctx.beginPath()
    //ctx.arc(this.x-(this.gx-this.dx),this.y-(this.gy-this.dy),this.size/2,0,Math.PI*2);
    //ctx.arc(this.x,this.y,this.size/2,0,Math.PI*2);
    ctx.fill();
  }
}
function Player(x,y) {
  this.c = [C.red,C.dkred,"red","dkred"];
  this.canonsC = [C.gray,C.dkgray, "gray", "dkgray"];
  this.x = x;
  this.y = y;
  this.dx = x;
  this.dy = y;
  this.MX = 0;
  this.MY = 0;
  this.motionX = 0;
  this.motionY = 0;
  this.state = 0;
  this.timer = 0;
  this.dir = 0;
  this.dDir = 0;
  this.size = 35;
  this.class = "Basic";
  this.dead = 1;
  this.canons = [new Canon(24,60)];
  function Canon(width = 0, height = 0, offx = 0, offdir = 0, openWidth = 0){
    this.height = height;
    this.offx = offx;
    this.offdir = offdir;
    this.width = width;
    this.openWidth = openWidth;
    this.recoil = 0;
    this.shoot = function(){
      if(this.recoil<=0){
        this.recoil +=0.1;
      }
    }
    this.update = function(){
      if(this.recoil > 0 && this.recoil<8){
        this.recoil+=(9-this.recoil)*0.4;
      } else if(this.recoil>=8){
        this.recoil = -this.recoil;
      } if(this.recoil < -0.1){
        if(this.recoil-(this.recoil-16)*0.05<0){
          this.recoil+= (-this.recoil)*0.2;
        } else {
          this.recoil = 0;
        }
      }
    }
    this.draw = function(size,x,y,dir,color){
      let c = document.createElement('canvas');
      c.height = 300;
      c.width = 300;
      cctx = c.getContext('2d');
      cctx.translate(150,150);
      cctx.rotate(dir+this.offdir);
      cctx.beginPath();
      cctx.moveTo(0,(this.offx-this.width/2)*size/70);
      cctx.lineTo(0,(this.offx+this.width/2)*size/70);
      cctx.lineTo((this.height-Math.abs(this.recoil))*size/70,(this.offx+this.width/2+this.openWidth/2)*size/70);
      cctx.lineTo((this.height-Math.abs(this.recoil))*size/70,(this.offx-this.width/2-this.openWidth/2)*size/70);
      cctx.closePath();
      cctx.lineWidth = LineW;
      cctx.lineJoin = "bevel";
      cctx.fillStyle = color[0];
      cctx.strokeStyle = color[1];
      cctx.fill();
      cctx.stroke();
      cctx.beginPath();
      cctx.arc(0,0,size/2,0,Math.PI*2);
      cctx.closePath();
      cctx.globalCompositeOperation = 'destination-out';
      cctx.fill();

      ctx.save();
      ctx.translate(x,y);
      ctx.drawImage(c,-150,-150);
      ctx.restore();
    }
  }
  this.changeClass = function(clas){
    if(this.class == clas){return;}
    this.class = clas;
    this.canons = [];
    let c = CLASS[clas];
    console.log(clas)
    for(let i in c.canons){
      let can = c.canons[i];
      this.canons.push(new Canon(can.width,can.height,can.offx,can.offdir,can.openWidth));
    }
  }
  this.hit = async function(){
    if(this.state == 0){
      this.state = 2;
      let n = 0;
      while(n<=7){
        await sleep(16);

        if(n == 2){
          this.c[0] = "red";
          this.c[1] = "red";
          this.canonsC[0] = "red";
          this.canonsC[1] = "red";
        } else if(n == 5){
          this.c[0] = "white";
          this.c[1] = "white";
          this.canonsC[0] = "white";
          this.canonsC[1] = "white";
        } else {
          this.c[0] = C[this.c[2]];
          this.c[1] = C[this.c[3]];
          this.canonsC[0] = C[this.canonsC[2]];
          this.canonsC[1] = C[this.canonsC[3]];
        }

        n++;
      }
      this.state = 0;
      this.c[0] = C[this.c[2]];
      this.c[1] = C[this.c[3]];
      this.canonsC[0] = C[this.canonsC[2]];
      this.canonsC[1] = C[this.canonsC[3]];
    }
  }
  this.update = function(){
    if(this.dead<1){this.dead-=0.05;this.size+=0.5;return;}
    this.dx += (this.x-this.dx)*Smooth;
    this.dy += (this.y-this.dy)*Smooth;
    let dDirx = Math.cos(this.dDir);
    let dDiry = Math.sin(this.dDir);;
    let dirx = Math.cos(this.dir);
    let diry = Math.sin(this.dir);
    dDirx += (dirx-dDirx)*0.5;
    dDiry += (diry-dDiry)*0.5;
    this.dDir = Math.atan2(dDiry,dDirx);
    this.motionX += (this.MX-this.motionX)*Smooth;
    this.motionY += (this.MY-this.motionY)*Smooth;
    if(this.state == 0){
      this.timer = 0;
      this.c[0] = C[this.c[2]];
      this.c[1] = C[this.c[3]];
      this.canonsC[0] = C[this.canonsC[2]];
      this.canonsC[1] = C[this.canonsC[3]];
    }
    if(this.state == 1){
      let l = 100-Math.abs(Math.sin(this.timer/16)*(90-C.HSL[this.c[2]].L));
      this.c[0] = "hsl("+C.HSL[this.c[2]].H+","+C.HSL[this.c[2]].S+"%,"+l+"%)";
      l = 100-Math.abs(Math.sin(this.timer/16)*(90-C.HSL[this.c[3]].L));
      this.c[1] = "hsl("+C.HSL[this.c[3]].H+","+C.HSL[this.c[3]].S+"%,"+l+"%)";
      l = 100-Math.abs(Math.sin(this.timer/16)*(90-C.HSL[this.canonsC[2]].L));
      this.canonsC[0] = "hsl("+C.HSL[this.canonsC[2]].H+","+C.HSL[this.canonsC[2]].S+"%,"+l+"%)";
      l = 100-Math.abs(Math.sin(this.timer/16)*(90-C.HSL[this.canonsC[3]].L));
      this.canonsC[1] = "hsl("+C.HSL[this.canonsC[3]].H+","+C.HSL[this.canonsC[3]].S+"%,"+l+"%)";
      this.timer+=1;
    }
    this.canons.forEach(function(e){
      e.update();
    });
  }
  this.draw = function(){
    ctx.globalAlpha = Math.max(0,this.dead);
    for(let can in this.canons){
      this.canons[can].draw(this.size*2,this.dx+this.motionX/Smooth,this.dy+this.motionY/Smooth,this.dir,this.canonsC);
    }
    ctx.beginPath()
    ctx.arc(this.dx+this.motionX/Smooth,this.dy+this.motionY/Smooth,this.size,0,Math.PI*2)
    ctx.fillStyle = this.c[0];
    ctx.strokeStyle = this.c[1];
    ctx.lineWidth = LineW;
    ctx.fill();
    ctx.stroke();
  }
}
function Objects(x,y,type){
  this.c = [];
  this.class = 0;
  this.size = 20;
  switch(type){
    case "square":this.c = [C.square,C.dksquare,"square","dksquare"];this.class = 0;this.size = 20;break;
    case "triangle":this.c = [C.trian,C.dktrian,"trian","dktrian"];this.class = 1;this.size = 18;break;
    case "penta":this.c = [C.penta,C.dkpenta,"penta","dkpenta"];this.class = 2;this.size = 42;break;
  }
  this.x = x;
  this.y = y;
  this.dx = x;
  this.dy = y;
  this.dead = 1;
  this.state = 0;
  this.angle = Math.random()*Math.PI*2;
  this.dir = Math.floor(parseInt(Math.random()*2))*2-1;
  this.hit = async function(){
    if(this.state == 0){
      this.state = 2;
      let n = 0;
      while(n<=7){
        await sleep(16);

        if(n == 2){
          this.c[0] = "red";
          this.c[1] = "red";
        } else if(n == 5){
          this.c[0] = "white";
          this.c[1] = "white";
        } else {
          this.c[0] = C[this.c[2]];
          this.c[1] = C[this.c[3]];
        }

        n++;
      }
      this.state = 0;
      this.c[0] = C[this.c[2]];
      this.c[1] = C[this.c[3]];
    }
  }
  this.update = function(){
    if(this.dead<1){this.dead-=0.05;return;}
    this.dx += (this.x-this.dx)*Smooth;
    this.dy += (this.y-this.dy)*Smooth;
    this.angle+=this.dir/320;
  }
  this.draw = function(){
    ctx.globalAlpha = Math.max(0,this.dead);
    ctx.save()
    ctx.translate(this.dx,this.dy);
    ctx.rotate(this.angle);
    ctx.beginPath();
    switch(this.class){
      case 0: ctx.rect(-22,-22,44,44);break;
      case 1: ctx.moveTo(32,0);ctx.lineTo(Math.cos(Math.PI*2/3)*32,Math.sin(Math.PI*2/3)*32);ctx.lineTo(Math.cos(Math.PI*4/3)*32,Math.sin(Math.PI*4/3)*32);ctx.closePath();break;
      case 2: ctx.moveTo(52,0);
              ctx.lineTo(Math.cos(Math.PI*2/5)*52,Math.sin(Math.PI*2/5)*52);
              ctx.lineTo(Math.cos(Math.PI*4/5)*52,Math.sin(Math.PI*4/5)*52);
              ctx.lineTo(Math.cos(Math.PI*6/5)*52,Math.sin(Math.PI*6/5)*52);
              ctx.lineTo(Math.cos(Math.PI*8/5)*52,Math.sin(Math.PI*8/5)*52);
              ctx.closePath();break;
    }
    ctx.lineWidth = LineW;
    ctx.lineJoin = "bevel";
    ctx.fillStyle = this.c[0];
    ctx.strokeStyle = this.c[1];
    ctx.fill()
    ctx.stroke();
    ctx.restore();
  }
}
function Bullet(x,y,color){
  this.c = [C.gray,C.dkgray,"gray","dkgray"];
  switch(color){
    case "G": this.c = [C.green,C.dkgreen,"green","dkgreen"];break;
    case "R": this.c = [C.red,C.dkred,"red","dkred"];break;
  }
  this.x = x;
  this.y = y;
  this.size = 15;
  this.dx = x;
  this.state = 0;
  this.dy = y;
  this.MX = 0;
  this.MY = 0;
  this.motionX = 0;
  this.motionY = 0;
  this.type = 0;
  this.dir = 0;
  this.dDir = 0;
  this.dead = 1;
  this.hit = async function(){
    if(this.state == 0){
      this.state = 2;
      let n = 0;
      while(n<=7){
        await sleep(16);

        if(n == 2){
          this.c[0] = "red";
          this.c[1] = "red";
        } else if(n == 5){
          this.c[0] = "white";
          this.c[1] = "white";
        } else {
          this.c[0] = C[this.c[2]];
          this.c[1] = C[this.c[3]];
        }

        n++;
      }
      this.state = 0;
      this.c[0] = C[this.c[2]];
      this.c[1] = C[this.c[3]];
    }
  }
  this.draw = function(){
    if(this.dead<1){this.dead-=0.1;} else {
      this.dx += (this.x-this.dx)*Smooth;
      this.dy += (this.y-this.dy)*Smooth;
      this.motionX += (this.MX-this.motionX)*Smooth;
      this.motionY += (this.MY-this.motionY)*Smooth;
    }
    ctx.globalAlpha = Math.max(0,this.dead);
    ctx.beginPath();
    switch(parseInt(this.type)){
      case 0:ctx.arc(this.dx+this.motionX*2,this.dy+this.motionY*2,this.size,0,Math.PI*2);break;
      case 1:
        let dDirx = Math.cos(this.dDir);
        let dDiry = Math.sin(this.dDir);;
        let dirx = Math.cos(this.dir);
        let diry = Math.sin(this.dir);
        dDirx += (dirx-dDirx)*0.4;
        dDiry += (diry-dDiry)*0.4;
        this.dDir = Math.atan2(dDiry,dDirx);
        ctx.translate(this.dx+this.motionX*2,this.dy+this.motionY*2)
        ctx.rotate(this.dDir);
        let r = 1.4;
        ctx.moveTo(this.size*r,0);
        ctx.lineTo(Math.cos(Math.PI*2/3)*this.size*r,Math.sin(Math.PI*2/3)*this.size*r);
        ctx.lineTo(Math.cos(Math.PI*4/3)*this.size*r,Math.sin(Math.PI*4/3)*this.size*r);
        ctx.closePath();
        ctx.lineJoin = "round";
        //console.log(this.size,this.dir);
      break;
    }
    ctx.lineWidth = LineW;
    ctx.fillStyle = this.c[0];
    ctx.strokeStyle = this.c[1];
    ctx.fill()
    ctx.stroke();
  }
}
function GUI(){
  this.mouse = 1;
  this.name = "lolololololololo";
  this.class = "Basic";
  this.map = {"width":150,"height":150};
  this.leaderboard = {};
  this.xp = 1;
  this.hp= 100;
  this.lvl = [0,20,50,100,150,200,250,300,350,400,500,
              600,750,900,1100,1300,1500,1750,2000,2250,2500,
              2900,3300,3800,4300,4800,5600,6200,6900,7800,9000,
              10000,11200,12400,13600,14800,16000,17500,19000,21000,23000,
              25000,27500,30000,32500,35000,37500,40000,43000,46000,50000];
  this.currentLvl = 1;
  this.posUp = 0;
  this.lvldirection = 0;
  this.stateBar = [0,0,0];
  this.state = [
    ["Health",0,"HpUp"],
    ["Health Regan",0,"HpRegan"],
    ["Body damage",0,"BodyDam"],
    ["Mouvement Speed",0,"MSpeed"],
    ["Reload",0,"Reload"],
    ["Bullet Penetration",0,"BPene"],
    ["Bullet Damage",0,"BDamage"],
    ["Bullet Speed",0,"BSpeed"]
  ]
  this.upS = {
    "time":0,
    "step":0,
    "mouv":0,
  };
  this.tankLvl = {
    "0":0,
    "timer":0,
    "offx":0,
    "class":this.class,
    "lvl":0,
    "size":[]
  };
  this.tlvl = [14,29,49];
  function drawCan(x,y,width,height,offdir,offx,openWidth,dir,size){
    ctx.save();
    ctx.translate(x,y);
    ctx.globalAlpha = 1;
    ctx.rotate(-dir+offdir);
    ctx.beginPath();
    ctx.moveTo(0,(offx-width/2)*size/70);
    ctx.lineTo(0,(offx+width/2)*size/70);
    ctx.lineTo(height*size/70,(offx+width/2+openWidth/2)*size/70);
    ctx.lineTo(height*size/70,(offx-width/2-openWidth/2)*size/70);
    ctx.closePath();
    ctx.lineJoin = "bevel";
    ctx.fillStyle = C.gray;
    ctx.strokeStyle = C.dkgray;
    ctx.fill()
    ctx.stroke();
    ctx.restore();
  }
  this.update = function(){
    this.stateBar[1] += (this.hp-this.stateBar[1])*0.05;
    if(this.stateBar[0]>99 && this.xp>=this.lvl[this.currentLvl]){
      this.lvldirection =-1;
      for(let i in this.lvl){
        if(this.xp<this.lvl[i]){
          this.posUp+=i-this.currentLvl;
          this.currentLvl = i;
          break;
        }
      }
    } else if(this.lvldirection == -1){
      if(this.stateBar[0]<1){
        this.lvldirection = ((this.xp-this.lvl[this.currentLvl-1])/(this.lvl[this.currentLvl]-this.lvl[this.currentLvl-1])*100);
      }
    } else {
      this.lvldirection = ((this.xp-this.lvl[this.currentLvl-1])/(this.lvl[this.currentLvl]-this.lvl[this.currentLvl-1])*100);
    }
    if(this.xp>=this.lvl[this.lvl.length-1]){this.lvldirection=99;}
    this.stateBar[0] += (this.lvldirection-this.stateBar[0])*0.05;
  }
  this.drawTankUp = function(){
    if(this.lvl[this.tlvl[this.tankLvl[0]]]<this.xp){
      this.tankLvl.class = this.class;
      this.tankLvl.lvl = this.tankLvl[0];
      this.tankLvl.offx+=(1-this.tankLvl.offx)*0.05;
    } else if(this.tankLvl.timer == 0){
      this.tankLvl.class = this.class;
      this.tankLvl.lvl = this.tankLvl[0];
      return;
    } else {
      this.tankLvl.offx+=(0-this.tankLvl.offx)*0.05;
    }
    this.tankLvl.timer+=1;
    let tanknb = CLASSTREE[this.tankLvl.lvl][this.tankLvl.class].length;
    let h = 95;
    let w = 90;
    for(let i = 0; i<tanknb; i++){
      if(typeof this.tankLvl.size[i] === "undefined"){
        this.tankLvl.size[i] = 0;
      }
      let size = this.tankLvl.size[i];
      let y = (-tanknb+(tanknb/2)+i)*h+window.innerHeight/2+h/2;
      let x = 90*(-1+(this.tankLvl.offx*2));
      if(mouseRect(x-size*1.1,-tanknb*h/2+window.innerHeight/2,size*2.2,tanknb*h)){
        if(mouseRect(x-size*1.1,y-size*1.1,size*2.2,size*2.2)){
          this.tankLvl.size[i] += (38-this.tankLvl.size[i])*0.2;
        } else {
          this.tankLvl.size[i] += (32-this.tankLvl.size[i])*0.2;
        }
      } else {
        this.tankLvl.size[i] += (35-this.tankLvl.size[i])*0.2;
      }
      let classs =  CLASS[CLASSTREE[this.tankLvl.lvl][this.tankLvl.class][i]];
      ctx.lineWidth = 2;
      for(let can in classs.canons){
          let c = classs.canons[can];
          drawCan(x,y,c.width,c.height,c.offdir,c.offx,c.openWidth,Math.PI/4+this.tankLvl.timer/180,size)
        }
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(x,y,size/2,0,Math.PI*2)
      ctx.arc(this.dx+this.motionX/Smooth,this.dy+this.motionY/Smooth,this.size,0,Math.PI*2)
      ctx.fillStyle = C.green;
      ctx.strokeStyle = C.dkgreen;
      ctx.fill();
      ctx.stroke();
      ctx.font = "bold 12px Ubuntu";
      ctx.lineWidth =3;
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.strokeStyle = "#3c3c42";
      ctx.strokeText(CLASSTREE[this.tankLvl.lvl][this.tankLvl.class][i], x,y+h/3); ctx.fillText(CLASSTREE[this.tankLvl.lvl][this.tankLvl.class][i], x, y+h/3);
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.roundRect(x-size*1.1,y-size*1.1,size*2.2,size*2.2,4)
      ctx.stroke();
      if(mouseRect(x-size*1.1,y-size*1.1,size*2.2,size*2.2)){
        mouseEnable = 0;
        if(this.mouse){
          socket.emit("class",CLASSTREE[this.tankLvl[0]][this.class][i]);
        }
      }
    }
  }
  this.drawUpgrade = function(){
    this.upS.time+=1;
    this.upS.step +=(this.upS.mouv-this.upS.step)*0.1;
    let y = window.innerHeight/2-55;
    let marge = 10;
    let x = window.innerWidth/2;
    let barsize = 360;
    let lilbar = barsize/8-marge;
    if(this.upS.step<1 && this.posUp>0){
      ctx.globalAlpha = 1-this.upS.step;
      let arr = new Path2D();{
        arr.moveTo(x-10,y+Math.sin(this.upS.time/30+.6)*3);
        arr.lineTo(x,y-10+Math.sin(this.upS.time/30+.6)*3);
        arr.lineTo(x+10,y+Math.sin(this.upS.time/30+.6)*3);
        arr.moveTo(x-10,y-15+Math.sin(this.upS.time/30)*3);
        arr.lineTo(x,y-25+Math.sin(this.upS.time/30)*3);
        arr.lineTo(x+10,y-15+Math.sin(this.upS.time/30)*3);
      }
      ctx.lineCap = "round";
      ctx.strokeStyle = C[INSTANCE[1].Main.c[2]];
      ctx.lineWidth = 8;
      ctx.stroke(arr);
      ctx.strokeStyle = "white";
      ctx.lineWidth = 3;
      ctx.stroke(arr);
      ctx.globalAlpha = 1;
      if(mouseRect(x-10,y-25,20,30)){
        mouseEnable = 0;
        if(this.mouse){
          this.upS.mouv = 1;
        }
      }
    }
    if(this.upS.step>0.01){
      if(!mouseRect(x-barsize/2,y-150,barsize,150)){
        if(this.mouse){
          this.upS.mouv = 0;
        }
      }
      {
        ctx.globalAlpha = 0.2;
        ctx.beginPath()
        ctx.moveTo(x-(barsize/2*this.upS.step),y);
        ctx.lineTo(x+(barsize/2*this.upS.step),y);
        ctx.strokeStyle = "#3c3c42";
        ctx.lineWidth = 4;
        ctx.stroke();
      }//Underbar
      {
        x-=barsize/2;
        let barH = 30;
        ctx.font = "bold 12px Ubuntu";
        ctx.textAlign = "center";
        for(let St in this.state){
          ctx.fillStyle = C.grayscale;
          ctx.globalAlpha = 0.3;
          //ctx.fillRect(x+(marge+lilbar)*St+marge/2,y-17*this.upS.step,lilbar,10*this.upS.step)
          ctx.lineWidth =3;
          ctx.fillStyle = "white";
          ctx.strokeStyle = "black";
          ctx.globalAlpha = this.upS.step;
          ctx.strokeText(this.state[St][1], x+(marge+lilbar)*St+marge/2+lilbar/2, y-8);ctx.fillText(this.state[St][1], x+(marge+lilbar)*St+marge/2+lilbar/2, y-8);
          ctx.lineWidth =3*this.upS.step;
          if(mouseRect(x+(barsize/8)*St,y-150,lilbar+marge,150)){
            mouseEnable = 0;
            ctx.strokeText(this.state[St][0], window.innerWidth/2, y+15);ctx.fillText(this.state[St][0], window.innerWidth/2, y+15);
            if(this.mouse){
              socket.emit("upgrade",this.state[St][2])
            }
          }
          for(let i = 0; i<this.state[St][1]; i++){
            ctx.fillStyle = C.stateC[St];
            ctx.strokeStyle = "#3c3c42";
            ctx.beginPath();
            ctx.roundRect(x+(marge+lilbar)*St+marge/2,y-27-marge/2-((10+marge/3)*i)*this.upS.step,lilbar,8*this.upS.step,4);
            ctx.globalAlpha = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.fill();
          }
        }
      }//lilbar
    }
  }
  this.drawMap = function(){
    let s_w = window.innerWidth;
    let s_h = window.innerHeight;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.rect(s_w-this.map.width-20,s_h-this.map.height-20,this.map.width,this.map.height);
    ctx.fillStyle = "gainsboro";
    ctx.strokeStyle = "darkgray";
    ctx.lineJoin = "round";
    ctx.lineWidth = 6;
    ctx.fill();
    ctx.stroke();
    let x = s_w-(6800-INSTANCE[1].Main.gx)*this.map.width/6800-20;
    let y = s_h-(6800-INSTANCE[1].Main.gy)*this.map.height/6800-20;
    let dir = INSTANCE[1].Main.dir;
    ctx.beginPath()
    ctx.moveTo(x+Math.cos(dir)*8,y+Math.sin(dir)*8)
    ctx.lineTo(x+Math.cos(dir+Math.PI*.8)*8,y+Math.sin(dir+Math.PI*.8)*8);
    ctx.lineTo(x+Math.cos(dir+Math.PI*1.2)*8,y+Math.sin(dir+Math.PI*1.2)*8);
    ctx.closePath();
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = INSTANCE[1].Main.c[0];
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  this.drawState = function(){
    let x = window.innerWidth/2;
    let h = window.innerHeight;
    let marge = 12;
    let size = [140,200,140];
    let bg = "#3c3c42";
    ctx.lineWidth = 4;
    ctx.fillStyle = bg;
    ctx.strokeStyle = bg;
    ctx.roundRect(x-size[0]-size[1]/2-marge,h-32,size[0],10,5);ctx.fill();ctx.stroke();
    ctx.roundRect(x-size[1]/2,h-36,size[1],16,8);ctx.fill();ctx.stroke();
    ctx.roundRect(x+size[1]/2+marge,h-32,size[2],10,5);ctx.fill();ctx.stroke();
    //XP
    ctx.roundRect(x+size[1]/2+marge,h-32,12+((size[2]-10)*this.stateBar[2]/100),10,5);
    ctx.fillStyle = C.xpBar;
    ctx.fill();
    //HP
    ctx.roundRect(x-size[1]/2,h-36,16+((size[1]-16)*this.stateBar[1]/100),16,8);
    ctx.fillStyle = C[INSTANCE[1].Main.c[2]];
    ctx.fill();
    //LVL
    ctx.roundRect(x-size[0]-size[1]/2-marge,h-32,12+((size[0]-10)*this.stateBar[0]/100),10,5);
    ctx.fillStyle = C.lvlBar;
    ctx.fill();
    ctx.font = "bold 10px Ubuntu";
    ctx.fillStyle = "white";
    ctx.miterLimit=2;
    ctx.lineWidth = 3;
    //XP
    ctx.textAlign = "right";
    ctx.strokeText(simpleNum(this.xp), x+marge+size[1]/2+size[2]-5, h-24); ctx.fillText(simpleNum(this.xp), x+marge+size[1]/2+size[2]-5, h-24);
    //HP
    ctx.font = "bold 30px Ubuntu";
    ctx.lineWidth =6;
    ctx.textAlign = "center";
    ctx.strokeText(this.name, x, h-48);ctx.fillText(this.name, x, h-48);
    ctx.font = "bold 12px Ubuntu";
    ctx.lineWidth =4;
    ctx.textAlign = "center";
    ctx.strokeText(this.class, x, h-24);ctx.fillText(this.class, x, h-24);
    //LVL
    ctx.font = "bold 10px Ubuntu";
    ctx.lineWidth =3;
    ctx.textAlign = "middle";
    ctx.strokeText(this.currentLvl, x-size[0]/2-size[1]/2-marge, h-24);ctx.fillText(this.currentLvl, x-size[0]/2-size[1]/2-marge, h-24);
  }
  this.draw = function(){
    if(this.tankLvl[0] == -1){
      return;
    }
    this.drawMap();
    this.drawState();
    this.drawUpgrade();
    this.drawTankUp();
    this.mouse = 0;
  }
}

var INSTANCE = [{},{},{}];
INSTANCE[1].Main = new User()
var preface = new GUI();

function step(){
mouseEnable = 1;
  //---resize screen---//
  screenW += (motionScreen-screenW);
  if(oldDim != dim || oldScreen != screenW){
    ctx.resetTransform()
    ctx.translate(Math.min(Math.min(-(-window.innerWidth+1280,window.innerWidth-(window.innerHeight*(1/.5625)))/2,0),Math.min(Math.min(-(-window.innerHeight*(1/.5625)+1280)*.5625,window.innerHeight-(window.innerWidth*0.5625))/2,0))
    ctx.scale(ratio/screenW,ratio/screenW);
    oldDim = dim;
    oldScreen = screenW;
  }
  //screenW = motionScreen;
  //-----------------//
  for(let Lay in INSTANCE){
    if(Lay==2){continue;}
    for(let EL in INSTANCE[Lay]){
      INSTANCE[Lay][EL].update();
    }
  }
  //----------------//
  preface.update();
  draw()
}
function draw(){
  ctx.save();
  ctx.resetTransform();
  ctx.clearRect(0,0,3000,3000);
  ctx.restore();
  ctx.save();
  ctx.fillStyle = C.Grid;
  ctx.fillRect(0,0,screenW,screenW*0.5625)
  INSTANCE[1].Main.grid()
  //--------------//
  for(let Lay in INSTANCE){
    for(let EL in INSTANCE[Lay]){
      if(INSTANCE[Lay][EL].dead <= 0){delete INSTANCE[Lay][EL];continue;}
      ctx.save();
      INSTANCE[Lay][EL].draw();
      ctx.restore();
    }
  }
  //--------------//
  ctx.restore();
  ctx.save();
  ctx.resetTransform();
  preface.draw();
  ctx.restore();
  if(mouseEnable){
    Canvas.style.cursor = "default";
  } else {
    Canvas.style.cursor = "pointer";
  }
  window.requestAnimationFrame(step)
}
