from dotenv import load_dotenv
load_dotenv()
from get_content import get_content_comparison

from vertexai.preview.generative_models import GenerativeModel, Part
from typing import List, Any
import json
import base64
from trulens_eval.tru_custom_app import instrument
from trulens_eval import Feedback, TruCustomApp
from trulens_feedbacks import StandAlone


def comparision_prompt_template_str(guidelines, content):
    return f"""Given this video, and the following transcription I will provide a list of guidelines.
    Please return each of the guidelines and explain if it aligns with the TEXT or not, give a reason why, give feedback to improve, and a score from 1 to 10 for each one.
    If the text doesn't mention the guideline, just ignore it. I will only use the list of guidelines, please include any feedback within each of them instead of at the end, and do not add text besides the guidelines.

    transcription:

    {content}

    guidelines: 

    {guidelines}

    Response must be an array of JSON objects following this schema: 

    {{
    "title": the name of the guideline
    "feedback": reason why it aligns or not, and some improvement advice
    "score": the score given to that guideline
    }}"""

def get_analysis(content:str = None, guidelines:str = None, youtube_url:str = None):
    response = ""
    # download video, convert to base64, and return
    vid_b64 = get_content_comparison(youtube_url, "video")
    video1 = Part.from_data(data=base64.b64decode(vid_b64), mime_type="video/mp4")
    model = GenerativeModel("gemini-pro-vision")
    responses = model.generate_content(
        [video1, comparision_prompt_template_str(guidelines, content)],
        generation_config={
            "max_output_tokens": 2048,
            "temperature": 0.1,
            "top_p": 1,
            "top_k": 32
        },
    stream=True,
    )
    
    for r in responses:
        response += r.candidates[0].content.parts[0].text

    return json.loads(response)


class AnalyzeWithTrulens:
    comparision: Any

    @instrument
    def analyze(self, content, guidelines, youtube_url):
        comparision = get_analysis(content=content, guidelines=guidelines, youtube_url=youtube_url)
        self.comparision = comparision
        feedbacks = ""

        for guideline in comparision:
            feedbacks += f"-{guideline['feedback']}\n"

        return feedbacks

def get_tru_analysis_apps() -> (TruCustomApp, AnalyzeWithTrulens):
    standalone = StandAlone()
    f_feedback_congruence = Feedback(standalone.feedback_congruence).on_input_output()
    llm_app = AnalyzeWithTrulens()
    tru_app = TruCustomApp(llm_app, app_id = 'Feedback congruence', feedbacks = [f_feedback_congruence])

    return tru_app, llm_app
