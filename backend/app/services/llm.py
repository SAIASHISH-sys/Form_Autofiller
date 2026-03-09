from google import genai
from app.core.config import Gemin_API_KEY, LLM_Model

client = genai.Client(api_key = Gemin_API_KEY)

def generate_answer(question: str, content_chunk: list[dict]) -> str:
    context = "\n".join(chunk["text"] for chunk in content_chunk)
    
    response = client.models.generate_content(
        model = LLM_Model,
        contents=f"Context from Resume:\n{context}\n\nQuestion: {question}"
    )
    return response.text