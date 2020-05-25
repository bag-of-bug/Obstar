(function(exports, platform){
  var decode =  {
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
  };
  var encode = {
    "str":     (() => {
      return( dv, data, offset = 0 ) => {
        let length = data.length;
        dv.setUInt8( offset, length );
        for( let i = 0; i<length; i++){
          dv.setUint16( 1+offset+i*2, data.charCodeAt(i) );
        }
        return str;
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
        return dv.getUint32( offset, data );
      }
    })(),
    "float32": (() => {
      return ( dv, data, offset = 0 ) => {
        dv.setFloat32( offset, data );
      }
    })()
  }
  var TYPE = {
    'message':'uint8',
    /// basic
    'init': {
      'result': 'uint8'
    },
    'err':  {
      'result': 'uint8'
    },
    'close': {
      'result': 'uint8'
    },
    /// inputs
    'keydown':{
      'key':'uint8'
    },
    'keyup':{
      'key':'uint8'
    },
    'mousemove': {
      'x':   'float32',
      'y':   'float32',
      'dir': 'float32'
    },
    ///
    'GameUpdate':{
      //////////
      'head':{
        'timestamp':   'int32',
        'width':       'float32',
        'height':      'float32',
        'screen':      'uint16'
      },
      ///////////
      'CONSTRUCTOR': 'uint8',
      'ID':          'uint16',
      'Player':{
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
        'name':     'str',
        'nameC':    'uint8',
        'recoil':   'uint16'
      },
      'Objects':{
        'state':  'uint8',
        'type':   'uint8',
        'x':      'float32',
        'y':      'float32',
        'size':   'float32',
        'alpha':  'uint8',
      },
      'Bullets':{
        'type':   'uint8',
        'x':      'float32',
        'y':      'float32',
        'size':   'float32',
        'color':  'uint8',
        'alpha':  'uint8',
        'dir':    'int16'
      }
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
        'screen'
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
        'name',
        'nameC',
        'recoil',
        'canDir'
      ],
      'Objects':[
        'states',
        'type',
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
    }
  };
  var toBUFFER = {
    'construc':{
      'Players': 0,
      'Objects': 1,
      'Bullets': 2
    },
    'type':    {
      'init':       0,
      'err':        1,
      'close':      2,
      'keydown':    3,
      'keyup':      4,
      'mousemove':  5,
      'GameUpdate': 6,
    },
    'class':   {
      'Basic':  0,
      'Doble':  1,
      'Rifle':  2,
      'Sniper': 3,
      'Rocket': 4
    },
    'ans':     {
      'init':{
        'yes':   0,
        'no':    1,
        'retry': 2
      },
      'err': {
        'ERR_SERVER_FULL':  0,
        'ERR_SERVER_OFF':   1,
        'ERR_DOUBLE_IP':    2,
        'ERR_DOUBLE_ACC':   3,
        'ERR_BROKEN_KEY':   4,
        'ERR_GAMEMODE':     5,
        'ERR_PACKET_LENGTH':6,
        'ERR_PACKET_TYPE':  7,
      },
      'close':{
        'right':  0,
        'broken': 1,
        'kick':   2
      }
    }
  };
  var toSTRING = {
    'construc':[
      'Players',
      'Objects',
      'Bullets',
    ],
    'type':    [
      'init',
      'err',
      'close',
      'keydown',
      'keyup',
      'mousemove',
      'GameUpdate'
    ],
    'class':   [
      'Basic',
      'Doble',
      'Rifle',
      'Sniper',
      'Rocket'
    ],
    'color':   [
      'green',
      'red',
      'yellow',
      'blue',
      'gray',
      'special'
    ],
    'ans':     {
      'init':[
        'yes',
        'no',
        'retry'
      ],
      'err': [
        'ERR_SERVER_FULL',
        'ERR_SERVER_OFF',
        'ERR_DOUBLE_IP',
        'ERR_DOUBLE_ACC',
        'ERR_BROKEN_KEY',
        'ERR_GAMEMODE',
        'ERR_PACKET_LENGTH',
        'ERR_PACKET_TYPE',
      ],
      'close':[
        'right',
        'broken',
        'kick'
      ]
    }
  };
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
      }
      this.cursor += c;
      return decode[type]( type, this.cursor-c )
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
        case 'str': c = 1+data.length*2;break;
      }
      encode[type](data,this.cursor);
      this.cursor += c;
    };
    getBuffer(){
      return this.buffer;
    }
  };

  exports.encode = (() => {
    if(platform == 'server'){
      return (type, data)=>{
        let ENC = new Encoder();
        switch(type){
          /////
          case 'init':
          case 'err':
          case 'close':{
              ENC.init(2);
              ENC.write(toBUFFER['type'][type], TYPE['message']);
              ENC.write(toBUFFER['ans'][type][data], TYPE[type].result);
              return ENC.getBuffer();
              break;
            };
          /////
          case 'GameUpdate':{
              ENC.init(data.length+1);
              ENC.write(toBUFFER['type']['GameUpdate'], TYPE['message']);
              ///HEAD///
              for(let n in SCHEMA.GameUpdate.head){
                let inset = data.head[n];
                let Type = TYPE.GameUpdate.head[n];
                switch(n){
                  default: ENC.write( inset , Type ); break;
                }
              };
              ///MAIN///
              for(let n in SCHEMA.GameUpdate.Players){
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
                    ENC.write( parseInt( (inset/Math.PI*2)*65536 ), Type );
                    break;
                  };
                  case 'hp':
                  case 'alpha':  {
                    ENC.write( parseInt( inset*255 ), Type );
                    break;
                  };
                  case 'recoil': {
                    ENC.write( parseInt('1'+inset.join(''),2), Type );
                    break;
                  };
                  case 'canDir': {
                    let len = inset.length;
                    ENC.write( inset.map(x => parseInt(
                      String.fromCharCode(((x+Math.PI)/Math.PI*2)*65535), 10 )).join(''), Type);
                    break;
                  };
                  default: ENC.write( inset, Type );break;
                }
              };
              ///REST///
              for(let INST of data.instances){
                let construc = INST.construc;
                let id = INST.id;
                ENC.write( toBUFFER['construc'][construc], TYPE.GameUpdate.CONSTRUC);
                ENC.write( id, TYPE.GameUpdate.ID);
                for(let n in SCHEMA['GameUpdate'][construc]){
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
                      ENC.write( parseInt( (inset/Math.PI*2)*65536 ), Type );
                      break;
                    };
                    case 'hp':
                    case 'alpha':  {
                      ENC.write( parseInt( inset*255 ), Type );
                      break;
                    };
                    case 'recoil': {
                      ENC.write( parseInt('1'+inset.join(''),2), Type );
                      break;
                    };
                    case 'canDir': {
                      let len = inset.length;
                      ENC.write( inset.map(x => parseInt(
                        String.fromCharCode(((x+Math.PI)/Math.PI*2)*65535), 10 )).join(''), Type);
                      break;
                    };
                    default: ENC.write( inset, Type );break;
                  }
                };
              }
              return ENC.getBuffer();
              break;
            };
          case 'UiUpdate':  {

          };
        }
      };
    } else {////////CLIENT
      return (type, data)=>{
        let ENC = new Encoder();
        switch(type){
          /////
          case 'init':{
              ENC.init(1);
              ENC.write(toBUFFER['type'][type], TYPE['message']);
              return ENC.getBuffer();
              break;
            };
          /////
          case 'GameUpdate':{

            };
          case 'UiUpdate':  {

          };
        }
      };
    }
  })();
  exports.decode = (() => {

  })();

})(typeof exports === 'undefined' ? this['proto'] : exports,
   typeof exports === 'undefined' ? 'client' : 'server')
