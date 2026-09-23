import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export const LoadingSpinner = ({ label = "Legal-Max AI is analyzing..." }) => {
  return (
    <div className="glass-panel p-8 flex flex-col items-center justify-center gap-3 text-center border-indigo-500/20">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <Sparkles className="w-5 h-5 text-indigo-400 absolute animate-pulse" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-200">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">Evaluating clauses, obligations, and risk factors...</p>
      </div>
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="glass-panel p-4 space-y-3 animate-pulse">
    <div className="h-4 bg-slate-800 rounded w-1/3"></div>
    <div className="h-3 bg-slate-800/60 rounded w-full"></div>
    <div className="h-3 bg-slate-800/60 rounded w-4/5"></div>
  </div>
);
