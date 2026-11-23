import {motionAt,type MotionLeg} from '../geometry.ts';

// The controller owns elapsed time only. A mounted stage owns its rAF handle.
export function createPlayback() {
  let elapsed=0;
  let last:number|undefined;
  return {
    reset(){elapsed=0;last=undefined;},
    pause(){last=undefined;},
    seek(ms:number){if(!Number.isFinite(ms))throw new RangeError('Invalid elapsed time');elapsed=Math.max(0,ms);last=undefined;},
    tick(now:number,plan:MotionLeg[]){
      if(!Number.isFinite(now))throw new RangeError('Invalid playback timestamp');
      if(last!==undefined)elapsed+=Math.min(50,Math.max(0,now-last));
      last=now;
      return motionAt(plan,elapsed);
    }
  };
}
