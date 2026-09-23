import React from 'react';
import { Download } from 'lucide-react';
import { exportAsFile } from '../services/exportService';

const ExportButton = ({ content, filename = "legal_analysis" }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => exportAsFile(content, filename, 'md')}
        className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
      >
        <Download className="w-3.5 h-3.5 text-indigo-400" />
        Export Markdown
      </button>
      <button
        onClick={() => exportAsFile(content, filename, 'txt')}
        className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
      >
        <Download className="w-3.5 h-3.5 text-slate-400" />
        Export Text
      </button>
    </div>
  );
};

export default ExportButton;
