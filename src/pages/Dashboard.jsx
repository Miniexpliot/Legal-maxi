import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  GitCompare, 
  ShieldAlert, 
  MessageSquare, 
  ListCheck, 
  BookOpen, 
  Scale, 
  FileCode2, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  FolderOpen,
  Server,
  Lock,
  Volume2,
  Calendar,
  AlertTriangle,
  Play,
  Layers,
  CheckCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import FileUploader from '../components/FileUploader';
import DisclaimerBanner from '../components/DisclaimerBanner';

const featureCards = [
  {
    path: '/simplify',
    title: 'Document Simplifier & Audio Explainer',
    category: 'Simplification',
    description: 'Converts complex contracts into ELI5 plain English, visual obligation maps, and text-to-speech audio.',
    icon: FileText,
    badge: 'Audio + Visual Maps',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    path: '/compare',
    title: 'Contract Comparator & Redline Diff',
    category: 'Comparison',
    description: 'Side-by-side textual diffing, discrepancy matrix, and negotiation counter-clause redlines.',
    icon: GitCompare,
    badge: 'Diff Metrics + Shifts',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    path: '/scan',
    title: 'Clause & Risk Scanner with Heatmap',
    category: 'Risk',
    description: 'Audits agreements for liquidated damages, uncapped indemnities, and FTC non-compete compliance.',
    icon: ShieldAlert,
    badge: 'Health Gauge (0-100)',
    color: 'from-rose-500 to-amber-500'
  },
  {
    path: '/qa',
    title: 'Grounded Legal Q&A Assistant',
    category: 'Intelligence',
    description: 'Interrogate contracts with paragraph-level citations, anti-hallucination guardrails, and transcript export.',
    icon: MessageSquare,
    badge: 'RAG Grounded Citations',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    path: '/summary',
    title: 'Executive Briefs & Obligation Tracker',
    category: 'Checklists',
    description: 'Interactive compliance checklist with milestone progress bar and .ICS calendar reminder exports.',
    icon: ListCheck,
    badge: 'Interactive Tasks + .ICS',
    color: 'from-cyan-500 to-blue-500'
  },
  {
    path: '/glossary',
    title: 'Plain-English Legal Glossary',
    category: 'Knowledge',
    description: 'Searchable dictionary of 250+ legal terms with ELI5 definitions and AI-powered custom term explainer.',
    icon: BookOpen,
    badge: '250+ Terms + AI Explainer',
    color: 'from-amber-500 to-orange-500'
  },
  {
    path: '/rights',
    title: 'Rights Advisor & Attorney Prep Sheet',
    category: 'Advisory',
    description: '5-step dispute escalation ladder and printable 5-question attorney consultation intake sheets.',
    icon: Scale,
    badge: 'Attorney Consultation Sheet',
    color: 'from-pink-500 to-rose-500'
  },
  {
    path: '/templates',
    title: 'Playbook Studio & Template Library',
    category: 'Drafting',
    description: 'Standard contract templates (NDAs, Freelance, Lease, Cease & Desist) with 1-click workspace ingestion.',
    icon: FileCode2,
    badge: 'Vetted Clauses & Forms',
    color: 'from-indigo-500 to-violet-500'
  },
  {
    path: '/compliance',
    title: 'Automated Regulatory Compliance Audit',
    category: 'Compliance',
    description: 'Scorecard auditing agreements against GDPR/DPDP data privacy rules, notice periods, and consumer terms.',
    icon: CheckCircle2,
    badge: 'Privacy & Fair Terms',
    color: 'from-emerald-500 to-indigo-500'
  }
];

const Dashboard = () => {
  const { documents, activeDocument, setActiveDocId, addDocument, backendStatus, readingLevel, autoRedactPii } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', 'Simplification', 'Comparison', 'Risk', 'Intelligence', 'Checklists', 'Advisory', 'Compliance'];

  const filteredCards = selectedCategory === 'All'
    ? featureCards
    : featureCards.filter(c => c.category === selectedCategory);

  const activeDocHealth = activeDocument?.text?.includes('$250,000') ? 64 : 88;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Enterprise Stats & Health Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Legal Intelligence</div>
            <div className="text-base font-extrabold text-white flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>55+ AI Features</span>
            </div>
          </div>
          <span className="badge badge-indigo text-[10px]">Active</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Backend Engine</div>
            <div className="text-base font-extrabold text-white flex items-center gap-1.5">
              <Server className={`w-4 h-4 ${backendStatus.online ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span>{backendStatus.online ? 'FastAPI 2.0' : 'In-Browser'}</span>
            </div>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${backendStatus.online ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
            {backendStatus.online ? 'Connected' : 'Offline Mode'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Privacy & PII</div>
            <div className="text-base font-extrabold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>{autoRedactPii ? 'Auto-Redact ON' : 'Standard'}</span>
            </div>
          </div>
          <span className="badge badge-emerald text-[10px]">Zero Storage</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Persona Style</div>
            <div className="text-base font-extrabold text-white flex items-center gap-1.5 capitalize">
              <span>{readingLevel}</span>
            </div>
          </div>
          <span className="badge badge-primary text-[10px]">WCAG 2.1 AA</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="glass-panel p-8 relative overflow-hidden border border-indigo-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Enterprise GenAI Legal Intelligence &amp; Document Review
          </div>

          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
            Democratizing Legal Assistance with <span className="gradient-text">Legal-Max</span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Understand complex contracts, detect buried penalty clauses, generate redline counter-proposals, and produce attorney-ready consultation sheets effortlessly.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-400" /> Client-Side Privacy Sanitizer</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> Grounded Gemini 1.5 Analysis</span>
            <span className="flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-indigo-400" /> Multi-Document Workspace</span>
          </div>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Active Document Overview & Quick Launch Hub */}
      {activeDocument && (
        <div className="glass-panel p-6 border border-slate-800 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Active Workspace Contract</div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2 mt-0.5">
                <FileText className="w-5 h-5 text-indigo-400" />
                {activeDocument.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Size: {activeDocument.size} • Uploaded: {new Date(activeDocument.uploadDate).toLocaleDateString()}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[11px] text-slate-400">Contract Safety Score</div>
                <div className={`text-xl font-black ${activeDocHealth >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {activeDocHealth} / 100
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                activeDocHealth >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {activeDocHealth >= 80 ? '🟢' : '🟡'}
              </div>
            </div>
          </div>

          {/* Quick Action Buttons for Active Document */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-2">
            <button
              onClick={() => navigate('/simplify')}
              className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-800/50 hover:bg-indigo-900/50 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Simplify Document
                </span>
                <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Translate to plain English + audio</div>
            </button>

            <button
              onClick={() => navigate('/scan')}
              className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 hover:bg-rose-900/50 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> Scan Risk Hazards
                </span>
                <ArrowRight className="w-3 h-3 text-rose-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Audit penalty &amp; liability clauses</div>
            </button>

            <button
              onClick={() => navigate('/summary')}
              className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/50 hover:bg-cyan-900/50 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <ListCheck className="w-3.5 h-3.5" /> Action Checklist
                </span>
                <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Track obligations &amp; export .ICS</div>
            </button>

            <button
              onClick={() => navigate('/qa')}
              className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/50 hover:bg-emerald-900/50 text-left transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Ask Questions
                </span>
                <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Grounded clause citations</div>
            </button>
          </div>
        </div>
      )}

      {/* Workspace Documents Management & Uploader */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass-panel p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center justify-between">
            <span>Workspace Document Vault</span>
            <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{documents.length}</span>
          </h3>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveDocId(doc.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                  activeDocument?.id === doc.id
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-white shadow-sm'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="truncate pr-2">
                  <p className="text-xs font-semibold truncate">{doc.name}</p>
                  <p className="text-[10px] text-slate-500">{doc.size}</p>
                </div>
                {activeDocument?.id === doc.id && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Upload Agreement (PDF, DOCX, TXT)</h3>
          <FileUploader onDocumentParsed={(newDoc) => addDocument(newDoc)} />
        </div>
      </div>

      {/* Categorized 55+ Features Suite */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-heading font-bold text-white">Full Legal Intelligence Suite (55+ Capabilities)</h2>
            <p className="text-xs text-slate-400">Explore purpose-built legal AI tools audited against 30-day industry standards.</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-2.5 py-1 rounded-lg transition-all font-medium ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-white'
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
                className="glass-panel p-5 group hover:-translate-y-1 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} bg-opacity-20 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2 font-heading">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {card.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Launch Capability</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
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
