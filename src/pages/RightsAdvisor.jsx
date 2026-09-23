import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Scale, Sparkles, HelpCircle, FileCheck, Layers, ExternalLink, Printer } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeDocument } from '../services/apiClient';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ExportButton from '../components/ExportButton';
import { LoadingSpinner } from '../components/LoadingStates';

const sampleScenarios = [
  "My landlord is refusing to return my security deposit after moving out.",
  "A freelance client hasn't paid my 60-day overdue invoice of $3,500.",
  "I received an NDA with a strict 3-year worldwide non-compete clause.",
  "My employer is requiring me to sign an IP assignment agreement for my personal weekend project."
];

const RightsAdvisor = () => {
  const { autoRedactPii } = useApp();
  const [scenario, setScenario] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState('');

  const handleAnalyzeRights = async (presetText) => {
    const textToRun = presetText || scenario;
    if (!textToRun.trim()) return;
    if (presetText) setScenario(presetText);

    setLoading(true);
    setOutput('');

    try {
      const result = await analyzeDocument({
        taskType: 'rights',
        documentText: '',
        prompt: `Scenario: "${textToRun}". Include potential non-litigation options, evidence collection checklist, and a 5-question attorney consultation checklist.`,
        redactPii: autoRedactPii
      });

      setOutput(result.content);
      setDataSource(result.source);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrintConsultationPrep = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
            <Scale className="w-6 h-6 text-pink-400" />
            Rights &amp; Options Advisor with Attorney Prep
          </h1>
          <p className="text-xs text-slate-400">Evaluate remedies, dispute escalation ladders, evidence intake checklists, and questions for counsel.</p>
        </div>
        <DisclaimerBanner compact />
      </div>

      {/* Visual Dispute Resolution Ladder */}
      <div className="glass-panel p-4 border border-slate-800">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-white uppercase tracking-wider">
          <Layers className="w-4 h-4 text-pink-400" />
          Standard Dispute Resolution Ladder
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <div className="font-bold text-pink-300">1. Direct Notice</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Informal amicable talks</div>
          </div>
          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <div className="font-bold text-indigo-300">2. Demand Letter</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Formal 14-day cure deadline</div>
          </div>
          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <div className="font-bold text-purple-300">3. Mediation</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Neutral third-party conciliation</div>
          </div>
          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <div className="font-bold text-amber-300">4. Small Claims</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Quick local court recovery</div>
          </div>
          <div className="p-2 rounded bg-slate-900/60 border border-slate-800">
            <div className="font-bold text-rose-300">5. Arbitration</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Binding formal proceeding</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Describe Your Situation</h3>
            <textarea
              rows={5}
              placeholder="e.g. My freelance client has not paid my final invoice of $4,200 despite 4 written reminders and contract sign-off..."
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="input-field text-xs leading-relaxed"
            />

            <button
              onClick={() => handleAnalyzeRights()}
              disabled={loading || !scenario.trim()}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Remedies &amp; Generate Lawyer Prep Brief</span>
            </button>
          </div>

          {/* Preset Scenarios */}
          <div className="glass-panel p-4 space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Common Real-World Scenarios</h4>
            <div className="space-y-2">
              {sampleScenarios.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnalyzeRights(s)}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300 hover:text-pink-300 hover:border-pink-500/30 transition-all"
                >
                  "{s}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className="glass-panel p-6 border border-slate-800 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-pink-400" />
                Options Analysis &amp; Attorney Consultation Sheet
              </h3>
              {dataSource && (
                <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {dataSource === 'backend' ? '⚡ FastAPI' : '🌐 Client'}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {output && (
                <button
                  onClick={handlePrintConsultationPrep}
                  className="btn-secondary text-xs py-1.5 px-2.5 flex items-center gap-1"
                  title="Print Lawyer Intake Sheet"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              )}
              {output && <ExportButton content={output} filename="rights_options_consultation_sheet" />}
            </div>
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner label="Evaluating remedies, statutory rights & drafting consultation sheet..." />
            </div>
          ) : output ? (
            <div className="markdown-body text-xs text-slate-300 overflow-y-auto max-h-[560px] pr-2">
              <Markdown>{output}</Markdown>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-12">
              <HelpCircle className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-medium">No Scenario Analyzed Yet</p>
              <p className="text-xs max-w-xs mt-1">Enter your situation or click a common scenario above to evaluate options.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightsAdvisor;
