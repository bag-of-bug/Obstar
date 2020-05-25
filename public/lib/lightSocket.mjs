var decode = {
  "str":     () => {
    return( str, offset = 0 ) => {
      return str.slice(offset+1, offset+1+str.charCodeAt( offset ));
    }
  },
  "int8":    () => {
    return ( str, offset = 0 ) => {
      return str.charCodeAt( offset );
    }
  },
  "uint8":   () => {
    return ( str, offset = 0 ) => {
      return str.charCodeAt( offset);
    }
  },
  "uint8C":  () => {
    return ( str, offset = 0 ) => {
      return str.charCodeAt( offset);
    }
  },
  "int16":   () => {
    var arr = new Int16Array( 1 );
    var char = new Int8Array( arr.buffer );
    return function( str, offset ) {
      for ( var i = 0; i < 2; ++i ) {
        char[i] = str.charCodeAt( offset + i );
      }

      return arr[0];
    };
  },
  "uint16":  () => {
    var arr = new Uint16Array( 1 );
    var char = new Int8Array( arr.buffer );
    return function( str, offset ) {
      for ( var i = 0; i < 2; ++i ) {
        char[i] = str.charCodeAt( offset + i );
      }

      return arr[0];
    };
  },
  "int32":   () => {
    var arr = new Int32Array( 1 );
    var char = new Int8Array( arr.buffer );
    return function( str, offset ) {
      for ( var i = 0; i < 4; ++i ) {
        char[i] = str.charCodeAt( offset + i );
      }
      return arr[0];
    };
  },
  "uint32":  () => {
    var arr = new Uint32Array( 1 );
    var char = new Int8Array( arr.buffer );
    return function( str, offset ) {
      for ( var i = 0; i < 4; ++i ) {
        char[i] = str.charCodeAt( offset + i );
      }

      return arr[0];
    };
  },
  "float32": () => {
    var arr = new Float32Array( 1 );
    var char = new Int8Array( arr.buffer );
    return function( str, offset ) {
      for ( var i = 0; i < 4; ++i ) {
        char[i] = str.charCodeAt( offset + i );
      }

      return arr[0];
    };
  },
  "float64": () => {
    var arr = new Float64Array( 1 );
    var char = new Int8Array( arr.buffer );
    return function( str, offset ) {
      for ( var i = 0; i < 8; ++i ) {
        char[i] = str.charCodeAt( offset + i );
      }

      return arr[0];
    };
  }
};
var encode = {
  "str":     () => {
    var arr = new Int8Array( 1 );
    return function( $0 ) {
      arr[0] =  $0.charCodeAt( 0 );
      return String.fromCharCode( arr[0]+$0 );
    };
  },
  "int8":    () => {
    var arr = new Int8Array( 1 );
    return function( $0 ) {
      arr[0] =  $0;
      return String.fromCharCode( arr[0] );
    };
  },
  "uint8":   () => {
    var arr = new Uint8Array( 1 );
    return function( $0 ) {
      arr[0] =  n;
      return String.fromCharCode( arr[0] );
    };
  },
  "uint8C":  () => {
    var arr = new uInt8ClampedArray( 1 );
    return function( $0 ) {
      arr[0] =  $0;
      return String.fromCharCode( arr[0] );
    };
  },
  "int16":   () => {
    var arr = new Int16Array( 1 );
    var char = new Int8Array( arr.buffer );
    return function( $0 ) {
      arr[0] = $0;
      return String.fromCharCode( char[0], char[1] );
    };
  },
  "uint16":  () => {
    var arr = new Uint16Array( 1 );
    var char = new Int8Array( arr.buffer );
    return function( $0 ) {
      arr[0] = $0;
      return String.fromCharCode( char[0], char[1] );
    };
  },
  "int32":   () => {
    var arr = new Int32Array( 1 );
    var char = new Int8Array( arr.buffer );
    return function( $0 ) {
      arr[0] = $0;
      return String.fromCharCode( char[0], char[1], char[2], char[3] );
    };
  },
  "uint32":  () => {
    var arr = new Uint32Array( 1 );
    var char = new Int8Array( arr.buffer );
    return function( $0 ) {
      arr[0] = $0;
      return String.fromCharCode( char[0], char[1], char[2], char[3] );
    };
  },
  "float32": () => {
    var arr = new Float32Array( 1 );
    var char = new Int8Array( arr.buffer );
    return function( $0 ) {
      arr[0] = $0;
      return String.fromCharCode( char[0], char[1], char[2], char[3] );
    };
  },
  "float64": () => {
    var arr = new Float64Array( 1 );
    var char = new Int8Array( arr.buffer );
    return function( $0 ) {
      arr[0] = $0;
      return String.fromCharCode( char[0], char[1], char[2], char[3],
                                  char[4], char[5], char[6], char[7]);
    };
  }
};
var addValue = function(val, type){
  return encode[type](val);
};
var setValue = function(str, offset, type, obj, prop){
  obj[prop] = decode[type](str, offset);
  ///
  let c = 1;
  switch(type){
    case "int16":
    case "uint16": c = 2;break;
    case "int32":
    case "uint32":
    case "float32": c = 4;break;
    case "float64": c = 8;break;
    case 'str': c = str.charCodeAt( offset )+1;
  }
  return c;
};

export class Encoder{
  constructor(){
    this.str = '';
  }
  add(value, type){
    this.str += addValue($0, $1);
    return this;
  }
  getMessage(){
    return this.str;
  }
}
export class Decoder{
  constructor(str){
    this.cursor = 0;
    this.str = str;
    this.strEnd = str.length-1;
  }
  read(type){
    let c = 1;
    switch(type){
      case "int16":
      case "uint16": c = 2;break;
      case "int32":
      case "uint32":
      case "float32": c = 4;break;
      case "float64": c = 8;break;
      case 'str': c = this.str.charCodeAt( this.cursor )+1;break;
    }
    let data = decode[type]()(this.str,this.cursor);
    this.cursor+= c;
    return data;
  }
  end(){
    return ((this.strEnd) <= this.cursor);
  }
}
