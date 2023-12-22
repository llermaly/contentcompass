from dotenv import load_dotenv
load_dotenv()

from trulens_eval import Provider
from llama_index.llms.gemini import  Gemini
from llama_index.output_parsers import PydanticOutputParser
from llama_index.program import LLMTextCompletionProgram
from pydantic import BaseModel, Field



guidelines_evaluate_prompt_str = """\
Evaluate the alignment of the provided guidelines with the video transcript on a scale from 0 to 10, where 0 means no alignment and 10 means perfect alignment. Consider how well the guidelines are reflected in the video content as described in the transcript.

Guidelines to be evaluated:
{guidelines}

Video Transcript:
{transcript}

Analysis:
- Determine the relevance of each guideline to the content of the transcript.
- Assess how thoroughly each guideline is embodied in the transcript.
- Provide an overall score (0-10) reflecting the alignment between the guidelines and the transcript content.

Evaluation:\n
"""

feedback_congruence_prompt_str = """\
Evaluate the relevance and accuracy of the provided feedback in relation to the video transcript on a scale from 0 to 10, where 0 means the feedback is entirely unrelated or invented, and 10 means the feedback is perfectly aligned and based on the transcript.

Transcript:
{transcript}

Provided Feedback:
{feedback}

Analysis and Evaluation:
- Review each piece of feedback and identify its connections or references to the transcript.
- Assess how accurately and relevantly the feedback reflects the content of the transcript.
- Assign a score from 0 to 10 for each piece of feedback based on its alignment with the transcript.
- For each feedback, provide a brief justification for the score, explaining the level of relevance to the transcript.

Scores and Justifications:\n
"""


class Output(BaseModel):
    """Data model of the output"""
    score: float = Field(..., description="The score obtained")




class StandAlone(Provider):
    def guidelines_alignment(self, input: str, output:str) -> float:
        
        gemini_llm = Gemini(max_tokens=32000)

        llm_program = LLMTextCompletionProgram.from_defaults(
            output_parser=PydanticOutputParser(Output),
            prompt_template_str=guidelines_evaluate_prompt_str,
            llm=gemini_llm,
            verbose=True,
        )

        response = llm_program(transcript=input, guidelines=output)

        return response.score / 10.0
    
    def feedback_congruence(self, input: str, output:str) -> float:
        
        gemini_llm = Gemini(max_tokens=32000)

        llm_program = LLMTextCompletionProgram.from_defaults(
            output_parser=PydanticOutputParser(Output),
            prompt_template_str=feedback_congruence_prompt_str,
            llm=gemini_llm,
            verbose=True,
        )

        response = llm_program(transcript=input, feedback=output)

        return response.score / 10.0

