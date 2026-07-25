from fastapi import APIRouter

from recommendation.models import RecommendationRequest, RecommendationResponse
from recommendation.service import recommend_resources

router = APIRouter()


@router.post("/recommend", response_model=RecommendationResponse)
def recommend(request: RecommendationRequest) -> RecommendationResponse:
    return recommend_resources(request)
