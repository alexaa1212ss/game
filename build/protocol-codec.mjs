// Independent implementation of the recovered Cavegame binary wire format.
// Schemas and provenance are retained in docs/protocol.json. No original app
// modules are executed by this implementation.
import { readFileSync } from 'node:fs';

const input=JSON.parse(readFileSync('alpha/build-input.json','utf8'));const {packetSchemas:wireSchemas}=await import('../payload/versions/'+input.version+'/app/src/online/client-schemas.mjs');const metadata={packets:wireSchemas};
export const packetSchemas = metadata.packets;
const byName = new Map(packetSchemas.map(packet => [packet.name, packet]));
const byId = new Map(packetSchemas.map(packet => [packet.id, packet]));
const MAX_BYTES = 16 * 1024 * 1024;
const MAX_ARRAY_ITEMS = 1000000;

export function getPacket(typeOrId) {
  const packet = typeof typeOrId === 'number' ? byId.get(typeOrId) : byName.get(typeOrId);
  if (!packet) throw new RangeError(`Unknown Cavegame packet: ${String(typeOrId)}`);
  return packet;
}

export function isClientPacket(id) {
  return byId.get(id)?.clientAllowed === true;
}

function defaults(schema) {
  if (Array.isArray(schema)) return [];
  if (typeof schema === 'object') return Object.fromEntries(Object.entries(schema).map(([key, value]) => [key, defaults(value)]));
  if (schema === 'string') return '';
  if (schema === 'bool' || schema === 'boolean') return false;
  return 0;
}

function merge(target, source) {
  for (const [key, value] of Object.entries(source ?? {})) {
    if (value && typeof value === 'object' && !Array.isArray(value) && target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) merge(target[key], value);
    else target[key] = value;
  }
  return target;
}

// Supplies required fields for a new local server. Array element objects still
// need every field specified by their schema; use defaultsForSchema if needed.
export const defaultsForSchema = defaults;
export function createPacket(type, overrides = {}) {
  const packet = getPacket(type);
  const result = merge(defaults(packet.schema), overrides);
  delete result.__message;
  result.type = packet.name;
  return result;
}

function integer(value, min, max, field) {
  if (!Number.isInteger(value) || value < min || value > max) throw new TypeError(`${field} must be an integer in ${min}..${max}`);
}

// The shipped compiler defers nested array bodies in repeated objects. For the
// recovered schemas this means item enchantments follow count/id/type (and shop
// seller fields), even though "enchantments" sorts before "id". Objects outside
// array elements retain normal lexical order, including singular item packets.
const keyCache=new WeakMap();
function wireKeys(schema, repeated) {
  const cached=keyCache.get(schema);if(cached)return cached[repeated?1:0];
  const keys = Object.keys(schema).sort();
  const deferred=[...keys.filter(key => !Array.isArray(schema[key])), ...keys.filter(key => Array.isArray(schema[key])).reverse()];keyCache.set(schema,[keys,deferred]);return repeated?deferred:keys;
}
const WRITE_TYPES={int8:[1,'writeInt8',-128,127],uint8:[1,'writeUInt8',0,255],int16:[2,'writeInt16BE',-32768,32767],uint16:[2,'writeUInt16BE',0,65535],int32:[4,'writeInt32BE',-2147483648,2147483647],uint32:[4,'writeUInt32BE',0,4294967295],float32:[4,'writeFloatBE',-3.4028234663852886e38,3.4028234663852886e38],float64:[8,'writeDoubleBE',-Number.MAX_VALUE,Number.MAX_VALUE]};
// Compile the trusted schemas into closures once. Dense multiplayer snapshots
// must not rebuild field paths and sort/inspect every repeated entity or tile.
const writerCache=new WeakMap();
function compositeWriter(schema,repeated){
 let pair=writerCache.get(schema);if(pair?.[repeated?1:0])return pair[repeated?1:0];
 if(!pair){pair=[];writerCache.set(schema,pair);}
 const child=(s,r,label)=>typeof s==='object'?compositeWriter(s,r):(w,v)=>w.value(s,v,label,r);
 let emit;
 if(Array.isArray(schema)){const item=child(schema[0],true,'array item');emit=(w,value)=>{if(!Array.isArray(value))throw new TypeError('Field must be an array');if(value.length>MAX_ARRAY_ITEMS)throw new RangeError('Array exceeds item limit');w.varuint(value.length,'array length');for(let i=0;i<value.length;i++)item(w,value[i]);};}
 else{const fields=wireKeys(schema,repeated).map(key=>[key,child(schema[key],repeated,key)]);emit=(w,value)=>{if(value===null||typeof value!=='object'||Array.isArray(value))throw new TypeError('Field must be an object');for(let i=0;i<fields.length;i++){const field=fields[i];field[1](w,value[field[0]]);}};}
 pair[repeated?1:0]=emit;return emit;
}

class Writer {
  constructor() { this.buffer=Buffer.allocUnsafe(512);this.length = 0; }
  reserve(length){const end=this.length+length;if(end>MAX_BYTES)throw new RangeError('Packet exceeds size limit');if(end>this.buffer.length){const next=Buffer.allocUnsafe(Math.max(end,Math.min(MAX_BYTES,this.buffer.length*2)));this.buffer.copy(next,0,0,this.length);this.buffer=next;}const offset=this.length;this.length=end;return offset;}
  push(bytes) {
    const offset=this.reserve(bytes.length);bytes.copy(this.buffer,offset);
  }
  varuint(value, field) {
    integer(value, 0, 2147483647, field);
    do { const low = value % 128; value = Math.floor(value / 128);const offset=this.reserve(1);this.buffer[offset]=low | (value ? 128 : 0); } while (value);
  }
  value(schema, value, field, repeated = false) {
    if (typeof schema === 'object') return compositeWriter(schema,repeated)(this,value);
    if (schema === 'string') {
      if (typeof value !== 'string') throw new TypeError(`${field} must be a string`);
      const length=Buffer.byteLength(value,'utf8');this.varuint(length,field);const offset=this.reserve(length);this.buffer.write(value,offset,length,'utf8');return;
    }
    if (schema === 'varuint') { this.varuint(value, field); return; }
    if (schema === 'varint') {
      integer(value, -1073741824, 1073741823, field);
      this.varuint(value >= 0 ? value * 2 : -value * 2 - 1, field); return;
    }
    if (schema === 'bool' || schema === 'boolean') {
      if (typeof value !== 'boolean') throw new TypeError(`${field} must be a boolean`);
      const offset=this.reserve(1);this.buffer[offset]=value?1:0;return;
    }
    const type = WRITE_TYPES[schema];
    if (!type) throw new TypeError(`Unsupported schema ${schema}`);
    if (schema.startsWith('float')) {
      if (typeof value !== 'number' || !Number.isFinite(value) || value < type[2] || value > type[3]) throw new TypeError(`${field} is outside ${schema} range`);
    } else integer(value, type[2], type[3], field);
    const offset=this.reserve(type[0]);this.buffer[type[1]](value,offset);
  }
}

class Reader {
  constructor(bytes) { this.bytes = bytes; this.offset = 0; }
  take(length) {
    if (this.offset + length > this.bytes.length) throw new RangeError('Truncated Cavegame packet');
    const offset = this.offset; this.offset += length; return offset;
  }
  varuint() {
    let value = 0, factor = 1;
    for (let index = 0; index < 5; index++, factor *= 128) {
      const byte = this.bytes[this.take(1)]; value += (byte & 127) * factor;
      if (value > 2147483647) throw new RangeError('Varuint exceeds supported range');
      if (!(byte & 128)) return value;
    }
    throw new RangeError('Unterminated varuint');
  }
  value(schema, repeated = false) {
    if (Array.isArray(schema)) {
      const length = this.varuint();
      if (length > MAX_ARRAY_ITEMS) throw new RangeError('Array exceeds item limit');
      return Array.from({ length }, () => this.value(schema[0], true));
    }
    if (typeof schema === 'object') {
      const object = {};
      for (const key of wireKeys(schema, repeated)) object[key] = this.value(schema[key], repeated);
      return object;
    }
    if (schema === 'string') { const length = this.varuint(); return this.bytes.toString('utf8', this.take(length), this.offset); }
    if (schema === 'varuint') return this.varuint();
    if (schema === 'varint') { const value = this.varuint(); return value % 2 ? -(value + 1) / 2 : value / 2; }
    if (schema === 'bool' || schema === 'boolean') return this.bytes[this.take(1)] !== 0;
    const types = {
      int8: [1, 'readInt8'], uint8: [1, 'readUInt8'], int16: [2, 'readInt16BE'], uint16: [2, 'readUInt16BE'],
      int32: [4, 'readInt32BE'], uint32: [4, 'readUInt32BE'], float32: [4, 'readFloatBE'], float64: [8, 'readDoubleBE'],
    };
    const type = types[schema];
    if (!type) throw new TypeError(`Unsupported schema ${schema}`);
    return this.bytes[type[1]](this.take(type[0]));
  }
}

export function encodePacket(typeOrPacket, payload = {}, lookup = getPacket) {
  const type = typeof typeOrPacket === 'object' ? typeOrPacket.type : typeOrPacket;
  const value = typeof typeOrPacket === 'object' ? typeOrPacket : payload;
  const packet = lookup(type), writer = new Writer();
  writer.value(packet.schema, { ...value, __message: packet.id }, packet.name);
  return writer.buffer.subarray(0,writer.length);
}

export function decodePacket(input, lookup = getPacket) {
  let bytes;
  if (input instanceof ArrayBuffer) bytes = Buffer.from(input);
  else if (ArrayBuffer.isView(input)) bytes = Buffer.from(input.buffer, input.byteOffset, input.byteLength);
  else throw new TypeError('Expected Buffer, ArrayBuffer or typed array');
  if (!bytes.length) throw new RangeError('Empty Cavegame packet');
  if (bytes.length > MAX_BYTES) throw new RangeError('Packet exceeds size limit');
  const packet = lookup(bytes[0]), reader = new Reader(bytes);
  const decoded = reader.value(packet.schema);
  if (reader.offset !== bytes.length) throw new RangeError('Trailing bytes in Cavegame packet');
  delete decoded.__message;
  decoded.type = packet.name;
  return decoded;
}
