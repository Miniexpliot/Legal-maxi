import React, { useState } from 'react';
import { Sparkles, Key, Check, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

const QuotaExceededBanner = ({ onKeyAdded }) => {
  const { setApiKey } = useApp();
  const [inputKey, setInputKey] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!inputKey.trim()) return;
    setApiKey(inputKey.trim());
    setSaved(true);
    setTimeout(() => {
      if (onKeyAdded) onKeyAdded(inputKey.trim());
    }, 800);
  };

  return (
    <div className="glass-panel p-5 my-4 border border-amber-300/40 dark:border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/30 shadow-lg rounded-2xl animate-fade-in">
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-amber-200 font-heading">
              Cloud AI Demo Quota Limit Reached
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              "The shared demo limit for today has been reached. To continue analyzing contracts with real-time AI without interruption, please connect your own free Gemini API key below."
            </p>
          </div>

          {saved ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20">
              <Check className="w-4 h-4" />
              <span>Personal key saved securely! Resuming analysis...</span>
            </div>
          ) : (
            <form onSubmit={handleSave} className="flex flex-col sm:flex-row gap-2 pt-1">
              <div className="relative flex-1">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Paste free Gemini API key (AIzaSy...)"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
              </div>
              <button
                type="submit"
                disabled={!inputKey.trim()}
                className="btn-primary py-2 px-4 text-xs font-semibold whitespace-nowrap bg-amber-600 hover:bg-amber-500 border-none text-white shadow-md shadow-amber-600/20"
              >
                Save & Continue
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </form>
          )}

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Stored 100% locally in your browser. Never transmitted to third-party databases.
            </span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
            >
              Get free Gemini Key (Instant)
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotaExceededBanner;
