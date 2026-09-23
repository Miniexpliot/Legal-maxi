import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Eye, EyeOff, ShieldCheck, Trash2, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

const Settings = () => {
  const { apiKey, setApiKey, documents } = useApp();
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveKey = (e) => {
    e.preventDefault();
    setApiKey(inputKey);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClearDocuments = () => {
    if (confirm("Are you sure you want to clear cached documents?")) {
      localStorage.removeItem('legal_max_documents');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-indigo-400" />
          Settings & Configurations
        </h1>
        <p className="text-xs text-slate-400">Configure your Gemini API key, privacy settings, and workspace data.</p>
      </div>

      <DisclaimerBanner />

      {/* Gemini API Key Section */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Google Gemini API Key</h3>
              <p className="text-xs text-slate-400">Enter your Gemini API key to enable live AI analysis. (Stored client-side only)</p>
            </div>
          </div>

          {apiKey ? (
            <span className="badge badge-emerald">Connected</span>
          ) : (
            <span className="badge badge-amber">Demo Mode Active</span>
          )}
        </div>

        <form onSubmit={handleSaveKey} className="space-y-3 pt-2">
          <div className="relative">
            <input
              type={showKey ? "text" : "password"}
              placeholder="AIzaSy..."
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
              Don't have a key? Get a free API key at <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-indigo-400 underline">Google AI Studio</a>.
            </p>

            <button type="submit" className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5">
              {savedSuccess ? <CheckCircle className="w-4 h-4 text-emerald-300" /> : <Key className="w-4 h-4" />}
              <span>{savedSuccess ? 'Key Saved!' : 'Save Key'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Data Privacy & Storage */}
      <div className="glass-panel p-6 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Privacy & Local Storage</h3>
            <p className="text-xs text-slate-400">All uploaded documents and chat histories remain strictly on your device.</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
          <span className="text-slate-400">Cached Workspace Documents: <strong className="text-white">{documents.length}</strong></span>
          <button
            onClick={handleClearDocuments}
            className="btn-secondary text-xs text-rose-400 border-rose-500/30 hover:bg-rose-500/10 py-1.5 px-3 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Local Storage</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
