import React, { useState, useEffect } from 'react';
import LegalMarkdown from '../components/LegalMarkdown';
import { 
  FileText, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  CheckSquare, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeDocument } from '../services/apiClient';
import FileUploader from '../components/FileUploader';
import DocumentViewer from '../components/DocumentViewer';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ExportButton from '../components/ExportButton';
import QuotaExceededBanner from '../components/QuotaExceededBanner';
import { LoadingSpinner } from '../components/LoadingStates';
import { speechService } from '../utils/speechHelper';

const DocumentSimplifier = () => {
  const { activeDocument, addDocument, readingLevel, setReadingLevel, autoRedactPii } = useApp();
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [dataSource, setDataSource] = useState('');
  const [piiCount, setPiiCount] = useState(0);
  const [quotaExhausted, setQuotaExhausted] = useState(false);

  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);

  const handleSimplify = async () => {
    if (!activeDocument) return;
    setLoading(true);
    setOutput('');
    setQuotaExhausted(false);
    speechService.stop();
    setSpeaking(false);

    try {
      const result = await analyzeDocument({
        taskType: 'simplify',
        documentText: activeDocument.text,
        prompt: `Simplify for a ${readingLevel} reader. Provide 1) Executive gist in 3 sentences, 2) Core obligations, 3) Important dates and hidden financial liabilities, 4) Five critical questions to ask an attorney.`,
        redactPii: autoRedactPii
      });

      setOutput(result.content);
      setDataSource(result.source);
      if (result.isQuotaExhausted) {
        setQuotaExhausted(true);
      }
      if (result.piiRedacted) {
        const total = Object.values(result.piiRedacted).reduce((a, b) => a + b, 0);
        setPiiCount(total);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSpeech = () => {
    if (speaking) {
      speechService.stop();
      setSpeaking(false);
    } else {
      speechService.speak({
        text: output,
        onStart: () => setSpeaking(true),
        onEnd: () => setSpeaking(false),
        onError: () => setSpeaking(false)
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
            Document Simplifier & Visual Explainer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Transform complex legal contracts into plain English, structured obligation maps, and natural audio briefings.
          </p>
        </div>

        <DisclaimerBanner compact />
      </div>

      {quotaExhausted && (
        <QuotaExceededBanner onKeyAdded={() => handleSimplify()} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Active Document Viewer & Controls */}
        <div className="space-y-4">
          <div className="glass-panel p-5 space-y-3 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Persona & Reading Level
              </h3>
              {autoRedactPii && (
                <span className="badge badge-emerald flex items-center gap-1 text-[10px]">
                  <ShieldCheck className="w-3 h-3" /> PII Masking Active
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'eli5', label: '🐣 ELI5' },
                { id: 'executive', label: '💼 Executive' },
                { id: 'paralegal', label: '⚖️ Paralegal' }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setReadingLevel(style.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                    readingLevel === style.id
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/25 scale-[1.02]'
                      : 'bg-slate-100/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleSimplify}
              disabled={loading || !activeDocument}
              className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 mt-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simplify Active Document ({readingLevel.toUpperCase()})</span>
            </button>
          </div>

          <DocumentViewer document={activeDocument} height="460px" />
          <FileUploader label="Upload New Contract to Simplify" onDocumentParsed={(doc) => addDocument(doc)} />
        </div>

        {/* Right Column: AI Output & Visual Obligation Breakdown */}
        <div className="glass-panel p-6 flex flex-col border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm min-h-[500px]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80 dark:border-slate-800/80">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-heading">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                Plain English Breakdown
              </h3>
              <span className="badge-pill text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60">
                {dataSource === 'backend' ? '⚡ Live Gemini AI' : '🛡️ Client Engine'}
              </span>
              {piiCount > 0 && (
                <span className="badge-pill text-[10px] text-slate-600 dark:text-slate-400">
                  {piiCount} PII Redacted
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {output && (
                <button
                  onClick={handleToggleSpeech}
                  title={speaking ? "Stop Audio Briefing" : "Listen to Natural Audio Briefing"}
                  className={`p-2 rounded-xl border transition-all shadow-xs flex items-center gap-1.5 text-xs font-semibold ${
                    speaking 
                      ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 animate-pulse' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:border-indigo-300'
                  }`}
                >
                  {speaking ? (
                    <>
                      <VolumeX className="w-4 h-4 text-rose-500" />
                      <span className="hidden sm:inline">Pause</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-indigo-500" />
                      <span className="hidden sm:inline">Audio Brief</span>
                    </>
                  )}
                </button>
              )}
              {output && <ExportButton content={output} filename="simplified_legal_doc" />}
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center py-12">
              <LoadingSpinner label="Deconstructing legal clauses & synthesizing plain-English brief..." />
            </div>
          ) : output ? (
            <div className="space-y-4">
              {/* Quick Visual Obligation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/40 text-left">
                  <div className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-500" /> What You Must Do
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Protect proprietary materials, adhere to notice deadlines.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/40 text-left">
                  <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-500" /> What Counterparty Must Do
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Reciprocal non-disclosure, cure window compliance.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/40 text-left">
                  <div className="text-[11px] font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> High-Risk Traps
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    Automatic liquidated damages, unilateral attorney fees.
                  </div>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[520px] pr-2 mt-2">
                <LegalMarkdown content={output} />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-xs py-12">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 mb-3">
                <FileText className="w-6 h-6 opacity-60" />
              </div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">Ready to simplify</p>
              <p className="text-slate-500 text-[11px] mt-1">Select your reading level and click "Simplify Active Document".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentSimplifier;
