import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { MessageSquare, Send, Sparkles, User, Bot, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { generateLegalAnalysis } from '../services/aiEngine';
import DocumentViewer from '../components/DocumentViewer';
import DisclaimerBanner from '../components/DisclaimerBanner';

const sampleQuestions = [
  "What are my key obligations under this document?",
  "What is the penalty or financial liability if breached?",
  "How can either party terminate this agreement?",
  "Which state/court has legal jurisdiction over disputes?",
  "Is there a non-compete or non-solicitation clause?"
];

const LegalQA = () => {
  const { activeDocument, apiKey } = useApp();
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
      const aiResponse = await generateLegalAnalysis({
        prompt: promptText,
        documentText: activeDocument.text,
        apiKey,
        taskType: 'qa'
      });

      const botMsg = { sender: 'bot', text: aiResponse, timestamp: new Date().toLocaleTimeString() };
      setMessages(prev => [...prev, botMsg]);
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
            <MessageSquare className="w-6 h-6 text-emerald-400" />
            Legal Q&A Assistant
          </h1>
          <p className="text-xs text-slate-400">Ask natural language questions about your active document and get grounded answers.</p>
        </div>
        <DisclaimerBanner compact />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Context Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <DocumentViewer document={activeDocument} height="400px" />

          {/* Quick Preset Questions */}
          <div className="glass-panel p-4 space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Suggested Questions
            </h4>
            <div className="space-y-1.5">
              {sampleQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAsk(q)}
                  disabled={loading}
                  className="w-full text-left p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 hover:text-indigo-300 hover:border-indigo-500/30 transition-all"
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
              <span className="text-xs font-semibold text-white">Interactive Document Assistant</span>
            </div>

            {messages.length > 0 && (
              <button
                onClick={() => setMessages([])}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear Chat
              </button>
            )}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12">
                <MessageSquare className="w-12 h-12 text-slate-700 mb-3" />
                <p className="text-sm font-medium">Ask any question regarding your document</p>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Type a prompt below or pick a suggested question from the left sidebar to start.
                </p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-2xl p-4 rounded-xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                        : 'glass-panel bg-slate-900/80 border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.sender === 'bot' ? (
                      <div className="prose prose-invert max-w-none text-xs space-y-2">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                    <span className="block text-[9px] opacity-50 mt-2 text-right">{msg.timestamp}</span>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))
            )}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="glass-panel p-3 rounded-xl text-xs text-slate-400 animate-pulse">
                  Legal-Max AI is searching document context...
                </div>
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/80">
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
                placeholder="Ask about liabilities, deadlines, non-competes, or jurisdiction..."
                className="input-field text-xs py-2.5"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="btn-primary py-2.5 px-4 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalQA;
