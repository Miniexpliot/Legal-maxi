import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { parseDocumentFile, formatFileSize } from '../services/documentParser';

const FileUploader = ({ onDocumentParsed, label = "Upload Legal Document" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = async (file) => {
    if (!file) return;
    setError(null);
    setLoading(true);
    setFileName(file.name);

    try {
      const extractedText = await parseDocumentFile(file);
      const newDoc = {
        id: 'doc-' + Date.now(),
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type || 'text/plain',
        uploadDate: new Date().toISOString(),
        text: extractedText
      };
      setLoading(false);
      if (onDocumentParsed) {
        onDocumentParsed(newDoc);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to parse document');
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
        }`}
      >
        <input
          type="file"
          accept=".pdf,.txt,.md,.doc,.docx"
          className="hidden"
          onChange={(e) => e.target.files && handleFileChange(e.target.files[0])}
        />

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-2 text-indigo-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm font-medium">Extracting document text ({fileName})...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-1">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">{label}</h4>
            <p className="text-xs text-slate-400 max-w-xs">
              Drag and drop your PDF, TXT, or MD legal document here, or <span className="text-indigo-400 underline">browse files</span>
            </p>
            <span className="text-[10px] text-slate-500 mt-1">Supports PDF, TXT, Markdown • Max 10MB</span>
          </div>
        )}
      </label>

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
