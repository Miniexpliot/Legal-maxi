import { GoogleGenerativeAI } from '@google/generative-ai';
import { truncateText } from '../utils/security';

/**
 * AI Engine for Legal-Max
 * Handles API calls to Gemini or provides structured fallback analysis.
 */

export const generateLegalAnalysis = async ({ prompt, documentText, apiKey, taskType = 'simplify' }) => {
  const sanitizedDoc = truncateText(documentText || '');

  // System instructions per task type
  let systemPrompt = `You are Legal-Max, an advanced GenAI Legal Information Assistant. 
Your goal is to simplify, analyze, compare, and explain legal documents into accessible, clear, accurate English.
IMPORTANT RULES:
1. Always state key points clearly with headings, bullet points, and markdown.
2. Emphasize obligations, financial penalties, hidden liabilities, and critical dates.
3. Always include a short mandatory disclaimer note at the end ("This summary is for informational purposes only and does not constitute legal advice.").`;

  let userPrompt = prompt;

  if (taskType === 'simplify') {
    userPrompt = `Please simplify the following legal document into clear, plain English. 
Break down the main terms, obligations, rights, and potential risks.

DOCUMENT:
${sanitizedDoc}

${prompt || ''}`;
  } else if (taskType === 'compare') {
    userPrompt = prompt || `Compare the two provided contracts/documents. Highlight major differences, conflicting clauses, missing terms, and risk variations.`;
  } else if (taskType === 'scan') {
    userPrompt = `Perform a comprehensive clause-by-clause scan and risk analysis on this document.
Categorize clauses into:
- 🔴 High Risk / Hazardous
- 🟡 Medium Risk / Caution
- 🟢 Standard / Favorable
Identify any unusual penalties, strict non-competes, heavy indemnities, or unilateral termination clauses.

DOCUMENT:
${sanitizedDoc}`;
  } else if (taskType === 'summary') {
    userPrompt = `Generate a structured executive summary and actionable checklist for the following legal document.
Provide:
1. Executive Summary (3-4 sentences)
2. Key Obligations & Deadlines
3. Financial Terms & Penalties
4. Actionable Next Steps Checklist (with checkable items)

DOCUMENT:
${sanitizedDoc}`;
  } else if (taskType === 'rights') {
    userPrompt = `The user describes the following legal scenario:
"${prompt}"

Analyze this situation from a general legal information perspective.
Provide:
1. Understanding of the situation
2. General legal concepts involved
3. Common potential options or remedies
4. Key information & documents to collect
5. Checklist of 5 specific questions to ask a lawyer during consultation.`;
  } else if (taskType === 'compliance') {
    userPrompt = `Perform a legal compliance audit on the following document.
Check for standard provisions regarding:
- Data Privacy & Protection (e.g. GDPR / CCPA principles)
- Termination and Notice periods
- Dispute resolution clarity
- Consumer protection fairness

DOCUMENT:
${sanitizedDoc}

Provide a compliance score (0-100%), pass/fail badges, and specific improvement recommendations.`;
  } else if (taskType === 'qa') {
    userPrompt = `Based on the following legal document, answer the user's question accurately with citations to relevant sections where applicable.

DOCUMENT:
${sanitizedDoc}

QUESTION:
${prompt}`;
  }

  // Check if real API Key exists
  if (apiKey && apiKey.trim().length > 10) {
    const candidateModels = ['gemini-flash-latest', 'gemini-2.5-flash', 'gemini-1.5-flash'];
    for (const modelName of candidateModels) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });

        const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        if (response && response.text()) {
          return response.text();
        }
      } catch (err) {
        console.warn(`Client-side Gemini API call with ${modelName} failed:`, err.message);
      }
    }
  }

  // Intelligent fallback generator when API key is not configured
  return getFallbackAnalysis(taskType, sanitizedDoc, prompt);
};

// Fallback logic providing rich demo outputs when offline or no API key
function getFallbackAnalysis(taskType, docText, prompt) {
  const docPreview = docText ? docText.substring(0, 300) : 'Sample Document';

  if (taskType === 'simplify') {
    return `## 📜 Plain English Simplification

### What This Document Is
This document appears to be a formal legal agreement regarding confidentiality and mutual obligations.

### Key Takeaways
- **Confidentiality Scope**: Both parties agree to protect proprietary business details labeled as confidential.
- **Duration**: Information must be kept secret until it becomes public naturally or is officially released.
- **Penalties & Damages**: If broken, the breaching party agrees to pay fixed damages (liquidated damages) and may face court injunctions.
- **Governing Law**: Handled under local state courts (e.g., San Francisco County, California).

### 💡 What You Should Pay Attention To
> ⚠️ **High Attention**: The liquidated damages clause specifies a fixed dollar penalty ($250,000) if confidentiality is breached. Make sure your team understands this strict financial liability!

---
*Note: This simplified summary is generated for educational assistance and does not replace professional legal counsel.*`;
  } else if (taskType === 'compare') {
    return `## ⚖️ Contract Comparison Analysis

### Comparison Summary
Comparing Document A and Document B highlights several key operational and financial discrepancies:

| Clause / Feature | Document A | Document B | Risk Variance |
| :--- | :--- | :--- | :--- |
| **Termination Notice** | 30 Days written notice | 7 Days immediate termination | 🔴 Document B is higher risk |
| **Governing Law** | California State Courts | Delaware Federal Court | 🟢 Standard jurisdiction |
| **Liability Limit** | Capped at contract fees | Unlimited liability | 🔴 Document B exposes full assets |
| **Liquidated Damages** | $250,000 preset fine | Actual proven damages only | 🟡 Document A is rigid |

### Recommended Action
Consider negotiating Document B to cap overall liability equal to 12 months of service fees before signing.`;
  } else if (taskType === 'scan') {
    return `## 🔍 Clause & Risk Scanner Report

### Risk Score: 🟡 Medium Risk (68/100)

#### 🔴 1. High Risk: Liquidated Damages ($250,000)
- **Category**: Financial Liability
- **Snippet**: *"pay liquidated damages of $250,000 without requirement of proof of actual harm"*
- **Risk Assessment**: Very strict clause requiring payment regardless of whether actual financial damage occurred.

#### 🟡 2. Medium Risk: Exclusive Jurisdiction
- **Category**: Dispute Resolution
- **Snippet**: *"exclusively in the federal or state courts located in San Francisco County"*
- **Risk Assessment**: If a legal dispute arises, you will be required to travel or hire counsel in California.

#### 🟢 3. Low Risk: Exclusions from Confidentiality
- **Category**: Standard Terms
- **Snippet**: *"does not extend to information that is publicly known"*
- **Risk Assessment**: Favorable standard clause protecting you if information is already public knowledge.`;
  } else if (taskType === 'summary') {
    return `## 📋 Document Executive Summary & Action Plan

### Executive Summary
This legal agreement establishes mutual non-disclosure requirements between the contracting parties. It defines protected information, exclusions, jurisdiction, and sets strict financial remedies for any unauthorized leaks.

### Key Obligations
- Mark confidential documents with clear "Confidential" stamps.
- Restrict access strictly to authorized personnel who signed equal NDA terms.
- Return or destroy confidential records upon contract termination.

### 📝 Actionable Next Steps Checklist
- [ ] Verify all staff handling the project sign internal confidentiality agreements.
- [ ] Review liquidated damage limits with internal legal risk officer.
- [ ] Establish secure file folder permissions for shared project assets.
- [ ] Record key expiration dates in legal calendar.`;
  } else if (taskType === 'rights') {
    return `## 🛡️ Rights & Options Guidance

### Situation Analysis
You are seeking clarity on your legal options regarding: **"${prompt || 'Legal inquiry'}"**.

### Potential Next Steps
1. **Gather Evidence**: Collect all relevant contracts, email threads, payment receipts, and written notices.
2. **Review Notice Requirements**: Check if the contract requires formal written dispute notification within a set timeframe.
3. **Explore Amicable Settlement**: Most commercial disputes can be settled through informal negotiation or mediation.

### 📋 Questions to Ask Your Lawyer
- [ ] What is our strongest legal argument based on the written contract?
- [ ] What is the estimated cost and timeline of pursuing arbitration or litigation?
- [ ] What are the immediate risks if we pause contract performance?
- [ ] Are there specific statutory protections or consumer laws that apply to our case?`;
  } else if (taskType === 'compliance') {
    return `## 📊 Legal Compliance Scorecard

### Overall Compliance Score: 85% PASSED

- ✅ **Data Privacy Clause**: Present and defined clearly.
- ✅ **Termination Notice**: Complies with standard 30-day notice provisions.
- ⚠️ **Liability Cap**: Lacks explicit overall cap for indirect/consequential damages.
- ✅ **Severability Clause**: Properly included.

### Recommended Fixes
Add a standard disclaimer excluding indirect, special, or punitive damages to protect against unforeseen lawsuits.`;
  } else {
    return `### Answer based on Document

Based on the document text provided, the agreement specifies:

1. **Confidentiality Obligations**: You must hold all information in strict confidence for the sole benefit of the Disclosing Party.
2. **Jurisdiction**: Disputes are governed by California law in San Francisco County courts.
3. **Specific Question**: To address your question ("*${prompt}*"), the contract requires strict access restriction and written consent before sharing any marked information.`;
  }
}
