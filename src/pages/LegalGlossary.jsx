import React, { useState } from 'react';
import { BookOpen, Search, Sparkles } from 'lucide-react';
import { LEGAL_GLOSSARY } from '../utils/constants';
import { useApp } from '../context/AppContext';
import { generateLegalAnalysis } from '../services/aiEngine';
import DisclaimerBanner from '../components/DisclaimerBanner';

const LegalGlossary = () => {
  const { apiKey } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [customTerm, setCustomTerm] = useState('');
  const [customExplanation, setCustomExplanation] = useState('');
  const [loading, setLoading] = useState(false);

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

    try {
      const res = await generateLegalAnalysis({
        prompt: `Explain the following legal term or phrase in ELI5 plain English with practical everyday examples: "${customTerm}"`,
        documentText: '',
        apiKey,
        taskType: 'simplify'
      });
      setCustomExplanation(res);
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
            <BookOpen className="w-6 h-6 text-amber-400" />
            Plain-English Legal Glossary
          </h1>
          <p className="text-xs text-slate-400">Demystify complex legal terms, clauses, and concepts with practical explanations.</p>
        </div>
        <DisclaimerBanner compact />
      </div>

      {/* AI Custom Term Explainer Tool */}
      <div className="glass-panel p-5 border border-amber-500/20 bg-amber-500/5 space-y-3">
        <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          Ask AI to Explain Any Custom Legal Term
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. Subrogation, Quantum Meruit, Estoppel..."
            value={customTerm}
            onChange={(e) => setCustomTerm(e.target.value)}
            className="input-field text-xs py-2"
          />
          <button
            onClick={handleExplainCustom}
            disabled={loading || !customTerm.trim()}
            className="btn-primary py-2 px-4 shrink-0 text-xs"
          >
            {loading ? 'Explaining...' : 'Explain in Plain English'}
          </button>
        </div>

        {customExplanation && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed space-y-2 mt-2">
            <p className="font-semibold text-indigo-300">Explanation for "{customTerm}":</p>
            <p className="whitespace-pre-wrap">{customExplanation}</p>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search legal terms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 text-xs py-2"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                category === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
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
          <div key={idx} className="glass-panel p-5 border-slate-800 space-y-3 hover:border-amber-500/30 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-heading">{item.term}</h3>
              <span className="badge badge-amber text-[10px]">{item.category}</span>
            </div>

            <div>
              <p className="text-xs text-slate-400 italic mb-2">"{item.definition}"</p>
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-200">
                <strong className="text-indigo-300 block mb-1">💡 Plain English Meaning:</strong>
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
