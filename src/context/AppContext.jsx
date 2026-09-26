import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredApiKey, setStoredApiKey, checkBackendHealth } from '../services/apiClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [apiKey, setApiKeyState] = useState(() => {
    return getStoredApiKey() || localStorage.getItem('legal_max_api_key') || (import.meta.env.VITE_GEMINI_API_KEY || '');
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('legal_max_theme') || 'dark';
  });

  const [backendStatus, setBackendStatus] = useState({
    online: false,
    checked: false,
    service: 'Checking...',
    version: ''
  });

  const [readingLevel, setReadingLevel] = useState('executive'); // 'eli5', 'executive', 'paralegal'
  const [autoRedactPii, setAutoRedactPii] = useState(true);
  const [activeChecklist, setActiveChecklist] = useState({});

  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('legal_max_documents');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [
      {
        id: 'sample-nda-1',
        name: 'Sample Non-Disclosure Agreement.txt',
        size: '4.2 KB',
        type: 'text/plain',
        uploadDate: new Date().toISOString(),
        text: `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into as of January 15, 2026, by and between Nexus Tech Inc. ("Disclosing Party") and Quantum Innovations LLC ("Receiving Party").

1. CONFIDENTIAL INFORMATION
For purposes of this Agreement, "Confidential Information" shall include all information or material that has or could have commercial value or other utility in the business in which Disclosing Party is engaged. If Information is in written form, the Disclosing Party shall label or stamp the materials with the word "Confidential" or some similar warning.

2. OBLIGATIONS OF RECEIVING PARTY
Receiving Party shall hold and maintain the Confidential Information in strictest confidence for the sole and exclusive benefit of the Disclosing Party. Receiving Party shall carefully restrict access to Confidential Information to employees, contractors, and third parties as is reasonably required and shall require those persons to sign non-disclosure restrictions at least as protective as those in this Agreement.

3. EXCLUSIONS FROM CONFIDENTIALITY
Receiving Party's obligations under this Agreement do not extend to information that is: (a) publicly known at the time of disclosure or subsequently becomes publicly known through no fault of the Receiving Party; (b) discovered or created by the Receiving Party before disclosure by Disclosing Party; (c) learned by the Receiving Party through legitimate means other than from the Disclosing Party; or (d) disclosed by Receiving Party with Disclosing Party's prior written consent.

4. TERM & TERMINATION
The non-disclosure provisions of this Agreement shall survive the termination of this Agreement and Receiving Party's duty to hold Confidential Information in confidence shall remain in effect until the Confidential Information no longer qualifies as a trade secret or until Disclosing Party releases Receiving Party from such obligation in writing.

5. GOVERNING LAW & JURISDICTION
This Agreement shall be governed by and construed in accordance with the laws of the State of California, without giving effect to any principles of conflicts of law. Any legal action or proceeding arising under this Agreement will be brought exclusively in the federal or state courts located in San Francisco County, California.

6. LIQUIDATED DAMAGES & INJUNCTIVE RELIEF
In the event of a breach by Receiving Party, Receiving Party agrees to pay liquidated damages of $250,000 without requirement of proof of actual harm. Furthermore, Disclosing Party shall be entitled to seek injunctive relief without posting a bond.`
      },
      {
        id: 'sample-freelance-2',
        name: 'Independent Contractor Agreement.txt',
        size: '3.8 KB',
        type: 'text/plain',
        uploadDate: new Date().toISOString(),
        text: `INDEPENDENT CONTRACTOR AGREEMENT

This Independent Contractor Agreement is entered into by Client Co and Freelancer Pro.
1. SERVICES: Freelancer shall deliver Full-Stack Application Engineering services.
2. COMPENSATION: Fixed milestone payment of $12,500 payable net 15 days upon milestone verification.
3. INTELLECTUAL PROPERTY: All deliverables belong exclusively to Client upon full receipt of final payment.
4. TERMINATION: Either party may terminate with 14 days written notice. Client pays for all work approved prior to termination.
5. LIABILITY: Maximum aggregate liability of Contractor is limited to total fees received under this agreement.`
      }
    ];
  });

  const [activeDocId, setActiveDocId] = useState('sample-nda-1');

  const setApiKey = (key) => {
    setApiKeyState(key);
    setStoredApiKey(key);
    localStorage.setItem('legal_max_api_key', key);
  };

  const refreshBackendStatus = async () => {
    const status = await checkBackendHealth();
    setBackendStatus({ checked: true, ...status });
  };

  useEffect(() => {
    refreshBackendStatus();
  }, []);

  useEffect(() => {
    localStorage.setItem('legal_max_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('legal_max_documents', JSON.stringify(documents));
  }, [documents]);

  const activeDocument = documents.find(d => d.id === activeDocId) || documents[0] || null;

  const addDocument = (doc) => {
    setDocuments(prev => [doc, ...prev]);
    setActiveDocId(doc.id);
  };

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (activeDocId === id) {
      const remaining = documents.filter(d => d.id !== id);
      setActiveDocId(remaining[0]?.id || null);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleChecklistItem = (id) => {
    setActiveChecklist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <AppContext.Provider value={{
      apiKey,
      setApiKey,
      theme,
      toggleTheme,
      documents,
      addDocument,
      deleteDocument,
      activeDocId,
      setActiveDocId,
      activeDocument,
      backendStatus,
      refreshBackendStatus,
      readingLevel,
      setReadingLevel,
      autoRedactPii,
      setAutoRedactPii,
      activeChecklist,
      toggleChecklistItem
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
