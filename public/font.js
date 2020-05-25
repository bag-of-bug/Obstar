var canvas = document.getElementById('font');
var ctx = canvas.getContext('2d');
window.onresize = resize;
function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const C = {
  "green": "#36e28f",
  "dkgreen": "#33ac72",
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
  "dkpenta": "#8686ab"
};
var State = 'ffa';
var LW = 4;
var toState = 'entry';
var open = 1;
var toOpen = 1;
var T = 0;
var animated = 1;

function loop(){
  ///
  toOpen += (open-toOpen)*0.06;
  if(animated){
    T+=1;
  }
  ///
  if(State != toState){
    if(toOpen < 1.01){
      open = 1.03;
    } else {
      toState = State;
    }
  } else {
    open = 0;
  }

  draw()
  requestAnimationFrame(loop);
}
function draw(){
  ctx.filter = 'none';
  ctx.globalCompositeOperation = 'source-over';
  ctx.globalAlpha = 1;
  ctx.translate(-Width/2,-Height/2);
  var Width = window.innerWidth;
  var Height = window.innerHeight;
  ctx.clearRect(0,0,Width,Height);
  ctx.fillStyle = C.Grid;
  ctx.fillRect(0,0,Width,Height);
  var tilesize = 24;
  switch(State){
    case 'entry':{

    }break;
  }
  /// GRID ///
  {
    ctx.lineWidth = 1;
    for(let i = (Width/2)%tilesize; i<= Width; i+= tilesize){
      ctx.beginPath();
      ctx.moveTo(i,0);
      ctx.lineTo(i,Height);
      ctx.strokeStyle = C.dkGrid;
      ctx.LineWidth = 1;
      ctx.stroke();
    }
    for(let j = (Height/2)%tilesize; j<= Height; j+= tilesize){
      ctx.beginPath();
      ctx.moveTo(0,j);
      ctx.lineTo(Width,j);
      ctx.strokeStyle = C.dkGrid;
      ctx.LineWidth = 1;
      ctx.stroke();
    }
  }
  /// OBJ ///
  ctx.translate(Width/2,Height/2)
  {
    ///left
    tank(-400+Math.sin(T/220)*30,-200+Math.sin(T/350)*30,Math.sin(T/140)*15+30,38,'Rogue',[C.red,C.dkred]);
    tank(-500+Math.cos((T+20)/180)*30,100+Math.sin(T/350)*20,Math.sin((T+1)/170)*25-40,30,'Doble',[C.red,C.dkred]);
    tank(-250+Math.sin((T+21)/150)*40,300+Math.sin((T+3)/220)*10,Math.sin((T+1)/170)*30-180,25,'Basic',[C.red,C.dkred]);

    obj(-220+Math.cos(T/510)*10,-370+Math.sin(T/500)*20,(-T+4)/9,'triangle');
    obj(-500+Math.sin(T/400)*20,-220-Math.sin(0.1+T/490)*10,20-T/9,'square');
    obj(-400-Math.cos(T/500)*20,-100+Math.cos(T/500)*20,T/9,'square');
    obj(-460+Math.sin(-7+T/500)*20,-90-Math.sin(T/490)*10,(-T-50)/9,'square');
    obj(-560+Math.sin(1.6+T/400)*20,-110-Math.sin(0.1+T/490)*10,(13+T-2)/9,'square');
    obj(-680+Math.sin(0.5+T/400)*20,-0+Math.sin(0.1+T/490)*10,(19+T-2)/9,'pentagon');
    obj(-490-Math.cos(T/500)*20,-10-Math.sin(T/550)*15,(-T+1)/9,'triangle');
    obj(-280+Math.sin(T/500)*15,-250-Math.sin(T/600)*8,(T+0.3)/9,'square');
    obj(-240-Math.cos(T/600)*20,50-Math.cos(T/500)*10,(-T+1.5)/10,'pentagon');
    obj(-380+Math.sin(T/450)*10,250-Math.sin(T/510)*8,(T+0.5)/9,'square');
    obj(-520-Math.cos(T/350)*8,320-Math.sin(T/500)*15,(-T-1)/9,'square');
    obj(-450+Math.sin(T/400)*10,380+Math.sin(T/560)*20,(-T+40)/9,'square');
    obj(-430+Math.sin(0.8-T/450)*15,300-Math.sin(2-T/400)*8,(T+2.5)/9,'triangle');
    obj(-170-Math.sin(T/450)*30,345-Math.cos(-T/520)*10,(-T+3.5)/9,'square');
    obj(-40+Math.sin(T/450)*30,370-Math.sin(T/510)*10,(-T-2)/9,'triangle');
    obj(-650+Math.sin(T/450)*30,380+Math.sin(T/510)*10,(T-200)/9,'triangle');

    bull(-250-Math.sin(0.2+T/80)*25,-100-Math.sin(0.2+T/80)*14,40,[C.red,C.dkred]);
    bull(-360+Math.sin(T/100)*10,15-Math.sin(T/100)*10,32,[C.red,C.dkred]);
    bull(-350+Math.sin(0.2+T/100)*10,-50-Math.sin(0.2+T/100)*8,32,[C.red,C.dkred]);
    bull(-410+Math.sin(0.5+T/100)*10,45-Math.sin(.5+T/100)*12,32,[C.red,C.dkred]);
    bull(-630+Math.sin(0.2+T/90)*17,100-Math.sin(0.2+T/90)*20,35,[C.red,C.dkred]);
    bull(-680+Math.sin(-0.2+T/90)*20,200-Math.sin(-0.2+T/90)*17,35,[C.red,C.dkred]);
    bull(-600+Math.sin(-0.8+T/90)*25,270-Math.sin(-0.8+T/90)*8,35,[C.red,C.dkred]);
    bull(-715+Math.sin(-1.4+T/90)*25,330-Math.sin(-1.4+T/90)*8,35,[C.red,C.dkred]);
    bull(-360+Math.sin(0.5+T/100)*22,300+Math.sin(.5+T/100)*5,28,[C.red,C.dkred]);
    bull(-400+Math.sin(0.2+T/100)*22,320-Math.sin(.2+T/100)*4,28,[C.red,C.dkred]);
    bull(-300+Math.sin(1+T/100)*12,250+Math.sin(.8+T/100)*15,28,[C.red,C.dkred]);
    ///right
    tank(450+Math.sin(T/200)*17,-250-Math.cos(0.1+T/220)*20,-T/9,32,'Octop',[C.red,C.dkred]);
    tank(290+Math.cos(0.1-T/200)*10,-50-Math.cos(0.1+T/220)*10,Math.sin(T/200)*10+20,32,'Pilote',[C.red,C.dkred]);
    tank(350+Math.sin(T/130)*20,320-Math.sin(T/130)*15,-Math.cos(T/130)*10-40,32,'Bolly',[C.red,C.dkred]);

    obj(40-Math.sin(2-T/400)*20,-385-Math.cos(0.1+T/390)*10,200-T/9,'square');
    obj(610+Math.sin(T/400)*20,-220-Math.cos(0.1-T/490)*10,20+T/9,'square');
    obj(640+Math.cos(T/500)*10,-150-Math.sin(0.5+T/500)*12,60-T/9,'square');
    obj(740-Math.sin(1.3+T/500)*10,-130-Math.sin(0.5+T/520)*20,T/9,'square');
    obj(180+Math.sin(0.5-T/500)*10,-280+Math.sin(0.5+T/500)*12,60-T/9,'pentagon');
    obj(660-Math.cos(0.2+T/470)*12,-60-Math.cos(2-T/190)*15,20+T/9,'triangle');
    obj(460-Math.cos(4+T/490)*20,0-Math.sin(0.5+T/520)*6,100-T/9,'square');
    obj(430+Math.sin(1.5-T/510)*15,60+Math.sin(5+T/510)*15,-30-T/9,'square');
    obj(360+Math.cos(1-T/510)*18,90-Math.cos(5+T/490)*20,T/9,'triangle');
    obj(210+Math.sin(-T/500)*15,120+Math.sin(5+T/480)*15,90-T/9,'square');
    obj(350+Math.sin(-T/500)*15,220+Math.sin(5+T/480)*15,90-T/9,'square');
    obj(570-Math.sin(T/480)*21,150-Math.cos(5+T/480)*15,20-T/9,'pentagon');

    bull(430-Math.sin(.5+T/100)*10,-350-Math.sin(.5+T/100)*20,39,[C.red,C.dkred]);
    bull(300-Math.sin(1.5+T/100)*25,-300-Math.sin(1.5+T/100)*10,39,[C.red,C.dkred]);
    bull(320-Math.sin(T/100)*25,-200+Math.sin(T/100)*10,39,[C.red,C.dkred]);
    bull(620-Math.sin(2-T/100)*25,-320+Math.sin(2-T/100)*10,39,[C.red,C.dkred]);
    bull(570-Math.sin(3-T/100)*20,-160-Math.sin(3-T/100)*15,39,[C.red,C.dkred]);
    bull(500-Math.sin(4-T/100)*10,-110-Math.sin(4-T/100)*22,39,[C.red,C.dkred]);
    drone(380-Math.sin(T/100)*20,-10-Math.sin(T/100)*15,Math.cos(T/100)*20-110,20,[C.red,C.dkred]);
    drone(300-Math.sin(T/100)*12,-150+Math.sin(T/100)*20,-Math.sin(T/100)*15-170,20,[C.red,C.dkred]);
    bull(550-Math.sin(5-T/100)*8,-20-Math.sin(4-T/100)*24,39,[C.red,C.dkred]);
    bull(470-Math.sin(T/130)*24,220+Math.sin(T/130)*17,64,[C.red,C.dkred]);
  }
  /// DOORS ///
  ctx.translate(-Width/2,-Height/2);
  //ctx.filter = 'drop-shadow(0 0 16px rgba(0,0,0,0.3))'
  switch (toState){
    case '2team':
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(225+toOpen*(Width/2-225)+Math.sin(T/78)*15,0);
      ctx.lineTo(0+toOpen*(Width/2)+Math.sin(T/78)*15,Height*1.25+375);
      ctx.lineTo(0,Height)
      ///
      ctx.moveTo(Width,Height);
      ctx.lineTo(Width-225-toOpen*(Width/2-225)+(1-toOpen)*(Math.sin(1+T/75)*15),Height);
      ctx.lineTo(Width-toOpen*(Width/2)+(1-toOpen)*(Math.sin(1+T/75)*15),(Height-Height*1.25)-375);
      ctx.lineTo(Width,0);
      ///
      ctx.closePath();
      ctx.fillStyle = 'white';
      ctx.fill();
      //////////////////////////////////////////
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(180+toOpen*(Width/2-180)+(Math.sin(.5+T/83)*10)*(1-toOpen),0);
      ctx.lineTo(0+toOpen*(Width/2)+(Math.sin(.5+T/83)*10)*(1-toOpen),Height+300);
      ctx.lineTo(0,Height)
      ///
      ctx.moveTo(Width,Height);
      ctx.lineTo(Width-180-toOpen*(Width/2-180)+(1-toOpen)*(Math.sin(1.5+T/80)*10),Height);
      ctx.lineTo(Width-toOpen*(Width/2)+(1-toOpen)*(Math.sin(1.5+T/80)*10),-300);
      ctx.lineTo(Width,0);
      ///
      ctx.closePath();
      ctx.fillStyle = 'white';
      ctx.fill();
      ///GRADIENT///
      {
        ctx.globalCompositeOperation = 'hard-light';
        let grd = ctx.createLinearGradient(0, -Height/2, Width, 0);
        grd.addColorStop(0.10, '#f45520');
        grd.addColorStop(.400, '#d97f24');
        grd.addColorStop(.700, '#bca61a');
        //grd.addColorStop(.800, '#8ec749');
        grd.addColorStop(1.00, '#36e27f');

        ctx.fillStyle = grd;
        ctx.globalAlpha = Math.max(0,(1-toOpen)/4.8);
        ctx.fillRect(0, 0, Width,Height);
      }
    break;
    case '4team':
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(300+toOpen*(Width-300)+Math.sin(T/80)*15,0);
      ctx.lineTo(0,600+toOpen*(Height-600)+Math.sin(T/80)*30);
      ///
      ctx.moveTo(Width,Height);
      ctx.lineTo((1-toOpen)*(Width-300)-Math.sin(1+T/80)*15,Height);
      ctx.lineTo(Width,(1-toOpen)*(Height-600)-Math.sin(1+T/80)*30);
      ///
      //ctx.closePath();
      ctx.fillStyle = 'white';
      ctx.fill();
      //////////////////////////////////////////
      ctx.beginPath();
      ctx.moveTo(Width,0);
      ctx.lineTo((1-toOpen)*((Width-300)-(Math.sin(.5+T/80)*15)),0);
      ctx.lineTo(Width,600+toOpen*(Height-600)+(Math.sin(.5+T/80)*30)*(1-toOpen));
      ///
      ctx.moveTo(0,Height);
      ctx.lineTo(300+toOpen*(Width-300)+Math.sin(1.5+T/80)*15*(1-toOpen),Height);
      ctx.lineTo(0,(1-toOpen)*((Height-600)-(Math.sin(1.5+T/80)*30)));
      ///
      ctx.fillStyle = 'white';
      ctx.fill();
      {
        ctx.globalCompositeOperation = 'hard-light';
        let grd = ctx.createLinearGradient(0, Height, 0, -Height);
        grd.addColorStop(0.00, '#833ab4');
        //grd.addColorStop(.200, '#7303c0');
        grd.addColorStop(.500, '#fd1d1d');
        grd.addColorStop(1, '#fcb045');

        ctx.fillStyle = grd;
        ctx.globalAlpha = Math.max(0,(1-toOpen)/6.8);
        ctx.fillRect(0, 0, Width,Height);
      }
    break;
    case 'ffa':
    default:
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(500+toOpen*(Width-500)+Math.sin(T/80)*30,0);
      ctx.lineTo(0,400+toOpen*(Height-400)+Math.sin(T/80)*17);
      ///
      ctx.moveTo(Width,Height);
      ctx.lineTo((1-toOpen)*(Width-500)-Math.sin(1+T/80)*30,Height);
      ctx.lineTo(Width,(1-toOpen)*(Height-400)-Math.sin(1+T/80)*18);
      ///
      ctx.closePath();
      ctx.fillStyle = 'white';
      ctx.fill();
      //////////////////////////////////////////
      ctx.beginPath();
      ctx.moveTo(0,0);
      ctx.lineTo(400+toOpen*(Width-400)+(Math.sin(.5+T/80)*20)*(1-toOpen)+5,0);
      ctx.lineTo(0,300+toOpen*(Height-300)+(Math.sin(.5+T/80)*15)*(1-toOpen)+5);
      ///
      ctx.moveTo(Width,Height);
      ctx.lineTo((1-toOpen)*((Width-400)-(Math.sin(1.5+T/80)*20))-5,Height);
      ctx.lineTo(Width,(1-toOpen)*((Height-300)-(Math.sin(1.5+T/80)*15))-5);
      ///
      ctx.closePath();
      ctx.fillStyle = 'white';
      ctx.fill();
      {
        //background-image: linear-gradient(to right top, #16bffd, #65a2f9, #a07fdd, #c456a8, #cb3066);
        ctx.globalCompositeOperation = 'hard-light';
        let grd = ctx.createLinearGradient(0, 0, 0, Height);
        grd.addColorStop(0.00, '#16BFFD');
        grd.addColorStop(.300, '#65a2f9');
        grd.addColorStop(.500, '#a07fdd');
        grd.addColorStop(.700, '#c456a8');
        grd.addColorStop(1.00, '#CB3066');

        ctx.fillStyle = grd;
        ctx.globalAlpha = Math.max(0,(1-toOpen)/5.5);
        ctx.fillRect(0, 0, Width,Height);
      }
    break;
  }
}

function tank(x,y,angle,size,type,color){
  var CLASS = {
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
  }
  for(let c of CLASS[type].canons){
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate((angle/360*Math.PI*2)+c.offdir);
    ctx.beginPath();
    ctx.moveTo(0,(c.offx-c.width/2)*size/35);
    ctx.lineTo(0,(c.offx+c.width/2)*size/35);
    ctx.lineTo(c.height*size/35,(c.offx+c.width/2+c.openWidth/2)*size/35);
    ctx.lineTo(c.height*size/35,(c.offx-c.width/2-c.openWidth/2)*size/35);
    ctx.closePath();
    ctx.lineWidth = LW;
    ctx.lineJoin = 'bevel';
    ctx.fillStyle = C.gray;
    ctx.strokeStyle = C.dkgray;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  switch(type){
    default:
      ctx.beginPath()
      ctx.arc(x,y,size,0,Math.PI*2);
      ctx.closePath();
      ctx.fillStyle = color[0];
      ctx.strokeStyle = color[1];
      ctx.lineWidth = LW;
      ctx.fill();
      ctx.stroke();
    break;
  }
}
function obj(x,y,angle,type){
  ctx.save()
  ctx.translate(x,y);
  ctx.rotate(angle/360*Math.PI*2);
  ctx.beginPath()
  switch(type){
    case 'square': ctx.rect(-16,-16,32,32);
      ctx.fillStyle = C.square; ctx.strokeStyle = C.dksquare;
    break;
    case 'triangle':
      ctx.moveTo(25,0);ctx.lineTo(Math.cos(Math.PI*2/3)*25,Math.sin(Math.PI*2/3)*25);ctx.lineTo(Math.cos(Math.PI*4/3)*25,Math.sin(Math.PI*4/3)*25);ctx.closePath();
      ctx.fillStyle = C.trian; ctx.strokeStyle = C.dktrian;
    break;
    case 'pentagon': ctx.moveTo(42,0);
            ctx.lineTo(Math.cos(Math.PI*2/5)*42,Math.sin(Math.PI*2/5)*42);
            ctx.lineTo(Math.cos(Math.PI*4/5)*42,Math.sin(Math.PI*4/5)*42);
            ctx.lineTo(Math.cos(Math.PI*6/5)*42,Math.sin(Math.PI*6/5)*42);
            ctx.lineTo(Math.cos(Math.PI*8/5)*42,Math.sin(Math.PI*8/5)*42);
            ctx.closePath();
            ctx.fillStyle = C.penta; ctx.strokeStyle = C.dkpenta;
    break;
  }
  ctx.lineWidth = LW;
  ctx.lineJoin = "bevel";
  ctx.fill();
  ctx.stroke();
  ctx.restore()
}
function bull(x,y,size,color){
  ctx.beginPath()
  ctx.arc(x,y,size/3,0,Math.PI*2);
  ctx.closePath();
  ctx.fillStyle = color[0];
  ctx.strokeStyle = color[1];
  ctx.lineWidth = LW;
  ctx.fill();
  ctx.stroke();
}
function drone(x,y,angle,size,color){
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(angle/360*Math.PI*2);
  ctx.beginPath();
  ctx.moveTo(size,0);ctx.lineTo(Math.cos(Math.PI*2/3)*size,Math.sin(Math.PI*2/3)*size);ctx.lineTo(Math.cos(Math.PI*4/3)*size,Math.sin(Math.PI*4/3)*size);
  ctx.closePath();
  ctx.fillStyle = color[0];
  ctx.strokeStyle = color[1];
  ctx.lineWidth = LW;
  ctx.lineJoin = 'bevel';
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
