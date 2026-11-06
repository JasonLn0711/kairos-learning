export function simulatedDocumentAccess(actor:string,document:string,action:string):boolean {
 if(!['a','b','reviewer'].includes(actor)||!['A','B'].includes(document)||!['read','edit','delete'].includes(action))return false;
 if(actor==='reviewer')return action==='read';
 return actor==='a'&&document==='A'||actor==='b'&&document==='B';
}
