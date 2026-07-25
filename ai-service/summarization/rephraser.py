from core.gemini import get_gemini_client, get_gemini_model
from summarization.models import SummarizationPreferences
from summarization.rephrase_prompts import build_rephrase_prompt


def rephrase_summary(
    summary: str,
    preferences: SummarizationPreferences,
) -> str:
    prompt = build_rephrase_prompt(
        summary=summary,
        experience_level=preferences.experienceLevel,
        preferred_language=preferences.preferredLanguage,
    )
    client = get_gemini_client()
    response = client.models.generate_content(
        model=get_gemini_model(),
        contents=prompt,
    )
    rephrased_summary = getattr(response, "text", None)

    if not isinstance(rephrased_summary, str) or not rephrased_summary.strip():
        raise RuntimeError("Gemini returned an empty rephrased summary")

    return rephrased_summary.strip()
