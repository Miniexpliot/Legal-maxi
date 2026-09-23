import React from 'react';
import { Link } from 'react-router-dom';
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
  FolderOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import FileUploader from '../components/FileUploader';
import DisclaimerBanner from '../components/DisclaimerBanner';

const featureCards = [
  {
    path: '/simplify',
    title: 'Document Simplifier',
    description: 'Transform complex legal agreements and jargon into clear, plain English summaries.',
    icon: FileText,
    color: 'from-indigo-500 to-blue-500'
  },
  {
    path: '/compare',
    title: 'Contract Comparator',
    description: 'Compare two contracts side-by-side to highlight risk variations and missing terms.',
    icon: GitCompare,
    color: 'from-purple-500 to-indigo-500'
  },
  {
    path: '/scan',
    title: 'Clause & Risk Scanner',
    description: 'Automatically scan documents for high-risk liability, penalty, and non-compete clauses.',
    icon: ShieldAlert,
    color: 'from-rose-500 to-amber-500'
  },
  {
    path: '/qa',
    title: 'Legal Q&A Assistant',
    description: 'Ask questions in plain language and get instant, context-aware answers from your document.',
    icon: MessageSquare,
    color: 'from-emerald-500 to-teal-500'
  },
  {
    path: '/summary',
    title: 'Summary & Checklists',
    description: 'Generate structured executive summaries, obligation timelines, and checkable action items.',
    icon: ListCheck,
    color: 'from-cyan-500 to-blue-500'
  },
  {
    path: '/glossary',
    title: 'Legal Glossary',
    description: 'Explore 200+ plain English definitions for complex legal terms and concepts.',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-500'
  },
  {
    path: '/rights',
    title: 'Rights & Options Advisor',
    description: 'Understand your options in legal situations and generate checklists for attorney consultations.',
    icon: Scale,
    color: 'from-pink-500 to-rose-500'
  },
  {
    path: '/templates',
    title: 'Document Templates',
    description: 'Access and customize foundational contracts including NDAs, Lease agreements, and Freelance terms.',
    icon: FileCode2,
    color: 'from-indigo-500 to-violet-500'
  },
  {
    path: '/compliance',
    title: 'Compliance Audit',
    description: 'Run automated compliance scorecards covering privacy, notice, and consumer fairness basics.',
    icon: CheckCircle2,
    color: 'from-emerald-500 to-indigo-500'
  }
];

const Dashboard = () => {
  const { documents, activeDocument, setActiveDocId, addDocument } = useApp();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Banner */}
      <div className="glass-panel p-8 relative overflow-hidden border border-indigo-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            GenAI-Powered Legal Intelligence Platform
          </div>

          <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-white tracking-tight leading-tight">
            Democratizing Legal Information with <span className="gradient-text">Legal-Max</span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            Understand complex contracts, identify hidden risks, compare agreements, and navigate your legal rights effortlessly without expensive barriers.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-400" /> Client-Side Privacy</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-amber-400" /> Instant Gemini AI Processing</span>
            <span className="flex items-center gap-1.5"><FolderOpen className="w-4 h-4 text-indigo-400" /> Multi-Document Workspace</span>
          </div>
        </div>
      </div>

      <DisclaimerBanner />

      {/* Active Document Selector & Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 glass-panel p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center justify-between">
            <span>Workspace Documents</span>
            <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">{documents.length}</span>
          </h3>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveDocId(doc.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                  activeDocument?.id === doc.id
                    ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <div className="truncate pr-2">
                  <p className="text-xs font-semibold truncate">{doc.name}</p>
                  <p className="text-[10px] text-slate-500">{doc.size}</p>
                </div>
                {activeDocument?.id === doc.id && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 glass-panel p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Upload New Document to Analyze</h3>
          <FileUploader onDocumentParsed={(newDoc) => addDocument(newDoc)} />
        </div>
      </div>

      {/* Feature Grid */}
      <div>
        <h2 className="text-lg font-heading font-bold text-white mb-4">Legal-Max Intelligence Suite</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.path}
                to={card.path}
                className="glass-panel p-5 group hover:-translate-y-1 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} bg-opacity-20 flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {card.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                  <span>Launch Tool</span>
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
