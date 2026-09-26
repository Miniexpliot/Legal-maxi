import React, { useState } from 'react';
import LegalMarkdown from '../components/LegalMarkdown';
import { MessageSquare, Send, Sparkles, User, Bot, Trash2, Download, BookmarkCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { askLegalQuestion } from '../services/apiClient';
import DocumentViewer from '../components/DocumentViewer';
import DisclaimerBanner from '../components/DisclaimerBanner';
import QuotaExceededBanner from '../components/QuotaExceededBanner';

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
  const [quotaExhausted, setQuotaExhausted] = useState(false);

  const handleAsk = async (questionToAsk) => {
    const promptText = questionToAsk || query;
    if (!promptText.trim() || !activeDocument) return;

    const userMsg = { sender: 'user', text: promptText, timestamp: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMsg]);
    if (!questionToAsk) setQuery('');
    setLoading(true);
    setQuotaExhausted(false);

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
      if (response.isQuotaExhausted) {
        setQuotaExhausted(true);
      }
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
          <h1 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            Grounded Legal Q&amp;A Assistant
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Interrogate any contract with verified clause citations, penalty checks, and hallucination guardrails.
          </p>
        </div>
        <DisclaimerBanner compact />
      </div>

      {quotaExhausted && (
        <QuotaExceededBanner onKeyAdded={() => handleAsk(query || 'What are the key terms?')} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Context Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <DocumentViewer document={activeDocument} height="390px" />

          {/* Quick Preset Questions */}
          <div className="glass-panel p-4 space-y-2 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              Grounded Question Starters
            </h4>
            <div className="space-y-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  disabled={loading}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-400/50 hover:bg-emerald-50/50 dark:hover:bg-slate-800/80 transition-all shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Chat Window */}
        <div className="lg:col-span-2 glass-panel flex flex-col h-[650px] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl shadow-sm overflow-hidden">
          {/* Chat Header */}
          <div className="px-5 py-3 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/90 dark:bg-slate-950/70">
            <div className="flex items-center gap-2.5">
              <Bot className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">Citation-Grounded Conversation</span>
              <span className="badge-pill text-[10px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800/60 flex items-center gap-1">
                <BookmarkCheck className="w-3 h-3 text-indigo-500" /> Grounded RAG
              </span>
            </div>

            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  onClick={handleExportChat}
                  className="btn-secondary text-[11px] py-1 px-2.5 rounded-lg flex items-center gap-1"
                  title="Download Markdown Transcript"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              )}
              {messages.length > 0 && (
                <button
                  onClick={() => setMessages([])}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Clear Chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30 dark:bg-slate-950/30">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Grounded Contract Interrogation</h4>
                  <p className="text-xs max-w-sm mt-1 text-slate-500">
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
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-2xs">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white shadow-indigo-600/20'
                        : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 text-[10px] opacity-75 mb-1.5 font-medium">
                      <span>{msg.sender === 'user' ? 'You' : 'Legal-Max Intelligence'}</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <LegalMarkdown content={msg.text} />

                    {msg.sender === 'bot' && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span>⚡ Gemini Real-Time AI</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Verified Citations</span>
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center shrink-0 shadow-2xs">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-3 text-xs justify-start animate-fade-in">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-3.5 rounded-2xl flex items-center gap-2.5 text-slate-600 dark:text-slate-400 text-xs shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                  <span>Analyzing clauses and generating verified grounded answer...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-950/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder={activeDocument ? "Ask anything about this document..." : "Upload a document first..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading || !activeDocument}
                className="input-field text-xs py-2.5 rounded-xl"
              />
              <button
                type="submit"
                disabled={loading || !query.trim() || !activeDocument}
                className="btn-primary py-2.5 px-4 rounded-xl shrink-0 text-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask Question</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalQA;
