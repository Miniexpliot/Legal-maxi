import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Eye, EyeOff, ShieldCheck, Trash2, CheckCircle, Lock, Sliders, FileText, ExternalLink, HardDrive } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

const Settings = () => {
  const {
    apiKey,
    setApiKey,
    isLiveAi,
    documents,
    readingLevel,
    setReadingLevel,
    autoRedactPii,
    setAutoRedactPii
  } = useApp();

  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveKey = (e) => {
    e.preventDefault();
    setApiKey(inputKey.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearDocuments = () => {
    if (confirm("Are you sure you want to permanently clear all cached documents from your browser?")) {
      localStorage.removeItem('legal_max_documents');
      window.location.reload();
    }
  };

  const handleExportAuditLog = () => {
    const auditData = {
      timestamp: new Date().toISOString(),
      documentsCount: documents.length,
      readingLevel,
      autoRedactPii,
      storageArchitecture: '100% Client-Side In-Browser (Zero Remote Document Persistence)',
      privacyStandard: 'GDPR Article 25 (Privacy by Design) + DPDP 2023',
      realtimeAiEngine: apiKey ? 'User Direct Gemini API Key' : 'Managed Free Tier Proxy'
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-max-privacy-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Settings &amp; Privacy Preferences
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Configure real-time Gemini AI keys, local browser storage privacy, and PII redactor.
        </p>
      </div>

      <DisclaimerBanner />

      {/* 100% Client-Side Privacy & Storage Architecture */}
      <div className="glass-panel p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              100% In-Browser Storage &amp; Zero-Retention Privacy
              <span className="badge-pill text-[10px] font-semibold text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800">
                Verified Local Sandbox
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All parsed contracts, PDFs, and chat histories remain strictly in your browser's local sandbox.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Zero Server Storing
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              We never save contracts to any central database or cloud disk. Closing your tab preserves only what is in your private browser cache.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
              <Lock className="w-4 h-4 text-indigo-500" />
              Automatic PII Redaction
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Emails, SSNs, Aadhaar, and phone numbers are automatically sanitized before passing into AI inference.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1">
              <Trash2 className="w-4 h-4 text-rose-500" />
              1-Click Wipe
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              You maintain total data sovereignty. Purge all uploaded documents and keys instantly at any time.
            </p>
          </div>
        </div>
      </div>

      {/* Google Gemini API Key Section */}
      <div className="glass-panel p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-xs">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Google Gemini API Key (Real-Time AI)</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supply your free Gemini API key to avoid shared rate limits and access live real-time model analysis.
              </p>
            </div>
          </div>

          {apiKey ? (
            <span className="badge-pill text-xs font-semibold text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800">
              Personal Key Active
            </span>
          ) : isLiveAi ? (
            <span className="badge-pill text-xs font-semibold text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800">
              Cloud Gemini API Active
            </span>
          ) : (
            <span className="badge-pill text-xs font-semibold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800">
              Demo Shared Mode
            </span>
          )}
        </div>

        <form onSubmit={handleSaveKey} className="space-y-3 pt-2">
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              placeholder="AIzaSy... Paste your personal Gemini API key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="input-field text-xs py-3 pr-10 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              Don't have a personal key?
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center gap-0.5 ml-1"
              >
                Get one free from Google AI Studio
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>

            <button type="submit" className="btn-primary text-xs py-2 px-5 flex items-center justify-center gap-1.5 shrink-0">
              {savedSuccess ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Key className="w-4 h-4" />}
              <span>{savedSuccess ? 'Key Saved!' : 'Save Key'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reading Level & Simplification Persona */}
      <div className="glass-panel p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-xs">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Default Simplification Persona</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Customize the target audience and tone of legal explanations.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setReadingLevel('eli5')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              readingLevel === 'eli5'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-indigo-400'
                : 'bg-white/70 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-xs text-slate-900 dark:text-white">🐣 ELI5 (Plain Consumer)</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Zero jargon, everyday analogies, maximum clarity for consumers and non-lawyers.
            </div>
          </button>

          <button
            type="button"
            onClick={() => setReadingLevel('executive')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              readingLevel === 'executive'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-indigo-400'
                : 'bg-white/70 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-xs text-slate-900 dark:text-white">💼 Business Executive</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              High-level commercial exposure, financial liabilities, operational deadlines, and deliverables.
            </div>
          </button>

          <button
            type="button"
            onClick={() => setReadingLevel('paralegal')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              readingLevel === 'paralegal'
                ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-indigo-400'
                : 'bg-white/70 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="font-bold text-xs text-slate-900 dark:text-white">⚖️ Paralegal Detail</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Granular clause dissection, statutory references, liability provisions, and strict definitions.
            </div>
          </button>
        </div>
      </div>

      {/* Privacy, PII Scrubbing & Data Sanitation */}
      <div className="glass-panel p-6 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Client-Side Privacy &amp; PII Scrubbing</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Automatically sanitize personal identifiers in your browser before transmitting to the AI model.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 rounded-xl">
          <div>
            <div className="text-xs font-semibold text-slate-900 dark:text-white">Auto-Redact Personal Identifiers</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Masks SSNs, Aadhaar, Credit Cards, Emails, and Phone Numbers before analysis.
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoRedactPii}
              onChange={(e) => setAutoRedactPii(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportAuditLog}
            className="btn-secondary text-xs py-2 px-3.5 flex items-center justify-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Privacy Audit Log (JSON)</span>
          </button>

          <button
            type="button"
            onClick={handleClearDocuments}
            className="btn-danger text-xs py-2 px-3.5 flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Cached Documents</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
