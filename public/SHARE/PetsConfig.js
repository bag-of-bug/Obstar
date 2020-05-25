(function(exports, platform){
  exports.pets = [
    (ctx, param, CONST, C) => {
      ctx.beginPath();
      ctx.arc(0,0,14*param.size/CONST.SIZE+CONST.LINEWIDTH/2,0,Math.PI*2,0);
      ctx.closePath();
      ctx.fillStyle = C[param.color][1]
      ctx.fill();
      ctx.closePath();
      ///
      ctx.beginPath();
      ctx.arc(0,0,14*param.size/CONST.SIZE-CONST.LINEWIDTH/2,0,Math.PI*2,0);
      ctx.closePath();
      ctx.fillStyle = C[param.color][0];
      ctx.fill();
      ctx.closePath();
    },
    (ctx, param, CONST, C) => {
      ///
      ctx.rotate((Date.now()/3000)%Math.PI*2);
      $1 = (12*param.size/CONST.SIZE)/20
      ctx.beginPath();
      ctx.rect(-20*$1,-20*$1,40*$1,40*$1);
      ctx.closePath();
      ctx.fillStyle = C.sqr[0];
      ctx.strokeStyle = C.sqr[1];
      ctx.lineWidth = CONST.LINEWIDTH;
      ctx.lineJoin = 'round';
      ctx.fill()
      ctx.stroke();
      ///
    },
    (ctx, param, CONST, C) => {
      ///
      let r = (Date.now()/3200)%Math.PI*2;
      ctx.rotate(r);
      $1 = (12*param.size/CONST.SIZE)/18
      ctx.beginPath();
        ctx.moveTo(32*$1,0)
        ctx.lineTo(-16*$1,27.7*$1)
        ctx.lineTo(-16*$1,-27.7*$1)
      ctx.closePath();
      ctx.fillStyle = C.tri[0];
      ctx.strokeStyle = C.tri[1];
      ctx.lineWidth = CONST.LINEWIDTH;
      ctx.lineJoin = 'round';
      ctx.fill()
      ctx.stroke();
      ///
    },
    (ctx, param, CONST, C) => {
      ///
      let r = (Date.now()/3600)%Math.PI*2;
      ctx.rotate(r);
      $1 = (20*param.size/CONST.SIZE)/42
      ctx.beginPath();
        ctx.moveTo(52*$1,0);
        ctx.lineTo(16.1*$1,49.5*$1);
        ctx.lineTo(-42.1*$1,30.6*$1);
        ctx.lineTo(-42.1*$1,-30.6*$1);
        ctx.lineTo(16.1*$1,-49.5*$1);
      ctx.closePath();
      ctx.fillStyle = C.pnt[0];
      ctx.strokeStyle = C.pnt[1];
      ctx.lineWidth = CONST.LINEWIDTH;
      ctx.lineJoin = 'round';
      ctx.fill()
      ctx.stroke();
      ///
    },
    (ctx, param, CONST, C) => {
      ctx.rotate(Date.now()/400%Math.PI*2)
      ctx.beginPath();
        let spike = 18, inner = 18*param.size/CONST.SIZE, outer = 23*param.size/CONST.SIZE;
        for(let i=0; i<spike; i+=2){
          let ang = (i/spike)*Math.PI*2;
          if(i == 0){
            ctx.moveTo(Math.cos(ang)*outer,Math.sin(ang)*outer);
          } else {
            ctx.lineTo(Math.cos(ang)*outer,Math.sin(ang)*outer);
          }
          ang = ((i+1)/spike)*Math.PI*2;
          ctx.lineTo(Math.cos(ang)*inner,Math.sin(ang)*inner);
        }
      ctx.closePath();
      ctx.fillStyle = '#333333';
      ctx.fill();
      ///
      ctx.beginPath();
      ctx.arc(0,0,15*param.size/CONST.SIZE+CONST.LINEWIDTH/2,0,Math.PI*2,0);
      ctx.closePath();
      ctx.fillStyle = C[param.color][1]
      ctx.fill();
      ctx.closePath();
      ///
      ctx.beginPath();
      ctx.arc(0,0,15*param.size/CONST.SIZE-CONST.LINEWIDTH/2,0,Math.PI*2,0);
      ctx.closePath();
      ctx.fillStyle = C[param.color][0];
      ctx.fill();
      ctx.closePath();
    },
    (ctx, param, CONST, C) => {
      ///
      let r = param.size/CONST.SIZE;
      ctx.rotate(param.dir);
      ctx.beginPath();
      ctx.rect(0,-7*r,28*r,14*r);
      ctx.closePath();
      ctx.lineWidth = CONST.LINEWIDTH;
      ctx.lineJoin = 'round';
      ctx.fillStyle = C.gray[0];
      ctx.strokeStyle = C.gray[1];
      ctx.fill();ctx.stroke();
      ///
      ctx.beginPath();
      ctx.arc(0,0,18*param.size/CONST.SIZE+CONST.LINEWIDTH/2,0,Math.PI*2,0);
      ctx.closePath();
      ctx.fillStyle = C.yellow[1]
      ctx.fill();
      ctx.closePath();
      ///
      ctx.beginPath();
      ctx.arc(0,0,18*param.size/CONST.SIZE-CONST.LINEWIDTH/2,0,Math.PI*2,0);
      ctx.closePath();
      ctx.fillStyle = C.yellow[0];
      ctx.fill();
      ctx.closePath();
    },
  ]
})(typeof(exports) === 'undefined' ? function(){this['PetsConfig'] = {}; return this['PetsConfig']}() : exports,
   typeof(exports) === 'undefined' ? 'client' : 'server')
