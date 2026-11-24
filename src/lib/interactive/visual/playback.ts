import {cyclePosition} from '../chapter/motion.ts';
import {motionAt,type MotionLeg} from '../geometry.ts';

// The controller owns elapsed time only. A mounted stage owns its rAF handle.
export function createPlayback() {
  let elapsed=0;
  let last:number|undefined;
  return {
    reset(){elapsed=0;last=undefined;},
    pause(){last=undefined;},
    seek(ms:number){if(!Number.isFinite(ms))throw new RangeError('Invalid elapsed time');elapsed=Math.max(0,ms);last=undefined;},
    tick(now:number,plan:MotionLeg[],repeat=false){
      if(!Number.isFinite(now))throw new RangeError('Invalid playback timestamp');
      if(last!==undefined)elapsed+=Math.min(repeat?Infinity:50,Math.max(0,now-last));
      last=now;
      const duration=plan.reduce((sum,leg)=>sum+leg.travelMs+leg.holdMs,0);
      return motionAt(plan,repeat?cyclePosition(elapsed,duration).elapsed:elapsed);
    }
  };
}
