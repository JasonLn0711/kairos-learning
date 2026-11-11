/** Two-space indentation denotes one child level in the supplied ecommerce sitemap. */
export function sitemapGroups(body:string):{title:string;children:string[]}[]{
 const groups:{title:string;children:string[]}[]=[];
 for(const line of body.split('\n')){
  if(!line.trim()||/^\s/.test(line)&&(!line.startsWith('  ')||/^\s/.test(line.slice(2))))throw new Error('invalid sitemap indentation');
  if(line.startsWith('  ')){
   if(!groups.length)throw new Error('orphan sitemap child');
   groups[groups.length-1].children.push(line.trim());
  }else groups.push({title:line,children:[]});
 }
 return groups;
}
