from pathlib import Path
import html,re
d=Path(__file__).resolve().parents[1]/'site/courses/matlab-practice/downloads/matlab_edition'
# Regenerate PDF report templates from matching versioned Markdown.
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont, defaultUnicodeEncodings
defaultUnicodeEncodings["MSung-Light"] = ("cht", "UniCNS-UCS2-H")
from reportlab.platypus import SimpleDocTemplate,Paragraph,Spacer,Table,TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
pdfmetrics.registerFont(UnicodeCIDFont('MSung-Light'))
normal=ParagraphStyle('normal',fontName='MSung-Light',fontSize=10,leading=16,wordWrap='CJK',spaceAfter=6)
heading=ParagraphStyle('heading',parent=normal,fontSize=15,leading=21,spaceBefore=10,spaceAfter=9)
def clean(t):return html.escape(t.replace('`','').replace('**','').lstrip('> '))
for i in range(1,4):
 lines=(d/f'CASE{i}_REPORT_TEMPLATE.md').read_text().splitlines();story=[];idx=0
 while idx<len(lines):
  line=lines[idx];idx+=1
  if line.startswith('```'):continue
  if line.startswith('|'):
   rows=[line]
   while idx<len(lines) and lines[idx].startswith('|'):rows.append(lines[idx]);idx+=1
   data=[[Paragraph(clean(cell.strip()),normal) for cell in row.strip('|').split('|')] for row in rows if not re.match(r'^\|[\s:|\-]+$',row)]
   table=Table(data,colWidths=[(A4[0]-88)/len(data[0])]*len(data[0]),repeatRows=1);table.setStyle(TableStyle([('GRID',(0,0),(-1,-1),.4,colors.HexColor('#cfc8bc')),('BACKGROUND',(0,0),(-1,0),colors.HexColor('#f3f0ea')),('VALIGN',(0,0),(-1,-1),'TOP')]));story.append(table)
  elif line.strip():story.append(Paragraph(clean(line.lstrip('# ')),heading if line.startswith('#') else normal))
  else:story.append(Spacer(1,5))
 SimpleDocTemplate(str(d/f'report_templates/case{i}_report_template.pdf'),pagesize=A4,rightMargin=44,leftMargin=44,topMargin=40,bottomMargin=40,title=f'案例 {i} 報告範本 · 教材 1.8 · 2026-10-22').build(story)
print('Generated three versioned PDF report templates')
