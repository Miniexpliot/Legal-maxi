import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { ListCheck, Sparkles, CheckSquare, Calendar, Download, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeDocument } from '../services/apiClient';
import DocumentViewer from '../components/DocumentViewer';
import FileUploader from '../components/FileUploader';
import DisclaimerBanner from '../components/DisclaimerBanner';
import ExportButton from '../components/ExportButton';
import { LoadingSpinner } from '../components/LoadingStates';

const DEFAULT_TASKS = [
  { id: 't1', title: 'Stamp all shared project documentation with explicit "CONFIDENTIAL"', due: 'Immediate' },
  { id: 't2', title: 'Confirm internal staff NDA signatures before sharing proprietary source', due: 'Day 3' },
  { id: 't3', title: 'Review $250,000 liquidated damages clause with legal risk counsel', due: 'Prior to signing' },
  { id: 't4', title: 'Add 30-day notice for convenience to contract calendar reminders', due: 'Day 30' },
  { id: 't5', title: 'Establish secure local folder with restricted access permissions', due: 'Day 1' }
];

const SummaryGenerator = () => {
  const { activeDocument, addDocument, activeChecklist, toggleChecklistItem, autoRedactPii } = useApp();
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState('');

  const handleGenerate = async () => {
    if (!activeDocument) return;
    setLoading(true);
    setOutput('');

    try {
      const result = await analyzeDocument({
        taskType: 'summary',
        documentText: activeDocument.text,
        prompt: 'Generate an Executive One-Pager, structured obligation timeline, and checkable task matrix.',
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

  const completedCount = DEFAULT_TASKS.filter(t => activeChecklist[t.id]).length;
  const progressPercent = Math.round((completedCount / DEFAULT_TASKS.length) * 100);

  const handleExportICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Legal-Max//Contract Milestones//EN
BEGIN:VEVENT
SUMMARY:Legal Notice & Cure Deadline - ${activeDocument?.name || 'Agreement'}
DESCRIPTION:30-Day Contract Notice & Cure Deadline
DTSTART:${new Date(Date.now() + 30 * 86400000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${new Date(Date.now() + 30 * 86400000 + 3600000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contract-milestone-${Date.now()}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
            <ListCheck className="w-6 h-6 text-cyan-400" />
            Executive Summary &amp; Actionable Obligations
          </h1>
          <p className="text-xs text-slate-400">One-pager executive briefing, interactive obligation tracker, and calendar milestone export.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportICS}
            className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-cyan-300 border-cyan-800"
            title="Download .ICS calendar reminder"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Export Calendar Event (.ICS)</span>
          </button>
          <DisclaimerBanner compact />
        </div>
      </div>

      {/* Interactive Obligation Checklist Card */}
      <div className="glass-panel p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Interactive Compliance Obligation Tracker ({completedCount}/{DEFAULT_TASKS.length} Done)
            </h3>
          </div>
          <span className="text-xs font-semibold text-cyan-400">{progressPercent}% Completed</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Checkable Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
          {DEFAULT_TASKS.map((task) => (
            <label
              key={task.id}
              className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                activeChecklist[task.id]
                  ? 'bg-cyan-950/30 border-cyan-800/60 text-slate-300 line-through opacity-70'
                  : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={Boolean(activeChecklist[task.id])}
                onChange={() => toggleChecklistItem(task.id)}
                className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              <div className="flex-1">
                <span className="leading-snug block">{task.title}</span>
                <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> Due: {task.due}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <button
            onClick={handleGenerate}
            disabled={loading || !activeDocument}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Executive Summary &amp; Milestone Timeline</span>
          </button>

          <DocumentViewer document={activeDocument} height="460px" />
          <FileUploader label="Upload New Document to Summarize" onDocumentParsed={(doc) => addDocument(doc)} />
        </div>

        <div className="glass-panel p-6 border border-slate-800 flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <ListCheck className="w-4 h-4 text-cyan-400" />
                Executive Deal Summary &amp; Action Plan
              </h3>
              {dataSource && (
                <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {dataSource === 'backend' ? '⚡ FastAPI' : '🌐 Client'}
                </span>
              )}
            </div>
            {output && <ExportButton content={output} filename="legal_executive_summary" />}
          </div>

          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner label="Extracting core milestones, deliverables & fee structures..." />
            </div>
          ) : output ? (
            <div className="markdown-body text-xs text-slate-300 overflow-y-auto max-h-[520px] pr-2">
              <Markdown>{output}</Markdown>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-12">
              <ListCheck className="w-12 h-12 text-slate-700 mb-3" />
              <p className="text-sm font-medium">No Executive Summary generated yet</p>
              <p className="text-xs max-w-xs mt-1">Click the button above to generate a structured executive brief & action timeline.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryGenerator;
