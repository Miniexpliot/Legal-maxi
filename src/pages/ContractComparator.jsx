import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { GitCompare, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateLegalAnalysis } from '../services/aiEngine';
import FileUploader from '../components/FileUploader';
import DocumentViewer from '../components/DocumentViewer';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ExportButton from '../components/ExportButton';
import { LoadingSpinner } from '../components/LoadingStates';

const ContractComparator = () => {
  const { apiKey } = useApp();
  const [docA, setDocA] = useState(null);
  const [docB, setDocB] = useState(null);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!docA || !docB) return;
    setLoading(true);
    setOutput('');

    try {
      const combinedPrompt = `COMPARE THE FOLLOWING TWO CONTRACTS SIDE-BY-SIDE:

DOCUMENT A (${docA.name}):
${docA.text}

DOCUMENT B (${docB.name}):
${docB.text}

Provide:
1. Side-by-side Comparison Table (Key terms, notice, jurisdiction, liability, penalties)
2. Crucial Discrepancies & Missing Clauses in either document
3. Risk Assessment: Which contract is safer for a signing party?`;

      const result = await generateLegalAnalysis({
        prompt: combinedPrompt,
        documentText: '',
        apiKey,
        taskType: 'compare'
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
            <GitCompare className="w-6 h-6 text-purple-400" />
            Contract Comparator
          </h1>
          <p className="text-xs text-slate-400">Compare two legal documents to spot hidden differences, liability shifts, and missing terms.</p>
        </div>
        <DisclaimerBanner compact />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document A Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Document A (Original / Target)</span>
            {docA && <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{docA.name}</span>}
          </div>
          {docA ? (
            <DocumentViewer document={docA} height="280px" />
          ) : (
            <FileUploader label="Upload Document A" onDocumentParsed={(doc) => setDocA(doc)} />
          )}
        </div>

        {/* Document B Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Document B (Revised / Counterpart)</span>
            {docB && <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{docB.name}</span>}
          </div>
          {docB ? (
            <DocumentViewer document={docB} height="280px" />
          ) : (
            <FileUploader label="Upload Document B" onDocumentParsed={(doc) => setDocB(doc)} />
          )}
        </div>
      </div>

      {/* Compare Action Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          disabled={loading || !docA || !docB}
          className="btn-primary px-8 py-3 text-sm shadow-xl"
        >
          <Sparkles className="w-5 h-5" />
          <span>Compare Contracts & Analyze Discrepancies</span>
        </button>
      </div>

      {/* Comparison Output */}
      <div className="glass-panel p-6 border border-slate-800">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-purple-400" />
            Comparison Report
          </h3>
          {output && <ExportButton content={output} filename="contract_comparison_report" />}
        </div>

        {loading ? (
          <LoadingSpinner label="Comparing contractual terms and risk variations..." />
        ) : output ? (
          <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-4 text-slate-200">
            <Markdown>{output}</Markdown>
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-8">
            Upload both Document A and Document B above, then click Compare to generate a side-by-side breakdown.
          </p>
        )}
      </div>
    </div>
  );
};

export default ContractComparator;
