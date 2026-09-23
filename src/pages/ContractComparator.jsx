import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { GitCompare, Sparkles, Check, ArrowRight, Percent, PlusCircle, MinusCircle, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { compareContracts } from '../services/apiClient';
import FileUploader from '../components/FileUploader';
import DocumentViewer from '../components/DocumentViewer';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ExportButton from '../components/ExportButton';
import { LoadingSpinner } from '../components/LoadingStates';

const ContractComparator = () => {
  const { documents } = useApp();
  const [docA, setDocA] = useState(documents[0] || null);
  const [docB, setDocB] = useState(documents[1] || null);
  const [output, setOutput] = useState('');
  const [diffStats, setDiffStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState('');

  const handleCompare = async () => {
    if (!docA || !docB) return;
    setLoading(true);
    setOutput('');
    setDiffStats(null);

    try {
      const result = await compareContracts({
        documentA: docA.text,
        documentB: docB.text,
        prompt: `Compare ${docA.name} against ${docB.name}. Highlight critical liability shifts, notice deadline changes, and redline counter-proposals.`
      });

      setOutput(result.aiAnalysis);
      setDiffStats(result.diffMetrics);
      setDataSource(result.source);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSamplePair = () => {
    if (documents.length >= 2) {
      setDocA(documents[0]);
      setDocB(documents[1]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-purple-400" />
            Contract Comparator & Redline Intelligence
          </h1>
          <p className="text-xs text-slate-400">Side-by-side textual diffing, semantic liability shifts, and counter-clause negotiation advice.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadSamplePair}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Load Active Sample Pair</span>
          </button>
          <DisclaimerBanner compact />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document A Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Document A (Baseline / Original)</span>
            {docA && <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{docA.name}</span>}
          </div>
          {docA ? (
            <DocumentViewer document={docA} height="260px" />
          ) : (
            <FileUploader label="Upload Document A" onDocumentParsed={(doc) => setDocA(doc)} />
          )}
        </div>

        {/* Document B Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Document B (Counterparty / Revised)</span>
            {docB && <span className="text-[10px] text-slate-400 truncate max-w-[150px]">{docB.name}</span>}
          </div>
          {docB ? (
            <DocumentViewer document={docB} height="260px" />
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
          className="btn-primary px-8 py-3 text-sm shadow-xl flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          <span>Execute Dual Contract Comparison &amp; Redline Analysis</span>
        </button>
      </div>

      {/* Diff Metrics Bar */}
      {diffStats && (
        <div className="glass-panel p-4 border border-purple-500/30 grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Content Similarity</div>
              <div className="text-sm font-bold text-white">{diffStats.similarity_percentage}%</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Additions / Revisions</div>
              <div className="text-sm font-bold text-emerald-400">+{diffStats.stats.additions} lines</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <MinusCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Deletions / Omissions</div>
              <div className="text-sm font-bold text-rose-400">-{diffStats.stats.deletions} lines</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Engine Source</div>
              <div className="text-sm font-bold text-white capitalize">{dataSource || 'Local'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Output Section */}
      <div className="glass-panel p-6 border border-slate-800 min-h-[400px]">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Discrepancy Matrix & Negotiation Strategy
          </h3>
          {output && <ExportButton content={output} filename="contract_comparison_redlines" />}
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <LoadingSpinner label="Comparing contractual obligations, indemnities & liability limits..." />
          </div>
        ) : output ? (
          <div className="markdown-body text-xs text-slate-300">
            <Markdown>{output}</Markdown>
          </div>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-slate-500 text-xs">
            <GitCompare className="w-10 h-10 mb-2 opacity-30" />
            <p>Select both Document A and Document B above and click Compare.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractComparator;
