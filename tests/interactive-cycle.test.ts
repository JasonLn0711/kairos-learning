import assert from 'node:assert/strict';
import test from 'node:test';
import { cyclePosition } from '../src/lib/interactive/chapter/motion.ts';

test('the marker rests on the final endpoint for exactly one second on every lap', () => {
  for (const duration of [650,1950,4100]) {
    const period = duration + 1000;
    for (const lap of [0,1,7]) {
      const start = lap * period;
      assert.deepEqual(cyclePosition(start + duration - 1,duration), {elapsed:duration-1, holding:false, lap});
      for (const hold of [0,999]) {
        assert.deepEqual(cyclePosition(start + duration + hold,duration), {elapsed:duration, holding:true, lap});
      }
      assert.deepEqual(cyclePosition(start + period,duration), {elapsed:0, holding:false, lap:lap+1});
    }
  }
});
