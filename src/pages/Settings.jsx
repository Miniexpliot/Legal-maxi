import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Eye, EyeOff, ShieldCheck, Trash2, CheckCircle, Server, RefreshCw, Lock, Sliders, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

const Settings = () => {
  const {
    apiKey,
    setApiKey,
    documents,
    backendStatus,
    refreshBackendStatus,
    readingLevel,
    setReadingLevel,
    autoRedactPii,
    setAutoRedactPii
  } = useApp();

  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [checkingBackend, setCheckingBackend] = useState(false);

  const handleSaveKey = (e) => {
    e.preventDefault();
    setApiKey(inputKey);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePingBackend = async () => {
    setCheckingBackend(true);
    await refreshBackendStatus();
    setCheckingBackend(false);
  };

  const handleClearDocuments = () => {
    if (confirm("Are you sure you want to clear cached documents?")) {
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
      backendStatus: backendStatus.online ? 'Online' : 'Offline (In-Browser Fallback)',
      securityCompliance: 'OWASP Top 10 + GDPR/DPDP Standard'
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-max-audit-log-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-400" />
          Settings & Configurations
        </h1>
        <p className="text-xs text-slate-400">Manage backend connection, Gemini API key, privacy scrubbers, and AI preferences.</p>
      </div>

      <DisclaimerBanner />

      {/* Backend Connection Status */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              backendStatus.online
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
            }`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                FastAPI Backend Engine
                <span className={`inline-block w-2 h-2 rounded-full ${backendStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              </h3>
              <p className="text-xs text-slate-400">
                {backendStatus.online
                  ? `Connected at http://127.0.0.1:5000 (v${backendStatus.version || '2.0.0'})`
                  : 'Backend offline — Using seamless in-browser fallback engine.'}
              </p>
            </div>
          </div>

          <button
            onClick={handlePingBackend}
            disabled={checkingBackend}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checkingBackend ? 'animate-spin' : ''}`} />
            <span>Check Connection</span>
          </button>
        </div>

        <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-semibold text-slate-300">💡 How to run the local backend server:</p>
          <code className="text-indigo-300 block bg-slate-950 px-2.5 py-1.5 rounded font-mono">
            cd backend &amp;&amp; pip install -r requirements.txt &amp;&amp; python main.py
          </code>
          <p className="text-[10px] text-slate-500">The frontend Vite proxy automatically forwards /api requests to port 5000.</p>
        </div>
      </div>

      {/* Gemini API Key Section */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Google Gemini API Key</h3>
              <p className="text-xs text-slate-400">Configured key is forwarded to backend via X-Gemini-Key header or stored in browser.</p>
            </div>
          </div>

          {apiKey ? (
            <span className="badge badge-emerald">Key Configured</span>
          ) : (
            <span className="badge badge-amber">Demo Fallback Active</span>
          )}
        </div>

        <form onSubmit={handleSaveKey} className="space-y-3 pt-2">
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              placeholder="AIzaSy... Paste your Gemini API key"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="input-field text-xs py-3 pr-10 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-[11px] text-slate-500">
              Don't have a key? Get one free at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-indigo-400 underline">Google AI Studio</a>.
            </p>

            <button type="submit" className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5">
              {savedSuccess ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Key className="w-4 h-4" />}
              <span>{savedSuccess ? 'Key Saved!' : 'Save Key'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Reading Level & Simplification Persona */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Default Simplification Persona</h3>
            <p className="text-xs text-slate-400">Customize the complexity and tone of legal explanations.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setReadingLevel('eli5')}
            className={`p-3 rounded-lg border text-left transition-all ${
              readingLevel === 'eli5'
                ? 'bg-indigo-500/20 border-indigo-500 text-white'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-semibold text-xs text-white">🐣 ELI5 (Elementary)</div>
            <div className="text-[11px] text-slate-400 mt-1">Zero jargon, everyday analogies, maximum clarity for consumers.</div>
          </button>

          <button
            type="button"
            onClick={() => setReadingLevel('executive')}
            className={`p-3 rounded-lg border text-left transition-all ${
              readingLevel === 'executive'
                ? 'bg-indigo-500/20 border-indigo-500 text-white'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-semibold text-xs text-white">💼 Business Executive</div>
            <div className="text-[11px] text-slate-400 mt-1">High-level financial exposure, operational milestones, and deliverables.</div>
          </button>

          <button
            type="button"
            onClick={() => setReadingLevel('paralegal')}
            className={`p-3 rounded-lg border text-left transition-all ${
              readingLevel === 'paralegal'
                ? 'bg-indigo-500/20 border-indigo-500 text-white'
                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="font-semibold text-xs text-white">⚖️ Paralegal Detail</div>
            <div className="text-[11px] text-slate-400 mt-1">Granular legal clauses, statutory references, and strict definitions.</div>
          </button>
        </div>
      </div>

      {/* Privacy, PII Scrubbing & Security */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Client-Side Privacy & PII Scrubbing</h3>
            <p className="text-xs text-slate-400">Automatically sanitize sensitive identifiers before transmitting to any AI model.</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-lg">
          <div>
            <div className="text-xs font-semibold text-white">Auto-Redact Personal Identifiers</div>
            <div className="text-[11px] text-slate-400">Masks SSNs, Aadhaar, Credit Cards, Emails, and Phone Numbers.</div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoRedactPii}
              onChange={(e) => setAutoRedactPii(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleExportAuditLog}
            className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Compliance Audit Log (JSON)</span>
          </button>

          <button
            type="button"
            onClick={handleClearDocuments}
            className="btn-danger text-xs py-2 px-3 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Cached Documents</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
