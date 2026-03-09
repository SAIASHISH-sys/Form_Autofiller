from google import genai
from app.core.config import Gemin_API_KEY , EMBEDDING_MODEL

client = genai.Client(api_key = Gemin_API_KEY)

def get_embeddings( texts: list[str]) -> list[list[float]]:
    result = client.models.embed_content(
        model = EMBEDDING_MODEL,
        contents = texts,
    )
    return [emb.values for emb in result.embeddings]


def get_query_embeddings( query: str) -> list[float]:
    result = client.models.embed_content(
        model = EMBEDDING_MODEL,
        contents = [query],
    )
    return result.embeddings[0].values