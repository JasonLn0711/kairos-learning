import {layoutNetwork,type SceneLayout} from '../geometry.ts';
import {type Locale,type Scene,type SceneEdge,type SceneNode} from '../model.ts';
import {type TeachingScene} from '../aase/model.ts';
import {glyphGeometry} from './registry.ts';

type Family = TeachingScene['kind'] | NonNullable<TeachingScene['visual']> | NonNullable<TeachingScene['demo']>;
interface StageState<R extends string> {
  id:string;
  renderer:R;
  caption:string;
  summary:string;
  sourceAnchors:readonly string[];
}

export function teachingStage(scene:TeachingScene, lang:Locale):StageState<Family> {
  return {id:scene.id,renderer:scene.demo ?? scene.visual ?? scene.kind,caption:scene.title[lang],
    summary:scene.mechanism[lang],sourceAnchors:scene.sourceAnchors};
}

// The catalog validates authored nodes and edges before this adapter is called.
// Only the introductory and DNS frames use a closer camera. Later frames share
// a chapter view so the return journey uses the same spatial landmarks.
export function networkStage(stepId:string,nodes:SceneNode[],edges:SceneEdge[],scene:Scene,lang:Locale,mode:SceneLayout,showNetwork=false) {
  const intro=!showNetwork && (stepId==='navigation' || stepId==='dns');
  const participants=new Set(scene.route);
  const visible=intro?nodes.filter(n=>participants.has(n.id)):nodes;
  const ids=new Set(visible.map(n=>n.id));
  const selected=edges.filter(e=>ids.has(e.from) && ids.has(e.to));
  const layout=layoutNetwork(visible,selected,mode);
  for(const node of layout.nodes){
    const ports=glyphGeometry(node.kind).ports;
    if(!ports.left || !ports.right)throw new Error('Missing device ports');
    const {x,y}=node.position;
    node.bounds={left:x+ports.left.x,right:x+ports.right.x,top:y-24,bottom:y+9};
  }
  const state:StageState<'isometric-topology'>={id:stepId,renderer:'isometric-topology',caption:scene.label[lang],
    summary:scene.route.map(id=>nodes.find(n=>n.id===id)!.label[lang]).join(' → '),sourceAnchors:['read-'+stepId]};
  const center=layout.nodes.reduce((a,n)=>({x:a.x+n.position.x/visible.length,y:a.y+n.position.y/visible.length}),{x:0,y:0});
  const span=Math.max(...layout.nodes.map(n=>n.position.x))-Math.min(...layout.nodes.map(n=>n.position.x));
  const heightSpan=Math.max(...layout.nodes.map(n=>n.position.y))-Math.min(...layout.nodes.map(n=>n.position.y));
  const camera=intro?{x:center.x-12,y:center.y-12,width:Math.max(260,span+184),height:Math.max(205,heightSpan+160)}:
    {x:layout.width/2,y:layout.height/2,width:layout.width,height:layout.height};
  return {...state,layout,camera};
}
