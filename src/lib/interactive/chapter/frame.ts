export type Frame={width:number;height:number};
export function fit(frame:Frame,w:number,h:number,top=0){
  const scale=Math.min(frame.width/w,frame.height/h,1.45);
  return 'translate('+((frame.width-w*scale)/2)+' '+((frame.height-h*scale)/2-top*scale)+') scale('+scale+')';
}
export type Snapshot={choice:number;a:number;b:number;logs:number;values:Record<string,string>;states:Record<string,string>;active:string};
