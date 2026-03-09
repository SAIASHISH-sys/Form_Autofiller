from app.core.config import CHUNK_SIZE, CHUNK_OVERLAP

def chunk_text(
        text: str,
        chunk_size: int= CHUNK_SIZE,
        chunk_overlap: int= CHUNK_OVERLAP
) -> list[str]:
    chunks = []
    start = 0
    while start <len(text):
        end = start + chunk_size
        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)
        start += chunk_size - chunk_overlap
    return chunks
