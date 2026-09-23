import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Scale, Sparkles, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateLegalAnalysis } from '../services/aiEngine';
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
  const { apiKey } = useApp();
  const [scenario, setScenario] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyzeRights = async (presetText) => {
    const textToRun = presetText || scenario;
    if (!textToRun.trim()) return;
    if (presetText) setScenario(presetText);

    setLoading(true);
    setOutput('');

    try {
      const result = await generateLegalAnalysis({
        prompt: textToRun,
        documentText: '',
        apiKey,
        taskType: 'rights'
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
            <Scale className="w-6 h-6 text-pink-400" />
            Rights & Options Advisor
          </h1>
          <p className="text-xs text-slate-400">Describe your situation to discover potential options, key steps, and lawyer consultation questions.</p>
        </div>
        <DisclaimerBanner compact />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="glass-panel p-5 space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Describe Your Situation</h3>
            <textarea
              rows={5}
              placeholder="e.g. My landlord refuses to repair the heating unit despite multiple written notices..."
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="input-field text-xs leading-relaxed"
            />

            <button
              onClick={() => handleAnalyzeRights()}
              disabled={loading || !scenario.trim()}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Situation & Legal Options</span>
            </button>
          </div>

          {/* Preset Scenarios */}
          <div className="glass-panel p-4 space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Common Scenarios</h4>
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
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-pink-400" />
              Legal Information Guidance & Preparation
            </h3>
            {output && <ExportButton content={output} filename="legal_rights_guidance" />}
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner label="Evaluating options and drafting attorney question checklist..." />
            </div>
          ) : output ? (
            <div className="prose prose-invert max-w-none text-xs leading-relaxed space-y-3 text-slate-200 overflow-y-auto max-h-[600px] pr-2">
              <Markdown>{output}</Markdown>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-12">
              <Scale className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-medium">No scenario analyzed yet</p>
              <p className="text-xs max-w-xs mt-1">Type your situation above to get actionable legal information.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightsAdvisor;
