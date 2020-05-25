import * as Proto from './lightSocket.mjs';

const SCHEMA = {
  'timestamp': 'uint32',
  'x': 'float32',
  'y': 'float32',
  'main':{
    'x':         'float32',
    'y':         'float32',
    'vx':        'float32',
    'vy':        'float32',
    'color':     'uint8',
    'hit':       'uint8',
    'size':      'float32',
    'alpha':     'uint8C',
    'class':     'uint8',
    'hp':        'uint8C',
    'screen':    'uint16',
    'name':      'str',
    'nameColor': 'uint8',
    'shoot':     'uint16'
  },
  'Player':{
    'x':         'float32',
    'y':         'float32',
    'vx':        'float32',
    'vy':        'float32',
    'dir':       'int16',
    'team':      'uint8',
    'hit':       'uint8',
    'size':      'float32',
    'alpha':     'uint8',
    'class':     'uint8',
    'hp':        'uint8',
    'name':      'str',
    'nameColor': 'uint8',
    'shoot':     'uint16'
  },
  'Objects':{
    'x':     'float32',
    'y':     'float32',
    'hit':   'uint8',
    'size':  'float32',
    'type':  'uint8',
    'alpha': 'uint8'
  },
  'Bullet':{
    'x':     'float32',
    'y':     'float32',
    'size':  'float32',
    'team':  'uint8',
    'alpha': 'uint8',
    'type':  'uint8'
  },
  'id':        'uint16',
  'constructor': 'uint8',
  'head' : 'uint8'
};
const DESCHEMA = {
  'main':[
    'x',
    'y',
    'vx',
    'vy',
    'color',
    'hit',
    'size',
    'alpha',
    'class',
    'hp',
    'screen',
    'name',
    'nameColor',
    'shoot'
  ],
  'Player':[
    'x',
    'y',
    'vx',
    'vy',
    'dir',
    'team',
    'hit',
    'size',
    'alpha',
    'class',
    'hp',
    'name',
    'nameColor',
    'shoot'
  ],
  'Objects':[
    'x',
    'y',
    'hit',
    'size',
    'type',
    'alpha'
  ],
  'Bullet':[
    'x',
    'y',
    'size',
    'team',
    'alpha',
    'type'
  ]
};
const ENCODE = {
  'type':{
    'main': 0,
    'Player': 1,
    'Objects': 2,
    'Bullet': 3
  },
  'class': {
    'Basic': 0,
    'Doble': 1,
    'Sniper': 2,
    'Rocket': 3
  },
  'head':{
    'update': 0,
    'err': 0,
    'disconnect': 0,
    'kick': 0
  }
};
const DECODE = {
  'constructor':[
    'main',
    'Player',
    'Objects',
    'Bullet'
  ],
  'class': [
    'Basic',
    'Doble',
    'Rifle',
    'Sniper',
    'Rocket'
  ],
  'color':[
    'green',
    'red',
    'blue',
    'yellow'
  ]
};
export var decodeUpdate = (data, main, tt) => {
  var DEC = new Proto.Decoder(data);
  let timestamp = DEC.read(SCHEMA['timestamp']);
  if(tt.timestamp<timestamp){
    tt.timestamp = timestamp;
  } else {
    return;
  }
  var g = {}, name, inst = {'General':{},'Player':[], 'Objects':[], 'Bullet':[]};
  g.x = DEC.read(SCHEMA['x']);
  g.y = DEC.read(SCHEMA['y']);
  ///MAIN///
  for( let i in DESCHEMA['main'] ){
    let n = DESCHEMA['main'][i];
    let type = SCHEMA['main'][n];
    switch(n){
      case 'color':
        main.setColor(DEC.read(type));
        break;
      case 'alpha':
        main[n] = DEC.read(type)/255;
        break;
      case 'class':
        main[n] = DECODE.class[DEC.read(type)];
        break;
      case 'shoot':
        let shot = DEC.read(type).toString(2).substr(1);
        for(let s in shot){
          if(shot[s] == '1'){
            main.shoot(s);
          }
        };
        break;
      case 'hit':
        if(DEC.read(type)){
          main.hit();
        }
        break;
      case 'screen':
        inst.General.Screen = DEC.read(type);
        break;
      default: main[n] = DEC.read(type)
    }
  }
  ///REST///
  while(1){
    if(DEC.end()){break};
    let j = DEC.read(SCHEMA['constructor']);
    name = DECODE.constructor[j];
    let id = DEC.read(SCHEMA['id']);
    inst[name][id] = {};
    let obj = inst[name][id];
    for( let i in DESCHEMA[name] ){
      let n = DESCHEMA[name][i];
      let type = SCHEMA[name][n];
      switch(n){
        case 'dir':
          obj[n] = (DEC.read(type)/255)*Math.PI;
          break;
        case 'alpha':
          obj[n] = DEC.read(type)/255;
          break;
        case 'class':
          obj[n] = DECODE.class[DEC.read(type)];
          break;
        case 'shoot':
          obj[n] = DEC.read(type).toString(2).substr(1);
          break;
        case 'team':
          obj.color = DECODE.color[DEC.read(type)];
          break;
        default: obj[n] = DEC.read(type);
      }
    }
  }
  ///
  return inst;
}
