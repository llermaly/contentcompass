from dotenv import load_dotenv
load_dotenv()

from llama_index.llms.gemini import  Gemini
from llama_index.output_parsers import PydanticOutputParser
from llama_index.program import LLMTextCompletionProgram
from pydantic import BaseModel, Field
from typing import List
from trulens_eval.tru_custom_app import instrument
from trulens_eval import Feedback, TruCustomApp
from trulens_feedbacks import StandAlone

prompt_template_str = """\
Please provide a set of guidelines for content creation, that can be directly validated through an analysis of the video content and its transcript by a language model. 
Guidelines must appear in the TEXT provided.

Ignore guidelines from the TEXT that can not be validated by the language model when analyzing the video content and its transcript.
The language model can see text and images of a single video.
Ignore personal advice, and advice that is not directly related to the video content and its transcript.
Ignore things like "post a video everyday" because you can't validate that with the language model.

TEXT:\n {content}\n\n
"""

class Analysis(BaseModel):
    """Data model of the analysis"""
    title: str = Field(..., description="Name of the guideline")

class Output(BaseModel):
    """Data model of the output"""
    guidelines: List[Analysis] = Field(..., description="List of guidelines")

def get_guidelines(content:str = None):    
    gemini_llm = Gemini(max_tokens=32000)

    llm_program = LLMTextCompletionProgram.from_defaults(
        output_parser=PydanticOutputParser(Output),
        prompt_template_str=prompt_template_str,
        llm=gemini_llm,
        verbose=True,
    )


    response = llm_program(content=content)

    return response.guidelines

class GuidelinesWithTrulens:
    guidelines: List[Analysis]  = []

    @instrument
    def extract_guidelines(self, content):
        guidelines = get_guidelines(content)

        self.guidelines = guidelines

        guidelines_str = ""
        for guideline in guidelines:
            guidelines_str += guideline.title + "\n"

        return guidelines_str
    



def get_tru_guidelines_apps() -> (TruCustomApp, GuidelinesWithTrulens):
    standalone = StandAlone()
    f_guidelines_alignment = Feedback(standalone.guidelines_alignment).on_input_output()
    llm_app = GuidelinesWithTrulens()
    tru_app = TruCustomApp(llm_app, app_id = 'Guidelines Alignment', feedbacks = [f_guidelines_alignment])

    return tru_app, llm_app
