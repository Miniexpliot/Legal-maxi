import React, { useState } from 'react';
import LegalMarkdown from '../components/LegalMarkdown';
import { MessageSquare, Send, Sparkles, User, Bot, Trash2, ShieldCheck, Download, BookmarkCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askLegalQuestion } from '../services/apiClient';
import DocumentViewer from '../components/DocumentViewer';
import DisclaimerBanner from '../components/DisclaimerBanner';

const sampleQuestions = [
  "What are my key obligations under this document?",
  "What is the penalty or liquidated damages if breached?",
  "How can either party terminate this agreement?",
  "Which state/court has legal jurisdiction over disputes?",
  "What are the notice requirements before taking legal action?"
];

const LegalQA = () => {
  const { activeDocument } = useApp();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (questionToAsk) => {
    const promptText = questionToAsk || query;
    if (!promptText.trim() || !activeDocument) return;

    const userMsg = { sender: 'user', text: promptText, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    if (!questionToAsk) setQuery('');
    setLoading(true);

    try {
      const response = await askLegalQuestion({
        documentText: activeDocument.text,
        question: promptText
      });

      const botMsg = {
        sender: 'bot',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString(),
        source: response.source,
        chunksIndexed: response.chunksIndexed
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportChat = () => {
    if (messages.length === 0) return;
    const transcript = messages.map(m => `### ${m.sender === 'user' ? '👤 User' : '⚖️ Legal-Max'} (${m.timestamp})\n\n${m.text}\n\n---\n`).join('\n');
    const header = `# Legal-Max Q&A Session Transcript\nDocument: ${activeDocument?.name || 'Untitled'}\nDate: ${new Date().toLocaleString()}\n\n*Notice: Informational purposes only.*\n\n---\n\n`;

    const blob = new Blob([header + transcript], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `legal-qa-transcript-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-extrabold text-white flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            Grounded Legal Q&amp;A Assistant
          </h1>
          <p className="text-xs text-slate-400">Natural language contract interrogation with clause citation grounding and hallucination guardrails.</p>
        </div>
        <DisclaimerBanner compact />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Context Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <DocumentViewer document={activeDocument} height="380px" />

          {/* Quick Preset Questions */}
          <div className="glass-panel p-4 space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Grounded Question Starters
            </h4>
            <div className="space-y-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  disabled={loading}
                  className="w-full text-left p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 hover:text-emerald-300 hover:border-emerald-500/30 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Chat Window */}
        <div className="lg:col-span-2 glass-panel flex flex-col h-[650px] border border-slate-800">
          {/* Chat Header */}
          <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white">Citation-Grounded Conversation</span>
              <span className="badge badge-indigo text-[10px] flex items-center gap-1">
                <BookmarkCheck className="w-3 h-3" /> Grounded RAG
              </span>
            </div>

            <div className="flex items-center gap-3">
              {messages.length > 0 && (
                <button
                  onClick={handleExportChat}
                  className="text-[11px] text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition-colors"
                  title="Download Markdown Transcript"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              )}
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-300">Grounded Document Interrogation</h4>
                  <p className="text-xs max-w-sm mt-1">
                    Ask any question about termination rules, liability limits, indemnities, or payment milestones.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 text-xs leading-relaxed animate-fade-in ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-xl p-3.5 ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-900 border border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 mb-1">
                      <span>{msg.sender === 'user' ? 'You' : 'Legal-Max Intelligence'}</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <LegalMarkdown content={msg.text} />

                    {msg.sender === 'bot' && msg.source && (
                      <div className="mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                        <span>Engine: {msg.source === 'backend' ? 'FastAPI Server' : 'Browser Engine'}</span>
                        <span className="text-emerald-400">Verified Clause References</span>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-3 text-xs justify-start animate-fade-in">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2 text-slate-400 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
                  <span>Cross-referencing document sections and generating grounded citations...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-900/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything about the contract (e.g., 'What happens if payment is delayed?')"
                className="input-field text-xs py-2.5"
                disabled={loading || !activeDocument}
              />
              <button
                type="submit"
                disabled={loading || !query.trim() || !activeDocument}
                className="btn-primary py-2.5 px-4 shrink-0 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalQA;
