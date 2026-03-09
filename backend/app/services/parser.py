import io 
import PyPDF2
from docx import Document

def extract_text_from_pdf(file_bytes: bytes) -> str:
    reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    return " ".join(page.extract_text() for page in reader.pages if page.extract_text())

def extract_text_from_docx(file_bytes: bytes) ->str:
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join(p.text for p in doc.paragraph if p.text.strip())

def extract_text(file_bytes: bytes, content_type: str) -> str:
    if content_type == "application/pdf":
        return extract_text_from_pdf(file_bytes)
    elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessing.document":
        return extract_text_from_docx(file_bytes)
    else:
        raise ValueError(f"Unsupported File Type; {content_type}")