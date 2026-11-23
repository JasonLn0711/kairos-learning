import type { Tone } from './tokens.ts';
export const glyphs = {
  person:{label:['使用者','User'],tone:'clay'},
  browser:{label:['瀏覽器','Browser'],tone:'neutral'},
  dns:{label:['DNS 解析器','DNS resolver'],tone:'clay'},
  edge:{label:['反向代理','Reverse proxy'],tone:'clay'},
  app:{label:['應用程式','Application server'],tone:'teal'},
  database:{label:['資料庫','Database'],tone:'violet'},
  request:{label:['請求','Request'],tone:'clay'},
  response:{label:['回應','Response'],tone:'teal'},
  data:{label:['資料','Data'],tone:'violet'},
  event:{label:['事件','Event'],tone:'neutral'},
  secure:{label:['安全交握','Secure handshake'],tone:'teal'}
} as const satisfies Record<string,{label:readonly [string,string];tone:Tone}>;
export type GlyphRole=keyof typeof glyphs;
export type VisualState='idle'|'active'|'focused'|'muted'|'warning'|'failed'|'success'|'blocked'|'processing';
export const isPacket=(role:GlyphRole)=>['request','response','data','event','secure'].includes(role);

// Local drawing envelopes include the largest state badge and the ground shadow.
// Port coordinates describe the physical contact surface independently of that envelope.
export function glyphGeometry(role:GlyphRole) {
  const packet=isPacket(role);
  const person=role==='person';
  const radius=role==='database'?24:role==='browser'?28:27;
  const bounds=packet?{left:-11,right:11,top:-10,bottom:10}:
    {left:person?-16:-39,right:person?29:39,top:role==='browser'?-55:-50,bottom:person?10:23};
  const portY=role==='browser'?-3:-6;
  return {
    bounds,
    hitBounds:{left:bounds.left-3,right:bounds.right+3,top:bounds.top-3,bottom:bounds.bottom+3},
    opticalCenter:{x:0,y:packet?0:-17},
    ports:person||packet?{}:{left:{x:-radius,y:portY},right:{x:radius,y:portY}}
  };
}
