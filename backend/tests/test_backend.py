import pytest
from backend.services.pii_scrubber import pii_scrubber
from backend.services.doc_parser import doc_parser
from backend.services.redline_engine import redline_engine
from backend.services.gemini_service import gemini_service
from backend.config import resolve_api_key

def test_pii_scrubber_redacts_ssn_and_email():
    text = "Client SSN is 123-45-6789 and email is lawyer@legaltech.com. Phone: 555-123-4567."
    scrubbed, stats = pii_scrubber.scrub(text)

    assert "[SSN_REDACTED]" in scrubbed
    assert "[EMAIL_REDACTED]" in scrubbed
    assert "[PHONE_REDACTED]" in scrubbed
    assert "123-45-6789" not in scrubbed
    assert "lawyer@legaltech.com" not in scrubbed
    assert stats["SSN"] == 1
    assert stats["EMAIL"] == 1

def test_pii_scrubber_empty_input():
    scrubbed, stats = pii_scrubber.scrub("")
    assert scrubbed == ""
    assert stats == {}

def test_document_chunker():
    sample_text = "\n\n".join([f"Paragraph {i}: This is contractual clause {i} with obligations." for i in range(20)])
    chunks = doc_parser.chunk_document(sample_text, chunk_size=300)

    assert len(chunks) > 1
    assert "chunk_id" in chunks[0]
    assert "text" in chunks[0]

def test_redline_engine_computes_diff():
    doc_a = "The termination notice shall be 30 days.\nGoverning law is California."
    doc_b = "The termination notice shall be 7 days.\nGoverning law is California."

    diff_result = redline_engine.compute_diff(doc_a, doc_b)

    assert "similarity_percentage" in diff_result
    assert diff_result["similarity_percentage"] > 50
    assert diff_result["stats"]["additions"] >= 1
    assert diff_result["stats"]["deletions"] >= 1

def test_resolve_api_key_header_priority():
    header_key = "user-provided-key-xyz"
    resolved = resolve_api_key(header_key)
    assert resolved == header_key

import asyncio

def test_gemini_service_offline_fallback():
    result = asyncio.run(gemini_service.generate_analysis(
        task_type="simplify",
        document_text="Confidential agreement between parties.",
        prompt="Simplify this",
        api_key=None
    ))

    assert result["success"] is True
    assert "Plain-English Simplification" in result["content"]
    assert result["is_live_ai"] is False
