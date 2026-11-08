"""Eight fixed, reviewed layouts. Content supplies text, never SVG markup."""
from pathlib import Path
from html import escape
import json,sys,re
from m0903_svg import sanitized_svg
R=Path(__file__).resolve().parents[1];S=R/'docs/sources/cs-systems-foundations'
def pair(title,body,en_title,en_body):return {'zh':{'title':title,'body':body},'en':{'title':en_title,'body':en_body}}
def models():
 return {
 'lifecycle':{'title':{'zh':'軟體從開發到交付的完整生命週期','en':'The software lifecycle from source to delivery'},'nodes':[
 pair('Source（來源）','程式碼、資料、設定、需求','Source','Code, data, configuration, requirements'),pair('Dependency（依賴）','套件、版本、函式庫、工具鏈','Dependency','Packages, versions, libraries, toolchain'),pair('Build / Execute（建置與執行）','作業系統、程序、編譯器、執行環境','Build / Execute','OS, processes, compilers, runtimes'),pair('Artifact（成品）','網站檔案、執行檔、容器映像、模型封裝','Artifact','Website files, executables, images, model packages'),pair('Deploy / Serve（部署與服務）','伺服器、容器、網路、瀏覽器','Deploy / Serve','Servers, containers, networks, browsers'),pair('Verification（驗證）','檢查每個階段，並確認使用者得到正確結果','Verification','Check every stage and the result users receive')], 'note':{'zh':'檔案系統與硬體支撐所有階段；Git 管理來源歷史；測試、安全與證據追溯貫穿整條流程。','en':'Filesystems and hardware support every stage; Git manages source history. Testing, security and provenance span the whole flow.'}},
 'hardware':{'title':{'zh':'CPU、RAM、SSD 與 GPU 的角色','en':'CPU, RAM, SSD and GPU roles'},'nodes':[
 pair('CPU','執行指令、運算與控制','CPU','Executes instructions, computation and control'),pair('RAM','暫存程序正在使用的資料','RAM','Holds data currently used by processes'),pair('SSD','持久保存檔案與程式','SSD','Persistently stores files and programs'),pair('GPU','大量平行計算，常用於圖形與 AI','GPU','Parallel computation for graphics and AI')], 'note':{'zh':'儲存層共享與執行期記憶體共享是不同機制。','en':'Storage sharing and runtime memory sharing are separate mechanisms.'}},
 'links':{'title':{'zh':'硬連結與符號連結','en':'Hard links and symbolic links'},'nodes':[
 pair('a.txt','directory entry','a.txt','directory entry'),pair('b.txt','directory entry','b.txt','directory entry'),pair('same inode','nlink = 2','same inode','nlink = 2'),pair('shared data','共用資料','shared data','shared data'),pair('link.txt','directory entry','link.txt','directory entry'),pair('link inode','stored path: target.txt','link inode','stored path: target.txt'),pair('target.txt','resolve path','target.txt','resolve path'),pair('target inode','目標檔案物件','target inode','target object'),pair('target data','目標資料','target data','target data'),pair('target removed → dangling link','目標移除後可能斷鏈','target removed → dangling link','May dangle when the target is removed')], 'note':{'zh':'左：兩個名稱指向同一 inode。右：虛線表示解析儲存的路徑或目標移除的情況；符號連結可跨檔案系統。','en':'Left: two names refer to one inode. Right: dashed lines denote path resolution or target removal. Symlinks can cross filesystem boundaries.'}},
 'cas':{'title':{'zh':'內容定址儲存','en':'Content-addressable storage'},'nodes':[
 pair('Content：檔案位元組','','Content: file bytes',''),pair('SHA-256：計算摘要','','SHA-256: compute a digest',''),pair('Blob Store：依摘要保存內容','','Blob Store: store content by digest',''),pair('版本 A','參照 Hash X','Version A','References Hash X'),pair('版本 B','參照 Hash X','Version B','References Hash X')], 'note':{'zh':'不同版本可以參照相同的內容物件，避免為一模一樣的位元組保存重複副本。','en':'Different versions can reference the same object, avoiding duplicate copies of identical bytes.'}},
 'environment':{'title':{'zh':'從依賴規格到已安裝環境','en':'From dependency requirements to an installed environment'},'nodes':[
 pair('Manifest','允許哪些依賴','Manifest','Which dependencies are allowed'),pair('Lockfile','選定哪些版本','Lockfile','Which versions were selected'),pair('Installed Environment（已安裝環境）','磁碟上真正存在的程式、模組、入口與連結','Installed Environment','Programs, modules, entry points and links actually on disk')], 'note':{'zh':'需求規格、解析結果與實際安裝狀態需要分別核對。','en':'Check requirements, resolution results and actual installation separately.'}},
 'docker':{'title':{'zh':'Docker 的典型分層儲存概念','en':'Typical layered Docker storage'},'nodes':[
 pair('Container Writable Layer','容器執行時新增或修改的狀態','Container Writable Layer','State added or changed while the container runs'),pair('Application Layer','應用程式及相關檔案','Application Layer','Application and related files'),pair('Dependency Layers','執行環境與套件','Dependency Layers','Runtimes and packages'),pair('Base Image Layers','基底檔案系統內容','Base Image Layers','Base filesystem contents'),pair('Volume / Bind Mount','獨立於容器可寫層管理的持久資料','Volume / Bind Mount','Persistent data managed outside the writable layer')], 'note':{'zh':'示意結構。多個映像可共用相同層，因此映像列表大小不能直接加總為實際唯一磁碟占用。','en':'Conceptual structure. Images may share layers; listed image sizes cannot simply be summed as unique disk usage.'}},
 'git-areas':{'title':{'zh':'Git 的三個主要工作區域','en':'Three main Git working areas'},'nodes':[
 pair('Working Tree','正在修改的檔案','Working Tree','Files being edited'),pair('Index','準備提交的內容','Index','Content prepared for a commit'),pair('Repository','已提交的版本物件','Repository','Committed version objects')], 'note':{'zh':'Working Tree → git add → Index → git commit → Repository。工作樹、暫存區與已提交資料是不同狀態。','en':'Working Tree → git add → Index → git commit → Repository. These are distinct states.'}},
 'git-dag':{'title':{'zh':'Git 分支與合併','en':'Git branches and merge'},'nodes':[pair(c,'',c,'') for c in 'ABCDEFG'], 'note':{'zh':'從 B 分出功能分支 C—D 與另一條開發線 E—F，G 為合併提交。圖線表示歷史連接；Git 內部父指標由新提交指向父提交。','en':'B branches into feature work C—D and another line E—F; G is the merge commit. Lines show history; internal parent pointers run from new commits to parents.'}}
 }
def wrap(text,width,size):
 lines=[];line='';n=0
 for token in re.findall(r'[A-Za-z0-9_/-]+|\s+|[^\s]',text):
  w=sum(size*(1 if ord(c)>255 else .57) for c in token)
  if n+w>width and line:lines.append(line.rstrip());line='';n=0
  if not line and not token.strip():continue
  for c in token:
   cw=size*(1 if ord(c)>255 else .57)
   if n+cw>width and line:lines.append(line.rstrip());line='';n=0
   line+=c;n+=cw
 if line.strip():lines.append(line.rstrip())
 return lines

def render(name,m,lang):
 p=[];prefix=f'cs-{name}-{lang}-'
 def text(x,y,t,size=22,width=1000,bold=False,anchor='start'):
  lines=wrap(t,width,size)
  for i,line in enumerate(lines):p.append(f'<text x="{x}" y="{y+i*size*1.7}" font-size="{size}" font-weight="{700 if bold else 400}" text-anchor="{anchor}">{escape(line)}</text>')
  return len(lines)*size*1.7
 def line(x1,y1,x2,y2,dash=False,color='#64748b',arrow=False):p.append(f'<path d="M{x1} {y1}L{x2} {y2}" fill="none" stroke="{color}" stroke-width="3"'+(' stroke-dasharray="9 7"' if dash else '')+(f' marker-end="url(#{prefix}arrow)"' if arrow else '')+'/>')
 def node(i,x,y,w,h=126,boxed=False):
  n=m['nodes'][i][lang]
  if boxed:p.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>')
  z=y+30;tx=x+w/2 if name in ['hardware','lifecycle','cas','environment','git-areas'] else x+20;anchor='middle' if name in ['hardware','lifecycle','cas','environment','git-areas'] else 'start';z+=text(tx,z,n['title'],16 if name=='links' else 24,w-40,True,anchor);text(tx,z+6,n['body'],14 if name=='links' else 20,w-40,False,anchor)
 text(28,42,m['title'][lang],28,1040,True)
 if name=='lifecycle':
  for i in range(6):
   node(i,45,100+i*185,1010,140,i==5)
   if i<5:line(550,245+i*185,550,270+i*185,arrow=True)
  end=1230
 elif name=='hardware':
  p.append('<rect x="25" y="80" width="1050" height="440" rx="20" fill="none" stroke="#cbd5e1" stroke-width="2"/>')
  icons=['M6 6h12v12H6z M9 9h6v6H9z M9 2v4 M15 2v4 M9 18v4 M15 18v4 M2 9h4 M2 15h4 M18 9h4 M18 15h4','M3 5h18v14H3z M6 8v4 M10 8v4 M14 8v4 M18 8v4 M6 19v3 M10 19v3 M14 19v3 M18 19v3','M3 12l4-8h10l4 8v8H3z M3 12h18 M6 16h1 M10 16h1','M3 3h18v14H3z M8 21h8 M12 17v4 M8 8h8 M8 12h8']
  for i in range(4):
   x=40+(i%2)*535;y=100+(i//2)*220
   p.append(f'<path d="{icons[i]}" transform="translate({x+225} {y}) scale(1.4)" fill="none" stroke="#18252c" stroke-width="1.8"/>');node(i,x,y+40,495,170)

  end=560
 elif name=='links':
  line(510,100,510,780)
  for i,x,y,w in [(0,30,120,200),(1,280,120,200),(2,140,360,240),(3,140,610,240),(4,560,120,260),(5,560,340,300),(6,890,340,180),(7,890,510,180),(8,890,670,180),(9,540,640,320)]:node(i,x,y,w,140,True)
  for a in [(130,260,260,360),(380,260,260,360),(260,500,260,610),(690,260,690,340),(980,480,980,510),(980,650,980,670)]:line(*a,arrow=True)
  line(860,410,890,410,True,arrow=True);line(690,480,690,640,True,arrow=True);end=860
 elif name=='cas':
  for i in range(3):
   node(i,40,110+i*160,1020)
   line(550,235+i*160,550,260+i*160,arrow=True)
  node(3,40,620,495,140,True);node(4,565,620,495,140,True);end=800
 elif name=='environment':
  node(0,40,110,460);node(1,600,110,460);line(510,150,570,150,arrow=True);line(550,250,550,290,arrow=True);node(2,40,310,1020);end=510
 elif name=='docker':
  for i in range(5):node(i,40,105+i*160,1020,140,i==4)
  line(40,735,1060,735);end=950
 elif name=='git-areas':
  icons=['M3 7h7l2 3h9l-3 10H3z M3 7V4h6l3 3','M3 5l2 2 4-4 M12 5h9 M3 13l2 2 4-4 M12 13h9 M12 21h9','M2 12h7 M15 12h7 M15 12a3 3 0 1 0-6 0a3 3 0 1 0 6 0']
  for i in range(3):
   p.append(f'<path d="{icons[i]}" transform="translate({180+i*360} 95) scale(1.4)" fill="none" stroke="#18252c" stroke-width="1.8"/>');node(i,30+i*360,140,330,180)

  end=350
 else:
  coords=[(100,320),(300,320),(500,170),(700,170),(500,470),(700,470),(950,320)]
  for a,b in [(0,1),(1,2),(2,3),(3,6),(1,4),(4,5),(5,6)]:line(*coords[a],*coords[b],color='#0f9488' if (a,b) in [(0,1),(1,2),(2,3),(3,6)] else '#64748b')
  for i,(x,y) in enumerate(coords):
   p.append(f'<circle cx="{x}" cy="{y}" r="44" fill="{"#0f766e" if i==6 else "#e2e8f0"}" stroke="#64748b" stroke-width="4"/>');p.append(f'<text x="{x}" y="{y+12}" font-size="36" font-weight="700" text-anchor="middle" fill="{"#ffffff" if i==6 else "#18252c"}">{escape(m["nodes"][i][lang]["title"])}</text>')
  text(470,85,'功能分支' if lang=='zh' else 'Feature branch',26,440);text(470,570,'另一條開發線' if lang=='zh' else 'Another development line',26,560);end=640
 end+=text(28,end,m['note'][lang],20,1040)+30
 raw=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 880 {end*.8}" role="img" aria-labelledby="{prefix}title {prefix}desc"><title id="{prefix}title">{escape(m["title"][lang])}</title><desc id="{prefix}desc">{escape(m["note"][lang])}</desc><defs><marker id="{prefix}arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#64748b"/></marker></defs><g transform="scale(0.8)"><rect width="1100" height="{end}" fill="#ffffff"/><g font-family="system-ui,sans-serif" fill="#18252c">'+''.join(p)+'</g></g></svg>'
 out=(sanitized_svg(raw,prefix)+'\n').encode();assert len(out)<100000;return out
if __name__=='__main__':
 data=models();outputs={S/'diagrams.json':(json.dumps(data,ensure_ascii=False,indent=2)+'\n').encode()}
 for name,m in data.items():
  for lang in ['zh','en']:outputs[S/f'svg/{name}-{lang}.svg']=render(name,m,lang)
 for path,body in outputs.items():
  if '--check' in sys.argv:assert path.read_bytes()==body,path
  else:path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(body)
 print(f'{len(outputs)-1} SVG previews generated/verified; not published')
