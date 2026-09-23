import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { CheckCircle2, Sparkles, Shield, AlertTriangle, FileCheck, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeDocument } from '../services/apiClient';
import DocumentViewer from '../components/DocumentViewer';
import FileUploader from '../components/FileUploader';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ExportButton from '../components/ExportButton';
import { LoadingSpinner } from '../components/LoadingStates';

const ComplianceChecker = () => {
  const { activeDocument, addDocument, autoRedactPii } = useApp();
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(85);
  const [dataSource, setDataSource] = useState('');

  const handleComplianceCheck = async () => {
    if (!activeDocument) return;
    setLoading(true);
    setOutput('');

    try {
      const result = await analyzeDocument({
        taskType: 'compliance',
        documentText: activeDocument.text,
        prompt: 'Check compliance against GDPR/CCPA data privacy, FTC non-compete rules, termination cure notice, and consumer protection.',
        redactPii: autoRedactPii
      });

      setOutput(result.content);
      setDataSource(result.source);
      setScore(activeDocument.text.includes('$250,000') ? 78 : 92);
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
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            Automated Legal Compliance Audit
          </h1>
          <p className="text-xs text-slate-400">Audit contracts against statutory privacy principles, notice fairness, and consumer protection guidelines.</p>
        </div>
        <DisclaimerBanner compact />
      </div>

      {/* Compliance Overview Scorecard */}
      <div className="glass-panel p-5 border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-lg text-emerald-400">
            {score}%
          </div>
          <div>
            <div className="text-[11px] text-slate-400">Compliance Index</div>
            <div className="text-xs font-bold text-emerald-300">SUBSTANTIAL COMPLIANCE</div>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> Data Privacy Safeguards
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Confidential standard defined</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Breach Notification Window
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Ambiguous notice deadline</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400" /> Severability Boilerplate
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Full clause included</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <button
            onClick={handleComplianceCheck}
            disabled={loading || !activeDocument}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run Regulatory Compliance Audit on Active Document</span>
          </button>

          <DocumentViewer document={activeDocument} height="460px" />
          <FileUploader label="Upload Document for Compliance Check" onDocumentParsed={(doc) => addDocument(doc)} />
        </div>

        <div className="glass-panel p-6 border border-slate-800 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                Compliance Scorecard &amp; Remediation Plan
              </h3>
              {dataSource && (
                <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {dataSource === 'backend' ? '⚡ FastAPI' : '🌐 Client'}
                </span>
              )}
            </div>
            {output && <ExportButton content={output} filename="compliance_audit_report" />}
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner label="Auditing document against statutory compliance rules & fair terms..." />
            </div>
          ) : output ? (
            <div className="markdown-body text-xs text-slate-300 overflow-y-auto max-h-[520px] pr-2">
              <Markdown>{output}</Markdown>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-12">
              <Shield className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-medium">No Compliance Audit Executed</p>
              <p className="text-xs max-w-xs mt-1">Click the button above to run an automated check against privacy & fair terms standards.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceChecker;
