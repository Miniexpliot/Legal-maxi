import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { FileText, Sparkles, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateLegalAnalysis } from '../services/aiEngine';
import DocumentViewer from '../components/DocumentViewer';
import FileUploader from '../components/FileUploader';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ExportButton from '../components/ExportButton';
import { LoadingSpinner } from '../components/LoadingStates';

const DocumentSimplifier = () => {
  const { activeDocument, apiKey, addDocument } = useApp();
  const [level, setLevel] = useState('Plain English');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSimplify = async () => {
    if (!activeDocument) return;
    setLoading(true);
    setOutput('');

    try {
      const result = await generateLegalAnalysis({
        prompt: `Target Simplification Level: ${level}`,
        documentText: activeDocument.text,
        apiKey,
        taskType: 'simplify'
      });
      setOutput(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            Document Simplifier
          </h1>
          <p className="text-xs text-slate-400">Convert complex legalese and legal jargon into clear, digestible language.</p>
        </div>

        <DisclaimerBanner compact />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Active Document Viewer & Upload */}
        <div className="space-y-4">
          <div className="glass-panel p-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Target Simplification Style</h3>
            <div className="flex gap-2">
              {['Plain English', 'Bullet Point Executive', 'ELI5 (Simple)'].map((style) => (
                <button
                  key={style}
                  onClick={() => setLevel(style)}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                    level === style
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>

            <button
              onClick={handleSimplify}
              disabled={loading || !activeDocument}
              className="w-full btn-primary py-2.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simplify Active Document</span>
            </button>
          </div>

          <DocumentViewer document={activeDocument} height="480px" />
          <FileUploader label="Upload New Document to Simplify" onDocumentParsed={(doc) => addDocument(doc)} />
        </div>

        {/* Right Column: AI Output */}
        <div className="glass-panel p-6 flex flex-col border border-slate-800 min-h-[500px]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Simplified Legal Breakdown
            </h3>
            {output && <ExportButton content={output} filename="simplified_legal_doc" />}
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner label="Translating legalese into plain English..." />
            </div>
          ) : output ? (
            <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-3 text-slate-200 overflow-y-auto max-h-[600px] pr-2">
              <Markdown>{output}</Markdown>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-12">
              <FileText className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-medium">No output generated yet</p>
              <p className="text-xs max-w-xs mt-1">Click "Simplify Active Document" above to get an instant AI translation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentSimplifier;
