(function(window){
  ///
  const CONST = {
    RESOLUTION: 1.1,
    OFFCAN:     1.2,
    LINEWIDTH: 4,
    SMOOTH: 0.15,
    SIZE: 35,
    MOUSEDELAY: 60/15,
    MOUSE_OUT: 3,
    UP_ORDER:[
      7,
      1,
      6,
      2,
      0,
      4,
      5,

      3
    ]
  };
  const CLASS = TanksConfig.class;
  const CLASS_TREE = TanksConfig.tree;
  var rnbcolor = ['hsl(0,100%,50%)','hsl(0,100%,30%)'];
  var C = window.colorPattern = window.colorPattern || {
    //         ---light------Dark---
    green:     ["#19e56e","#14ad54"],
    red:       ["#e6584b","#a9443b"],
    yellow:    ["#f4e433","#cab810"],
    blue:      ["#408edd","#3b6fa9"],
    gray:      ["#8e8ca5","#716e86"],//canons
    special:   rnbcolor,
    black:     ['#4a4a50','#1a1a1a'],
    white:     ['#f2f2f2','#e1e1e1'],
    lila:      ['#e0bbe4','#957dad'],
    necro:     ['#e5bd56','#b89337'],
    Grid:      ["#d0cdcd","#c1bebe"],

    hit:       ['#d82626','#d82626'],//red when you get hitted
    bull:      ["#999999","#6a6a6a"],
    sqr:       ["#cfcf9f","#a6a689"],
    alphaSqr:  ["#cfcf9f","#a6a689"],
    tri:       ["#d1adb2","#a38a8e"],
    alphaTri:  ["#d1adb2","#a38a8e"],
    pnt:       ["#b2b2cc","#8686ab"],
    alphaPnt:  ["#b2b2cc","#8686ab"],
    botName:    '#f6f1b5',
    up:[
      '#e6ab22',///Reload
      '#4bd79d',///M Speed
      '#e66a22',///BodyDamage
      '#4fd3d3',
      '#eddd2a',
      '#4a6dd8',
      '#e62222',
      '#50a5dc'
    ],
    class:[
      '#cd9797',
      '#cdc497',
      '#a9cd97',
      '#97bbcd',
      '#b9b5ce',
      '#ceb5ce',
      '#ceb5bd'
    ],
  };
  var RATIO = 1, UIRATIO;
  var Global = {
    mouse_out: 0,
    inputs: {
      old: {},
      mouseL:0,
      mouseR:0
    },
    mouseDelay: 0,
    mouse_x: 0,
    mouse_y: 0,
    oldMouse_x:0,
    oldMouse_y:0,
    fps: [],
    oldfps : 0,
    newfps: 0,
    canW: 0,
    canH: 0,
    winW: 0,
    winH: 0,
  }
  var Game = {
    timestamp: 0,
    screen: 1920,
    realScreen: 1920,
    width: 1,
    height: 1,
  };
  var Drawings = {
      canons:[
        (ctx, config, param, i) => {
          let c = config.canons[i], r = param.size/CONST.SIZE;
          if(c.hidden){
            return;
          }
          i = config.turrets ? parseInt(i) + config.turrets.length : i;
          let recoil = param.recoils[i] ? 1-Math.abs(param.recoils[i]) : 1;
          ctx.save();
            ctx.beginPath();
            ctx.rotate(c.offdir+param.dir);
            ctx.moveTo(0,(c.offx-c.width/2)*r);
            ctx.lineTo(0,(c.offx+c.width/2)*r);
            ctx.lineTo((c.height*recoil)*r,(c.offx+c.width/2+c.open/2)*r);
            ctx.lineTo((c.height*recoil)*r,(c.offx-c.width/2-c.open/2)*r);
            ctx.closePath();
            ctx.fillStyle = param.canC[0];
            ctx.strokeStyle = param.canC[1];
            ctx.lineWidth = CONST.LINEWIDTH;
            ctx.lineJoin = 'round';
            ctx.fill();
            ctx.stroke();
          ctx.restore();
        },
        (ctx, config, param, i) => {
          let c = config.canons[i], r = param.size/CONST.SIZE;
          i = config.turrets ? parseInt(i) + config.turrets.length : i;
          let recoil = param.recoils[i] ? 1-Math.abs(param.recoils[i]) : 1;
          ctx.save();
            ctx.beginPath();
            ctx.rotate(c.offdir+param.dir);
            ///
            ctx.moveTo((c.height*recoil-c.openlength)*r,(c.offx-c.width/2)*r);
            ctx.lineTo(0,(c.offx-c.width/2)*r);
            ctx.lineTo(0,(c.offx+c.width/2)*r);
            ctx.lineTo((c.height*recoil-c.openlength)*r,(c.offx+c.width/2)*r);
            ctx.lineTo((c.height*recoil)*r,(c.offx+c.width/2+c.open/2)*r);
            ctx.lineTo((c.height*recoil)*r,(c.offx-c.width/2-c.open/2)*r);
            ctx.lineTo((c.height*recoil-c.openlength)*r,(c.offx-c.width/2)*r);
            ctx.lineTo((c.height*recoil-c.openlength)*r,(c.offx+c.width/2)*r);
            ///
            ctx.closePath();
            ctx.fillStyle = param.canC[0];
            ctx.strokeStyle = param.canC[1];
            ctx.lineWidth = CONST.LINEWIDTH;
            ctx.lineJoin = 'round';
            ctx.fill();
            ctx.stroke();
          ctx.restore();
        },
      ],
      turrets:[
        (ctx, config, param, i) => {
          let c = config.turrets[i], r = param.size/CONST.SIZE;
          let recoil = param.recoils[i] ? 1-Math.abs(param.recoils[i]) : 1;
          ctx.save();
            ctx.beginPath();
            ctx.rotate(param.canDir[i] ? param.canDir[i] : 0);
            ctx.moveTo(0,(c.offx-c.width/2)*r);
            ctx.lineTo(0,(c.offx+c.width/2)*r);
            ctx.lineTo((c.height*recoil)*r,(c.offx+c.width/2+c.open/2)*r);
            ctx.lineTo((c.height*recoil)*r,(c.offx-c.width/2-c.open/2)*r);
            ctx.closePath();
            ctx.fillStyle = param.canC[0];
            ctx.strokeStyle = param.canC[1];
            ctx.lineWidth = CONST.LINEWIDTH;
            ctx.lineJoin = 'round';
            ctx.fill();
            ctx.stroke();
            ///
            ctx.beginPath()
            ctx.arc(0,0,c.rad*r+CONST.LINEWIDTH/2,0,Math.PI*2);
            ctx.closePath();
            ctx.fillStyle = param.canC[1];
            ctx.fill();
            ctx.beginPath()
            ctx.arc(0,0,c.rad*r-CONST.LINEWIDTH/2,0,Math.PI*2);
            ctx.closePath();
            ctx.fillStyle = param.canC[0];
            ctx.fill();
          ctx.restore();
        },
      ],
      body:[
        (ctx, config, param) => {
          ctx.beginPath();
          ctx.arc(0,0,param.size+CONST.LINEWIDTH/2,0,Math.PI*2,0);
          ctx.closePath();
          ctx.fillStyle = param.tankC[1];
          ctx.fill();
          ctx.closePath();
          ///
          ctx.beginPath();
          ctx.arc(0,0,param.size-CONST.LINEWIDTH/2,0,Math.PI*2,0);
          ctx.closePath();
          ctx.fillStyle = param.tankC[0];
          ctx.fill();
          ctx.closePath();
          ///
        },
        (ctx, config, param) => {
          ctx.save();
            ctx.rotate(param.dir);
            ctx.beginPath();
            roundRect(ctx,-param.size*config.body.width,
                          -param.size*config.body.height,
                           param.size*2*config.body.width,
                           param.size*2*config.body.height,1);
            ctx.closePath();
            ctx.strokeStyle = param.tankC[1];
            ctx.fillStyle = param.tankC[0];
            ctx.lineWidth = CONST.LINEWIDTH;
            ctx.fill();ctx.stroke();
          ctx.restore();
        },
        (ctx, config, param) => {
          let a = Math.PI*2/5, size = param.size*1.236;
          ctx.save();
            ctx.rotate(param.dir+a/2);
            ctx.beginPath();
              ctx.moveTo(Math.cos(a)*size,Math.sin(a)*size);
              ctx.lineTo(Math.cos(a*1)*size,Math.sin(a*1)*size);
              ctx.lineTo(Math.cos(a*2)*size,Math.sin(a*2)*size);
              ctx.lineTo(Math.cos(a*3)*size,Math.sin(a*3)*size);
              ctx.lineTo(Math.cos(a*4)*size,Math.sin(a*4)*size);
              ctx.lineTo(Math.cos(a*5)*size,Math.sin(a*5)*size);
            ctx.closePath();
            ctx.strokeStyle = param.tankC[1];
            ctx.fillStyle = param.tankC[0];
            ctx.lineWidth = CONST.LINEWIDTH;
            ctx.fill();ctx.stroke();
          ctx.restore();
        },
      ],
      bullet:[
        (ctx, param) => {
          ctx.beginPath();
          ctx.arc(0,0,param.size,0,Math.PI*2,0);
          ctx.fillStyle = C[param.color][1];
          ctx.fill();
          ctx.closePath();
          ///
          ctx.beginPath();
          ctx.arc(0,0,param.size-CONST.LINEWIDTH,0,Math.PI*2,0);
          ctx.fillStyle = C[param.color][0];
          ctx.fill();
          ctx.closePath();
        },
        (ctx, param) => {
          $1=param.size*1.7;
          ctx.rotate(param.dir);
          ctx.beginPath();
          ctx.moveTo($1,0);
          ctx.lineTo(-0.6*$1,0.8660254037844387*$1)
          ctx.lineTo(-0.6*$1,-0.8660254037844387*$1)
          ctx.closePath();
          ctx.fillStyle = C[param.color][0];
          ctx.fill();
          ctx.lineWidth = CONST.LINEWIDTH;
          ctx.lineJoin = 'round';
          ctx.strokeStyle = C[param.color][1];
          ctx.stroke();
        },
        (ctx, param) => {
          $1=param.size*1.8;
          let mini = $1*.38;
          ///
          ctx.rotate(param.dir);
          ctx.beginPath();
          ctx.moveTo($1,0);
          ctx.lineTo(0.5*mini,0.8660254037844387*mini);
          ctx.lineTo(-0.5*$1,0.8660254037844387*$1);
          ctx.lineTo(-1*mini ,0);
          ctx.lineTo(-0.5*$1,-0.8660254037844387*$1);
          ctx.lineTo(0.5*mini ,-0.8660254037844387*mini);
          ctx.closePath();
          ctx.fillStyle = C[param.color][0];
          ctx.fill();
          ctx.lineWidth = CONST.LINEWIDTH;
          ctx.lineJoin = 'round';
          ctx.strokeStyle = C[param.color][1];
          ctx.stroke();
        },
        (ctx, param) => {
          ctx.blendMode = 'source-over';
          ctx.rotate(param.dir);
          ctx.beginPath();
          ctx.rect(-param.size,-param.size,param.size*2,param.size*2)
          ctx.closePath();
          ctx.fillStyle = C[param.color][0];
          ctx.fill();
          ctx.lineWidth = CONST.LINEWIDTH;
          ctx.lineJoin = 'round';
          ctx.strokeStyle = C[param.color][1];
          ctx.stroke();
        }
      ],
      obj:{
        tri: (ctx,$0,$1,$2) => {
          ctx.rotate($2);
          $1 /= 18;
          ctx.beginPath();
            ctx.moveTo(32*$1,0)
            ctx.lineTo(-16*$1,27.7*$1)
            ctx.lineTo(-16*$1,-27.7*$1)
          ctx.closePath();
          ctx.fillStyle = $0[0];
          ctx.strokeStyle = $0[1];
          ctx.lineWidth = CONST.LINEWIDTH;
          ctx.lineJoin = 'round';
          ctx.fill();
          ctx.stroke();
        },
        sqr: (ctx,$0,$1,$2) => {
          ctx.rotate($2)
          $1 /=20;
          ctx.beginPath();
          ctx.rect(-20*$1,-20*$1,40*$1,40*$1);
          ctx.closePath();
          ctx.fillStyle = $0[0];
          ctx.strokeStyle = $0[1];
          ctx.lineWidth = CONST.LINEWIDTH;
          ctx.lineJoin = 'round';
          ctx.fill()
          ctx.stroke();
        },
        pnt: (ctx,$0,$1,$2) => {
          ctx.rotate($2)
          $1 /=42;
          ctx.beginPath();
            ctx.moveTo(52*$1,0);
            ctx.lineTo(16.1*$1,49.5*$1);
            ctx.lineTo(-42.1*$1,30.6*$1);
            ctx.lineTo(-42.1*$1,-30.6*$1);
            ctx.lineTo(16.1*$1,-49.5*$1);
          ctx.closePath();
          ctx.fillStyle = $0[0];
          ctx.strokeStyle = $0[1];
          ctx.lineWidth = CONST.LINEWIDTH;
          ctx.lineJoin = 'round';
          ctx.fill()
          ctx.stroke();
        },
        alphaPnt: (ctx,$0,$1,$2) => {
          ctx.rotate($2)
          $1 /=150;
          ctx.beginPath();
            ctx.moveTo(185.7*$1,0);
            ctx.lineTo(57.5*$1,176.8*$1);
            ctx.lineTo(-150.4*$1,109.3*$1);
            ctx.lineTo(-150.4*$1,-109.3*$1);
            ctx.lineTo(57.1*$1,-176.8*$1);
          ctx.closePath();
          ctx.fillStyle = $0[0];
          ctx.strokeStyle = $0[1];
          ctx.lineWidth = CONST.LINEWIDTH;
          ctx.lineJoin = 'round';
          ctx.fill();
          ctx.stroke();
        },
        alphaSqr: (ctx,$0,$1,$2) => {
          ctx.rotate($2);
          $1 /=90;
          ctx.beginPath();
            ctx.rect(-90*$1,-90*$1,180*$1,180*$1);
          ctx.closePath();
          ctx.fillStyle = $0[0];
          ctx.strokeStyle = $0[1];
          ctx.lineWidth = CONST.LINEWIDTH;
          ctx.lineJoin = 'round';
          ctx.fill();
          ctx.stroke();
        },
        alphaTri: (ctx,$0,$1,$2) => {
          ctx.rotate($2);
          $1 /=72;
          ctx.beginPath()
            ctx.moveTo(138*$1,0)
            ctx.lineTo(-69*$1,119.5*$1)
            ctx.lineTo(-69*$1,-119.5*$1)
          ctx.closePath();
          ctx.fillStyle = $0[0];
          ctx.strokeStyle = $0[1];
          ctx.lineWidth = CONST.LINEWIDTH;
          ctx.lineJoin = 'round';
          ctx.fill();
          ctx.stroke();
        },
        bull: (ctx,$0,$1,$2) => {
          offcan.can.height = offcan.can.width = $1*2*RATIO*CONST.OFFCAN+2;
          offcan.ctx.translate(offcan.can.width/2,offcan.can.height/2);
          offcan.ctx.scale(RATIO*CONST.OFFCAN,RATIO*CONST.OFFCAN);
          ///
          offcan.ctx.blendMode = 'source-over';
          offcan.ctx.beginPath();
          offcan.ctx.arc(0,0,$1,0,Math.PI*2,0);
          offcan.ctx.fillStyle = $0[1];
          offcan.ctx.fill();
          ///
          offcan.ctx.beginPath();
          offcan.ctx.arc(0,0,$1-CONST.LINEWIDTH,0,Math.PI*2,0);
          offcan.ctx.fillStyle = $0[0];
          offcan.ctx.fill();

          ctx.save();
            ctx.scale(1/CONST.OFFCAN/RATIO,1/CONST.OFFCAN/RATIO);
            ctx.drawImage(offcan.can,-offcan.can.width/2,-offcan.can.height/2);
          ctx.restore();
        }
      },
      pet:PetsConfig.pets
  };
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  function roundedPoly(ctx, points, radius) {
    var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection, drawDirection, angle, halfAngle, cRadius, lenOut;
    var asVec = function(p, pp, v) {
      v.x = pp.x - p.x;
      v.y = pp.y - p.y;
      v.len = Math.sqrt(v.x * v.x + v.y * v.y);
      v.nx = v.x / v.len;
      v.ny = v.y / v.len;
      v.ang = Math.atan2(v.ny, v.nx);
    }
    v1 = {};
    v2 = {};
    len = points.length;
    p1 = points[len - 1];
    for (i = 0; i < len; i++) {
      p2 = points[(i) % len];
      p3 = points[(i + 1) % len];
      asVec(p2, p1, v1);
      asVec(p2, p3, v2);
      sinA = v1.nx * v2.ny - v1.ny * v2.nx;
      sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny;
      angle = Math.asin(sinA);
      radDirection = 1;
      drawDirection = false;
      if (sinA90 < 0) {
        if (angle < 0) {
          angle = Math.PI + angle;
        } else {
          angle = Math.PI - angle;
          radDirection = -1;
          drawDirection = true;
        }
      } else {
        if (angle > 0) {
          radDirection = -1;
          drawDirection = true;
        }
      }
      halfAngle = angle / 2;
      lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
      if (lenOut > Math.min(v1.len / 2, v2.len / 2)) {
        lenOut = Math.min(v1.len / 2, v2.len / 2);
        cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
      } else {
        cRadius = radius;
      }
      x = p2.x + v2.nx * lenOut;
      y = p2.y + v2.ny * lenOut;
      x += -v2.ny * cRadius * radDirection;
      y += v2.nx * cRadius * radDirection;
      ctx.arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection);
      p1 = p2;
      p2 = p3;
    }
    ctx.closePath();
  }
  function roundRect(ctx, x, y, width, height, radius) {
    if (typeof stroke === 'undefined') {
      stroke = true;
    }
    if (typeof radius === 'undefined') {
      radius = 0;
    }
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) {
        radius[side] = radius[side] || defaultRadius[side];
      }
    }
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  }
  ///
  var General = {};
  General['updateRatio'] = ()=>{
      RATIO = Math.max(Global.canW/Game.screen,
                        Global.canH/(Game.screen*.5625))
      UIRATIO = Math.max(Global.canW/1920,
                        Global.canH/(1920*.5625))//*(CONST.RESOLUTION);
  }
  General['ease-in-out'] = function(t,e = 5) {return t<=.5 ? Math.pow(2*t,e)/2 : 1-Math.pow(2*(1-t),e)/2}
  General['isMouse'] = (x,y,w,h,r = 1)=>{
    let mouse_x = Global.mouse_x/r,mouse_y = Global.mouse_y/r;
    return (mouse_x>=x) && (mouse_y>=y) && (mouse_x<=x+w) && (mouse_y<=y+h)
  };
  General['isMouseCirc'] = (x,y,r)=>{return (Math.sqrt(Math.pow(Global.mouse_x-x,2)+Math.pow(Global.mouse_y-y,2)) <= r)};
  General['color'] = {
    shade: (color, percent) => {
          var R = parseInt(parseInt(color.substring(1,3),16)*percent);
          var G = parseInt(parseInt(color.substring(3,5),16)*percent);
          var B = parseInt(parseInt(color.substring(5,7),16)*percent);
          R = (R<255)?R:255;
          G = (G<255)?G:255;
          B = (B<255)?B:255;
          return "#" + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
        }
  }
  //////////
  class Tank{
    constructor(x,y,size,color){
      this.color = color;
      this.x = x;
      this.y = y;
      this.name = {name:"",color:0};
      this.vx = 0;
      this.vy = 0;
      this.dvx = 0;
      this.dvy = 0;
      this.dx = x;
      this.dy = y;
      this.hp = 1;
      this.hpAlpha = 0;
      this.scale = 1;
      this.class = 'Doble';
      this.size = size;
      this.SH = {
        lapse: -1
      }
      this.dir = 0;
      this.ddir = 0;
      this.canDir = [];
      this.canDdir = [];
      this.destroy = 0;
      this.prediclen = 0;
      this.predicdir = 0;
      this.invinsible = 0;
      this.xp = 0;
      this.name = '';
      this.recoil = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      this.off = (()=>{
        let can = document.createElement('CANVAS');
        let ctx = can.getContext('2d');
        let IT = {
          drawName: name,
          drawXp:   shortxp,
          name: '',
          xp: -1,
          can: can,
        }
        let r = CONST.RESOLUTION*CONST.OFFCAN;
        let lw = 4;
        let offy = 0;
        can.height = (15+24+lw*2)*r;

        function name(name,xp,bot){
          ctx.setTransform(1,0,0,1,0,0);
          ctx.font = '700 24px Catamaran';
          let m = ctx.measureText(name);
          let w = m.width*r;
          can.width = Math.min(Math.max(100*r,w+(lw*2*r)),300*r);
          ctx.font = '700 24px Catamaran';
          ctx.lineJoin = 'round';
          ctx.lineWidth = lw;
          ctx.textBaseline = 'middle';
          ctx.strokeStyle = '#222222';
          ctx.fillStyle = bot ? C.botName : '#fcfcfc';
          ctx.setTransform(r,0,0,r,can.width/2,0);
          let c = ctx.measureText(name);
          ctx.strokeText( name, -c.width/2, lw + 12 );
          ctx.fillText(   name, -c.width/2, lw + 12 );
          ///
          offy = 24+lw*2;
          shortxp(xp);
        };
        function shortxp(xp){
          ctx.clearRect(-can.width/2,offy+1,can.width,can.height-offy);
          ctx.font = '700 15px Catamaran';
          ctx.lineWidth = 3;
          ctx.textBaseline = 'middle';
          ctx.strokeStyle = '#222222';
          let m = ctx.measureText(xp);
          ctx.strokeText( xp, -m.width/2, offy + 15/2 );
          ctx.fillText(   xp, -m.width/2, offy + 15/2 );
        };

        return IT;
      })();
      this.hpBar = (()=>{
        let can = document.createElement('CANVAS');
        let ctx = can.getContext('2d');
        let R = CONST.RESOLUTION*CONST.OFFCAN;
        let Hp = 1;
        let Size = 0;
        let lw = 1.5;
        let height = 5;
        can.height = (height+lw*2+4)*R

        function drawHp(hp,size,color){
          if(size != Size || hp != Hp){
            if(size != Size){
              can.width = (size+lw*2+4+height)*R;
              Size = size;
            } else {
              ctx.setTransform(1,0,0,1,0,0)
              ctx.clearRect(0,0,can.width,can.height);
            }
          } else {
            return;
          }
          ctx.setTransform(R,0,0,R,can.width/2,2);
          ctx.beginPath();
          roundRect(ctx,-size/2-lw-height/2,0,size+lw*2+height,height+lw*2,(height+lw*2)/2);
          ctx.closePath();
          ctx.fillStyle = '#333333';
          ctx.fill();
          ///
          ctx.beginPath();
          roundRect(ctx,-size/2-height/2,lw,size*hp+height,height,height/2);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        };

        return {
          can: can,
          redraw: drawHp
        }
      })();
      this.hitted = 0;
    };
    shoot(c){
        if(this.recoil[c]<=0){
          this.recoil[c]+=0.01;
      }
    };
    async hit(){
      if(!this.hitted){
        this.hitted = 2;
        await sleep(33);
        this.hitted = 1;
        await sleep(33);
        this.hitted = 0;
      } else {
        return;
      }
    };
    update(){
      if(this.name != this.off.name || this.bot != this.off.bot){
        this.off.name = this.name;
        this.off.bot = this.bot;
        this.off.drawName(this.name,this.xp,this.bot);
      }
      if(this.xp != this.off.xp){
        this.off.xp = this.xp;
        this.off.drawXp(this.xp);
      }
      this.dx += (this.x-this.dx)*CONST.SMOOTH;
      this.dy += (this.y-this.dy)*CONST.SMOOTH;
      this.dvx += (this.vx-this.dvx)*CONST.SMOOTH/2;
      this.dvy += (this.vy-this.dvy)*CONST.SMOOTH/2;
      this.ddir = Math.atan2(
        Math.sin(this.ddir)+(Math.sin(this.dir)-Math.sin(this.ddir))*0.3,
        Math.cos(this.ddir)+(Math.cos(this.dir)-Math.cos(this.ddir))*0.3
      );
      if(this.canDir.length == this.canDdir.length){
        for(let i in this.canDir){
          this.canDdir[i] = Math.atan2(
            Math.sin(this.canDdir[i])+(Math.sin(this.canDir[i])-Math.sin(this.canDdir[i]))*0.3,
            Math.cos(this.canDdir[i])+(Math.cos(this.canDir[i])-Math.cos(this.canDdir[i]))*0.3
          )
        }
      } else {
        this.canDdir = this.canDir;
      }
      ///
      if(this.shield){
        this.SH.lapse += 1;
        if(this.SH.lapse == 6){
          this.SH.body = [General.color.shade(C[this.color][0],1.1),C[this.color][1]];
          this.SH.canons = [General.color.shade(C.gray[0],1.1),C.gray[1]];
        } else if(this.SH.lapse == 0){
          this.SH.body = C[this.color];
          this.SH.canons = C.gray;
        } else if(this.SH.lapse == 12){
          this.SH.lapse = -1;
        }
      }
      ///
      if(this.hp<1){
        this.hpAlpha = Math.min(.8,this.hpAlpha+0.05);
      } else {
        this.hpAlpha = Math.max(0,this.hpAlpha-0.01);
      }
      for(let i in this.recoil){
        if(this.recoil[i] > 0 && this.recoil[i]<0.07){
          this.recoil[i]+=(0.075-this.recoil[i])*0.3;
        } else if(this.recoil[i]>=0.07){
          this.recoil[i] = -this.recoil[i];
        } if(this.recoil[i] < 0){
          if(this.recoil[i] < -0.005){
            this.recoil[i]+= (-this.recoil[i])*0.2;
          } else {
            this.recoil[i] = 0;
          }
        }
      }
    };
    draw(ctx){
      ctx.translate(this.dx+this.dvx,this.dy+this.dvy)
      ctx.globalAlpha = this.alpha;
      let can = General['drawTank'](ctx,parseInt(this.alpha),{
         class: this.class,
         tankC: this.shield ? this.SH.body : ((this.hitted>1) ? C.hit : C[this.color]),
         canC: this.shield ? this.SH.canons : ((this.hitted>1) ? C.hit : C.gray),
         size: this.size,
         dir: this.ddir,
         recoils: this.recoil,
         canDir: this.canDdir
      }).can;
      if(!can){return;}
      let w = can.width/(CONST.OFFCAN), h = can.height/(CONST.OFFCAN)
      ctx.drawImage(can,-w/2,-h/2,w,h);
      ///
    };
    drawUi(ctx){
      ctx.translate(this.dx+this.dvx,this.dy+this.dvy)
      ctx.globalAlpha = .8*this.alpha;
      ctx.scale(1/CONST.OFFCAN/CONST.RESOLUTION,1/CONST.OFFCAN/CONST.RESOLUTION);
      ctx.drawImage(this.off.can,
        -this.off.can.width/2,
        -this.off.can.height-this.size*1.2*CONST.OFFCAN*CONST.RESOLUTION
      );
      ///
      ctx.globalAlpha = this.hpAlpha*this.alpha;
      this.hpBar.redraw(this.hp,this.size*1.7,C[this.color][0]);
      ctx.drawImage(this.hpBar.can,
        -this.hpBar.can.width/2,
        (this.size*1.2)*CONST.OFFCAN*CONST.RESOLUTION
      )
    };
  };
  class Obj{
    constructor(x,y,size,type){
      this.color = type;
      this.x = x;
      this.y = y;
      this.dx = x;
      this.dy = y;
      this.vx = 0;
      this.vx = 0;
      this.hp = 1;
      this.hpAlpha = 0;
      this.scale = 1;
      this.size = size;
      this.dsize = 0;
      this.type = type;
      this.hitted = 0;
      this.alpha = 1;
      this.dalpha = 0;
      this.dir = Math.PI*2*Math.random();
      this.hitted = 0;
      this.hpBar = (()=>{
        let can = document.createElement('CANVAS');
        let ctx = can.getContext('2d');
        let R = CONST.RESOLUTION*CONST.OFFCAN;
        let Hp = 1;
        let Size = 0;
        let lw = 1.5;
        let height = 5;
        can.height = (height+lw*2+4)*R

        function drawHp(hp,size,color){
          if(size != Size || hp != Hp){
            if(size != Size){
              can.width = (size+lw*2+4+height)*R;
              Size = size;
            } else {
              ctx.setTransform(1,0,0,1,0,0)
              ctx.clearRect(0,0,can.width,can.height);
            }
          } else {
            return;
          }
          ctx.setTransform(R,0,0,R,can.width/2,2);
          ctx.beginPath();
          roundRect(ctx,-size/2-lw-height/2,0,size+lw*2+height,height+lw*2,(height+lw*2)/2);
          ctx.closePath();
          ctx.fillStyle = '#333333';
          ctx.fill();
          ///
          ctx.beginPath();
          roundRect(ctx,-size/2-height/2,lw,size*hp+height,height,height/2);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        };

        return {
          can: can,
          redraw: drawHp
        }
      })();
      switch(this.type){
        case 'sqr':
        case 'bull':
        case 'tri':
          this.rotate = 0.006*Math.sign(Math.random()-0.5);
        break;
        case 'pnt':
          this.rotate = 0.005*Math.sign(Math.random()-0.5);
        break;
        case 'alphaPnt':
        case 'alphaSqr':
        case 'alphaTri':
          this.rotate = 0.001*Math.sign(Math.random()-0.5);
          this.drawUi = function(ctx){
            ctx.translate(this.dx,this.dy);
            ctx.scale(1/CONST.OFFCAN/CONST.RESOLUTION,1/CONST.OFFCAN/CONST.RESOLUTION);
            ctx.globalAlpha = this.hpAlpha*this.alpha;
            this.hpBar.redraw(this.hp,this.size*1.7,C[this.color][0]);
            ctx.drawImage(this.hpBar.can,
              -this.hpBar.can.width/2,
              (this.size*1.2)*CONST.OFFCAN*CONST.RESOLUTION
            )
          }
        break;
      }
    }
    update(){
      this.dx += (this.x-this.dx)*CONST.SMOOTH;
      this.dy += (this.y-this.dy)*CONST.SMOOTH;
      this.dsize += (this.size-this.dsize)*CONST.SMOOTH*2;
      this.dalpha += (this.alpha-this.dalpha)*CONST.SMOOTH*2;
      this.dir+=this.rotate;
      if(this.shield && this.color !== 'special'){
        this.color = 'special';
      }
      if(this.shield && !this.drawUi){
        this.drawUi = function(ctx){
          ctx.translate(this.dx,this.dy);
          ctx.scale(1/CONST.OFFCAN/CONST.RESOLUTION,1/CONST.OFFCAN/CONST.RESOLUTION);
          ctx.globalAlpha = this.hpAlpha*this.alpha;
          this.hpBar.redraw(this.hp,this.size*1.7,C[this.color][0]);
          ctx.drawImage(this.hpBar.can,
            -this.hpBar.can.width/2,
            (this.size*1.2)*CONST.OFFCAN*CONST.RESOLUTION
          )
        }
      }
      if(this.hp<1){
        this.hpAlpha = Math.min(.8,this.hpAlpha+0.05);
      } else {
        this.hpAlpha = Math.max(0,this.hpAlpha-0.01);
      }
      /*
      if(this.draw.alpha < 1 && !this.e){
        this.e = 1;
        let e = ParticuleSys.add(0,0,this.size*2,this.size*2,dOBJECTS);
        let c = 0;
        switch(this.type){
          case 'sqr':
          case 'Bsqr':
            c = C.dksquare;
            break;
          case 'bull':
            c = C.dkbull;
            break;
          case 'tri':
          case 'Btri':
            c = C.dktrian;
            break;
          case 'pnt':
          case 'Bpnt':
            c = C.dkpenta;
            break;
        }
        ParticuleSys.part(e,[0,Math.PI*2],[1.1,2.4],1.01,[10,30],c,[5,9],0.98)
        ParticuleSys.burst(e,parseInt((this.size/7.5)+Math.random()*6),this.dx-this.size,this.dy-this.size);
        */
      }
    async hit(){
      if(!this.hitted){
        this.hitted = 2;
        await sleep(50);
        this.hitted = 1;
        await sleep(16);
        this.hitted = 0;
      } else {
        return;
      }
    }
    draw(ctx){
      ctx.translate(this.dx,this.dy);
      ctx.globalAlpha = this.dalpha;
      if(this.type=='bull'){
        let can = General['drawBullet'].draw(ctx,{size:this.size,type:0,color:(this.hitted>1) ? 'hit' : this.color});
        return;
      }
      Drawings['obj'][this.type](ctx,(this.hitted>1) ? C.hit : C[this.color],this.dsize,this.dir);
    }
  };
  class Bullet{
    constructor(x,y,size,dir,type,color){
      this.color = color;
      this.dx = x;//+(MAIN.x-MAIN.dx);
      this.dy = y;//+(MAIN.y-MAIN.dy);
      this.x = x;
      this.y = y;
      this.vx = 0//this.x-this.dx;
      this.vy = 0//this.y-this.dy;
      this.type = type;
      this.scale = 1;
      this.size = size;
      this.dir = dir;
      this.ddir = dir;
      this.destroy = 0;
      this.alpha = 1;
    }
    update(){
      this.dx += (this.x-this.dx)*CONST.SMOOTH;
      this.dy += (this.y-this.dy)*CONST.SMOOTH;
      this.vx += (this.x-this.dx-this.vx)*CONST.SMOOTH;
      this.vy += (this.y-this.dy-this.vy)*CONST.SMOOTH;
      if(this.ddir != this.dir){
        this.ddir = Math.atan2(
          Math.sin(this.ddir)+(Math.sin(this.dir)-Math.sin(this.ddir))*0.2,
          Math.cos(this.ddir)+(Math.cos(this.dir)-Math.cos(this.ddir))*0.2
        )
      }
      ///
    }
    draw(ctx){
      ctx.translate(this.dx,this.dy);
      ctx.globalAlpha = this.alpha;
      let param = {
        size  : this.size,
        type  : this.type,
        color : this.color,
        dir   : this.ddir,
        alpha : this.alpha
      }
      let can = this.pet ?
        General['drawPet'].draw(ctx,param) :
        General['drawBullet'].draw(ctx,param);
      if(can){
        let w = can.width/(CONST.OFFCAN), h = can.height/(CONST.OFFCAN)
        ctx.drawImage(can,-w/2,-h/2,w,h);
      }
    }
  };
  //////////
  function preRun(){
    //
    if(!General['canvas']){
      General['canvas'] = document.createElement('CANVAS');
      General['canvas'].oncontextmenu = event => event.preventDefault();
      General['canvas'].style.width = '100%';
      General['canvas'].style.height = '100%';
      document.body.style.backgroundColor = C.Grid[1];
      document.body.appendChild(General['canvas']);
    }
    General['ctx'] = General['canvas'].getContext('2d');
    var ctx = General['ctx'];
    //////////
    General['foreground'] = new function(){
      this.y = -5000;
      this.alpha = -160;
      this.actual = 'Connection...';
      this.little = '';
      this.errorAlpha = 0;
      this.eA = 0;
      this.show = 1;
      this.update = ()=>{
        this.y += -this.y*0.04;
        this.alpha += (1-this.alpha)*0.04;
        this.eA += (this.errorAlpha-this.eA)*0.06;
      };
      this.draw = ()=>{
        ctx.globalAlpha = this.eA;
        ctx.fillStyle = '#a92c2c';
        ctx.fillRect(0,0,Global.winW,Global.winH);
        ///
        ctx.translate(Global.winW/2,Global.winH/2+this.y)
        ctx.globalAlpha = Math.max(0,this.alpha);
        ctx.font = '700 70px Catamaran';
        ctx.strokeStyle = '#333333';
        ctx.lineJoin = 'miter';
        ctx.fillStyle = this.errorAlpha ? '#e69696' : '#e8e8e8';
        ctx.lineWidth = 10;
        let m = ctx.measureText(this.actual);
        ctx.strokeText(this.actual,-m.width/2,0);
        ctx.fillText(this.actual,-m.width/2,0);
        ///
        ctx.font = '700 15px Catamaran';
        m = ctx.measureText(this.little);
        ctx.fillText(this.little,-m.width/2,26);
      };
      this.setInfo = (i, l='', e = 0)=>{
        this.actual = i;
        this.little = l;
        this.y = -100;
        this.alpha = -5;
        this.errorAlpha = e;
      };
      if(General['KICK']){
        this.setInfo('Access Denied!',General['KICK'],1)
      }
    };
    General['STATES'] = 'Connection';
    //////////
    General['Interact'] = {
      onresize: ()=>{
        Global.winW = window.innerWidth;
        Global.winH = window.innerHeight;
        Global.canW = General['canvas'].width = Global.winW*CONST.RESOLUTION;
        Global.canH = General['canvas'].height = Global.winH*CONST.RESOLUTION;
      },
      onkeydown: e => {
      }
    };
    General.Interact.onresize();
    for(let i in General['Interact']){
      window[i] = General['Interact'][i];
    };
    //////////
    function Draw(){
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0,0,Global.canW,Global.canH);
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0,0,Global.canW,Global.canH);
      ctx.scale(CONST.RESOLUTION,CONST.RESOLUTION)
      General['foreground'].draw();
    };
    function Loop(){
      General['foreground'].update();
      Draw();
      if(General['preRun']){
        requestAnimationFrame(Loop);
      } else {
        Run();
      }
    };
    General['preRun'] = 1;
    Loop();
    /////////
    General['KICK'] = General['KICK'] || 0;
    General['WS'] = General['KICK'] ? 0 :  (() => {
      let socket = new WebSocket(WS_LINK)
          socket.binaryType = 'arraybuffer';
      socket.onopen    = ()=>{
        socket.send(PROTO.encode('init',POST))
      };
      socket.onmessage = (packet) => {
        let decoded = PROTO.decode(packet.data);
        let type = decoded.type;
        switch(type){
          case 'ping':{
            socket.send(PROTO.encode('ping',0))
            break;
          };
          case 'kick':{
            General['KICK'] = decoded.reason;
            General['foreground'].setInfo('Access denied!','err '+decoded.reason,1);
            break;
          };
          case 'GameUpdate':{
            General['preRun'] = 0;
            General['GGG'] = decoded.data;
            break;
          };
        }
      };
      socket.onclose   = (err) => {
        General['KICK'] = General['KICK'] || 'Connection lost';
      };
      return socket;
    })();
  };
  function Run(){
    if(!General['canvas']){
      General['canvas'] = document.createElement('CANVAS');
      General['canvas'].oncontextmenu = event => event.preventDefault();
      General['canvas'].style.width = '100%';
      General['canvas'].style.height = '100%';
      document.body.appendChild(General['canvas']);
    }
    General['ctx'] = General['canvas'].getContext('2d');
    var ctx = General['ctx'];
    ///
    General['drawTank'] = General['drawTank'] || (() => {
      let can = document.createElement('CANVAS');
      let ctxx = can.getContext('2d');
      let R = CONST.OFFCAN;
      let Coord = {};
      ///
      function setCoord(config){
        let middleX = 0, middleY = 0, canSize = CONST.SIZE/2+CONST.LINEWIDTH;
        let marge = 2;
        ///
        if(config.canons){
          for(let c of config.canons){
            ///
            let len = Math.sqrt(
              Math.pow(c.height,2)+
              Math.pow(c.width/2+c.offx+c.open/2,2)
            )+CONST.LINEWIDTH;
            canSize = Math.max(canSize,len);
            ///
            let cos = Math.cos(c.offdir),sin = Math.sin(c.offdir);
            middleX += cos*Math.max(0,c.height-CONST.SIZE/2)+sin*c.offx;
            middleY += sin*Math.max(0,c.height-CONST.SIZE/2)+cos*c.offx;
          }
          middleX /= config.canons.length*2;
          middleY /= config.canons.length*2;
        }
        if(config.turrets){
          for(let c of config.turrets){
            ///
            let len = Math.sqrt(
              Math.pow(c.height,2)+
              Math.pow(c.width/2+c.offx+c.open/2,2)
            )+CONST.LINEWIDTH;
            canSize = Math.max(canSize,len);
            ///
            let cos = Math.cos(c.offdir),sin = Math.sin(c.offdir);
            middleX += cos*Math.max(0,c.height-CONST.SIZE/2)+sin*c.offx;
            middleY += sin*Math.max(0,c.height-CONST.SIZE/2)+cos*c.offx;
          }
          middleX /= config.canons.length*2;
          middleY /= config.canons.length*2;
        }
        if(!config.canons && !config.turrets){
          middleX = canSize;
          middleY = canSize;
        };
        canSize = canSize*2 + marge*2;
        ///
        return {
          mX:middleX,
          mY:middleY,
          size: canSize,
          marge: marge
        }
      };
      ///
      return (ctx,isOpac,param)=>{
        var tank, coord;
        if(CLASS[param.class]){
          tank = CLASS[param.class];
        } else {
          return;
        }
        if(!Coord[param.class]){
          Coord[param.class] = setCoord(tank);
        }
        coord = Coord[param.class];
        ///
        if(!isOpac){
          let s = coord.size*param.size/CONST.SIZE*R;
          can.width = can.height = s;
          ctx = ctxx;
          ctx.setTransform(R,0,0,R,can.width/2,can.height/2)
        }
        ///
        for(let i in tank.canons){
          Drawings.canons[tank.canons[i].type]( ctx, tank, param, i);
        };
        Drawings.body[tank.body.shape]( ctx, tank, param );
        for(let i in tank.turrets){
          Drawings.turrets[tank.turrets[i].type]( ctx, tank, param, i );
        };
        return {
          can: isOpac ? 0 : can,
          mX:Coord[param.class].mX,
          mY:Coord[param.class].mY,
        }
      };
    })();
    General['drawBullet'] = (()=>{
      function canDraw(param){
        let can = document.createElement('CANVAS');
        let ctx = can.getContext('2d');
        can.width = can.height = (param.size*2+CONST.LINEWIDTH+2)*CONST.OFFCAN;
        ctx.setTransform(CONST.OFFCAN,0,0,CONST.OFFCAN,can.width/2,can.height/2);
        Drawings.bullet[param.type](ctx,param.color,param.size,param.recoil);
      }
      function draw(ctx,param){
        if(param.alpha<1){
          switch(param.type){
            case 0: case 1: case 2: case 3:{
              break;
            }
            default:{
              return canDraw(param);
            }
          }
        }
        Drawings.bullet[param.type](ctx,param);
      }
      ///
      return {
        draw:   draw
      }
    })();
    General['drawPet'] = (()=>{
      function canDraw(param){
        let can = document.createElement('CANVAS');
        let ctx = can.getContext('2d');
        can.width = can.height = (param.size*2+CONST.LINEWIDTH+2)*CONST.OFFCAN;
        ctx.setTransform(CONST.OFFCAN,0,0,CONST.OFFCAN,can.width/2,can.height/2);
        Drawings.pet[param.type]( ctx, param, CONST, C );
        return can;
      }
      function draw(ctx,param){
        if(param.alpha<1){
          switch(param.type){
            //case 0: case 1: case 2: case 3:{
          //    break;
            //}
            default:{
              return canDraw(param);
            }
          }
        }
        Drawings.pet[param.type]( ctx, param, CONST, C );
      }
      ///
      return {
        draw:   draw
      }
    })();
    ///
    var Instances = {
      'Objects': [],
      'Players': [],
      'Bullets': []
    };
    var User = new function(){
      this.color = 'green';
      this.x = 0;
      this.y = 0;
      this.gx = 'move';
      this.gy = 'move';
      this.dx = 'move';
      this.dy = 'move';
      this.vx = 0;
      this.vy = 0;
      this.dvx = 0;
      this.dvy = 0;
      this.scale = 1;
      this.class = "Rocket";
      this.SH = {
        lapse: -1
      };
      this.hp = 1;
      this.hpAlpha = 1;
      this.alpha = 1;
      this.size = 22;
      this.dir = 0;
      this.canDir = [];
      this.canDdir = [];
      this.followDir = 0;
      this.body = 0;
      this.invinsible = 0;
      this.recoil = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      this.predic = {
        x:0,
        y:0,
        xspeed:0,
        yspeed:0,
      }
      this.old = {
        "size":this.size,
        'class':this.class,
        dir:0
      }
      this.hitted = 0;
      this.hpBar = (()=>{
        let can = document.createElement('CANVAS');
        let ctx = can.getContext('2d');
        let R = CONST.RESOLUTION*CONST.OFFCAN;
        let Hp = 1;
        let Size = 0;
        let lw = 1.5;
        let height = 5;
        can.height = (height+lw*2+4)*R

        function drawHp(hp,size,color){
          if(size != Size || hp != Hp){
            if(size != Size){
              can.width = (size+lw*2+4+height)*R;
              Size = size;
            } else {
              ctx.setTransform(1,0,0,1,0,0)
              ctx.clearRect(0,0,can.width,can.height);
            }
          } else {
            return;
          }
          ctx.setTransform(R,0,0,R,can.width/2,2);
          ctx.beginPath();
          roundRect(ctx,-size/2-lw-height/2,0,size+lw*2+height,height+lw*2,(height+lw*2)/2+.5);
          ctx.closePath();
          ctx.fillStyle = '#333333';
          ctx.fill();
          ///
          ctx.beginPath();
          roundRect(ctx,-size/2-height/2,lw,size*hp+height,height,height/2);
          ctx.closePath();
          ctx.fillStyle = color;
          ctx.fill();
        };

        return {
          can: can,
          redraw: drawHp
        }
      })();
      ///
      this.shoot = function(c){
        if(this.recoil[c]<=0){
          this.recoil[c] = -this.recoil[c]+0.005;
        }
      }
      this.hit = async function(){
        if(!this.hitted){
          this.hitted = 2;
          await sleep(50);
          this.hitted = 1;
          await sleep(16);
          this.hitted = 0;
        } else {
          return;
        }
      }
      this.update = function(){
        let motionDir = [0,0];
        let len = 0.31/2;
        let FRICTION = 0.95;
        if(Global.inputs.w || Global.inputs.ArrowUp){motionDir[0]-=len;}
        if(Global.inputs.s || Global.inputs.ArrowDown){motionDir[0]+=len;}
        if(Global.inputs.a || Global.inputs.ArrowLeft){motionDir[1]-=len;}
        if(Global.inputs.d || Global.inputs.ArrowRight){motionDir[1]+=len;}
        let ddir = Math.atan2(motionDir[0],motionDir[1]);
        let llen = Math.min(Math.sqrt((motionDir[0]*motionDir[0])+(motionDir[1]*motionDir[1])),len);
        this.predic.xspeed+=Math.cos(ddir)*llen;this.predic.xspeed*=FRICTION;
        this.predic.yspeed+=Math.sin(ddir)*llen;this.predic.yspeed*=FRICTION;
        this.predic.x+=this.predic.xspeed;
        this.predic.y+=this.predic.yspeed;
        let tolen = Math.sqrt(Math.pow(this.predic.x,2)+Math.pow(this.predic.y,2));
        tolen+=(-tolen)*CONST.SMOOTH;
        ddir = Math.atan2(this.predic.y,this.predic.x);
        this.predic.x = Math.cos(ddir)*tolen;
        this.predic.y = Math.sin(ddir)*tolen;

        this.dir = Math.atan2((Global.mouse_y-Global.winH/2 -this.predic.y-(this.dvy/CONST.SMOOTH)),
                              Global.mouse_x-Global.winW/2 -this.predic.x-(this.dvx/CONST.SMOOTH));
        if(this.old.dir != parseInt(this.dir*100)){
          this.old.dir = parseInt(this.dir*100);
          this.DIFFDIR = 1;
        }
        if(this.hp<1){
          this.hpAlpha = Math.max(0,Math.min(.8,this.hpAlpha+0.05));
        } else {
          this.hpAlpha = Math.max(0,Math.min(.8,this.hpAlpha-0.01));
        }
        for(let i in this.recoil){
          if(this.recoil[i] > 0 && this.recoil[i]<0.07){
            this.recoil[i]+=(0.075-this.recoil[i])*0.3;
          } else if(this.recoil[i]>=0.07){
            this.recoil[i] = -this.recoil[i];
          } if(this.recoil[i] < 0){
            if(this.recoil[i] < -0.005){
              this.recoil[i]+= (-this.recoil[i])*0.2;
            } else {
              this.recoil[i] = 0;
            }
          }
        }
        if(this.canDir.length == this.canDdir.length){
          for(let i in this.canDir){
            this.canDdir[i] = Math.atan2(
              Math.sin(this.canDdir[i])+(Math.sin(this.canDir[i])-Math.sin(this.canDdir[i]))*0.3,
              Math.cos(this.canDdir[i])+(Math.cos(this.canDir[i])-Math.cos(this.canDdir[i]))*0.3
            )
          }
        } else {
          this.canDdir = this.canDir;
        }
        //console.log(this.recoil);

        ///STATE///
        if(this.shield){
          this.SH.lapse += 1;
          if(this.SH.lapse == 6){
            this.SH.body = [General.color.shade(C[this.color][0],1.1),C[this.color][1]];
            this.SH.canons = [General.color.shade(C.gray[0],1.1),C.gray[1]];
          } else if(this.SH.lapse == 0){
            this.SH.body = C[this.color];
            this.SH.canons = C.gray;
          } else if(this.SH.lapse == 12){
            this.SH.lapse = -1;
          }
        }
        ///GRID///{
          if(isNaN(this.gx)){
            this.gx = this.x;
          }
          if(isNaN(this.gy)){
            this.gy = this.y;
          }
          if(isNaN(this.dx)){
            this.dx = this.x;
          }
          if(isNaN(this.dy)){
            this.dy = this.y;
          }
          this.dx += (this.x-this.dx)*CONST.SMOOTH;
          this.dy += (this.y-this.dy)*CONST.SMOOTH;
          this.dvx += (this.vx-this.dvx)*CONST.SMOOTH;
          this.dvy += (this.vy-this.dvy)*CONST.SMOOTH;
          this.gx += (this.x-this.gx)*CONST.SMOOTH/1.6;
          this.gy += (this.y-this.gy)*CONST.SMOOTH/1.6;
      };
      this.draw = function(){
        ctx.translate(this.dx+this.dvx+this.predic.x,this.dy+this.dvy+this.predic.y)
        ctx.globalAlpha = this.alpha;
        let o = General['drawTank'](ctx,parseInt(this.alpha),{
          class: this.class,
          tankC: this.shield ? this.SH.body : ((this.hitted>1) ? C.hit : C[this.color]),
          canC: this.shield ? this.SH.canons : ((this.hitted>1) ? C.hit : C.gray),
          size: this.size,
          dir: this.followDir ? this.realDir : this.dir,
          recoils: this.recoil,
          canDir: this.canDdir
        });
        let can = o.can;
        if(can){
          let w = can.width/(CONST.OFFCAN), h = can.height/(CONST.OFFCAN);
          ctx.drawImage(can,-w/2,-h/2,w,h);
        }
        ///
        ctx.scale(1/CONST.OFFCAN/CONST.RESOLUTION,1/CONST.OFFCAN/CONST.RESOLUTION);
        this.hpBar.redraw(this.hp,this.size*1.5,C[this.color][0]);
        ctx.globalAlpha *= this.hpAlpha;
        ctx.drawImage(this.hpBar.can,
          -this.hpBar.can.width/2,
          (this.size*1.2)*CONST.OFFCAN*CONST.RESOLUTION
        );
      };
    };
    General['background'] = General['background'] || (()=>{
      return (posx,posy, tileSize) => {
        let h = Game.screen*.5625*RATIO;
        ///
        ctx.fillStyle = C.Grid[0];
        ctx.fillRect(
          -(Game.width/2+posx)*RATIO+Global.canW/2,
          -(Game.height/2+posy)*RATIO+Global.canH/2,
          Game.width*RATIO,
          Game.height*RATIO
        );
        ///
        let ts = tileSize*RATIO;
        ctx.globalAlpha = 0.05;
        ctx.beginPath();
        for(let x = -(posx*RATIO-Global.canW/2)%ts ; x<=Game.screen*RATIO+(posx%ts) ; x+=ts){
          ctx.moveTo(x,0);
          ctx.lineTo(x,h);
        }
        for(let y = -(posy*RATIO-Global.canH/2)%ts; y<=h+(posy%ts) ; y+=ts){
          ctx.moveTo(0,y)
          ctx.lineTo(Game.screen*RATIO,y)
        }
        ctx.lineWidth = 1*RATIO;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.globalAlpha = 1;
        switch(POST.gm){
          case '2team':{
            ctx.fillStyle = C.red[0];
            ctx.globalAlpha = 0.2;
            ctx.fillRect(
              -(-Game.width/2+posx)*RATIO+Global.canW/2,
              -(Game.height/2+posy)*RATIO+Global.canH/2,
              -600*RATIO,
              Game.height*RATIO
            );
            ctx.fillStyle = C.green[0];
            ctx.fillRect(
              -(Game.width/2+posx)*RATIO+Global.canW/2,
              -(Game.height/2+posy)*RATIO+Global.canH/2,
              600*RATIO,
              Game.height*RATIO
            );
            break;
          }
        }
      };
    })();
    General['Ui'] = new function(){
      this.lvl = 0;
      this.dlvl = 0;
      this.xp = 0;
      this.upNb = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      this.lvlDim = {
        lw: 4,
        w:8,
        h:15,
        W:14,
        H:30
      }
      this.still = 0;
      this.dead = 0;
      ///
      this.MAP = (()=>{
        let can = document.createElement('CANVAS');
        let ctx = can.getContext('2d');
        let R = CONST.RESOLUTION*CONST.OFFCAN;
        let size = 150;
        let lw = 12;
        ctx.font = '700 24px Catamaran';
        let m = ctx.measureText('Obstar.io').width+20;
        can.height = can.width = (size+lw)*R+4;
        can.width+=m*R;
        //
        ctx.setTransform(R,0,0,R,2+lw/2*R,2+lw/2*R);
        ctx.font = '700 24px Catamaran';
        ctx.fillStyle =  '#eeeeee';
        ctx.strokeStyle = '#222222';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 4;
        ctx.strokeText('Obstar.io',0,12);
        ctx.fillText('Obstar.io',0,12);
        ctx.translate(m,0);
        switch(POST.gm){
          case '2team':{
            ctx.beginPath();
            roundRect(ctx,0,0,size,size,0);
            ctx.closePath();
            ctx.strokeStyle = '#222222';
            ctx.lineJoin = 'round';
            ctx.lineWidth = lw;
            ctx.stroke();
            ctx.clip();
            ctx.fillStyle = '#f4f4f4';
            ctx.fillRect(0,0,size,size);
            ctx.fillStyle = C.green[0];
            ctx.fillRect(0,0,size/12,size);
            ctx.fillStyle = C.red[0];
            ctx.fillRect(size,0,-size/12,size);
            break;
          }
          default:{
            ctx.fillStyle = '#ececec';
            ctx.beginPath();
            roundRect(ctx,0,0,size,size,0);
            ctx.closePath();
            ctx.strokeStyle = '#333333';
            ctx.lineJoin = 'round';
            ctx.lineWidth = lw;
            ctx.stroke();
            ctx.fill();
            break;
          }
        }
        return {
          size: size,
          can: can,
          lw: lw/2*R,
          cursSize: 3
        };
      })();
      this.ST = (()=>{
        let can = document.createElement('CANVAS');
        let ctx = can.getContext('2d');
        let R = CONST.RESOLUTION*CONST.OFFCAN;
        can.width = 800*R;
        can.height = 75*R;
        let offy = 0;
        {
          ctx.scale(R,R);
          let lw = 6;
          ctx.font = '700 36px Catamaran';
          ctx.lineJoin = 'round';
          ctx.lineWidth = lw;
          ctx.textBaseline = 'middle';
          ctx.strokeStyle = '#222222';
          ctx.fillStyle = '#fcfcfc';
          let m = ctx.measureText(POST.name);
          ctx.strokeText(POST.name,400-m.width/2,lw+18);
          ctx.fillText(POST.name,400-m.width/2,lw+18);
          offy = lw+34+lw
        }
        ///
        barc = '#fbe048 ';
        bardkc = General['color'].shade(barc,.5);
        barMarge = 9;
        barW = 42;
        barH = 16;
        barRad = 9;
        barlw = 6;
        /// level ///
        function level(tank,score,lvl){
          ctx.clearRect(0,offy,can.width,can.height+offy);
          bar(lvl);
          score = score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          ctx.font = '700 18px Catamaran';
          ctx.lineWidth = 3.5;
          ctx.strokeStyle = '#222222';
          ctx.fillStyle = '#fcfcfc';
          let m = ctx.measureText(score+' '+tank);
          ctx.strokeText(score+' '+tank,400-m.width/2,5+offy+8);
          ctx.fillText(score+' '+tank,400-m.width/2,5+offy+8)
        }
        function bar(lvl){
          ctx.save();
          let fullbar = barMarge*9+barW*10;
          ctx.translate((400-fullbar/2),offy+5);
          ctx.beginPath();
          roundRect(ctx, -1, 0, fullbar+2, barH,barRad);
          ctx.closePath();
          ctx.lineWidth = barlw;
          ctx.fillStyle = ctx.strokeStyle = '#222222';
          ctx.stroke();
          ctx.fill();

          ctx.beginPath();
          for(let i = 0; i<10; i++){
            roundRect(ctx,i*(barW+barMarge),0,barW,barH,barRad);
            ctx.closePath();
          }
          ctx.clip();
          ctx.fillStyle = bardkc;
          ctx.fillRect(0,0,lvl*barW + Math.max(0,lvl-1)*barMarge,barH);
          ctx.fillStyle = barc;
          ctx.fillRect(0,0,parseInt(lvl)*barW + parseInt(Math.max(0,lvl-1))*barMarge,barH);
          ctx.restore();

        }
        return {
          lvl: bar,
          update: level,
          tank: 0,
          score: 0,
          can: can
        };
      })();
      this.UP = (()=>{
        let can = document.createElement('CANVAS');
        let ctx = can.getContext('2d');
        let R = CONST.RESOLUTION*CONST.OFFCAN;
        let W = 38;
        let h = 18;
        let marge = 5;
        let lw = 8;
        let plusRad = 15;
        let r = 9;
        ///
        var STATES;
        var NB;
        var LOGO;
        var CLASS = 0;
        ///
        function drawAll(tankClass,states,max = 6){
          if(tankClass == CLASS){
            return;
          }
          CLASS = tankClass
          STATES = {up:[],max:max};
          let w = max*(W+marge);
          can.height = ((plusRad*2+lw*2+4)*states.length)+20+18+6*4;
          can.height *= R;
          can.width  = w+plusRad*2+lw*2+4;
          can.width *= R;
          ///
          ctx.scale(R,R);
          ctx.lineJoin = 'round';
          ctx.strokeStyle = '#222222';
          ctx.fillStyle = '#fcfcfc';
          let offy = 6;
          ctx.font = '700 26px Catamaran';
          ctx.lineWidth = 4.5;
          ctx.textBaseline = 'middle';
          let logom = ctx.measureText('Enhance').width
          ctx.strokeText('Enhance',can.width/2/R-logom/2,offy+13);
          ctx.fillText('Enhance',can.width/2/R-logom/2,offy+13);
          offy += 20+6;
          LOGO = {
            sx:0,
            sy:0,
            sw:can.width,
            sh:offy*R
          };
          ///
          NB = {
            sx:0,
            sy:offy*R,
            sw:can.width,
            sh:(6+15+6)*R,
            nb: 0
          };
          setNb(0);
          offy += 18+6+6;
          offy *= R;
          let PLUSONE = 0;
          if(states.length%2){PLUSONE = 1;}
          ///
          for(let i = 0; i < states.length-PLUSONE; i++){
            STATES.up.push({
              x:(i%2 ? plusRad+lw+2 : w+plusRad+lw+2)*R,
              y:(plusRad*2+lw*2+4)/2*R,
              sx:0,
              sy:offy+((can.height-offy)/states.length)*i,
              sw:can.width,
              sh:(can.height-offy)/states.length,
              ismouse:0,
              isfull:0,
              nb:0,
              odd:i%2,
              name:states[i]
            });
            redraw(i,0,0);
          }
        };
        function redraw(state,nb,isMouse,colored = 1){
          let data = STATES.up[state]
          if(!data){return;}
          if(data.isfull && nb>=STATES.max){return;}
          if(isMouse == data.isMouse && data.nb == Math.min(nb,STATES.max) && data.isfull  == ((data.nb == STATES.max) || !colored)){return;}
          data.isMouse = isMouse;
          data.nb      = Math.min(nb,STATES.max);
          data.isfull  = (data.nb == STATES.max) || !colored;
          let w = STATES.max*(W+marge);
          ///
          ctx.setTransform(R,0,0,R,data.sx,data.sy);
          ctx.clearRect(0,0,data.sw/R,data.sh/R)
          ctx.translate(lw+2,lw+2);
          ctx.textBaseline = 'middle';
          ///
          if(data.odd){
            //right
            ///BACK
              ctx.fillStyle = ctx.strokeStyle = '#222222';
              ctx.lineWidth = lw;
              ctx.beginPath();
              roundRect(ctx,plusRad*2-r-2,plusRad-h/2,w,h,r);
              ctx.closePath();
              ctx.fill();ctx.stroke();
              /////
              ctx.fillStyle = C.up[state];
              for(let i = 0; i<data.nb; i++){
                ctx.beginPath();
                roundRect(ctx,plusRad*2-r + (W+marge)*i,plusRad-h/2  , W, h,r);
                ctx.closePath();
                ctx.fill();
              }
              /////
              let plusC = data.isfull ? '#a8a8a8' : isMouse ? General.color.shade(C.up[state],1.4) : C.up[state];
              ctx.beginPath();
              ctx.arc(plusRad,plusRad,plusRad,0,Math.PI*2);
              ctx.closePath();
              ctx.lineWidth = lw;
              ctx.fill();ctx.stroke();
              ctx.fillStyle = plusC;
              ctx.fill();
              /// + ///
              ctx.font = '700 40px Catamaran';
              ctx.fillStyle = General.color.shade(plusC,data.isfull ? 1.4 : 1.8);
              ctx.fillText('+',plusRad-11,plusRad);
            ///front///

            /// text ///
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#222222';
            ctx.font = '700 18px Catamaran';
            ctx.fillStyle = '#fcfcfc';
            let tw = ctx.measureText(data.name).width
            ctx.strokeText(data.name,w/2-tw/2+plusRad,plusRad);
            ctx.fillText(data.name,w/2-tw/2+plusRad,plusRad);
            ///
          } else {
            //left
            ///BACK
            ctx.fillStyle = ctx.strokeStyle = '#222222';
            ctx.lineWidth = lw;
            ctx.beginPath();
            roundRect(ctx,r+2,plusRad-h/2,w,h,r);
            ctx.closePath();
            ctx.fill();ctx.stroke();
            ///
            ctx.fillStyle = C.up[state];
            for(let i = 0; i<data.nb; i++){
              ctx.beginPath();
              roundRect(ctx,w+plusRad-2 - (W+marge)*(i+1),plusRad-h/2  , W, h,r);
              ctx.closePath();
              ctx.fill();
            }
            ///
            let plusC = data.isfull ? '#a8a8a8' : isMouse ? General.color.shade(C.up[state],1.6) : C.up[state];
            ctx.beginPath();
            ctx.arc(w+plusRad,plusRad,plusRad,0,Math.PI*2);
            ctx.closePath();
            ctx.lineWidth = lw;
            ctx.fill();ctx.stroke();
            ctx.fillStyle = plusC;
            ctx.fill();
            /// + ///
            ctx.font = '700 40px Catamaran';
            ctx.fillStyle = General.color.shade(plusC,1.8);
            ctx.fillText('+',w+plusRad-11,plusRad);
            ///
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#222222';
            ctx.font = '700 18px Catamaran';
            ctx.fillStyle = '#fcfcfc';
            let tw = ctx.measureText(data.name).width
            ctx.strokeText(data.name,r+2+w/2-tw/2,plusRad);
            ctx.fillText(data.name,r+2+w/2-tw/2,plusRad);
          }
          ctx.translate(0,plusRad*2+lw*2+4);
        };
        function setNb(nb){
          if(NB.nb == nb){return;}
          NB.nb = nb;
          ctx.setTransform(1,0,0,1,NB.sx,NB.sy);
          ctx.clearRect(0,0,NB.sw,NB.sh);
          ctx.scale(R,R);
          ctx.strokeStyle = '#222222';
          ctx.fillStyle = '#fcfcfc';
          ctx.font = '700 20px Catamaran';
          ctx.textBaseline = 'middle';
          ctx.lineWidth = 3.5;
          let nbm = ctx.measureText('x'+nb).width;
          ctx.beginPath();
          roundRect(ctx,NB.sw/2/R-nbm/2-5,2,nbm+10,24,4);
          ctx.closePath();
          ctx.fillStyle = '#222222';
          ctx.fill();
          //ctx.strokeText('x'+nb,NB.sw/2/R-nbm/2,6);
          ctx.fillStyle = '#fcfcfc';
          ctx.fillText('x'+nb,NB.sw/2/R-nbm/2,15);
        }
        ///

        drawAll(
          'Basic',
          ['Health Regen',
          'Reload',
          'Max Health',
          'Bullet Speed',
          'Movement Speed',
          'Bullet Damage',
          'Body Damage',
          'Bullet Penetration'],6);
        ///
        return {
          can: can,
          logo:LOGO,
          nb:NB,
          setNb: setNb,
          up: STATES.up,
          redraw: redraw,
          init: drawAll,
          show: 0,
          isShowing: 0,
          isMouse:   0,
          speed: .03
        }
      })();
      this.TNK = (()=>{
        let ALL = {
          actual: [],
          show: 0,
          dshow: 0,
          mDown: -50*CONST.RESOLUTION,
          mRight: -60*CONST.RESOLUTION,
          class: 0,
          classLvl:  0,
          choices: [],
          actualClass: 0
        };
        let R = CONST.RESOLUTION*CONST.OFFCAN;
        let size = 100;
        let tankS = 1.6;
        let lw    = 4.5;
        let inLw  = 9;
        let round = 4;
        let fnt = 18;
        {
          let thislw = 4.5;
          ALL.logo = document.createElement('CANVAS');
          let ctx = ALL.logo.getContext('2d');
          ctx.font = '700 30px Catamaran';
          let m = ctx.measureText('Upgrade').width;
          ALL.logo.width = (m+thislw*2)*R;
          ALL.logo.height = (30+18+thislw*4)*R;
          ctx.setTransform(R,0,0,R,ALL.logo.width/2,0);
          ctx.font = '700 30px Catamaran';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#f4f4f4';
          ctx.lineWidth = thislw;
          ctx.lineJoin = 'round';
          ctx.strokeStyle = '#222222';
          ctx.strokeText('Upgrade',-m/2,thislw+15);
          ctx.fillText('Upgrade',-m/2,thislw+15);
          ctx.translate(0,30+thislw);
          ctx.font = '700 18px Catamaran';
          ctx.fillStyle = '#222222';
          m = ctx.measureText('hide').width;
          ctx.beginPath();
          roundRect(ctx,-m/2-thislw,thislw,m+thislw*2,18+thislw,3);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#f4f4f4';
          ctx.fillText('hide',-m/2,thislw+3+18/2)
          ALL.hideWidth = (m+thislw+thislw)*R;
          ALL.hideHeight = (15+thislw*2)*R
        }
        ///
        function mouseOn(c,is){
          if(ALL.Class[c].is != is){
            ALL.Class[c].is = is;
            let ctx = ALL.Class[c].can.getContext('2d');
            ctx.setTransform(R,0,0,R,0,0);
            ctx.translate(2+lw,2+lw);
            ctx.beginPath();
            roundRect(ctx,0,0,size,size,round);
            ctx.closePath();
            ctx.fillStyle = is ? General.color.shade(C.class[ALL.Class[c].id],1.3) : C.class[ALL.Class[c].id];
            ctx.fill();
            ctx.lineJoin = 'round';
            ctx.lineWidth = lw;
            ctx.strokeStyle = General.color.shade(ctx.fillStyle,0.6);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(size/2,size/2,size/2-lw/2,0,Math.PI*2);
            ctx.closePath();
            ctx.fillStyle = General.color.shade(ctx.fillStyle,1.1);
            ctx.fill();
            ctx.translate(0,size+lw+2);
          }
        }
        function setClass(classes){
          let same = 1;
          if(classes.length == ALL.actual.length){
            for(let i in classes){
              if(ALL.actual[i] != classes[i]){
                same = 0;
                break;
              }
            }
          } else {
            same = 0;
          }
          if(same){return;}
          ALL.actual = classes;
          ALL.Class = {};
          ALL.size = (size+4+lw*2)*R;
          for(let i in classes){
            let n = classes[i];
            let tank = {
              id: i
            };
            ALL.Class[n] = tank;
            let can = document.createElement('CANVAS');
            let ctx = can.getContext('2d');
            tank.can = can;
            tank.img = document.createElement('CANVAS');
            can.width = size+4+lw*2;
            can.width *= R;
            can.height = can.width*2+2+fnt+2;
            can.height *= R;
            tank.img.width = tank.img.height = (size+lw*2+4)*R;
            ///BACKGROUND
            {
              mouseOn(n,0);
            }
            ///TANK
            {
              ctx.save();
              ctx.translate(0,2+lw);
              ctx.beginPath();
              ctx.rect(0,0,size,size);
              ctx.closePath();
              ctx.clip();
              let img = General['drawTank'](ctx,0,
                {
                 class: classes[i],
                 tankC: C.green,
                 canC: C.gray,
                 size: 28,
                 dir: 0,
                 recoils: [],
                 canDir: []
               }
              );
              ctx.drawImage(
                img.can,
                size/2-img.can.width/2/tankS-img.mX/tankS,
                size/2-img.can.height/2/tankS-img.mY/tankS,
                img.can.width/tankS,
                img.can.height/tankS
              );
              ctx.restore();
              ctx.translate(0,size+lw+2);
            }
            ///NAME
            {
              ctx.translate(0,2+lw+2);
              ctx.font = `700 ${fnt}px Catamaran`;
              ctx.textBaseline = 'middle';
              ctx.lineWidth = 3.5;
              let m = ctx.measureText(n).width;
              ctx.fillStyle = '#f4f4f4';
              ctx.strokeStyle = '#222222';
              ctx.strokeText(n,size/2-m/2,fnt/2);
              ctx.fillText(n,size/2-m/2,fnt/2);
            }
            ALL.Class[n] = tank;
          }
        };
        function getImage(c){
          let tank = ALL.Class[c]
          let ctx = tank.img.getContext('2d');
          ctx.clearRect(0,0,tank.img.width,tank.img.height);
          //ctx.strokeRect(0,0,tank.img.width,tank.img.height);
          ctx.drawImage(
            tank.can,
            0,0,
            tank.can.width,tank.can.width,
            0,0,
            tank.can.width,tank.can.width,
          );
          ///
          ctx.save();
          ctx.translate(tank.can.width/2,tank.can.width/2);
          ctx.rotate(Game.timestamp/130);
          ctx.drawImage(
            tank.can,
            0,tank.can.width,
            tank.can.width,tank.can.width,
            -tank.can.width/2,-tank.can.width/2,
            tank.can.width,tank.can.width
          );
          ctx.restore();
          ///
          ctx.drawImage(
            tank.can,
            0,tank.can.width*2,
            tank.can.width,tank.can.height-tank.can.width*2,
            0,tank.can.width-(2+lw+fnt)*R-6,
            tank.can.width,tank.can.height-tank.can.width*2,
          );
          return tank.img;
        }
        ///
        ALL.getImage = getImage;
        ALL.mouseOn  = mouseOn;
        ALL.setClass = setClass;
        ///
        setClass(['Cyclone','Basic','Sniper']);
        ///
        return ALL;
      })();
      this.LB = (()=>{
        let can = document.createElement('CANVAS');
        let ctx = can.getContext('2d');
        let R = CONST.RESOLUTION*CONST.OFFCAN;
        let w = 240;
        let h = 16;
        let lw = 5;
        let marge = 16;
        let ext = [
          '',
          'k',
          'M',
          'Md'
        ];
        let textS = 18;
        let font = '700 '+textS+'px Catamaran';
        let logo = 30;
        ///
        can.width = (lw+w)*R+4;
        can.height = (logo+marge+(marge+h)*10)*R+4;
        {
          ctx.setTransform(R,0,0,R,can.width/2,2);
          ctx.font = '700 '+logo+'px Catamaran';
          let m = ctx.measureText('Leaderboard').width;
          ctx.textBaseline = 'middle';
          ctx.lineWidth = 4.5;
          ctx.fillStyle = '#f4f4f4';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = '#222222';
          ctx.strokeText('Leaderboard',-m/2,logo/2);
          ctx.fillText('Leaderboard',-m/2,logo/2);
        }
        ///
        var ALL = {
          leads: {}
        }
        ///
        function draw(all){
          ctx.setTransform(R,0,0,R,2,2)
          ctx.translate(lw/2,logo-marge);
          ctx.clearRect(-lw,marge,can.width,can.height);
          for(let i in all){
            let one = all[i];
            let zeros = one.xp ? parseInt(Math.log10(one.xp)/3) : 0;
            let text = one.name+' - '+parseInt(one.xp/Math.pow(10,zeros*3)*10)/10+' '+ext[zeros];
            if(!ALL.leads[text]){
              ALL.leads[text] = addText(text);
            } else {
              ALL.leads[text].last = 2;
            };
            ///
            ctx.translate(0,h+marge);
            ctx.beginPath();
            roundRect(ctx,0,0,w,h,h/2+1);
            ctx.closePath();
            ctx.fillStyle = ctx.strokeStyle = '#181818';
            ctx.lineWidth = lw;
            ctx.fill();
            ctx.stroke();
            ///
            ctx.beginPath();
            roundRect(ctx,0,0,h+(w-h)*((one.xp+1)/(all[0].xp+1)),h,h/2+1);
            ctx.closePath();
            ctx.fillStyle  = C[one.team][0];
            ctx.fill();
            ///
            ctx.drawImage(ALL.leads[text].can,0,-3,ALL.leads[text].can.width/R,ALL.leads[text].can.height/R);
          };
          ///
          for(let i in ALL.leads){
            if(ALL.leads[i].last){
              ALL.leads[i].last--;
            } else {
              delete ALL.leads[i];
            }
          }
        };
        function addText(text){
          let can = document.createElement('CANVAS');
          let ctx = can.getContext('2d');
          can.height = (textS+lw)*R;
          can.width  = (w+lw)*R;
          ///
          ctx.scale(R,R);
          ctx.translate(lw/2,lw/2);
          ctx.font = font;
          ctx.textBaseline = 'middle';
          ctx.lineJoin = 'round';
          ctx.lineWidth = 3.5;
          ctx.fillStyle = '#f4f4f4';
          ctx.strokeStyle = '#222222';
          let m = ctx.measureText(text).width;
          if(m>=w){
            ctx.translate(w-m,0);
          } else {
            ctx.translate(w/2-m/2,0);
          }
          ctx.strokeText(text,0,textS/2);
          ctx.fillText(text,0,textS/2);
          ///
          return {
            can: can,
            last: 2
          };
        }
        //draw([]);
        ///
        return {
          set: draw,
          can: can
        };
      })();
      this.END = (()=>{
        ///
        let xpS = 50;
        let nameS = 22;
        let marge = 30;
        let lw = 6;
        let fill = '#f0f0f0';
        let stroke = '#333333';
        let is = 0;
        let ALL = {
          offy: 0
        };
        ///
        function set(dead,name,xp,tank){
          if(dead && !is){
            is = dead;
            ALL.title = setTitle(name,xp);
            ALL.tank = setTank(tank);
          } else if(Math.abs(dead-ALL.offy)>0.01){
            ALL.offy += (dead-ALL.offy)*((dead<ALL.offy) ? 0.1 : 0.03);
          } else {
            is = dead;
            ALL.offy = dead;
          }
        };
        function setTitle(name,xp){
          let can = document.createElement('CANVAS');
          let ctx = can.getContext('2d');
          let R = CONST.RESOLUTION*CONST.OFFCAN;
          let font = '700 '
          let text = 'score: '+xp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          ctx.font = '700 '+xpS+'px Catamaran';
          let m = ctx.measureText(text).width;
          can.width = m*R+lw*R+4;
          can.height = (xpS + nameS*2)*R+4;
          ///
          ctx.setTransform(R,0,0,R,can.width/2,0);
          ctx.font = '700 '+xpS+'px Catamaran';
          ctx.textBaseline = 'middle';
          ctx.lineJoin = 'round';
          ctx.lineWidth = lw;
          ctx.fillStyle = fill;
          ctx.strokeStyle = stroke;
          ctx.strokeText(text,-m/2,nameS*2+xpS/2);
          ctx.fillText(text,-m/2,nameS*2+xpS/2);
          ///
          ctx.font = '700 '+nameS+'px Catamaran';
          m = ctx.measureText(name).width;
          ctx.lineWidth = 3.5;
          ctx.strokeText(name,-m/2,nameS);
          ctx.fillText(name,-m/2,nameS);
          ///
          return can;
        };
        function setTank(tank){
          let can = document.createElement('CANVAS');
          let ctx = can.getContext('2d');
          let R = CONST.RESOLUTION*CONST.OFFCAN;
          let img = General['drawTank'](ctx,0,
            {
             class: tank,
             tankC: C.green,
             canC: C.gray,
             size: 35,
             dir: 0,
             recoils: [],
             canDir: []
           }
          );
          can.width = img.can.width;
          can.height = img.can.height;
          ctx.save();
          ctx.translate(img.can.width/2-img.mX,img.can.height/2-img.mY);
          ctx.rotate(-Math.PI/8);
          ctx.drawImage(img.can,-img.can.width/2,-img.can.height/2);
          ctx.restore();
          ///
          ctx.font = '700 '+parseInt(20*R)+'px Catamaran';
          m = ctx.measureText(tank).width;
          ctx.textBaseline = 'middle';
          ctx.lineJoin = 'round';
          ctx.lineWidth = 4;
          ctx.fillStyle = fill;
          ctx.strokeStyle = stroke;
          ctx.strokeText(tank,img.can.width/2-m/2,img.can.height-parseInt(20*R)/2);
          ctx.fillText(tank,img.can.width/2-m/2,img.can.height-parseInt(20*R)/2);
          return can;
        };
        function setEnter(){
          let can = document.createElement('CANVAS');
          let ctx = can.getContext('2d');
          let R = CONST.RESOLUTION*CONST.OFFCAN;
          let text = 'Press enter to respawn.';
          ctx.font = '700 '+nameS+'px Catamaran';
          let m = ctx.measureText(text).width;
          can.width = (m+lw)*R+4;
          can.height = (nameS+lw)*R+4;
          ///
          ctx.setTransform(R,0,0,R,can.width/2,0);
          ctx.font = '700 '+nameS+'px Catamaran';
          ctx.textBaseline = 'middle';
          ctx.lineJoin = 'round';
          ctx.lineWidth = 3;
          ctx.fillStyle = fill;
          ctx.strokeStyle = stroke;
          ctx.strokeText(text,-m/2,nameS/2);
          ctx.fillText(text,-m/2,nameS/2);
          return can;
        };
        ALL.set = set;
        ALL.enter = setEnter();
        console.log(ALL.enter);
        ///
        return ALL;
      })()
      this.MES = (()=>{
        let R = CONST.RESOLUTION*CONST.OFFCAN;
        let M = [
        ];
        let startA = 6;
        let dimA   = .02;
        let fSize = 25;
        let mH = 25;
        let mV = 4;
        let font = '600 '+fSize+'px Catamaran';
        function add(message){
          for(let mes of message){
            if(mes[0] == '/' && mes[1] == 'i' && mes[2] == 'm' && mes[3] == 'g'){
              mes = mes.split(' ');
              var _img = document.createElement('IMG');
              var newImg = new Image;
              newImg.onload = function(){
                  _img.src = this.src;
                  console.log(123);
                  M.unshift({
                    can:_img,
                    a: startA,
                    da: 0.02,
                    img: 1
                  });
              }
              newImg.src = './pic/img_mess/'+mes[1];
              continue;
            }
            let can = document.createElement('CANVAS');
            let ctx = can.getContext('2d');
            ctx.font = font;
            let m = ctx.measureText(mes).width;
            can.width = (m+mH)*R;
            can.height = (fSize+mV*2)*R;
            ////
            ctx.fillStyle = '#000000';
            ctx.fillRect(0,0,can.width,can.height);
            ctx.setTransform(R,0,0,R,can.width/2,mV*R);
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff';
            ctx.font = font;
            ctx.fillText(mes,-m/2,fSize/2);
            ////
            M.unshift({
              can:can,
              a: startA,
              da: 0.02
            })
          }
        }
        add(['set']);
        M[0].a = 0.1;
        function update(){
          for(let i in M){
            M[i].da += (Math.min(1,M[i].a)-M[i].da)*0.1;
            if(M[i].da<0.01){
              M.splice(i,1);
              continue;
            }
            M[i].a -= dimA;
          }
        }
        return {
          mes: M,
          update: update,
          add: add
        };
      })();
      /////
      this.map         = function(){
        ctx.setTransform(UIRATIO,0 ,0 ,UIRATIO, Global.canW,0);
        ctx.translate(-15,15);
        ctx.scale(1/CONST.OFFCAN/CONST.RESOLUTION,1/CONST.OFFCAN/CONST.RESOLUTION);
        ctx.drawImage(this.MAP.can,-this.MAP.can.width+2,-2);

        ctx.translate(-this.MAP.lw,this.MAP.lw)
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#222222';
        ctx.scale(CONST.OFFCAN*CONST.RESOLUTION,CONST.OFFCAN*CONST.RESOLUTION);
        ctx.beginPath();
        ctx.arc(-this.MAP.size/2+(User.x/Game.width)*this.MAP.size,
                 this.MAP.size/2+(User.y/Game.height)*this.MAP.size, this.MAP.cursSize, 0, Math.PI*2)
        ctx.closePath();
        ctx.fill();
      };
      this.states      = function(){
        this.dlvl += (this.lvl-this.dlvl)*0.05;
        ///
        if(this.ST.tank != User.class || this.ST.score != this.xp || this.dlvl!=this.ST.dlvl){
          this.ST.tank = User.class;
          this.ST.score = this.xp;
          this.ST.dlvl = this.dlvl;
          this.ST.update(User.class,this.xp,this.dlvl%10+0.1);
        }
        ctx.save();
        ctx.setTransform(UIRATIO,0 ,0 ,UIRATIO, Global.canW/2, Global.canH);
        ctx.scale(1/CONST.OFFCAN/CONST.RESOLUTION,1/CONST.OFFCAN/CONST.RESOLUTION)
        ctx.drawImage(this.ST.can,-this.ST.can.width/2,-this.ST.can.height-18);
        ctx.restore();
        //ctx.globalAlpha = 1;
      };
      this.upgrade     = function(){
        if(!this.still){
          this.UP.isShowing = 0;
        } else {
          this.UP.setNb(this.still);
        }
        ///
        if(this.UP.isShowing || Global.inputs.u || parseInt(this.END.offy+.1)){
          this.UP.show = Math.min(this.dead ? 1 : 1.8,this.UP.show+(this.dead ? this.UP.speed*.6 : this.UP.speed));
        } else {
          this.UP.show = Math.max(0,this.UP.show-this.UP.speed);
        }
        if(!this.still && !Global.inputs.u && !this.UP.show && !parseInt(this.END.offy+.1)){return;}
        ///
        this.UP.init(User.class,CLASS[User.class].ups ? CLASS[User.class].ups : TanksConfig.defaultUps,6);
        ///
        let SHOW = Math.min(General['ease-in-out'](this.UP.show,3),1);
        let ALPHA = ctx.globalAlpha;
        ctx.setTransform(UIRATIO,0,0,UIRATIO,Global.canW/2+User.predic.x,Global.canH/2+User.predic.y);
        ctx.scale(1/CONST.OFFCAN/CONST.RESOLUTION,1/CONST.OFFCAN/CONST.RESOLUTION)
        ///
        if(SHOW){
          ctx.globalAlpha = ALPHA*SHOW;
          let n = 0;
          let dis = Math.PI/this.UP.up.length*1;
          if(this.still){
            ctx.drawImage(this.UP.can,
              this.UP.logo.sx,//sx
              this.UP.logo.sy,//sy
              this.UP.logo.sw,//sw
              this.UP.logo.sh,//sh
              -this.UP.logo.sw/2,
              -this.UP.logo.sh/2-92*SHOW*CONST.RESOLUTION*CONST.RESOLUTION*CONST.OFFCAN,
              this.UP.logo.sw,//w
              this.UP.logo.sh,//h
            );
          }
          for(let i in this.UP.up){
            let up = this.UP.up[i];
            if(!up.odd){n++;}
            let angle = (-dis*this.UP.up.length/Math.PI)+(n*dis*SHOW)
            let offx = Math.cos(angle)*120*CONST.RESOLUTION*CONST.OFFCAN;
            let offy = Math.sin(angle)*120*CONST.RESOLUTION*CONST.OFFCAN;
            let j = General.isMouseCirc(
              (Global.canW/2+User.predic.x+(up.odd ? offx : -offx)/CONST.OFFCAN/CONST.RESOLUTION*UIRATIO)/CONST.RESOLUTION,
              (Global.canH/2+User.predic.y+offy/CONST.OFFCAN*UIRATIO/CONST.RESOLUTION)/CONST.RESOLUTION,
              12*UIRATIO
            );
            if(j){Global.mouse_out = CONST.MOUSE_OUT;}
            if(j && Global.inputs.mouseL){
              if(!up.press){
                console.log(i,CONST.UP_ORDER[i]);
                General['WS'].send(PROTO.encode('upgrade',CONST.UP_ORDER[i]));
                up.press = 1;
              }
            } else {
              if(!Global.inputs.mouseL){
                up.press = 0;
              } else {
                up.press = 1;
              }
            }
            this.UP.redraw(i,this.upNb[CONST.UP_ORDER[i]],j,this.still)
            ctx.drawImage(this.UP.can,
              up.sx,//sx
              up.sy,//sy
              up.sw,//sw
              up.sh,//sh
              (up.odd ? offx*SHOW : -offx*SHOW) -up.x,//x
              offy*SHOW -up.y,//y
              up.sw,//w
              up.sh,//h
            );
          }
        }
        ///
        if(this.still){
          ctx.globalAlpha = ALPHA;
          ctx.drawImage(this.UP.can,
            this.UP.nb.sx,//sx
            this.UP.nb.sy,//sy
            this.UP.nb.sw,//sw
            this.UP.nb.sh,//sh
            0-this.UP.nb.sw/2,//x
            Math.sin(Game.timestamp/18)*2-this.UP.nb.sh/2-45*RATIO*CONST.RESOLUTION*CONST.RESOLUTION*CONST.OFFCAN/UIRATIO,//y
            this.UP.nb.sw,//w
            this.UP.nb.sh,//h
          );
          let j = General.isMouseCirc(
            (Global.canW/2+User.predic.x)/CONST.RESOLUTION,
            (Global.canH/2+User.predic.y)/CONST.RESOLUTION-45*RATIO,
            15*UIRATIO
          );
          if(j){
            Global.mouse_out = CONST.MOUSE_OUT;
          }
          if((j && Global.inputs.mouseL) || Global.inputs.u){
            this.UP.isShowing = 1;
          }
          j = General.isMouseCirc(
            (Global.canW/2)/CONST.RESOLUTION,
            (Global.canH/2)/CONST.RESOLUTION,
            125*UIRATIO
          );
          if(Global.inputs.mouseL && !j){
            this.UP.isShowing = 0;
            if(this.UP.show>1){this.UP.show = 1;}
          }
        }
      };
      this.tanks       = function(){
        if((this.classLvl != this.TNK.classLvl || User.class != this.TNK.class)){
          this.TNK.classLvl = this.classLvl;
          this.TNK.class = User.class;
          this.TNK.tochoices = [];
          for(let i = 0; i < this.classLvl; i++){
            if(CLASS_TREE[i][User.class]){
              this.TNK.tochoices = this.TNK.tochoices.concat(CLASS_TREE[i][User.class]);
            }
          }
          this.TNK.show = -.5;
          this.TNK.hide = 0;
        }
        ///
        let reverse = 1/UIRATIO*CONST.OFFCAN*CONST.RESOLUTION*CONST.RESOLUTION;
        if(this.TNK.hide){
          this.TNK.show = -.5;
          let isIn = (General['isMouse'](
            (Global.winW)-(30)/reverse,
            (Global.winH)-(-this.TNK.mDown+this.TNK.size*this.TNK.choices.length)/reverse,
            (30)/reverse,
            (-this.TNK.mDown+this.TNK.size*this.TNK.choices.length)/reverse,
          ));
          if(isIn){this.TNK.show = 1; this.TNK.hide = 0}
        } else {
          let isIn = (General['isMouse'](
            (Global.winW)-(-this.TNK.mRight+this.TNK.size/2+this.TNK.hideWidth/2)/reverse,
            (Global.winH)-(this.TNK.size/2+15*reverse+this.TNK.hideHeight+this.TNK.mDown+(this.TNK.size+2)*this.TNK.choices.length)/reverse,
            (this.TNK.hideWidth)/reverse,
            (this.TNK.hideHeight)/reverse,
          ));
          if(isIn){
            Global.mouse_out = CONST.MOUSE_OUT;
          };
          if(isIn && Global.inputs.mouseL && !Global.inputs.old.mouseL){
            this.TNK.hide = 1;
          }
        }
        ///
        if(this.TNK.dshow<0.01 && this.TNK.show<=0){
          this.TNK.dshow = 0;
          this.TNK.choices = this.TNK.tochoices;
          this.TNK.setClass(this.TNK.choices);
          if(this.TNK.choices.length){
            this.TNK.show = 1;
          } else {
            this.TNK.show = -.5;
          }
          return;
        }
        if(!this.TNK.tochoices.length){
          this.TNK.show = -.5;
        }
        ctx.setTransform(UIRATIO,0 ,0 ,UIRATIO, Global.canW, Global.canH);
        ctx.scale(1/CONST.OFFCAN/CONST.RESOLUTION,1/CONST.OFFCAN/CONST.RESOLUTION);
        this.TNK.dshow += (this.TNK.show-this.TNK.dshow)*0.05;
        for(let i in this.TNK.choices){
          let n = this.TNK.choices[i];
          let c = this.TNK.getImage(n);
          var gw = c.width;
          let isIn = (General['isMouse'](
            (Global.winW)-(-this.TNK.mRight+c.width-5)/reverse,
            (Global.winH)-(-this.TNK.mDown+(c.height*(parseInt(i)+1)-5))/reverse,
            (c.width-20)/reverse,
            (c.height-20)/reverse,
          ) && this.TNK.show>0 && this.TNK.dshow>.8);
          if(isIn){
            Global.mouse_out = CONST.MOUSE_OUT;
            if(Global.inputs.mouseL && !Global.inputs.old.mouseL){
              this.TNK.show = -.5;
              General['WS'].send(PROTO.encode('upClass',n));
            }
          }
          this.TNK.mouseOn(n,isIn);
          ctx.drawImage(c,20+(this.TNK.mRight-c.width-20)*this.TNK.dshow,this.TNK.mDown-(c.height+2)*(parseInt(i)+1));
        };
        ctx.globalAlpha = 0.7;
        ctx.drawImage(this.TNK.logo,
          20+(this.TNK.mRight-gw/2-this.TNK.logo.width/2-20)*this.TNK.dshow,
          -gw/2-15*reverse-this.TNK.logo.height-this.TNK.mDown-(gw+2)*this.TNK.choices.length
        )
      };
      this.leaderboard = function(){
        ctx.setTransform(UIRATIO,0 ,0 ,UIRATIO,0,0);
        ctx.scale(1/CONST.OFFCAN/CONST.RESOLUTION,1/CONST.OFFCAN/CONST.RESOLUTION);
        if(this.isReady){
          this.LB.set(this.leaderInfo);
        }
        ctx.drawImage(this.LB.can,55*CONST.RESOLUTION,25*CONST.RESOLUTION);
      };
      this.messages    = function(){
        ctx.setTransform(UIRATIO,0 ,0 ,UIRATIO,Global.canW/2,25*CONST.RESOLUTION);
        ctx.scale(1/CONST.OFFCAN/CONST.RESOLUTION,1/CONST.OFFCAN/CONST.RESOLUTION);
        this.MES.update();
        let offy = 0;
        let a = ctx.globalAlpha;
        for(let m of this.MES.mes){
          if(m.img){
            ctx.globalAlpha = m.da;
            ctx.save();
            ctx.scale(CONST.RESOLUTION,CONST.RESOLUTION);
            let mot = m.a > 1 ? m.da : 1;
            ctx.drawImage(m.can,-m.can.width/2*mot,offy,m.can.width*mot,m.can.height*mot);
            offy += (m.a>1) ? ((m.can.height+10)*m.da)*CONST.RESOLUTION : (m.can.height+10)*CONST.RESOLUTION;
            ctx.globalAlpha = a;
            ctx.restore();
            continue;
          }
          ctx.globalAlpha *= m.da;
          let mot = m.a > 1 ? m.da : 1;
          ctx.drawImage(m.can,-m.can.width/2*mot,offy,m.can.width*mot,m.can.height*mot);
          offy += (m.a>1) ? (m.can.height+10)*m.da : m.can.height+10;
          ctx.globalAlpha = a;
        }
      };
      this.endScreen   = function(){
        this.END.set(this.dead,User.name,this.xp,User.class);
        if(this.END.offy){
          let invert = 1-this.END.offy
          ctx.setTransform(1,0,0,1,0,0);
          ctx.globalAlpha = this.END.offy;
          ctx.fillStyle = 'rgba(0,0,10,0.3)';
          ctx.fillRect(0,0,Global.canW,Global.canH);
          ctx.setTransform(UIRATIO,0 ,0 ,UIRATIO,Global.canW/2,Global.canH/2);
          ctx.scale(1/CONST.OFFCAN/CONST.RESOLUTION,1/CONST.OFFCAN/CONST.RESOLUTION);
          ctx.drawImage(this.END.title,-this.END.title.width/2,-this.END.title.height-this.END.tank.height*.8-200*invert);
          ctx.drawImage(this.END.tank,-this.END.tank.width,this.END.tank.height/2-200*invert);
          ctx.drawImage(this.END.enter,0,this.END.tank.height-this.END.enter.height/4-200*invert)
        }
      };
      ///
      this.draw = function(){
        ctx.globalAlpha = 0.25;
        this.map();
        ctx.globalAlpha = 0.7;
        this.states();
        ctx.globalAlpha = 0.8
        this.tanks();
        ctx.globalAlpha = 0.75
        this.leaderboard();
        ctx.globalAlpha = .4;
        this.messages();
        ///
        ctx.globalAlpha = .9;
        this.endScreen();
        ctx.globalAlpha = 0.7
        this.upgrade();
        this.isReady = 0;
      };
    };
    General['doors'] = new function(){
      this.close = 0;
      this.toClose = 1;
      this.update = function(){
        if(General.KICK){
          this.close = 1;
        } else {
          this.close = 0;
        }
        if(this.close == this.toClose){return;}
        this.toClose += (this.close-this.toClose)*0.04;
        if(this.toClose>.99){
          this.toClose = 1;
        }
        if(this.toClose<.001){
          this.toClose = 0;
        }
      }
      this.draw = function(){
        let Width = Global.winW*CONST.RESOLUTION;
        let Height = Global.winH*CONST.RESOLUTION;
        //////////////////////////////////////////
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(-50+this.toClose*(Width+60),0);
        ctx.lineTo(0,-60+this.toClose*(Height+72));
        ///
        ctx.moveTo(Width,Height);
        ctx.lineTo(Width+50-this.toClose*(Width+60),Height);
        ctx.lineTo(Width,Height+60-this.toClose*(Height+72));
        ///
        ctx.closePath();
        ctx.fillStyle = General.color.shade('#ffffff',1-(1-this.toClose)/10);
        ctx.fill();
      }
    };
    ///
    General['Interact'] = {
      onresize: ()=>{
        Global.winW = window.innerWidth;
        Global.winH = window.innerHeight;
        Global.canW = General['canvas'].width = Global.winW*CONST.RESOLUTION;
        Global.canH = General['canvas'].height = Global.winH*CONST.RESOLUTION;
        General['updateRatio']();
      },
      onmousemove: e => {
        Global.mouse_x = e.clientX;
        Global.mouse_y = e.clientY;
      },
      onmousedown: e => {
        let key = 0;
        switch(e.button){
          case 0:{
            key = 'mouseL';
            break;
          };
          case 2:{
            key = 'mouseR';
            break;
          }
        }
        if(!key || Global.inputs[key]){return};
        Global.inputs[key] = 1;
        if(Global.mouse_out){return;}
        General['WS'].send(PROTO.encode('keydown',key));
      },
      onmouseup: e => {
        let key = 0;
        switch(e.button){
          case 0:{
            key = 'mouseL';
            break;
          };
          case 2:{
            key = 'mouseR';
            break;
          }
        }
        if(!key || !Global.inputs[key]){return};
        Global.inputs[key] = 0;
        General['WS'].send(PROTO.encode('keyup',key));
      },
      onkeydown: e => {
        let key = e.key.toLowerCase();
        if(Global.inputs[key]){return};
        Global.inputs[key] = 1;
        switch(key){
          case 'q':{
            if(Global.inputs.shift && Global.inputs.control){
              General['CHAT'].toggle();
            }
            break;
          };
          case 'l':{
            if(Global.inputs.shift && Global.inputs.control){
              General['DEV'].toggle();
            }
            break;
          };
          case 'a':
          case 'w':
          case 's':
          case 'd':
          case 'e':
          case 'c':
          case 'arrowup':
          case 'arrowdown':
          case 'arrowleft':
          case 'arrowright':{
            General['WS'].send(PROTO.encode('keydown',key))
            break;
          };
        }
      },
      onkeyup: e => {
        let key = e.key.toLowerCase();
        if(!Global.inputs[key]){return;}
        Global.inputs[key] = 0;
        switch(key){
          case 'enter':{
            if(General['DEV'].isOn){
              General['DEV'].send();
            } else if(General['CHAT'].isOn){
              General['CHAT'].send();
            }
          }
          case 'a':
          case 'w':
          case 's':
          case 'd':
          case 'arrowup':
          case 'arrowdown':
          case 'arrowleft':
          case 'arrowright':{
            General['WS'].send(PROTO.encode('keyup',key))
            break;
          };
          case 'f':{
            console.log(Global.FPS);
            break;
          };
        }
      },
    };
    General.Interact.onresize();
    for(let i in General['Interact']){
      window[i] = General['Interact'][i];
    };
    ///
    function getFps(){
      Global.fps.push(1000/(-Global.oldfps+Global.newfps));
      if(Global.fps.length>50){
        Global.fps.splice(0,1);
      }
      let toshow = Global.fps.reduce(function(t,n){return t+n;})
      toshow /= Global.fps.length;
      Global.FPS = toshow;
    }
    function Draw(){
      ///
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0,0,Global.canW,Global.canH);
      General['background'](User.gx,User.gy,20);
      ///
      let sx = -User.gx*RATIO+(Global.canW/2), sy = -User.gy*RATIO+(Global.canH/2);
      for(let c in Instances){
        for(let i in Instances[c]){
          ///
          ctx.setTransform(RATIO, 0, 0, RATIO, sx, sy);
          ctx.globalAlpha = 1;
          ///
          Instances[c][i].draw(ctx);
        }
      }
      ///
      ctx.setTransform(RATIO, 0, 0, RATIO, sx, sy);
      ctx.globalAlpha = 1;
      User.draw();
      ///
      for(let c in Instances){
        for(let i in Instances[c]){
          if(Instances[c][i].drawUi){
            ctx.setTransform(RATIO,0,0,RATIO,sx,sy);
            Instances[c][i].drawUi(ctx);
          }
        }
      }
      ///
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      General.Ui.draw();
      ///
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = 1;
      General.doors.draw();
    }
    function Loop(){
      ///
      if(General['KICK']){
        if(General['doors'].toClose == 1){
          General['run'] = 0;
        }
      }
      Global.oldfps = Date.now();
      rnbcolor[0] = 'hsl('+(Game.timestamp*2)%360+',78%,56%)';
      rnbcolor[1] = 'hsl('+(Game.timestamp*2)%360+',50%,38%)';
      ///
      General['doors'].update();
      Game.screen += (Game.realScreen-Game.screen)*0.1;
      if(parseInt(Game.screen) != Game.realScreen){
        General['updateRatio']();
      }
      ///
      for(let c in Instances){
        for(let i in Instances[c]){
          Instances[c][i].update();
        }
      }
      ///
      User.update();
      if(Global.mouseDelay){
        Global.mouseDelay--;
      } else if(User.DIFFDIR){
        General['WS'].send(PROTO.encode('mousemove',{
          x: Math.min(.5,Math.max(-.5,((Global.mouse_x-User.dvx/CONST.SMOOTH-Global.winW/2))/(Game.screen)*CONST.RESOLUTION/RATIO)),
          y: Math.min(.5,Math.max(-.5,((Global.mouse_y-User.dvy/CONST.SMOOTH-Global.winH/2))/(Game.screen*0.5625)*CONST.RESOLUTION/RATIO)),
          dir: User.dir
        }))
        Global.mouseDelay = CONST.MOUSEDELAY;
        User.DIFFDIR = 0;
      } else {
        if(Global.mouse_x != Global.oldMouse_x || Global.mouse_y != Global.oldMouse_y){
          User.DIFFDIR = 1;
          Global.oldMouse_x = Global.mouse_x;
          Global.oldMouse_y = Global.mouse_y;
        }
      }
      ///
      Draw();
      ///
      Global.newfps = Date.now();
      getFps();
      if(!General['run']){
        preRun();
        return;
      }
      if(Global.inputs.old.mouseL != Global.inputs.mouseL){
        Global.inputs.old.mouseL = Global.inputs.mouseL;
      }
      requestAnimationFrame(Loop);
      ///
      if(Global.mouse_out){
        if(General['canvas'].style.cursor != 'pointer')
        {General['canvas'].style.cursor = 'pointer';}
        Global.mouse_out--;
      } else {
        if(General['canvas'].style.cursor != 'default')
        {General['canvas'].style.cursor = 'default';}
      }
    }
    General['run'] = 1;
    Loop();
    ///
    General['SetPacket'] = General['SetPacket'] || function(data){
      if(data.head.timestamp < Game.timestamp){
        return;
      }
      /// DELETE OLD DATA ///
      for( let C in Instances){
        for( let I in Instances[C]){
          if( typeof( data.Instances[C][I] ) === 'undefined' ){
            delete Instances[C][I];
          }
        }
      }
      /// SET DATA ///
      for(let THING in data){
        ///Head///
        if(THING == 'head'){
          Game.realScreen = data.head.screen;
          Game.timestamp = data.head.timestamp;
          Game.width     = data.head.width;
          Game.height    = data.head.height;
          if(General['Ui']){
            General['Ui'].xp = data.head.xp;
            General['Ui'].still = data.head.still;
            General['Ui'].classLvl = data.head.cLvl;
            General['Ui'].lvl    = data.head.level;
          }
         continue;
        }
        ///User///
        if(THING == 'User'){
          for(let param in data.User){
            switch(param){
              case 'states':{
                if(data.User[param][0]){
                  User.hit();
                }
                if(User.followDir && !data.User[param][1]){
                  User.DIFFDIR = 1;
                }
                User.followDir = data.User[param][1];
                ///
                if(General['Ui']){
                  General['Ui'].dead = data.User[param][2];
                }
                ///
                User.shield = data.User[param][3];
                break;
              };
              case 'recoil':{
                for(let i in data.User[param]){
                  if(data.User[param][i]){
                    User.shoot(i)
                  }
                }
                break;
              };
              case 'dir':   {
                User.realDir = data.User[param];
                break;
              };
              default: User[param] = data.User[param];break;
            }
          }
        }
        ///REST
        for(let CONSTRUC in data.Instances){
          for(let OBJ in data.Instances[CONSTRUC]){
            let obj = data.Instances[CONSTRUC][OBJ];
            let inst = Instances[CONSTRUC];
            /// NEW ///
            if ( typeof( inst[OBJ] ) === 'undefined' ){
              switch( CONSTRUC ){
                case 'Players':  inst[OBJ] = new Tank(obj.x,obj.y,obj.size,obj.color);inst[OBJ].bot = obj.states[7];break;
                case 'Objects': inst[OBJ] = new Obj(obj.x,obj.y,obj.size,obj.type);break;
                case 'Bullets':  inst[OBJ] = new Bullet(obj.x, obj.y, obj.size, obj.dir, obj.type, obj.color);break;

              }
            } else {
               for(let PARAM in obj){
                 switch( PARAM ){
                   case 'states':{
                     switch(CONSTRUC){
                       case 'Players':{
                         if(obj.states[0]) inst[OBJ].hit();
                         inst[OBJ].shield = obj.states[1];
                         inst[OBJ].bot = obj.states[6];
                         break;
                       }
                       case 'Objects':{
                        if(obj.states[0]) inst[OBJ].hit();
                        break;
                       }
                       case 'Bullets':{
                         inst[OBJ].pet = obj.states[0]
                         break;
                       }
                     }
                     break;
                   };
                   case 'recoil':{
                     for(let i in obj[PARAM]){
                       if(obj[PARAM][i]){
                         inst[OBJ].shoot(i)
                       }
                     }
                     break;
                   };
                   default: inst[OBJ][PARAM] = obj[PARAM];break;
                 }
               }
            }
          }
        }
      }
    }
    General['WS'].onmessage = packet => {
      let decoded = PROTO.decode(packet.data);
      let type = decoded.type;
      switch(type){
        case 'ping':{
          if(!General['PING']){
            General['PING'] = new function(){
              this.run = function(){
                if(this.stop){
                  console.log('ping stopped');
                  return;
                }
                General['WS'].send(PROTO.encode('ping',0))
                setTimeout(it=>it.run(),1000,this)
              }
              this.stop = 0;
              this.run();
            }
          }
          break;
        };
        case 'kick':{
          General['KICK'] = decoded.reason;
          General['PING'].stop = 1;
          break;
        };
        case 'GameUpdate':{
          General['SetPacket'](decoded.data)
          break;
        };
        case 'UpdateUp':{
          General['Ui'].upNb = decoded.data.ups;
          break;
        };
        case 'UiUpdate':{
          if(General['Ui']){
            General['Ui'].isReady = 1;
            General['Ui'].leaderInfo = decoded.data.leader;
            General['Ui'].mapInfo = decoded.data.map;
            General['Ui'].MES.add(decoded.data.mess);
          }
          break;
        };
        case 'comResponse':{
          General['DEV'].log(decoded.data.res);
          break;
        };
        case 'chatUpdate':{
          General['CHAT'].log(decoded.data.res);
          break;
        };
      }
    };
  };
  //////////
  General['DEV'] = (() => {
    var dev = {
      isOn: 0,
    };
    let input = document.createElement('INPUT');
    input.onkeydown = function(e){
      switch(e.key){
        case 'ArrowUp':{
          if(curs>0){
            curs--;
            input.value = history[curs];
          }
          break;
        }
        case 'ArrowDown':{
          if(curs<history.length-1){
            curs++;
            input.value = history[curs];
          }
          break;
        }
      }
    };
    input.type = 'text';
    input.id = 'dinput';
    input.maxLength = '50';
    var history = [''], curs = 0;
    let div = document.createElement('DIV');
    div.appendChild(input);
    div.id = 'console'
    ////
    function toggle(){
      General['CHAT'].isOn ? General['CHAT'].toggle() : 0;
      if(dev.isOn){
        document.body.removeChild(div);
      } else {
        document.body.appendChild(div);
        input.focus();
      }
      dev.isOn = !dev.isOn;
    };
    dev.toggle = toggle;
    window.toggleConsole = toggle;
    ////
    function send(){
      if(input.value == 'clear'){
        div.innerHTML = '';
        div.appendChild(input);
        input.focus();
      }
      if(input.value.length){
        General['WS'].send(PROTO.encode('com',input.value))
        history[history.length-1] = input.value;
        curs = history.length;
        history.push('');
        input.value = '';
      }
    }
    dev.send = send;
    ////
    function log(arr){
      for(let data of arr){
        let log = document.createElement('DIV')
        log.innerHTML = data.replace(/ /g, '\u00a0');
        div.insertBefore(log,input);
      }
    }
    dev.log = log;
    ////
    return dev;
  })();
  General['CHAT'] = (() => {
    var chat = {
      isOn: 0,
    };
    let input = document.createElement('INPUT');
    input.type = 'text';
    input.id = 'cinput';
    input.maxLength = '100';
    let div = document.createElement('DIV');
    div.id = 'chat';
    mess = document.createElement('DIV');
    mess.id = 'mess';
    mess.innerHTML =
    "<div style='line-height: 115%'>"+
      "<span style='opacity: 0.6;font-size:1.1em;'>Welcome to the chat!</span></br>"+
      "&nbsp;&nbsp;/join to join a chat</br>"+
      "&nbsp;&nbsp;/quit to quit the chat</br>"+
      "&nbsp;&nbsp;/name to get the chat name</br>"+
    "</div>";
    div.appendChild(mess);
    div.appendChild(input);
    ////
    function toggle(){
      if(General['DEV'].isOn){
        General['DEV'].toggle();
      }
      if(chat.isOn){
        document.body.removeChild(div);
      } else {
        document.body.appendChild(div);
        input.focus();
      }
      chat.isOn = !chat.isOn;
    };
    chat.toggle = toggle;
    ////
    function send(){
      if(input.value.length){
        General['WS'].send(PROTO.encode('chat',input.value))
        input.value = '';
      }
    }
    chat.send = send;
    ////
    function escapeHtml(html){
      var text = document.createTextNode(html);
      var p = document.createElement('p');
      p.appendChild(text);
      return p.innerHTML;
    }
    function log(arr){
      for(let data of arr){
        let log = document.createElement('DIV');
        let splited = data[0].split(' ');
        name = splited.slice(1).join(' ');
        log.innerHTML =  data[0].length ? `<span style="color: #${splited[0]}">`+escapeHtml(name)+' : </span>' : '<span style="color:#ccc;font-weight:500">server : </span>'
        log.innerHTML += escapeHtml(data[1]);
        doScroll = (mess.scrollTop+mess.clientHeight>=mess.scrollHeight-5);
        mess.appendChild(log,input);
        if(doScroll){
          mess.scrollTo(0,mess.scrollHeight);
        }
      }
    }
    chat.log = log;
    ////
    return chat;
  })();
  //////////
  window.onload = preRun;
})(window);
