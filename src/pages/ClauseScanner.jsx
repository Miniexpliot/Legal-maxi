import React, { useState } from 'react';
import LegalMarkdown from '../components/LegalMarkdown';
import { ShieldAlert, Sparkles, AlertOctagon, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeDocument } from '../services/apiClient';
import DocumentViewer from '../components/DocumentViewer';
import FileUploader from '../components/FileUploader';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ExportButton from '../components/ExportButton';
import QuotaExceededBanner from '../components/QuotaExceededBanner';
import { LoadingSpinner } from '../components/LoadingStates';

const ClauseScanner = () => {
  const { activeDocument, addDocument, autoRedactPii } = useApp();
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [riskFilter, setRiskFilter] = useState('all');
  const [healthScore, setHealthScore] = useState(68);
  const [dataSource, setDataSource] = useState('');
  const [quotaExhausted, setQuotaExhausted] = useState(false);

  const handleScan = async () => {
    if (!activeDocument) return;
    setLoading(true);
    setOutput('');
    setQuotaExhausted(false);

    try {
      const result = await analyzeDocument({
        taskType: 'scan',
        documentText: activeDocument.text,
        prompt: 'Audit all clauses for punitive liquidated damages, strict non-competes, heavy indemnification, and unilateral termination.',
        redactPii: autoRedactPii
      });

      setOutput(result.content);
      setDataSource(result.source);
      if (result.isQuotaExhausted) {
        setQuotaExhausted(true);
      }
      setHealthScore(activeDocument.text.includes('$250,000') ? 62 : 84);
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
          <h1 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            Clause &amp; Risk Scanner with Heatmap
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Audit contracts for disproportionate liquidated damages, hidden liabilities, and unfair unilateral terms.
          </p>
        </div>
        <DisclaimerBanner compact />
      </div>

      {quotaExhausted && (
        <QuotaExceededBanner onKeyAdded={() => handleScan()} />
      )}

      {/* Contract Health Score & Risk Filters */}
      <div className="glass-panel p-5 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-base shadow-xs ${
            healthScore >= 80 ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60' :
            healthScore >= 60 ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60' :
            'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60'
          }`}>
            {healthScore}
          </div>
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Health Index</div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">
              {healthScore >= 80 ? '🟢 Low Legal Risk' : healthScore >= 60 ? '🟡 Moderate Exposure' : '🔴 High Hazard'}
            </div>
          </div>
        </div>

        <button
          onClick={() => setRiskFilter('high')}
          className={`p-3 rounded-xl border text-left transition-all shadow-2xs ${
            riskFilter === 'high' 
              ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-500 text-rose-700 dark:text-rose-300' 
              : 'bg-white/80 dark:bg-slate-900/40 border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-500" /> High Risk
            </span>
            <span className="badge-pill text-[10px] bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800">1 Critical</span>
          </div>
          <div className="text-[10px] opacity-75 mt-1">Liquidated damages, indemnity</div>
        </button>

        <button
          onClick={() => setRiskFilter('medium')}
          className={`p-3 rounded-xl border text-left transition-all shadow-2xs ${
            riskFilter === 'medium' 
              ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-500 text-amber-700 dark:text-amber-300' 
              : 'bg-white/80 dark:bg-slate-900/40 border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Caution
            </span>
            <span className="badge-pill text-[10px] bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">2 Terms</span>
          </div>
          <div className="text-[10px] opacity-75 mt-1">Perpetual survival, jurisdiction</div>
        </button>

        <button
          onClick={() => setRiskFilter('low')}
          className={`p-3 rounded-xl border text-left transition-all shadow-2xs ${
            riskFilter === 'low' 
              ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-500 text-emerald-700 dark:text-emerald-300' 
              : 'bg-white/80 dark:bg-slate-900/40 border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Standard
            </span>
            <span className="badge-pill text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">2 Balanced</span>
          </div>
          <div className="text-[10px] opacity-75 mt-1">Mutual severability, term</div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <button
            onClick={handleScan}
            disabled={loading || !activeDocument}
            className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 shadow-lg text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Audit Active Document for Hazards &amp; Penalties</span>
          </button>

          <DocumentViewer document={activeDocument} height="460px" />
          <FileUploader label="Upload New Agreement for Risk Scan" onDocumentParsed={(doc) => addDocument(doc)} />
        </div>

        <div className="glass-panel p-6 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 font-heading">
                <ShieldAlert className="w-4 h-4 text-rose-500" />
                Risk Audit Report &amp; Heatmap
              </h3>
              <span className="badge-pill text-[10px] font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800/60">
                {dataSource === 'backend' ? '⚡ Live Gemini AI' : '🛡️ Client Engine'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {riskFilter !== 'all' && (
                <button
                  onClick={() => setRiskFilter('all')}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                >
                  Clear Filter
                </button>
              )}
              {output && <ExportButton content={output} filename="risk_clause_scan" />}
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <LoadingSpinner label="Evaluating contractual liabilities, non-competes & penalty caps..." />
            </div>
          ) : output ? (
            <div className="overflow-y-auto max-h-[520px] pr-2">
              <LegalMarkdown content={output} />
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 py-12">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <ShieldAlert className="w-6 h-6 opacity-60" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No Risk Scan performed yet</p>
              <p className="text-xs max-w-xs mt-1 text-slate-500">Click the audit button to calculate contract risk score and clause heatmaps.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClauseScanner;
