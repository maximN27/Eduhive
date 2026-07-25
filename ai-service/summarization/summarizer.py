from core.gemini import get_gemini_client, get_gemini_model
from summarization.models import SummarizationRequest, SummarizationResponse
from summarization.rephraser import rephrase_summary
from summarization.summary_prompts import build_summary_prompt


def summarize_post(request: SummarizationRequest) -> SummarizationResponse:
    active_comments = [comment for comment in request.comments if not comment.isDeleted]
    prompt = build_summary_prompt(
        title=request.title,
        content=request.content,
        comments=active_comments,
    )

    client = get_gemini_client()
    response = client.models.generate_content(
        model=get_gemini_model(),
        contents=prompt,
    )
    base_summary = getattr(response, "text", None)

    if not isinstance(base_summary, str) or not base_summary.strip():
        raise RuntimeError("Gemini returned an empty summary")

    final_summary = base_summary.strip()
    preferences = request.preferences

    if preferences and (
        (preferences.experienceLevel and preferences.experienceLevel.strip())
        or (preferences.preferredLanguage and preferences.preferredLanguage.strip())
    ):
        final_summary = rephrase_summary(final_summary, preferences)

    return SummarizationResponse(summary=final_summary)
