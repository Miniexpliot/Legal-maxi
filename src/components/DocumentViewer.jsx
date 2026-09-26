import React, { useState } from 'react';
import { FileText, Search, Copy, Check } from 'lucide-react';

const DocumentViewer = ({ document, height = "400px" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  if (!document) {
    return (
      <div className="glass-panel p-8 text-center text-slate-400 flex flex-col items-center justify-center" style={{ minHeight: height }}>
        <FileText className="w-12 h-12 text-slate-600 mb-3" />
        <p className="text-sm font-medium">No document active</p>
        <p className="text-xs text-slate-500">Upload or select a legal document to view text</p>
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
        <mark key={i} className="bg-amber-400/30 text-amber-200 px-0.5 rounded font-bold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="glass-panel flex flex-col overflow-hidden border border-slate-800" style={{ height }}>
      {/* Header */}
      <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-200 truncate">{document.name}</span>
          <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{document.size || 'Text'}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Find term..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-md text-xs pl-8 pr-3 py-1 text-slate-200 focus:outline-none focus:border-indigo-500 w-32"
            />
          </div>

          <button
            onClick={handleCopy}
            title="Copy text"
            className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Document Text Body */}
      <div className="p-4 overflow-y-auto font-mono text-xs text-slate-300 bg-slate-950/60 leading-relaxed whitespace-pre-wrap flex-1 select-text">
        {renderHighlightedText()}
      </div>
    </div>
  );
};

export default DocumentViewer;
