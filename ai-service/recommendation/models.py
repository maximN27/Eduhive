from pydantic import BaseModel, Field


class UserProfile(BaseModel):
    experienceLevel: str = "Beginner"
    interests: list[str] = Field(default_factory=list)
    preferredLanguage: str = "English"
    preferredResourceType: str = "All"


class CandidateResource(BaseModel):
    id: str
    title: str
    type: str
    url: str
    tags: list[str] = Field(default_factory=list)


class RecommendationRequest(BaseModel):
    userProfile: UserProfile
    candidateResources: list[CandidateResource]


class Recommendation(BaseModel):
    resourceId: str
    title: str
    reason: str
    score: float = Field(ge=0, le=10)


class RecommendationResponse(BaseModel):
    recommendations: list[Recommendation]
