import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import DocumentSimplifier from './pages/DocumentSimplifier';
import ContractComparator from './pages/ContractComparator';
import ClauseScanner from './pages/ClauseScanner';
import LegalQA from './pages/LegalQA';
import SummaryGenerator from './pages/SummaryGenerator';
import LegalGlossary from './pages/LegalGlossary';
import RightsAdvisor from './pages/RightsAdvisor';
import TemplateLibrary from './pages/TemplateLibrary';
import ComplianceChecker from './pages/ComplianceChecker';
import Settings from './pages/Settings';

const App = () => {
  return (
    <AppProvider>
      <Router>
        <div className="flex min-h-screen bg-slate-950 text-slate-100">
          <Sidebar />

          <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/simplify" element={<DocumentSimplifier />} />
              <Route path="/compare" element={<ContractComparator />} />
              <Route path="/scan" element={<ClauseScanner />} />
              <Route path="/qa" element={<LegalQA />} />
              <Route path="/summary" element={<SummaryGenerator />} />
              <Route path="/glossary" element={<LegalGlossary />} />
              <Route path="/rights" element={<RightsAdvisor />} />
              <Route path="/templates" element={<TemplateLibrary />} />
              <Route path="/compliance" element={<ComplianceChecker />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
