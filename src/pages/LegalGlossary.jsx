import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, HelpCircle } from 'lucide-react';
import LegalMarkdown from '../components/LegalMarkdown';
import { LEGAL_GLOSSARY } from '../utils/constants';
import { useApp } from '../context/AppContext';
import { analyzeDocument } from '../services/apiClient';
import DisclaimerBanner from '../components/DisclaimerBanner';
import QuotaExceededBanner from '../components/QuotaExceededBanner';

const LegalGlossary = () => {
  const { autoRedactPii } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [customTerm, setCustomTerm] = useState('');
  const [customExplanation, setCustomExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [quotaExhausted, setQuotaExhausted] = useState(false);

  const categories = ['All', ...new Set(LEGAL_GLOSSARY.map(t => t.category))];

  const filteredTerms = LEGAL_GLOSSARY.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = category === 'All' || t.category === category;
    return matchesSearch && matchesCat;
  });

  const handleExplainCustom = async () => {
    if (!customTerm.trim()) return;
    setLoading(true);
    setCustomExplanation('');
    setQuotaExhausted(false);

    try {
      const res = await analyzeDocument({
        prompt: `Explain the following legal term or clause in ELI5 plain English with practical everyday examples: "${customTerm}"`,
        documentText: '',
        taskType: 'simplify',
        redactPii: autoRedactPii
      });
      setCustomExplanation(res.content);
      if (res.isQuotaExhausted) {
        setQuotaExhausted(true);
      }
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
          <h1 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <BookOpen className="w-4 h-4" />
            </div>
            Plain-English Legal Glossary
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Demystify complex legal Latin, contract terms, and procedural phrases with plain everyday translations.
          </p>
        </div>
        <DisclaimerBanner compact />
      </div>

      {quotaExhausted && (
        <QuotaExceededBanner onKeyAdded={() => handleExplainCustom()} />
      )}

      {/* AI Custom Term Explainer Tool */}
      <div className="glass-panel p-5 border border-amber-300/50 dark:border-amber-500/30 bg-amber-50/70 dark:bg-amber-950/20 rounded-2xl shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          Ask AI to Explain Any Custom Legal Term
        </h3>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            placeholder="e.g. Subrogation, Quantum Meruit, Estoppel, Force Majeure..."
            value={customTerm}
            onChange={(e) => setCustomTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleExplainCustom()}
            className="input-field text-xs py-2.5 rounded-xl flex-1"
          />
          <button
            onClick={handleExplainCustom}
            disabled={loading || !customTerm.trim()}
            className="btn-primary py-2.5 px-5 shrink-0 text-xs font-semibold rounded-xl shadow-md whitespace-nowrap"
          >
            {loading ? 'Consulting Gemini AI...' : 'Explain in Plain English'}
          </button>
        </div>

        {customExplanation && (
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed space-y-2 mt-3 shadow-xs animate-fade-in">
            <p className="font-bold text-indigo-700 dark:text-indigo-400">Explanation for "{customTerm}":</p>
            <LegalMarkdown content={customExplanation} />
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search verified legal definitions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 text-xs py-2.5 rounded-xl shadow-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-xs ${
                category === cat
                  ? 'bg-amber-500 text-white shadow-amber-500/25 scale-[1.02]'
                  : 'bg-white/80 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200/90 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map((item, idx) => (
          <div 
            key={idx} 
            className="glass-panel p-5 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl space-y-3 hover:border-amber-400/50 dark:hover:border-amber-500/30 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">{item.term}</h3>
              <span className="badge-pill text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/60">
                {item.category}
              </span>
            </div>

            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400 italic mb-2 leading-relaxed">
                "{item.definition}"
              </p>
              <div className="p-3 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/30 border border-indigo-200/70 dark:border-indigo-800/40 text-xs text-slate-800 dark:text-indigo-200 leading-relaxed shadow-2xs">
                <strong className="text-indigo-700 dark:text-indigo-300 block mb-1 font-semibold flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" /> Plain English Meaning:
                </strong>
                {item.plainExplanation}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LegalGlossary;
