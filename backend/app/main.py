from dotenv import load_dotenv
load_dotenv()

from analysis import get_analysis, get_tru_analysis_apps
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from get_content import get_content, get_video_metadata
from guidelines import get_guidelines, get_tru_guidelines_apps
from pydantic import BaseModel
from trulens_eval import Tru
from trulens_feedbacks import StandAlone

tru = Tru()

tru.run_dashboard()



app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

class Analyze(BaseModel):
    content: str

class Compare(BaseModel):
    content: str
    guidelines: str
    youtube_url: str = None

class EndToEnd(BaseModel):
    source_url: str
    dest_url: str

@app.post("/end-to-end")
def end_to_end(data:EndToEnd):
    try:
        metadata = {}
        # Get metadata
        source_metadata = get_video_metadata(data.source_url)
        dest_metadata = get_video_metadata(data.dest_url)
        metadata["source"] = source_metadata
        metadata["dest"] = dest_metadata
        # Get content from source 
        source_content = get_content(data.source_url)
        # Extract guidelines from source
        guidelines_dict = get_guidelines(source_content)
        guidelines_str = ""
        for guideline in guidelines_dict:
            guidelines_str += guideline.title + "\n"
        # Get content from dest
        dest_content = get_content(data.dest_url)
        # Compare content from dest with guidelines from source
        comparision = get_analysis(content=dest_content, guidelines=guidelines_str, youtube_url=data.dest_url)
        return {"data": comparision, "metadata": metadata, "ok": True}
    except Exception as e:
        return {"data": None, "ok": False, "error": str(e)}

@app.post("/extract-body")
def extract_body(data:Analyze):
    try:
        content = get_content(data.content)
        metadata = get_video_metadata(data.content)
        return {"data": content, "meta": metadata, "ok": True}
    except Exception as e:
        return {"data": None, "ok": False, "error": str(e)}
    
@app.post("/extract-guidelines")
def extract_guidelines(data:Analyze):
    try:
        tru_app, llm_app = get_tru_guidelines_apps()
        with tru_app as recording:
            llm_app.extract_guidelines(data.content)

        return {"data": llm_app.guidelines, "ok": True}
    except Exception as e:
        return {"data": None, "ok": False, "error": str(e)}

@app.post("/analyze")
def analyze_video(data:Compare):
    try:
        content = get_content(data.content)
        tru_app, llm_app = get_tru_analysis_apps()
        with tru_app as recording:
            llm_app.analyze(content=content, guidelines=data.guidelines, youtube_url=data.youtube_url)

        return {"data": llm_app.comparision, "ok": True}
    except Exception as e:
        return {"data": None, "ok": False, "error": str(e)}