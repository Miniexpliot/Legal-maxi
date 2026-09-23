import { saveAs } from 'file-saver';

export const exportAsFile = (content, filename, format = 'md') => {
  if (!content) return;

  const mimeType = format === 'md' ? 'text/markdown;charset=utf-8' : 'text/plain;charset=utf-8';
  const blob = new Blob([content], { type: mimeType });
  saveAs(blob, `${filename}.${format}`);
};
