import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { ListCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateLegalAnalysis } from '../services/aiEngine';
import DocumentViewer from '../components/DocumentViewer';
import FileUploader from '../components/FileUploader';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ExportButton from '../components/ExportButton';
import { LoadingSpinner } from '../components/LoadingStates';

const SummaryGenerator = () => {
  const { activeDocument, apiKey, addDocument } = useApp();
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!activeDocument) return;
    setLoading(true);
    setOutput('');

    try {
      const result = await generateLegalAnalysis({
        prompt: '',
        documentText: activeDocument.text,
        apiKey,
        taskType: 'summary'
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
            <ListCheck className="w-6 h-6 text-cyan-400" />
            Summary & Checklist Generator
          </h1>
          <p className="text-xs text-slate-400">Generate executive summaries, key obligation deadlines, and actionable task checklists.</p>
        </div>
        <DisclaimerBanner compact />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <button
            onClick={handleGenerate}
            disabled={loading || !activeDocument}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 to-indigo-600"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Executive Summary & Checklist</span>
          </button>

          <DocumentViewer document={activeDocument} height="460px" />
          <FileUploader label="Upload New Document to Summarize" onDocumentParsed={(doc) => addDocument(doc)} />
        </div>

        <div className="glass-panel p-6 border border-slate-800 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ListCheck className="w-4 h-4 text-cyan-400" />
              Actionable Summary Report
            </h3>
            {output && <ExportButton content={output} filename="legal_executive_summary" />}
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner label="Extracting executive takeaways and building action checklist..." />
            </div>
          ) : output ? (
            <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-3 text-slate-200 overflow-y-auto max-h-[600px] pr-2">
              <Markdown>{output}</Markdown>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-12">
              <ListCheck className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-medium">No Summary generated yet</p>
              <p className="text-xs max-w-xs mt-1">Click the button above to generate a structured summary & checklist.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryGenerator;
