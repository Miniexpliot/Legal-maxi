import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateLegalAnalysis } from '../services/aiEngine';
import DocumentViewer from '../components/DocumentViewer';
import FileUploader from '../components/FileUploader';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ExportButton from '../components/ExportButton';
import { LoadingSpinner } from '../components/LoadingStates';

const ComplianceChecker = () => {
  const { activeDocument, apiKey, addDocument } = useApp();
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplianceCheck = async () => {
    if (!activeDocument) return;
    setLoading(true);
    setOutput('');

    try {
      const result = await generateLegalAnalysis({
        prompt: '',
        documentText: activeDocument.text,
        apiKey,
        taskType: 'compliance'
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
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            Legal Compliance Audit
          </h1>
          <p className="text-xs text-slate-400">Run an automated compliance check covering privacy, termination notice, and consumer rights basics.</p>
        </div>
        <DisclaimerBanner compact />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <button
            onClick={handleComplianceCheck}
            disabled={loading || !activeDocument}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run Compliance Audit on Active Document</span>
          </button>

          <DocumentViewer document={activeDocument} height="460px" />
          <FileUploader label="Upload Document for Compliance Check" onDocumentParsed={(doc) => addDocument(doc)} />
        </div>

        <div className="glass-panel p-6 border border-slate-800 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Compliance Scorecard
            </h3>
            {output && <ExportButton content={output} filename="compliance_audit_report" />}
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner label="Auditing document against legal compliance standards..." />
            </div>
          ) : output ? (
            <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-3 text-slate-200 overflow-y-auto max-h-[600px] pr-2">
              <Markdown>{output}</Markdown>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-12">
              <CheckCircle2 className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-medium">No Compliance Audit executed</p>
              <p className="text-xs max-w-xs mt-1">Click the button above to run an automated check.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceChecker;
