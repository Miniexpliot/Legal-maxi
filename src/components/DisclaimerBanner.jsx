import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DISCLAIMER_TEXT } from '../utils/constants';

const DisclaimerBanner = ({ compact = false }) => {
  return (
    <div className={`glass-panel ${compact ? 'p-3 text-xs' : 'p-3.5'} flex items-start gap-3 border border-amber-300/80 dark:border-amber-500/30 bg-amber-50/90 dark:bg-amber-950/30 rounded-xl shadow-xs animate-fade-in`}>
      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 text-xs leading-relaxed text-amber-900 dark:text-amber-200/90 font-medium">
        <strong className="font-bold text-amber-950 dark:text-amber-300">Important Legal Notice: </strong>
        {DISCLAIMER_TEXT}
      </div>
    </div>
  );
};

export default DisclaimerBanner;
