import React, { useState } from 'react';
import { FileCode2, Copy, Check, Plus, Eye } from 'lucide-react';
import { CONTRACT_TEMPLATES } from '../utils/constants';
import { useApp } from '../context/AppContext';
import DisclaimerBanner from '../components/DisclaimerBanner';

const TemplateLibrary = () => {
  const { addDocument } = useApp();
  const [selectedTemplate, setSelectedTemplate] = useState(CONTRACT_TEMPLATES[0]);
  const [copied, setCopied] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedTemplate.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddToWorkspace = () => {
    const newDoc = {
      id: 'template-' + Date.now(),
      name: `${selectedTemplate.title}.txt`,
      size: `${(selectedTemplate.content.length / 1024).toFixed(1)} KB`,
      type: 'text/plain',
      uploadDate: new Date().toISOString(),
      text: selectedTemplate.content
    };
    addDocument(newDoc);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCode2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Standard Legal Contract Templates
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Pre-audited contract templates ready for immediate review, customization, and workspace analysis.
          </p>
        </div>
        <DisclaimerBanner compact />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Selector List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Available Templates
          </h3>
          <div className="space-y-3">
            {CONTRACT_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedTemplate.id === tmpl.id
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-500 text-slate-900 dark:text-white shadow-sm ring-1 ring-indigo-400'
                    : 'bg-white/80 dark:bg-slate-900/50 border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold font-heading text-slate-900 dark:text-white">{tmpl.title}</h4>
                  <span className="badge-pill text-[10px] font-semibold text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800">
                    {tmpl.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{tmpl.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Template Preview & Actions */}
        <div className="lg:col-span-2 glass-panel p-6 border border-slate-200/80 dark:border-slate-800 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">{selectedTemplate.title}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{selectedTemplate.category} Template</p>
            </div>

            <div className="flex items-center gap-2">
              {addedToast && (
                <span className="badge-pill py-1 px-2.5 text-[10px] animate-fade-in flex items-center gap-1 text-emerald-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800">
                  <Check className="w-3 h-3" /> Added to Workspace
                </span>
              )}
              <button onClick={handleCopy} className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-indigo-500" />}
                <span>{copied ? 'Copied' : 'Copy Template'}</span>
              </button>
              <button onClick={handleAddToWorkspace} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Workspace</span>
              </button>
            </div>
          </div>

          <div className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-slate-50/90 dark:bg-slate-950/80 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 leading-relaxed whitespace-pre-wrap flex-1 min-h-[350px] overflow-y-auto">
            {selectedTemplate.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateLibrary;
