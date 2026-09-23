import io
from typing import List, Dict, Any

class DocumentParserService:
    """
    Service for parsing PDF, DOCX, and TXT documents into indexed text blocks.
    Enables precise paragraph and line-level citation grounding for legal analysis.
    """

    @staticmethod
    def extract_text_from_pdf(file_bytes: bytes) -> str:
        try:
            import pypdf
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            text_pages = []
            for idx, page in enumerate(reader.pages):
                page_text = page.extract_text() or ""
                text_pages.append(f"--- Page {idx + 1} ---\n{page_text}")
            return "\n\n".join(text_pages)
        except Exception as e:
            return f"Error extracting PDF: {str(e)}"

    @staticmethod
    def extract_text_from_docx(file_bytes: bytes) -> str:
        try:
            import docx
            doc = docx.Document(io.BytesIO(file_bytes))
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            return "\n\n".join(paragraphs)
        except Exception as e:
            return f"Error extracting DOCX: {str(e)}"

    @staticmethod
    def chunk_document(text: str, chunk_size: int = 1500, overlap: int = 200) -> List[Dict[str, Any]]:
        """
        Splits legal text into overlapping chunks with metadata for RAG citation grounding.
        """
        if not text:
            return []

        paragraphs = text.split("\n\n")
        chunks = []
        current_chunk = []
        current_len = 0
        chunk_idx = 0

        for p in paragraphs:
            p_len = len(p)
            if current_len + p_len > chunk_size and current_chunk:
                chunk_text = "\n\n".join(current_chunk)
                chunks.append({
                    "chunk_id": chunk_idx,
                    "text": chunk_text,
                    "length": len(chunk_text)
                })
                chunk_idx += 1
                # Keep some overlap
                current_chunk = [current_chunk[-1]] if len(current_chunk) > 1 else []
                current_len = sum(len(c) for c in current_chunk)

            current_chunk.append(p)
            current_len += p_len

        if current_chunk:
            chunk_text = "\n\n".join(current_chunk)
            chunks.append({
                "chunk_id": chunk_idx,
                "text": chunk_text,
                "length": len(chunk_text)
            })

        return chunks

doc_parser = DocumentParserService()
