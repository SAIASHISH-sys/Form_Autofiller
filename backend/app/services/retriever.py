from sqlalchemy.orm import Session
from app.models import ResumeEmbedding
# from app.db.session import get_db
from app.services.embedder import get_query_embeddings

def _dot_score( a:list[float], b:list[float]) -> float:
    return sum( x*y for x, y in zip(a, b))

def retrieve_relevant_chunks(
        db: Session,
        query: str,
        user_id: str,
        top_k: int = 3,
        resume_id: str | None = None
) -> list[dict]:
    
    query_embedding = get_query_embeddings(query)
    #get all chunks for this user's resumes
    q = db.query(ResumeEmbedding).filter(ResumeEmbedding.user_id == user_id)
    if resume_id:
        q = q.filter(ResumeEmbedding.resume_id == resume_id)
    rows = q.all()
    if not rows:
        return []
    
    scored = []
    for idx, row in enumerate(rows):
        score = _dot_score(query_embedding, row.embedding)
        scored.append({
            "chunk_id": str(row.id),
            "text": row.chunk_text,
            "score": score,
            "chunk_index": idx,
            "resume_id": str(row.resume_id),
        })
    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_k]