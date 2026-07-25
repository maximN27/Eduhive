from functools import lru_cache

from google import genai

from config import settings


@lru_cache
def get_gemini_client() -> genai.Client:
    api_key = settings.gemini_api_key

    if not api_key or not api_key.strip():
        raise RuntimeError("GEMINI_API_KEY is not configured")

    return genai.Client(api_key=api_key)


def get_gemini_model() -> str:
    return settings.gemini_model
