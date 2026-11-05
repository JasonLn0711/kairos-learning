// Bound metadata visibility checks; never delete artifacts or retry a deployment.
export async function waitForPagesArtifact({name,list,log=(_message)=>{},sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms)),clock=Date.now,maxChecks=6,intervalMs=2000}){
 if(typeof name!=='string'||!/^github-pages-[1-9]\d*$/.test(name)||!Number.isInteger(maxChecks)||maxChecks<1||maxChecks>10||!Number.isInteger(intervalMs)||intervalMs<0||intervalMs>5000)throw Error('Invalid Pages artifact wait configuration');
 const started=clock();
 log(`Checking uploaded Pages artifact ${name}; at most ${maxChecks} metadata checks.`);
 for(let check=1;check<=maxChecks;check++){
  const artifacts=await list();if(!Array.isArray(artifacts))throw Error('Invalid Pages artifact list response');
  const matches=artifacts.filter(a=>a.name===name);
  log(`Artifact metadata check ${check}/${maxChecks}: ${matches.length} matching artifact(s); ${clock()-started} ms elapsed.`);
  if(matches.length>1)throw Error(`Refusing ambiguous Pages deployment: ${matches.length} artifacts named ${name}`);
  if(matches.length===1){
   const artifact=matches[0];
   if(artifact.expired!==false||!Number.isSafeInteger(artifact.id)||artifact.id<1||!Number.isSafeInteger(artifact.size_in_bytes)||artifact.size_in_bytes<1)throw Error(`Invalid or expired Pages artifact ${name}`);
   log(`Pages artifact ready: ${name}, ID ${artifact.id}, ${artifact.size_in_bytes} bytes.`);
   return artifact;
  }
  if(check<maxChecks)await sleep(intervalMs);
 }
 throw Error(`Pages artifact ${name} is still unavailable after ${maxChecks} metadata checks; deployment has not started`);
}
