"""Exercise the supplied standalone Streamlit example through actual AppTest reruns."""
from pathlib import Path
from streamlit.testing.v1 import AppTest
ROOT=Path(__file__).resolve().parents[1]

def test_unvalidated_input_and_stale_preview():
 app=AppTest.from_file(str(ROOT/'docs/sources/aase/m07-03/replacement-2026-11-11/app.py')).run()
 assert not app.exception
 assert len(app.text_input)==3 and len(app.button)==1
 assert not app.json
 app.text_input[0].input('SYN-001');app.text_input[1].input('DEMO-A');app.run()
 app.button[0].click().run()
 assert not app.exception
 assert app.session_state['preview']=={'application_id':'SYN-001','applicant_code':'DEMO-A','document_type':''}
 assert len(app.json)==1
 for index in range(3):
  app.text_input[index].input(f'CHANGED-{index}').run()
  assert app.session_state['preview'] is None and not app.json
  app.button[0].click().run()
  assert app.session_state['preview'][['application_id','applicant_code','document_type'][index]]==f'CHANGED-{index}'
 assert not app.exception
