import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { DISCLAIMER_TEXT } from '../utils/constants';

const DisclaimerBanner = ({ compact = false }) => {
  return (
    <div className={`glass-panel ${compact ? 'p-2 text-xs' : 'p-3'} flex items-start gap-3 border-amber-500/30 bg-amber-500/5 text-amber-300 rounded-lg`}>
      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 text-xs leading-relaxed text-amber-200/90">
        <strong className="font-semibold text-amber-300">Important Legal Notice: </strong>
        {DISCLAIMER_TEXT}
      </div>
    </div>
  );
};

export default DisclaimerBanner;
