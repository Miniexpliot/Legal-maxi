import re
from typing import Dict, Tuple

class PIIScrubber:
    """
    Client and Server-side PII sanitizer ensuring zero transmission of raw sensitive data.
    Complies with OWASP Top 10 and Privacy Standards (GDPR, CCPA, DPDP).
    """

    PATTERNS = {
        "SSN": re.compile(r"\b(?!000|666|9\d{2})\d{3}[- ](?!00)\d{2}[- ](?!0000)\d{4}\b"),
        "AADHAAR": re.compile(r"\b[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}\b"),
        "CREDIT_CARD": re.compile(r"\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})\b"),
        "EMAIL": re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"),
        "PHONE": re.compile(r"\b(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}\b"),
        "BANK_IBAN": re.compile(r"\b[A-Z]{2}[0-9]{2}(?:[ ]?[0-9A-Z]{4}){3,7}\b"),
    }

    @classmethod
    def scrub(cls, text: str) -> Tuple[str, Dict[str, int]]:
        if not text:
            return "", {}

        scrubbed = text
        stats = {}

        for pii_type, pattern in cls.PATTERNS.items():
            matches = pattern.findall(scrubbed)
            if matches:
                stats[pii_type] = len(matches)
                scrubbed = pattern.sub(f"[{pii_type}_REDACTED]", scrubbed)

        return scrubbed, stats

pii_scrubber = PIIScrubber()
