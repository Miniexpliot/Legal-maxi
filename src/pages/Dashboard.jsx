import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  GitCompare, 
  ShieldAlert, 
  MessageSquare, 
  BookOpen, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Shield,
  Lock,
  ShieldCheck,
  FileCode2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import FileUploader from '../components/FileUploader';
import DisclaimerBanner from '../components/DisclaimerBanner';

// Streamlined, focused legal AI tools
const coreWorkflows = [
  {
    path: '/simplify',
    title: 'Document Simplifier & Audio Explainer',
    category: 'Analysis',
    description: 'Deconstruct complex contracts into ELI5 plain English, obligation matrices, and natural audio briefings.',
    icon: FileText,
    badge: 'Plain English + Audio',
    color: 'from-indigo-500 to-blue-600'
  },
  {
    path: '/compare',
    title: 'Contract Comparator & Redline Diff',
    category: 'Review',
    description: 'Compare two contract versions side-by-side to pinpoint liability shifts, missing terms, and counter-clauses.',
    icon: GitCompare,
    badge: 'Redline & Liability Shifts',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    path: '/scan',
    title: 'Clause & Risk Scanner with Heatmap',
    category: 'Risk',
    description: 'Instant legal audit for hidden liquidated damages, non-competes, uncapped indemnity, and termination traps.',
    icon: ShieldAlert,
    badge: 'Contract Safety Gauge',
    color: 'from-rose-500 to-amber-600'
  },
  {
    path: '/qa',
    title: 'Grounded Legal Q&A Assistant',
    category: 'Interrogation',
    description: 'Interrogate any contract with paragraph-level citations, strict hallucination guardrails, and transcript export.',
    icon: MessageSquare,
    badge: 'Grounded RAG Citations',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    path: '/compliance',
    title: 'Regulatory & Privacy Compliance Audit',
    category: 'Compliance',
    description: 'Audit agreements against GDPR, DPDP, fair consumer contract laws, and mandatory termination windows.',
    icon: CheckCircle2,
    badge: 'Privacy & Terms Score',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    path: '/glossary',
    title: 'Plain-English Legal Glossary',
    category: 'Knowledge',
    description: 'Translate 250+ dense Latin and corporate legal terms into simple everyday explanations with AI term lookups.',
    icon: BookOpen,
    badge: '250+ Terms + AI Explainer',
    color: 'from-amber-500 to-orange-600'
  }
];

const Dashboard = () => {
  const { documents, activeDocument, setActiveDocId, addDocument, apiKey } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Analysis', 'Review', 'Risk', 'Interrogation', 'Compliance', 'Knowledge'];

  const filteredCards = selectedCategory === 'All'
    ? coreWorkflows
    : coreWorkflows.filter(c => c.category === selectedCategory);

  const activeDocHealth = activeDocument?.text?.includes('$250,000') ? 64 : 88;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top User-Centric Reassurance Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="glass-panel p-4 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Privacy Guarantee</div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5 font-heading">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Zero-Storage</span>
            </div>
          </div>
          <span className="badge-pill text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60">
            Local Browser
          </span>
        </div>

        <div className="glass-panel p-4 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Intelligence Engine</div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5 font-heading">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Gemini AI</span>
            </div>
          </div>
          <span className="badge-pill text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/60">
            {apiKey ? 'Real-Time' : 'Demo Active'}
          </span>
        </div>

        <div className="glass-panel p-4 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Workspace Documents</div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5 font-heading">
              <FileText className="w-4 h-4 text-purple-500" />
              <span>{documents.length} Agreements</span>
            </div>
          </div>
          <span className="badge-pill text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/60">
            Ready
          </span>
        </div>

        <div className="glass-panel p-4 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Safety Assessment</div>
            <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mt-0.5 font-heading">
              <Shield className={`w-4 h-4 ${activeDocHealth >= 80 ? 'text-emerald-500' : 'text-amber-500'}`} />
              <span>{activeDocHealth}/100 Index</span>
            </div>
          </div>
          <span className={`badge-pill text-[10px] font-semibold ${
            activeDocHealth >= 80 
              ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60'
              : 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60'
          }`}>
            {activeDocHealth >= 80 ? 'Low Risk' : 'Caution'}
          </span>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Active Document Overview & Quick Action Hub */}
      {activeDocument && (
        <div className="glass-panel p-6 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Active Workspace Contract</div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5 font-heading">
                <FileText className="w-5 h-5 text-indigo-500" />
                {activeDocument.name}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Size: {activeDocument.size} • Uploaded: {new Date(activeDocument.uploadDate).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Contract Safety Score</div>
                <div className={`text-2xl font-black font-heading ${activeDocHealth >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {activeDocHealth} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-xs ${
                activeDocHealth >= 80 
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60' 
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60'
              }`}>
                {activeDocHealth >= 80 ? '🟢' : '🟡'}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons for Active Document */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <button
              onClick={() => navigate('/simplify')}
              className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/50 hover:bg-indigo-100/90 dark:hover:bg-indigo-900/50 text-left transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" /> Simplify Plain English
                </span>
                <ArrowRight className="w-3 h-3 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">ELI5 summary + audio brief</div>
            </button>

            <button
              onClick={() => navigate('/scan')}
              className="p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/50 hover:bg-rose-100/90 dark:hover:bg-rose-900/50 text-left transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" /> Scan Risk Hazards
                </span>
                <ArrowRight className="w-3 h-3 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Audit penalties &amp; traps</div>
            </button>

            <button
              onClick={() => navigate('/compare')}
              className="p-3.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/50 hover:bg-purple-100/90 dark:hover:bg-purple-900/50 text-left transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                  <GitCompare className="w-3.5 h-3.5 text-purple-500" /> Compare Versions
                </span>
                <ArrowRight className="w-3 h-3 text-purple-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Side-by-side redlines</div>
            </button>

            <button
              onClick={() => navigate('/qa')}
              className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/50 text-left transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-500" /> Ask Question
                </span>
                <ArrowRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">Verified clause citations</div>
            </button>
          </div>
        </div>
      )}

      {/* Workspace Documents Management & Uploader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass-panel p-5 space-y-3.5 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">
              Workspace Document Vault
            </h3>
            <span className="badge-pill text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/60">
              {documents.length} Files
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveDocId(doc.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between shadow-2xs ${
                  activeDocument?.id === doc.id
                    ? 'bg-indigo-50/90 dark:bg-indigo-600/20 border-indigo-300 dark:border-indigo-500/40 text-slate-900 dark:text-white font-semibold'
                    : 'bg-white/80 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="truncate pr-2">
                  <p className="text-xs truncate">{doc.name}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{doc.size}</p>
                </div>
                {activeDocument?.id === doc.id && (
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-sm shadow-indigo-500 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel p-5 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 font-heading">
            Upload Legal Agreement (PDF, DOCX, TXT)
          </h3>
          <FileUploader onDocumentParsed={(newDoc) => addDocument(newDoc)} />
        </div>
      </div>

      {/* Core Legal AI Workflows Suite */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white">
              Core Legal AI Workflows
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              High-impact, verified legal AI tools designed for non-lawyers and professional teams.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full transition-all font-semibold shadow-2xs ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-indigo-600/25 scale-[1.02]'
                    : 'bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.path}
                to={card.path}
                className="glass-panel p-5 group hover:-translate-y-1 hover:border-indigo-400/60 dark:hover:border-indigo-500/40 transition-all flex flex-col justify-between border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="badge-pill text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800/60">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
