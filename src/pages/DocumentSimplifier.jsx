import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { FileText, Sparkles, Volume2, VolumeX, ShieldCheck, CheckSquare, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeDocument } from '../services/apiClient';
import DocumentViewer from '../components/DocumentViewer';
import FileUploader from '../components/FileUploader';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ExportButton from '../components/ExportButton';
import { LoadingSpinner } from '../components/LoadingStates';

const DocumentSimplifier = () => {
  const { activeDocument, addDocument, readingLevel, setReadingLevel, autoRedactPii } = useApp();
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [piiCount, setPiiCount] = useState(0);
  const [dataSource, setDataSource] = useState('');

  const handleSimplify = async () => {
    if (!activeDocument) return;
    setLoading(true);
    setOutput('');
    setPiiCount(0);

    try {
      const result = await analyzeDocument({
        taskType: 'simplify',
        documentText: activeDocument.text,
        prompt: `Simplification Level: ${readingLevel}. Include visual breakdown of party obligations and highlight hidden traps.`,
        redactPii: autoRedactPii
      });

      setOutput(result.content);
      setDataSource(result.source);
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
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      const cleanText = output.replace(/[#*`_\[\]()]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText.substring(0, 800));
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setSpeaking(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-400" />
            Document Simplifier & Visual Explainer
          </h1>
          <p className="text-xs text-slate-400">Convert complex legalese into plain English, visual obligation maps, and audio summaries.</p>
        </div>

        <DisclaimerBanner compact />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Active Document Viewer & Controls */}
        <div className="space-y-4">
          <div className="glass-panel p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Persona & Reading Level</h3>
              {autoRedactPii && (
                <span className="badge badge-emerald flex items-center gap-1 text-[10px]">
                  <ShieldCheck className="w-3 h-3" /> PII Scrubber Active
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
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                    readingLevel === style.id
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleSimplify}
              disabled={loading || !activeDocument}
              className="w-full btn-primary py-2.5 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simplify Active Document ({readingLevel.toUpperCase()})</span>
            </button>
          </div>

          <DocumentViewer document={activeDocument} height="460px" />
          <FileUploader label="Upload New Document to Simplify" onDocumentParsed={(doc) => addDocument(doc)} />
        </div>

        {/* Right Column: AI Output & Visual Obligation Breakdown */}
        <div className="glass-panel p-6 flex flex-col border border-slate-800 min-h-[500px]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Plain English Synthesis
              </h3>
              {dataSource && (
                <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {dataSource === 'backend' ? '⚡ FastAPI Backend' : '🌐 Browser Engine'}
                </span>
              )}
              {piiCount > 0 && (
                <span className="text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800">
                  🛡️ {piiCount} PII Redacted
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {output && (
                <button
                  onClick={handleToggleSpeech}
                  title={speaking ? "Stop Readout" : "Listen to Audio Summary"}
                  className="p-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  {speaking ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}
              {output && <ExportButton content={output} filename="simplified_legal_doc" />}
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner label="Analyzing legal clauses & synthesizing plain-English summary..." />
            </div>
          ) : output ? (
            <div className="space-y-4">
              {/* Quick Visual Obligation Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-left">
                  <div className="text-[11px] font-bold text-indigo-300 flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5" /> What You Must Do
                  </div>
                  <div className="text-[10px] text-slate-300 mt-1">Preserve secrets, provide written notices on time.</div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-left">
                  <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                    <ArrowRight className="w-3.5 h-3.5" /> What They Must Do
                  </div>
                  <div className="text-[10px] text-slate-300 mt-1">Reciprocal confidentiality, timely cure windows.</div>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-left">
                  <div className="text-[11px] font-bold text-rose-300 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Critical Traps
                  </div>
                  <div className="text-[10px] text-slate-300 mt-1">Strict liquidated damages, exclusive out-of-state court.</div>
                </div>
              </div>

              <div className="markdown-body text-xs text-slate-300 overflow-y-auto max-h-[520px] pr-2">
                <Markdown>{output}</Markdown>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
              <FileText className="w-10 h-10 mb-2 opacity-30" />
              <p>Select your simplification level and click "Simplify Active Document".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentSimplifier;
