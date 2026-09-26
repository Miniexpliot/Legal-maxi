import React, { useState } from 'react';
import LegalMarkdown from '../components/LegalMarkdown';
import { GitCompare, Sparkles, Check, ArrowRight, Percent, PlusCircle, MinusCircle, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { compareContracts } from '../services/apiClient';
import FileUploader from '../components/FileUploader';
import DocumentViewer from '../components/DocumentViewer';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ExportButton from '../components/ExportButton';
import QuotaExceededBanner from '../components/QuotaExceededBanner';
import { LoadingSpinner } from '../components/LoadingStates';

// Rich fallback sample pair ensuring the button always works seamlessly
const DEFAULT_SAMPLE_A = {
  id: 'baseline-standard-nda',
  name: 'Standard_Mutual_NDA_v1.0.txt',
  size: '3.6 KB',
  text: `MUTUAL NON-DISCLOSURE AGREEMENT (ORIGINAL STANDARD BASELINE)

1. CONFIDENTIALITY OBLIGATION:
Both Disclosing Party and Receiving Party agree to treat proprietary technical data, financial figures, and product roadmaps with reasonable care (at least the same standard of care used for their own trade secrets).

2. TERM:
Confidentiality obligations expire three (3) years after the date of initial disclosure.

3. REMEDIES:
In the event of a breach, the non-breaching party may seek reasonable injunctive relief. Both parties waive special or punitive damages.

4. TERMINATION & RETURN:
Either party may terminate discussions upon thirty (30) days written notice. Upon request, all materials must be returned or certified destroyed within 15 days.`
};

const DEFAULT_SAMPLE_B = {
  id: 'revised-aggressive-counter',
  name: 'Counterparty_Marked_Up_NDA_v2.0.txt',
  size: '4.8 KB',
  text: `MUTUAL NON-DISCLOSURE AGREEMENT (COUNTERPARTY AGGRESSIVE REVISION)

1. CONFIDENTIALITY OBLIGATION (MODIFIED):
Receiving Party strictly guarantees that no employee or contractor shall ever disclose any trade secret. Strict liability applies regardless of reasonable care.

2. TERM (EXTENDED):
Confidentiality obligations remain in effect in perpetuity (indefinitely) and shall never expire.

3. REMEDIES & LIQUIDATED DAMAGES (HIGH RISK ADDITION):
In the event of any alleged breach, Receiving Party agrees to pay immediately $250,000 in liquidated damages without requirement of actual proof of loss, plus full unilateral attorney fees.

4. TERMINATION & NON-SOLICITATION:
Termination requires 90 days prior written notice. Receiving Party agrees not to hire or contact any employee of Disclosing Party for twenty-four (24) months.`
};

const ContractComparator = () => {
  const { documents } = useApp();
  const [docA, setDocA] = useState(documents[0] || DEFAULT_SAMPLE_A);
  const [docB, setDocB] = useState(documents[1] || DEFAULT_SAMPLE_B);
  const [output, setOutput] = useState('');
  const [diffStats, setDiffStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState('');
  const [justLoadedSample, setJustLoadedSample] = useState(false);
  const [quotaExhausted, setQuotaExhausted] = useState(false);

  const handleCompare = async () => {
    if (!docA || !docB) return;
    setLoading(true);
    setOutput('');
    setDiffStats(null);
    setQuotaExhausted(false);

    try {
      const result = await compareContracts({
        documentA: docA.text,
        documentB: docB.text,
        prompt: `Compare ${docA.name} against ${docB.name}. Highlight critical liability shifts, notice deadline changes, and redline counter-proposals.`
      });

      setOutput(result.aiAnalysis);
      setDiffStats(result.diffMetrics);
      setDataSource(result.source);
      if (result.isQuotaExhausted) {
        setQuotaExhausted(true);
      }
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
    } else {
      setDocA(DEFAULT_SAMPLE_A);
      setDocB(DEFAULT_SAMPLE_B);
    }
    setJustLoadedSample(true);
    setTimeout(() => setJustLoadedSample(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <GitCompare className="w-4 h-4" />
            </div>
            Contract Comparator &amp; Redline Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Side-by-side textual diffing, semantic liability shifts, and counter-clause negotiation advice.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadSamplePair}
            className={`whitespace-nowrap text-xs font-semibold py-2.5 px-4 flex items-center gap-2 rounded-xl transition-all shadow-sm ${
              justLoadedSample 
                ? 'border border-emerald-500 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 ring-1 ring-emerald-400' 
                : 'text-purple-700 dark:text-purple-300 bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 hover:border-purple-400 hover:bg-purple-100/70'
            }`}
            title="Load standard vs revised sample agreements"
          >
            {justLoadedSample ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Sample Pair Loaded!</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                <span>Load Active Sample Pair</span>
              </>
            )}
          </button>
        </div>
      </div>

      <DisclaimerBanner />

      {quotaExhausted && (
        <QuotaExceededBanner onKeyAdded={() => handleCompare()} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document A Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Document A (Baseline / Original)
            </span>
            {docA && <span className="badge-pill text-[10px] truncate max-w-[170px]">{docA.name}</span>}
          </div>
          {docA ? (
            <DocumentViewer document={docA} height="280px" />
          ) : (
            <FileUploader label="Upload Baseline Document A" onDocumentParsed={(doc) => setDocA(doc)} />
          )}
        </div>

        {/* Document B Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              Document B (Counterparty / Revised)
            </span>
            {docB && <span className="badge-pill text-[10px] truncate max-w-[170px]">{docB.name}</span>}
          </div>
          {docB ? (
            <DocumentViewer document={docB} height="280px" />
          ) : (
            <FileUploader label="Upload Revised Document B" onDocumentParsed={(doc) => setDocB(doc)} />
          )}
        </div>
      </div>

      {/* Compare Action Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleCompare}
          disabled={loading || !docA || !docB}
          className="btn-primary px-8 py-3.5 text-sm shadow-xl flex items-center gap-2.5 rounded-xl hover:scale-[1.02]"
        >
          <Sparkles className="w-4 h-4" />
          <span>Execute Dual Contract Comparison & Redline Analysis</span>
        </button>
      </div>

      {/* Diff Metrics Bar */}
      {diffStats && (
        <div className="glass-panel p-5 border border-purple-300/40 dark:border-purple-500/30 rounded-2xl grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in shadow-sm bg-purple-50/30 dark:bg-purple-950/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Percent className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Similarity Score</p>
              <p className="text-base font-bold text-slate-800 dark:text-slate-100">{diffStats.similarity_percentage}% Match</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">New Clauses Added</p>
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">+{diffStats.stats?.additions || 0} Terms</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <MinusCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Clauses Removed</p>
              <p className="text-base font-bold text-rose-600 dark:text-rose-400">-{diffStats.stats?.deletions || 0} Terms</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <Check className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">Unchanged Baseline</p>
              <p className="text-base font-bold text-slate-800 dark:text-slate-100">{diffStats.stats?.unchanged || 0} Sections</p>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Output Container */}
      {(loading || output) && (
        <div className="glass-panel p-6 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Comprehensive Redline Intelligence & Shift Diagnosis
              </h3>
              <span className="badge-pill text-[10px] font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/60">
                {dataSource === 'backend' ? '⚡ Live Gemini AI' : '🛡️ Client Engine'}
              </span>
            </div>
            {output && <ExportButton content={output} filename="contract_redline_comparison" />}
          </div>

          {loading ? (
            <div className="py-12 flex items-center justify-center">
              <LoadingSpinner label="Comparing contractual obligations, indemnities, and shifting risk liabilities..." />
            </div>
          ) : (
            <div className="overflow-y-auto max-h-[600px] pr-2">
              <LegalMarkdown content={output} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ContractComparator;
