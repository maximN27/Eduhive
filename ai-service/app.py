from fastapi import FastAPI

from recommendation.router import router as recommendation_router
from summarization.router import router as summarization_router

app = FastAPI(title="EduHive AI Service")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "EduHive AI Service"}


app.include_router(summarization_router, prefix="/api/ai")
app.include_router(recommendation_router, prefix="/api/ai")
