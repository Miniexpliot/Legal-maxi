import re
from typing import Tuple, Optional

ACADEMIC_PATTERNS = [
    re.compile(r"\b(?:syllabus|curriculum|course\s+code|credits?|semester|examination|marksheet|grade\s+card|roll\s+no|theory\s+examination|cluster\s+university|ug\s+syllabus|pg\s+syllabus|b\.?tech|m\.?tech|bca|mca|cbse|icse|ncert|homework|assignment|lecture\s+notes|textbook|unit\s+[-–—\d]+|course\s+objectives?|learning\s+outcomes?)\b", re.IGNORECASE),
    re.compile(r"\b(?:department\s+of|faculty\s+of|school\s+of\s+engineering|academic\s+year|internal\s+assessment|practical\s+exam)\b", re.IGNORECASE)
]

CODE_PATTERNS = [
    re.compile(r"\b(?:def\s+[a-zA-Z_]\w*\(|import\s+[a-zA-Z_]|from\s+[a-zA-Z_].*import|console\.log|function\s*\([^\)]*\)\s*\{|public\s+class\s+|#include\s+<|<!DOCTYPE\s+html>)\b", re.IGNORECASE)
]

LEGAL_KEYWORDS = [
    re.compile(r"\b(?:agreement|contract|party|parties|disclosing\s+party|receiving\s+party|employer|employee|contractor|client|lessor|lessee|licensor|licensee)\b", re.IGNORECASE),
    re.compile(r"\b(?:whereas|witnesseth|herein|hereafter|covenants?|undertakings?|shall\s+not\s+disclose|terms?\s+and\s+conditions?)\b", re.IGNORECASE),
    re.compile(r"\b(?:confidential\s+information|proprietary|non-disclosure|liquidated\s+damages|indemnif\w+|limitation\s+of\s+liability)\b", re.IGNORECASE),
    re.compile(r"\b(?:termination\s+for\s+cause|notice\s+period|cure\s+period|governing\s+law|jurisdiction|arbitration|dispute\s+resolution)\b", re.IGNORECASE),
    re.compile(r"\b(?:severability|entire\s+agreement|counterparts|in\s+witness\s+whereof|force\s+majeure|statute|regulation|privacy\s+policy)\b", re.IGNORECASE)
]

def validate_legal_document(text: str, filename: Optional[str] = None) -> Tuple[bool, str, Optional[str]]:
    """
    Validates whether text content represents a legitimate legal document.
    Returns: (is_legal, detected_classification, failure_reason)
    """
    sample = (f"{filename or ''}\n{text or ''}")[:8000].strip()
    
    if len(sample) < 40:
        return False, "Empty / Insufficient Content", "File contains too little readable text to evaluate."

    # Count positive legal markers
    legal_matches = sum(1 for p in LEGAL_KEYWORDS if p.search(sample))

    # Academic Syllabus / Marksheet
    if any(p.search(sample) for p in ACADEMIC_PATTERNS) and legal_matches < 2:
        detected_type = "Academic Syllabus / Course Curriculum"
        if re.search(r"\bmarksheet|grade\s+card|roll\s+no|result\b", sample, re.IGNORECASE):
            detected_type = "Academic Marksheet / Student Record"
        elif re.search(r"\bsyllabus|credits?|course\s+code\b", sample, re.IGNORECASE):
            detected_type = "University / School Course Syllabus"
        return False, detected_type, "Document contains educational curriculum or student marks instead of contractual legal clauses."

    # Programming Code
    if any(p.search(sample) for p in CODE_PATTERNS) and legal_matches < 2:
        return False, "Source Code / Software Script", "File contains programming code instead of legal terms or policies."

    # General Non-Legal (long text with zero legal markers)
    if len(sample) > 300 and legal_matches == 0:
        return False, "General Non-Legal Document", "Document lacks recognized legal terminology, covenants, contractual parties, or statutory references."

    return True, "Legal Instrument / Contract", None

def get_non_legal_notice(detected_type: str, reason: str, doc_name: str = "Uploaded Document") -> str:
    return f"""## ⚠️ Non-Legal Document Detected

**Uploaded Document:** `{doc_name}`  
**Detected Content Classification:** **{detected_type}**

---

### 🚫 Why This Cannot Be Analyzed as a Legal Agreement
Legal-Max is an AI assistant engineered strictly for **legal agreements, contracts, court filings, statutes, and regulatory documents**.

> **Audit Finding:** {reason}

The provided document lacks core contractual instruments:
- ❌ **No defined legal parties** (e.g., Disclosing/Receiving Party, Employer/Contractor, Licensor/Licensee)
- ❌ **No mutual consideration or legal covenants** (e.g., Confidentiality, Warranties, Intellectual Property ownership)
- ❌ **No breach consequences, indemnities, or liability caps**
- ❌ **No governing jurisdiction or dispute resolution forum**

---

### 📋 Recommended Next Steps:
To generate legal summaries, clause heatmaps, or redline diffs, please upload a recognized legal agreement, such as:
1. **Non-Disclosure Agreements (NDAs)** — *Mutual or Unilateral*
2. **Employment & Contractor Agreements** — *IP assignment, notice periods*
3. **Software Licenses & SaaS Terms** — *EULAs, SLAs, Data Processing Addenda (DPAs)*
4. **Commercial & Residential Leases** — *Default clauses, security deposit remedies*
5. **Vendor, Partnership & Procurement Agreements**

---
*Notice: Legal-Max automatically detects document classifications to prevent hallucinated legal interpretations of academic, personal, or technical files.*"""
