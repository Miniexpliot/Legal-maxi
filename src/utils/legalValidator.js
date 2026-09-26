/**
 * Legal Document Validator for Legal-Max
 * Evaluates whether uploaded document content is a genuine legal instrument
 * (contract, agreement, policy, statute, court filing) vs non-legal content
 * (academic syllabus, school marksheet, code, recipe, casual notes).
 */

const ACADEMIC_PATTERNS = [
  /\b(?:syllabus|curriculum|course\s+code|credits?|semester|examination|marksheet|grade\s+card|roll\s+no|theory\s+examination|cluster\s+university|ug\s+syllabus|pg\s+syllabus|b\.?tech|m\.?tech|bca|mca|cbse|icse|ncert|homework|assignment|lecture\s+notes|textbook|unit\s+[-–—\d]+|course\s+objectives?|learning\s+outcomes?)\b/i,
  /\b(?:department\s+of|faculty\s+of|school\s+of\s+engineering|academic\s+year|internal\s+assessment|practical\s+exam)\b/i
];

const CODE_PATTERNS = [
  /\b(?:def\s+[a-zA-Z_]\w*\(|import\s+[a-zA-Z_]|from\s+[a-zA-Z_].*import|console\.log|function\s*\([^\)]*\)\s*\{|public\s+class\s+|#include\s+<|<!DOCTYPE\s+html>)\b/i
];

const CASUAL_PATTERNS = [
  /\b(?:ingredients?|recipe|tablespoon|teaspoon|preheat\s+oven|mix\s+well|dear\s+diary|chapter\s+\d+|once\s+upon\s+a\s+time)\b/i
];

const LEGAL_KEYWORDS = [
  /\b(?:agreement|contract|party|parties|disclosing\s+party|receiving\s+party|employer|employee|contractor|client|lessor|lessee|licensor|licensee)\b/i,
  /\b(?:whereas|witnesseth|herein|hereafter|covenants?|undertakings?|shall\s+not\s+disclose|terms?\s+and\s+conditions?)\b/i,
  /\b(?:confidential\s+information|proprietary|non-disclosure|liquidated\s+damages|indemnif\w+|limitation\s+of\s+liability)\b/i,
  /\b(?:termination\s+for\s+cause|notice\s+period|cure\s+period|governing\s+law|jurisdiction|arbitration|dispute\s+resolution)\b/i,
  /\b(?:severability|entire\s+agreement|counterparts|in\s+witness\s+whereof|force\s+majeure|statute|regulation|privacy\s+policy)\b/i
];

/**
 * Validates whether a text document has genuine legal substance
 */
export const validateLegalDocument = (text = '', title = '') => {
  const combined = `${title}\n${text}`.toLowerCase();
  const trimmed = text.trim();

  // 1. Extreme short / empty content
  if (trimmed.length < 50) {
    return {
      isLegal: false,
      detectedType: 'Insufficient / Empty Content',
      reason: 'The uploaded file is empty or contains too few characters to evaluate.'
    };
  }

  // 2. Academic Syllabus or Marksheet Check
  const hasAcademic = ACADEMIC_PATTERNS.some(p => p.test(combined));
  // Count legal matches
  const legalMatches = LEGAL_KEYWORDS.filter(p => p.test(combined)).length;

  if (hasAcademic && legalMatches < 2) {
    let specificType = 'Academic Syllabus / Course Curriculum';
    if (/\bmarksheet|grade\s+card|roll\s+no|result\b/i.test(combined)) {
      specificType = 'Academic Marksheet / Student Record';
    } else if (/\bsyllabus|credits?|course\s+code\b/i.test(combined)) {
      specificType = 'University / School Syllabus';
    }

    return {
      isLegal: false,
      detectedType: specificType,
      reason: 'Contains academic coursework, credit structures, or syllabus examination details rather than contractual rights, liabilities, or covenants.'
    };
  }

  // 3. Source Code or Programming script
  const hasCode = CODE_PATTERNS.some(p => p.test(combined));
  if (hasCode && legalMatches < 2) {
    return {
      isLegal: false,
      detectedType: 'Source Code / Software Script',
      reason: 'Contains programming code syntax rather than written legal clauses or policies.'
    };
  }

  // 4. Recipe or Casual Fiction
  const hasCasual = CASUAL_PATTERNS.some(p => p.test(combined));
  if (hasCasual && legalMatches < 2) {
    return {
      isLegal: false,
      detectedType: 'Recipe / Casual Fiction',
      reason: 'Contains culinary or literary writing with no legal provisions or obligations.'
    };
  }

  // 5. Total absence of legal vocabulary in long text
  if (trimmed.length > 300 && legalMatches === 0) {
    return {
      isLegal: false,
      detectedType: 'General Non-Legal Document',
      reason: 'The text contains no recognizable legal terms, contractual parties, liability boundaries, or statutory covenants.'
    };
  }

  return {
    isLegal: true,
    detectedType: 'Legal Instrument / Contract',
    reason: null
  };
};

/**
 * Generates an authoritative markdown rejection explanation for non-legal documents
 */
export const getNonLegalDocumentNotice = (validation, docTitle = 'Uploaded Document') => {
  return `## ⚠️ Non-Legal Document Detected

**Uploaded Document:** \`${docTitle}\`  
**Detected Classification:** **${validation.detectedType}**

---

### 🚫 Why This Cannot Be Analyzed as a Legal Agreement
Legal-Max is an AI assistant engineered strictly for **legal agreements, contracts, court filings, statutes, and regulatory documents**.

${validation.reason ? `> **Finding:** ${validation.reason}\n` : ''}

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
*Notice: Legal-Max automatically detects document classifications to prevent hallucinated legal interpretations of academic, personal, or technical files.*`;
};
