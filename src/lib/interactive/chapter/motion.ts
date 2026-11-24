export const repeatDelay = 1000;

export function cyclePosition(elapsed: number, duration: number) {
  const cycle = duration + repeatDelay;
  const local = elapsed % cycle;
  return { elapsed: Math.min(local, duration), holding: local >= duration, lap: Math.floor(elapsed / cycle) };
}
