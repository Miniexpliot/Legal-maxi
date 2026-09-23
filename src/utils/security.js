/**
 * Security utilities for input sanitization and XSS prevention
 */

export const sanitizeText = (text) => {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const validateApiKey = (key) => {
  if (!key) return false;
  // Gemini API keys typically start with AIza
  return typeof key === 'string' && key.trim().length > 10;
};

export const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
};

export const truncateText = (text, maxLength = 50000) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '\n...[Text Truncated for token limit]' : text;
};
