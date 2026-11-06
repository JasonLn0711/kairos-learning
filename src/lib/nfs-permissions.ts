export const permissionModes=[600,640,644,777] as const;
export function permissionBits(mode:number):string[] {
 if(!permissionModes.some(value=>value===mode))throw new RangeError('Unsupported teaching mode');
 return String(mode).split('').map(digit=>{
  const bits=Number(digit);
  return (bits&4?'r':'-')+(bits&2?'w':'-')+(bits&1?'x':'-');
 });
}
