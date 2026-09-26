import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Menu, Scale } from 'lucide-react';
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

const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 transition-colors">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Scale className="w-5 h-5" />
          </div>
          <span className="font-heading font-extrabold text-base tracking-tight text-white">
            Legal<span className="gradient-text">-Max</span>
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Main Sidebar */}
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
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
  );
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <AppLayout />
      </Router>
    </AppProvider>
  );
};

export default App;
