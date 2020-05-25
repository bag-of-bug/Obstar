(function(exports, platform){
  var decode =  (platform == 'client') ?
  {
    "str":     (() => {
      return( dv, offset = 0 ) => {
        let length = dv.getUint8(offset)*2;
        let str = '';
        for( let i = offset+1; i<length+offset+1; i+=2){
          str += String.fromCharCode(dv.getUint16(i));
        }
        return str;
      }
    })(),
    "str8":    (() => {
      return( dv, offset = 0 ) => {
        let length = dv.getUint8(offset);
        let str = '';
        for( let i = offset+1; i<length+offset+1; i++){
          str += String.fromCharCode(dv.getUint8(i));
        }
        return str;
      }
    })(),
    "int8":    (() => {
      return ( dv, offset = 0 ) => {
        return dv.getInt8( offset );
      }
    })(),
    "uint8":   (() => {
      return ( dv, offset = 0 ) => {
        return dv.getUint8( offset );
      }
    })(),
    "int16":   (() => {
      return ( dv, offset = 0 ) => {
        return dv.getInt16( offset );
      }
    })(),
    "uint16":  (() => {
      return ( dv, offset = 0 ) => {
        return dv.getUint16( offset );
      }
    })(),
    "int32":   (() => {
      return ( dv, offset = 0 ) => {
        return dv.getInt32( offset );
      }
    })(),
    "uint32":  (() => {
      return ( dv, offset = 0 ) => {
        return dv.getUint32( offset );
      }
    })(),
    "float32": (() => {
      return ( dv, offset = 0 ) => {
        return dv.getFloat32( offset );
      }
    })()
  }:
  {
    "str":     (() => {
      return( buff, offset = 0 ) => {
        let length = buff.readUInt8(offset)*2;
        let str = '';
        for( let i = offset+1; i<length+offset+1; i+=2){
          str += String.fromCharCode(buff.readUInt16BE(i));
        }
        return str;
      }
    })(),
    "str8":    (() => {
      return( buff, offset = 0 ) => {
        let length = buff.readUInt8(offset);
        let str = '';
        for( let i = offset+1; i<length+offset+1; i++){
          str += String.fromCharCode(buff.readUInt8(i));
        }
        return str;
      }
    })(),
    "int8":    (() => {
      return ( buff, offset = 0 ) => {
        return buff.readInt8( offset );
      }
    })(),
    "uint8":   (() => {
      return ( buff, offset = 0 ) => {
        return buff.readUInt8( offset );
      }
    })(),
    "int16":   (() => {
      return ( buff, offset = 0 ) => {
        return buff.readInt16BE( offset );
      }
    })(),
    "uint16":  (() => {
      return ( buff, offset = 0 ) => {
        return buff.readUInt16BE( offset );
      }
    })(),
    "int32":   (() => {
      return ( buff, offset = 0 ) => {
        return buff.readInt32BE( offset );
      }
    })(),
    "uint32":  (() => {
      return ( buff, offset = 0 ) => {
        return buff.readUInt32BE( offset );
      }
    })(),
    "float32": (() => {
      return ( buff, offset = 0 ) => {
        return buff.readFloatBE( offset );
      }
    })()
  };
  var encode = {
    "str":     (() => {
      return( dv, data, offset = 0 ) => {
        let length = data.length;
        dv.setUint8( offset, length );
        for( let i = 0; i<length; i++){
          dv.setUint16( 1+offset+(i*2), data.charCodeAt(i) );
        }
      }
    })(),
    "str8":     (() => {
      return( dv, data, offset = 0 ) => {
        let length = data.length;
        dv.setUint8( offset, length );
        for( let i = 0; i<length; i++){
          dv.setUint8( 1+offset+i, data.charCodeAt(i) );
        }
      }
    })(),
    "int8":    (() => {
      return ( dv, data, offset = 0 ) => {
        dv.setInt8( offset, data );
      }
    })(),
    "uint8":   (() => {
      return ( dv, data, offset = 0 ) => {
        dv.setUint8( offset, data);
      }
    })(),
    "int16":   (() => {
      return ( dv, data, offset = 0 ) => {
        dv.setInt16( offset, data );
      }
    })(),
    "uint16":  (() => {
      return ( dv, data, offset = 0 ) => {
        dv.setUint16( offset, data );
      }
    })(),
    "int32":   (() => {
      return ( dv, data, offset = 0 ) => {
        dv.setInt32( offset, data );
      }
    })(),
    "uint32":  (() => {
      return ( dv, data, offset = 0 ) => {
        return dv.setUint32( offset, data );
      }
    })(),
    "float32": (() => {
      return ( dv, data, offset = 0 ) => {
        dv.setFloat32( offset, data );
      }
    })(),
    "arr":  (() => {
      return ( dv, data, offset = 0 ) => {
        for(let i in data){
          dv.setInt8( offset+parseInt(i), data[i] );
        }
      }
    })()
  }
  var TYPE = {
    'message':'uint8',
    'gm':     'uint8',
    'key':    'str8',
    'name':   'str',
    'pet':    'int8',
    'com':    'str8',
    'chat':   'str',
    /// basic
    'init': {
      'result':   'uint8'
    },
    'kick':  {
      'reason': 'uint8'
    },
    /// inputs
    'keydown':{
      'key':'uint8'
    },
    'keyup':{
      'key':'uint8'
    },
    'mousemove': {
      'x':   'int16',
      'y':   'int16',
      'dir': 'float32'
    },
    ///
    'upgrade':{
      'up': 'uint8'
    },
    'upClass':{
      'class': 'uint8'
    },
    ///
    'GameUpdate':{
      //////////
      'head':{
        'timestamp':   'uint32',
        'width':       'float32',
        'height':      'float32',
        'screen':      'uint16',
        'xp':          'uint32',
        'level':       'float32',
        'still':       'uint8',
        'cLvl':        'uint8'
      },
      ///////////
      'CONSTRUCTOR': 'uint8',
      'ID':          'uint16',
      'Players':{
        'states':   'uint8',
        'class':    'uint8',
        'color':    'uint8',
        'x':        'float32',
        'y':        'float32',
        'vx':       'float32',
        'vy':       'float32',
        'dir':      'int16',
        'size':     'float32',
        'alpha':    'uint8',
        'hp':       'uint8',
        'xp':       'uint16',
        'name':     'str',
        'nameC':    'uint8',
        'recoil':   'uint16',
        'canDir':     'str'
      },
      'Objects':{
        'states': 'uint8',
        'shape':  'uint8',
        'hp':     'uint8',
        'x':      'float32',
        'y':      'float32',
        'size':   'float32',
        'alpha':  'uint8',
      },
      'Bullets':{
        'states': 'uint8',
        'type':   'uint8',
        'x':      'float32',
        'y':      'float32',
        'size':   'float32',
        'color':  'uint8',
        'alpha':  'uint8',
        'dir':    'int16'
      }
    },
    'UiUpdate':{
      'array': 'uint8',
      'leader':{
        'xp': 'uint32',
        'name': 'str',
        'nameC': 'uint8',
        'team': 'uint8'
      }
    },
    'UpdateUp':{
      'ups': 'uint8'
    }
  };
  var SCHEMA = {
    /// basic
    'init':[
      'result',
    ],
    'err': [
      'reason'
    ],
    'close': [
      'reason'
    ],
    /// inputs
    'keydown':[
      'key'
    ],
    'keyup':[
      'key'
    ],
    'mousemove': [
      'x',
      'y',
      'dir'
    ],
    ///
    'GameUpdate':{
      //////////
      'head':[
        'timestamp',
        'width',
        'height',
        'screen',
        'xp',
        'level',
        'still',
        'cLvl',
      ],
      ///////////
      'Players':[
        'states',
        'class',
        'color',
        'x',
        'y',
        'vx',
        'vy',
        'dir',
        'size',
        'alpha',
        'hp',
        'xp',
        'name',
        'nameC',
        'recoil',
        'canDir'
      ],
      'Objects':[
        'states',
        'shape',
        'hp',
        'x',
        'y',
        'size',
        'alpha',
      ],
      'Bullets':[
        'states',
        'type',
        'x',
        'y',
        'size',
        'color',
        'alpha',
        'dir'
      ]
    },
    'UiUpdate':{
      'leader':[
        'xp',
        'name',
        'nameC',
        'team'
      ]
    },
  };
  var toSTRING = {
    'construc':[
      'Players',
      'Objects',
      'Bullets',
    ],
    'gamemode':[
      'ffa',
      '2team',
      '4team'
    ],
    'type':    [
      'init',
      'kick',
      'keydown',
      'keyup',
      'mousemove',
      'GameUpdate',
      'ping',
      'upgrade',
      'UpdateUp',
      'upClass',
      'UiUpdate',
      'com',
      'comResponse',
      'chat',
      'chatUpdate'
    ],
    'shapes':  [
      'sqr',
      'tri',
      'pnt',
      'alphaPnt',
      'alphaSqr',
      'alphaTri',
      'bull'
    ],
    'class':   (platform == 'client') ? TanksConfig.list : require('./TanksConfig.js').list,
    'color':   [
      'green',
      'red',
      'yellow',
      'blue',
      'gray',
      'special',
      'white',
      'black',
      'lila',
      'necro'
    ],
    'reason':  [
      'ERR_GAMEMODE',
      'ERR_DOUBLE_IP',
      'ERR_BROKEN_KEY',
      'ERR_SERVER_FULL',
      'ERR_SERVER_OFF',
      'ERR_REQUESTS_DELAY',
      'ERR_PACKET_LENGTH',
      'ERR_HEARTBEATS_LOST',
      'ERR_DOUBLE_ACC',
      'ERR_PACKET_TYPE'
    ],
    'key':     [
      'a',
      'w',
      's',
      'd',
      'e',
      'c',
      'mouseL',
      'mouseR',
      'enter',
      'arrw',
      'arrs',
      'arra',
      'arrd'
    ],
    'xpExt':   [
      '',
      ' k',
      ' m',
      ' b'
    ],
  };
  var toBUFFER = {
    'construc':{
      'Players': 0,
      'Objects': 1,
      'Bullets': 2
    },
    'gamemode':{
      'ffa':   0,
      '2team': 1,
      '4team': 3
    },
    'type':    {
      'init':       0,
      'kick':       1,
      'keydown':    2,
      'keyup':      3,
      'mousemove':  4,
      'GameUpdate': 5,
      'ping'      : 6,
      'upgrade':    7,
      'UpdateUp':   8,
      'upClass':    9,
      'UiUpdate':   10,
      'com':        11,
      'comResponse':12,
      'chat':       13,
      'chatUpdate': 14
    },
    'shapes':  {
      'sqr':    0,
      'tri':    1,
      'pnt':    2,
      'Bpnt':   3,
      'Bsqr':   4,
      'Btri':   5,
      'bull':   6
    },
    'class':   {},
    'reason':  {
      'ERR_GAMEMODE':        0,
      'ERR_DOUBLE_IP':       1,
      'ERR_BROKEN_KEY':      2,
      'ERR_SERVER_FULL':     3,
      'ERR_SERVER_OFF':      4,
      'ERR_REQUESTS_DELAY':  5,
      'ERR_PACKET_LENGTH':   6,
      'ERR_HEARTBEATS_LOST': 7,
      'ERR_DOUBLE_ACC':      8,
      'ERR_PACKET_TYPE':     9
    },
    'key':     {
      'a':         0,
      'w':         1,
      's':         2,
      'd':         3,
      'e':         4,
      'c':         5,
      'mouseL':    6,
      'mouseR':    7,
      'enter':     8,
      'arrowup':   9,
      'arrowdown': 10,
      'arrowleft': 11,
      'arrowright':12
    }
  };
  ///
  for(let i in toSTRING.class){
    toBUFFER.class[toSTRING.class[i]] = i;
  }
  ///
  class Decoder{
    constructor(buffer){
      this.buffer = buffer;
      this.dv = new DataView(buffer);
      this.cursor = 0;
      this.end = this.buffer.byteLength;
    }
    read(type){
      let c = 1;
      switch(type){
        case "int16":
        case "uint16": c = 2;break;
        case "int32":
        case "uint32":
        case "float32": c = 4;break;
        case 'str': c = this.dv.getUint8( this.cursor )*2+1;break;
        case 'str8': c = this.dv.getUint8( this.cursor )+1;break;
      }
      this.cursor += c;
      return decode[type]( this.dv, this.cursor-c )
    };
    isEnd(){
      return this.end == this.cursor;
    }
  };
  class DecoderBuff{
    constructor(buffer){
      this.buffer = buffer;
      this.cursor = 0;
      this.end = this.buffer.length;
    }
    read(type){
      let c = 1;
      switch(type){
        case "int16":
        case "uint16": c = 2;break;
        case "int32":
        case "uint32":
        case "float32": c = 4;break;
        case 'str': c = 1+this.buffer.readUInt8( this.cursor )*2;break;
        case 'str8': c = this.buffer.readUInt8( this.cursor )+1;break;
      }
      this.cursor += c;
      return decode[type]( this.buffer, this.cursor-c )
    };
    end(){
      return this.end == this.this.cursor;
    }
  };
  class Encoder{
    constructor(size = 0){
      if(size){
        this.buffer = new ArrayBuffer(size);
        this.dv = new DataView(this.buffer);
      }
      this.cursor = 0;
    };
    init(size){
      this.buffer = new ArrayBuffer(size);
      this.dv = new DataView(this.buffer);
      this.cursor = 0;
    }
    write(data, type){
      let c = 1;
      switch(type){
        case "int16":
        case "uint16": c = 2;break;
        case "int32":
        case "uint32":
        case "float32": c = 4;break;
        case "str8": c = 1+data.length;break;
        case 'str': c = 1+data.length*2;break;
        case 'arr': c = data.length;break;
      }
      encode[type](this.dv,data,this.cursor);
      this.cursor += c;
    };
    getBuffer(){
      return this.buffer;
    }
  };
  function checkLength(data,min,max){
    return(min<=data<=max)
  }

  exports.encode = (() => {
    if(platform == 'server'){
      return (type, data)=>{
        let ENC = new Encoder();
        switch(type){
          /////
          case 'ping':{
            ENC.init(1)
            ENC.write(toBUFFER.type['ping'], TYPE['message']);
            return ENC.getBuffer();
          }
          case 'kick':{
            ENC.init(2)
            ENC.write(toBUFFER.type['kick'], TYPE['message']);
            ENC.write(toBUFFER.reason[data], TYPE.kick.reason)
            return ENC.getBuffer();
          }
          /////
          case 'Instance':{
            ENC.init(data.len);
            let INST = data;
            let construc = INST.construc;
            let id = INST.id;
            ENC.write( toBUFFER['construc'][construc], TYPE.GameUpdate.CONSTRUCTOR);
            ENC.write( id, TYPE.GameUpdate.ID);
            for(let n of SCHEMA['GameUpdate'][construc]){
                let inset = INST[n];
                let Type = TYPE.GameUpdate[construc][n];
                switch(n){
                  case 'states': {
                    ENC.write( parseInt('1'+inset.join(''),2), Type );
                    break;
                  };
                  case 'class':  {
                    ENC.write( toBUFFER.class[inset], Type );
                    break;
                  };
                  case 'dir':    {
                    ENC.write( parseInt( (inset/(Math.PI*2))*65535 ), Type );
                    break;
                  };
                  case 'hp':
                  case 'alpha':  {
                    ENC.write( Math.max(Math.min(parseInt( inset*255 ),255),0), Type );
                    break;
                  };
                  case 'shape':  {
                    ENC.write( toBUFFER.shapes[inset], Type );
                    break;
                  };
                  case 'recoil': {
                    ENC.write( parseInt('1'+inset.join(''),2), Type );
                    break;
                  };
                  case 'xp':     {
                    let exp = inset ? parseInt(Math.log10(inset)/3) : 0;
                    ENC.write( parseInt((inset)/(Math.pow(1000,exp)))*10 + exp, Type );
                    break;
                  };
                  case 'canDir': {
                    let len = inset.length;
                    ENC.write( inset.map(x =>String.fromCharCode(((x+Math.PI)/(Math.PI*2))*65535)).join(''), Type);
                    break;
                  };
                  default: ENC.write( inset, Type );break;
                }
              };
            return new Int8Array(ENC.getBuffer());
            break;
          };
          /////
          case 'GameUpdate':{
              ENC.init(data.len+1);
              ENC.write(toBUFFER['type']['GameUpdate'], TYPE['message']);
              ///HEAD///
              for(let n of SCHEMA.GameUpdate.head){
                let inset = data.head[n];
                let Type = TYPE.GameUpdate.head[n];
                switch(n){
                  default: ENC.write( inset , Type ); break;
                }
              };
              ///MAIN///
              for(let n of SCHEMA.GameUpdate.Players){
                let inset = data.main[n];
                let Type = TYPE.GameUpdate.Players[n];
                switch(n){
                  case 'states': {
                    ENC.write( parseInt('1'+inset.join(''),2), Type );
                    break;
                  };
                  case 'class':  {
                    ENC.write( toBUFFER.class[inset], Type );
                    break;
                  };
                  case 'dir':    {
                    ENC.write( parseInt( (inset/(Math.PI*2))*65535 ), Type );
                    break;
                  };
                  case 'hp':
                  case 'alpha':  {
                    ENC.write( Math.max(Math.min(parseInt( inset*255 ),255),0), Type );
                    break;
                  };
                  case 'xp':{break;};
                  case 'recoil': {
                    ENC.write( parseInt('1'+inset.join(''),2), Type );
                    break;
                  };
                  case 'canDir': {
                    let len = inset.length;
                    ENC.write( inset.map(x =>String.fromCharCode(parseInt((x+Math.PI)/(Math.PI*2)*65535))).join(''), Type);
                    break;
                  };
                  default: ENC.write( inset, Type );break;
                }
              };
              ///REST///
              for(let INST of data.instances){
                ENC.write( INST, 'arr' )
              }
              /*
              for(let INST of data.instances){
                let construc = INST.construc;
                let id = INST.id;
                ENC.write( toBUFFER['construc'][construc], TYPE.GameUpdate.CONSTRUCTOR);
                ENC.write( id, TYPE.GameUpdate.ID);
                for(let n of SCHEMA['GameUpdate'][construc]){
                  let inset = INST[n];
                  let Type = TYPE.GameUpdate[construc][n];
                  switch(n){
                    case 'states': {
                      ENC.write( parseInt('1'+inset.join(''),2), Type );
                      break;
                    };
                    case 'class':  {
                      ENC.write( toBUFFER.class[inset], Type );
                      break;
                    };
                    case 'dir':    {
                      ENC.write( parseInt( (inset/(Math.PI*2))*65535 ), Type );
                      break;
                    };
                    case 'hp':
                    case 'alpha':  {
                      ENC.write( Math.max(Math.min(parseInt( inset*255 ),255),0), Type );
                      break;
                    };
                    case 'shape':  {
                      ENC.write( toBUFFER.shapes[inset], Type );
                      break;
                    };
                    case 'recoil': {
                      ENC.write( parseInt('1'+inset.join(''),2), Type );
                      break;
                    };
                    case 'xp':     {
                      let exp = inset ? parseInt(Math.log10(inset)/3) : 0;
                      ENC.write( parseInt((inset)/(Math.pow(1000,exp)))*10 + exp, Type );
                      break;
                    };
                    case 'canDir': {
                      let len = inset.length;
                      ENC.write( inset.map(x =>String.fromCharCode(((x+Math.PI)/(Math.PI*2))*65535)).join(''), Type);
                      break;
                    };
                    default: ENC.write( inset, Type );break;
                  }
                };
              }
              */
              return ENC.getBuffer();
              break;
            };
          case 'UiUpdate':  {
            ENC.init(data.len+1);
            ENC.write(toBUFFER['type'][type], TYPE['message']);
            ENC.write(data.leader.length, TYPE[type]['array']);
            for(let d of data.leader){
              for(let n of SCHEMA[type].leader){
                let inset = d[n];
                let Type = TYPE.UiUpdate.leader[n];
                switch(n){
                  default: ENC.write( inset, Type );break;
                }
              }
            }
            ENC.write(data.map.length, TYPE[type]['array']);
            ENC.write(data.mess.length, TYPE[type]['array']);
            for(let m of data.mess){
              ENC.write(m,'str');
            }
            return ENC.getBuffer();
            break;
          };
          case 'UpdateUp':   {
            ENC.init(2+data.length);
            ENC.write(toBUFFER.type['UpdateUp'], TYPE['message']);
            ENC.write(data.length, TYPE[type]['ups'])
            for(let i of data){
              ENC.write(i, TYPE[type]['ups'])
            }
            return ENC.getBuffer();
          }
          /////
          case 'chatUpdate':{
            data = new Array(data.length*2).fill(0).map((x,i)=>data[parseInt(i/2)][i%2]);
            ENC.init(data.join('').length*2+2+data.length);
            ENC.write(toBUFFER['type'][type], TYPE['message']);
            ENC.write(data.length, 'uint8');
            for(let i of data){
              ENC.write(i,'str');
            }
            return ENC.getBuffer();
            break;
          };
          case 'comResponse':{
            if(!Array.isArray(data)){
              data = [data];
            }
            ENC.init(data.join('').length+2+data.length);
            ENC.write(toBUFFER['type'][type], TYPE['message']);
            ENC.write(data.length, 'uint8');
            for(let i of data){
              ENC.write(i,'str8');
            }
            return ENC.getBuffer();
            break;
          };
        }
      };
    } else {////////CLIENT
      return (type, data)=>{
        let ENC = new Encoder();
        switch(type){
          /////
          case 'init':{
              ENC.init(5+data.key.length+data.name.length*2);
              ENC.write(toBUFFER['type'][type], TYPE['message']);
              ///
              ENC.write(data.key, TYPE['key']);
              ENC.write(toBUFFER['gamemode'][data.gm], TYPE['gm']);
              ENC.write(data.name, TYPE['name']);
              ENC.write(parseInt(data.pet), TYPE['pet']);
              return ENC.getBuffer();
              break;
            };
          case 'ping':{
            ENC.init(1);
            ENC.write(toBUFFER.type['ping'], TYPE['message']);
            return ENC.getBuffer();
            break;
          };
          /////
          case 'keydown':{
            ENC.init(2);
            ENC.write(toBUFFER['type'][type], TYPE['message']);
            ENC.write(toBUFFER['key'][data], TYPE[type]['key']);
            return ENC.getBuffer();
            break;
          };
          case 'keyup':{
            ENC.init(2);
            ENC.write(toBUFFER['type'][type], TYPE['message']);
            ENC.write(toBUFFER['key'][data], TYPE[type]['key']);
            return ENC.getBuffer();
            break;
          };
          case 'mousemove':{
            ENC.init(9)
            ENC.write(toBUFFER['type'][type], TYPE['message']);
            ENC.write(parseInt(data.x*65535), TYPE[type].x);
            ENC.write(parseInt(data.y*65535), TYPE[type].y);
            ENC.write(data.dir, TYPE[type].dir);
            return ENC.getBuffer();
            break;
          };
          /////
          case 'upgrade':{
            ENC.init(2);
            ENC.write(toBUFFER['type'][type], TYPE['message']);
            ENC.write(data, TYPE[type]['up']);
            return ENC.getBuffer();
            break;
          };
          case 'upClass':{
            ENC.init(2);
            ENC.write(toBUFFER['type'][type], TYPE['message']);
            ENC.write(toBUFFER['class'][data], TYPE[type]['class']);
            return ENC.getBuffer();
            break;
          };
          /////
          case 'chat':{
            ENC.init(2+data.length*2);
            ENC.write(toBUFFER['type'][type], TYPE['message']);
            ENC.write(data, TYPE[type]);
            return ENC.getBuffer();
            break;
          };
          case 'com':{
            ENC.init(2+data.length);
            ENC.write(toBUFFER['type'][type], TYPE['message']);
            ENC.write(data, TYPE[type]);
            return ENC.getBuffer();
            break;
          };
        }
      };
    }
  })();
  exports.decode = (() => {
    if(platform == 'server'){
      return (data)=>{
        if(!data.byteLength){
          return {error: 'ERR_PACKET_LENGTH'};
        }
        let DEC = new DecoderBuff(data);
        let j = DEC.read(TYPE['message']);
        let type = toSTRING['type'][j];//toSTRING['type'][DEC.read(TYPE['message'])];
        let result = {type:type, data: {}};
        switch(type){
          ///
          case 'init':{
            result.error = (checkLength(data.byteLength,25,65)) ? 0 : 'ERR_PACKET_LENGTH';
            if(result.error){ break; }
            result.data.key = DEC.read(TYPE['key']);
            result.data.gm  = toSTRING['gamemode'][DEC.read(TYPE['gm'])];
            result.data.name = DEC.read(TYPE['name']);
            result.data.pet = DEC.read(TYPE['pet']);
            result.error = (checkLength(result.data.key,25,25)) ? 0 : 'ERR_BROKEN_KEY';
            break;
          };
          case 'ping':{
            result.error = (checkLength(data.byteLength,1,1)) ? 0 : 'ERR_PACKET_LENGTH';
            break;
          }
          ///
          case 'keydown':
          case 'keyup':{
            result.error = (checkLength(data.byteLength,2,2)) ? 0 : 'ERR_PACKET_LENGTH';
            if(result.error){ break; }
            result.data.key = toSTRING['key'][DEC.read(TYPE[type]['key'])];
            break;
          };
          case 'mousemove':{
            result.error = (checkLength(data.byteLength,9,9)) ? 0 : 'ERR_PACKET_LENGTH';
            if(result.error){ break; }
            result.data.x = DEC.read(TYPE[type].x)/65535;
            result.data.y = DEC.read(TYPE[type].y)/65535;
            result.data.dir = DEC.read(TYPE[type].dir);
            break;
          };
          ///
          case 'upgrade':{
            result.error = (checkLength(data.byteLength,2,2)) ? 0 : 'ERR_PACKET_LENGTH';
            if(result.error){ break; }
            result.data.up = DEC.read(TYPE[type]['up']);
            break;
          };
          case 'upClass':{
            result.error = (checkLength(data.byteLength,2,2)) ? 0 : 'ERR_PACKET_LENGTH';
            if(result.error){ break; }
            result.data.up = toSTRING['class'][DEC.read(TYPE[type]['class'])];
            break;
          };
          ///
          case 'chat':{
            result.error = (checkLength(data.byteLength,202,202)) ? 0 : 'ERR_PACKET_LENGTH';
            if(result.error){ break; }
            result.data = DEC.read(TYPE[type]);
            break;
          }
          case 'com':{
            result.error = (checkLength(data.byteLength,52,52)) ? 0 : 'ERR_PACKET_LENGTH';
            if(result.error){ break; }
            result.data = DEC.read(TYPE[type]);
            break;
          }
        }
        return result;
      };
    } else {////////CLIENT
      return (data)=>{
        let DEC = new Decoder(data);
        let type = toSTRING['type'][DEC.read(TYPE['message'])];
        let result = {type:type, data: {}};
        switch(type){
          ///
          case 'ping':{
            break;
          };
          case 'kick':{
            result.reason = toSTRING['reason'][DEC.read(TYPE.kick.reason)];
            break;
          }
          ///
          case 'GameUpdate':{
            result.data.head = {};
            for(let n of SCHEMA.GameUpdate.head){
              let Type = TYPE.GameUpdate.head[n];
              result.data.head[n] = DEC.read(Type);
            }
            ///
            result.data.User = {};
            for(let n of SCHEMA.GameUpdate.Players){
              let Type = TYPE.GameUpdate.Players[n];
              switch(n){
                case 'states': {
                  result.data.User[n] = DEC.read(Type).toString(2).substr(1).split('').map(x=>parseInt(x));
                  break;
                };
                case 'class':  {
                  result.data.User[n] = toSTRING.class[DEC.read(Type)];
                  break;
                };
                case 'dir':    {
                  result.data.User[n] = (DEC.read(Type)/65535)*Math.PI*2;
                  break;
                };
                case 'hp':
                case 'alpha':  {
                  result.data.User[n] = DEC.read(Type)/255;
                  break;
                };
                case 'xp':     {break;};
                case 'color':  {
                  result.data.User[n] = toSTRING.color[DEC.read(Type)];
                  break;
                };
                case 'recoil': {
                  result.data.User[n] = DEC.read(Type).toString(2).substr(1).split('').map(x=>parseInt(x));
                  break;
                };
                case 'canDir': {
                  let deco = DEC.read(Type);
                  result.data.User[n] = deco.length ? deco.split('').map(x=>((x.charCodeAt(0)/65535)*(Math.PI*2))-Math.PI) : [];
                  break;
                };
                default: result.data.User[n] = DEC.read(Type);break;
              }
            }
            ///
            result.data.Instances = {Objects:[],Players:[],Bullets:[]};
            while(true){
              if(DEC.isEnd()){break;}
              let rawConstruc = DEC.read(TYPE.GameUpdate.CONSTRUCTOR)
              let construc = toSTRING['construc'][rawConstruc];
              let id = DEC.read(TYPE.GameUpdate.ID);
              result.data.Instances[construc][id] = {};
              let obj = result.data.Instances[construc][id];
              for(let n of SCHEMA['GameUpdate'][construc]){
                let Type = TYPE.GameUpdate[construc][n];
                switch(n){
                  case 'states': {
                    obj[n] = DEC.read(Type).toString(2).substr(1).split('').map(x=>parseInt(x));
                    break;
                  };
                  case 'class':  {
                    obj[n] = toSTRING.class[DEC.read(Type)];
                    break;
                  };
                  case 'dir':    {
                    obj[n] = (DEC.read(Type)/65535)*Math.PI*2;
                    break;
                  };
                  case 'shape':  {
                    obj.type = toSTRING.shapes[DEC.read(Type)];
                    break;
                  };
                  case 'hp':
                  case 'alpha':  {
                    obj[n] = DEC.read(Type)/255;
                    break;
                  };
                  case 'xp':     {
                    let raw = DEC.read(Type);
                    obj[n] = parseInt(raw/10) + toSTRING.xpExt[(raw-(parseInt(raw/10)*10))];
                    break;
                  };
                  case 'color':  {
                    obj[n] = toSTRING.color[DEC.read(Type)];
                    break;
                  };
                  case 'recoil': {
                    obj[n] = DEC.read(Type).toString(2).substr(1).split('').map(x=>parseInt(x));
                    break;
                  };
                  case 'canDir': {
                    let deco = DEC.read(Type);
                    obj[n] = deco.length ? deco.split('').map(x=>((x.charCodeAt(0)/65535)*(Math.PI*2))-Math.PI) : [];
                    break;
                  };
                  default: obj[n] = DEC.read(Type);break;
                }
              };
            }
            ///
            break;
          };
          case 'UiUpdate':{
            result.data.leader = new Array(DEC.read(TYPE[type]['array']));
            for(let i = 0; i<result.data.leader.length; i++){
              let player = {};
              for(let n of SCHEMA[type].leader){
                let Type = TYPE.UiUpdate.leader[n];
                switch(n){
                  case 'team':{
                    player[n] = toSTRING.color[DEC.read(Type)];
                    break;
                  }
                  default: player[n] = DEC.read(Type);break;
                }
              }
              result.data.leader[i] = player;
            }
            result.data.map = new Array(DEC.read(TYPE[type]['array']));
            result.data.mess = new Array(DEC.read(TYPE[type]['array']));
            for(let i = 0; i<result.data.mess.length; i++){
              result.data.mess[i] = DEC.read('str');
            }
            break;
          };
          case 'UpdateUp':  {
            result.data.ups = new Array(DEC.read(TYPE[type]['ups']));
            for(let i = 0; i<result.data.ups.length; i++){
              result.data.ups[i] = DEC.read(TYPE[type]['ups']);
            }
            break;
          };
          ///
          case 'chatUpdate':{
            result.data.res = [];
            let len = DEC.read('uint8');
            for(let i = 0; i<len/2; i+=2){
              result.data.res.push([DEC.read('str'),DEC.read('str')]);
            }
            break;
          };
          case 'comResponse':{
            result.data.res = [];
            let len = DEC.read('uint8');
            for(let i = 0; i<len; i++){
              result.data.res.push(DEC.read('str8'));
            }
            break;
          };
        }
        return result;
      };
    }
  })();

})(typeof(exports) === 'undefined' ? function(){this['PROTO'] = {}; return this['PROTO']}() : exports,
   typeof(exports) === 'undefined' ? 'client' : 'server')
