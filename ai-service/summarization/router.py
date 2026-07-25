from fastapi import APIRouter

from summarization.models import SummarizationRequest, SummarizationResponse
from summarization.summarizer import summarize_post

router = APIRouter()


@router.post("/summarize", response_model=SummarizationResponse)
def summarize(request: SummarizationRequest) -> SummarizationResponse:
    return summarize_post(request)
