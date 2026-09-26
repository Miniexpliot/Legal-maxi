import React, { useState } from 'react';
import { FileText, Search, Copy, Check } from 'lucide-react';

const DocumentViewer = ({ document, height = "400px" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  if (!document) {
    return (
      <div 
        className="glass-panel p-8 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center justify-center border border-slate-200/80 dark:border-slate-800/80 rounded-2xl bg-white/70 dark:bg-slate-900/60 shadow-sm" 
        style={{ minHeight: height }}
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-3 shadow-xs">
          <FileText className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No document selected</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Upload a PDF or contract text to view and inspect</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(document.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderHighlightedText = () => {
    if (!searchTerm.trim()) return document.text;
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')})`, 'gi');
    const parts = document.text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-amber-300/60 dark:bg-amber-400/30 text-slate-900 dark:text-amber-200 px-1 py-0.5 rounded font-bold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div 
      className="glass-panel flex flex-col overflow-hidden border border-slate-200/90 dark:border-slate-800/90 bg-white/80 dark:bg-slate-900/80 rounded-2xl shadow-sm transition-all" 
      style={{ height }}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50/90 dark:bg-slate-950/70 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/70 dark:border-indigo-800/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate" title={document.name}>
            {document.name}
          </span>
          {/* Redesigned File Size Pill */}
          <span className="badge-pill text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50/90 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/60 px-2.5 py-0.5 rounded-full shrink-0 shadow-xs">
            {document.size || 'Digital Text'}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Find term..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-slate-950 border border-slate-300/80 dark:border-slate-800 rounded-lg text-xs pl-8 pr-2.5 py-1 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-28 sm:w-36 shadow-xs"
            />
          </div>

          <button
            onClick={handleCopy}
            title={copied ? "Copied to clipboard!" : "Copy document text"}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Document Text Body - Readable in both Light & Dark */}
      <div className="p-4 overflow-y-auto font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-50/40 dark:bg-slate-950/50 leading-relaxed whitespace-pre-wrap flex-1 select-text">
        {renderHighlightedText()}
      </div>
    </div>
  );
};

export default DocumentViewer;
