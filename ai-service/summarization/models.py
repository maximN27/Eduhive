from pydantic import BaseModel, Field


class Comment(BaseModel):
    content: str
    isDeleted: bool = False
    parentComment: str | None = None


class SummarizationPreferences(BaseModel):
    experienceLevel: str | None = None
    preferredLanguage: str | None = None


class SummarizationRequest(BaseModel):
    title: str
    content: str
    comments: list[Comment] = Field(default_factory=list)
    preferences: SummarizationPreferences | None = None


class SummarizationResponse(BaseModel):
    summary: str
