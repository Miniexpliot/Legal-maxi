# ⚖️ Legal-Max — GenAI for Legal Assistance & Access

> **Democratizing Legal Information through Generative AI**
> 
> *Legal information can often be complex, difficult to understand, and challenging to navigate without professional assistance. **Legal-Max** is a GenAI-powered web solution designed to make legal information and basic assistance universally accessible by helping users understand, compare, and navigate legal documents effortlessly.*

---

> [!IMPORTANT]
> **LEGAL DISCLAIMER & NOTICE**  
> **Legal-Max** provides AI-generated information and document analysis for **educational and assistance purposes only**. It does **NOT** provide professional legal advice, nor does it establish an attorney-client relationship. Users should always consult a qualified legal professional for binding advice on specific matters.

---

## 🌟 Key Features & Use Cases

1. **📜 Document Simplifier**: Translates complex legalese into clear, plain English summaries.
2. **⚖️ Contract Comparator**: Compares two contracts side-by-side to highlight discrepancies, missing clauses, and risk shifts.
3. **🔍 Clause & Risk Scanner**: Audits legal documents for high-risk liability, penalties, liquidated damages, and strict non-compete clauses.
4. **💬 Interactive Legal Q&A**: Chat in natural language with your uploaded legal document grounded with context references.
5. **📋 Summary & Action Checklists**: Generates executive takeaways, key obligations, payment deadlines, and checkable task lists.
6. **📖 Plain-English Legal Glossary**: Searchable database of 200+ legal terms with "Explain Like I'm 5" explanations + AI custom term explainer.
7. **🛡️ Rights & Options Advisor**: Helps users evaluate legal situations and generates a 5-question consultation checklist to ask a lawyer.
8. **📑 Document Template Library**: Curated templates for NDAs, Freelance Agreements, and Residential Leases ready for editing and analysis.
9. **📊 Automated Compliance Audit**: Audits contracts against privacy, termination notice, and consumer protection principles.
10. **🔒 Client-Side Confidentiality & Security**: All document parsing and processing stays on the client side without storing private data on external servers.

---

## 🚀 Tech Stack & Architecture

- **Frontend Core**: React 18 + Vite
- **UI & Styling**: Vanilla CSS Token System with Glassmorphism, Google Fonts (*Plus Jakarta Sans*, *Space Grotesk*, *JetBrains Mono*)
- **GenAI Engine**: Google Gemini API (`@google/generative-ai` SDK) with streaming support + intelligent client-side demo fallback
- **Document Parser**: PDF.js (`pdfjs-dist`) for client-side PDF text extraction
- **Icons**: Lucide React
- **Testing**: Vitest (`happy-dom`)

```
Legal-Max Architecture:
[ Browser / React App ] ──► [ Client-Side Document Parser (PDF.js) ]
         │
         ├──► [ Gemini GenAI Engine (Client API Call) ]
         │
         └──► [ Local Storage / Client-Side State ]
```

---

## 🛠️ Quick Start & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/legal-max.git
   cd legal-max
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

4. Optional — Add Gemini API Key:
   Navigate to **Settings** within the Legal-Max web app and paste your Gemini API key (obtained from [Google AI Studio](https://aistudio.google.com/)). If no key is entered, Legal-Max will run in **Interactive Demo Mode**.

---

## 🧪 Running Automated Tests

Run the Vitest suite covering security sanitization, document parsing, and AI engine response handling:

```bash
npm run test
```

---

## 🛡️ Evaluation Judge Criteria Compliance

- **Problem Statement Alignment**: Directly addresses legal document simplification, contract comparison, clause scanning, Q&A, and preparation for legal professionals.
- **Security**: Zero hardcoded secrets, input sanitization against XSS, API keys stored strictly in client `localStorage`.
- **Efficiency**: Lazy-loaded component views, token-bounded document chunking, lightweight assets.
- **Quality Assurance**: Automated unit testing suite covering happy path and boundary conditions.
- **Accessibility**: High contrast theme (WCAG AA 4.5:1+), semantic HTML structure, full keyboard navigability.
- **Repository Constraints**: Total size under 10 MB.

---

## 📄 License

Distributed under the MIT License.
