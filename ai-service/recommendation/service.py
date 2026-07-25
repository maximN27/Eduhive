from core.gemini import get_gemini_client, get_gemini_model
from recommendation.models import (
    Recommendation,
    RecommendationRequest,
    RecommendationResponse,
)
from recommendation.prompts import build_recommendation_prompt


def recommend_resources(
    request: RecommendationRequest,
) -> RecommendationResponse:
    if not request.candidateResources:
        return RecommendationResponse(recommendations=[])

    prompt = build_recommendation_prompt(
        user_profile=request.userProfile,
        candidate_resources=request.candidateResources,
    )
    client = get_gemini_client()
    response = client.models.generate_content(
        model=get_gemini_model(),
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": RecommendationResponse,
        },
    )
    response_text = getattr(response, "text", None)

    if not isinstance(response_text, str) or not response_text.strip():
        raise RuntimeError("Gemini returned an empty recommendation response")

    generated_response = RecommendationResponse.model_validate_json(response_text)
    candidate_by_id = {
        candidate.id: candidate for candidate in request.candidateResources
    }
    recommendations_by_id: dict[str, Recommendation] = {}

    for recommendation in generated_response.recommendations:
        candidate = candidate_by_id.get(recommendation.resourceId)
        if not candidate:
            continue

        authoritative_recommendation = Recommendation(
            resourceId=candidate.id,
            title=candidate.title,
            reason=recommendation.reason,
            score=recommendation.score,
        )
        existing = recommendations_by_id.get(candidate.id)

        if existing is None or authoritative_recommendation.score > existing.score:
            recommendations_by_id[candidate.id] = authoritative_recommendation

    recommendations = sorted(
        recommendations_by_id.values(),
        key=lambda recommendation: recommendation.score,
        reverse=True,
    )

    return RecommendationResponse(recommendations=recommendations)
