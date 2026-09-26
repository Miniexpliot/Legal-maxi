import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Enhanced LegalMarkdown component
 * Supports GFM tables, checklists, callouts, strikethrough, blockquotes, code blocks.
 */
const LegalMarkdown = ({ content, className = '' }) => {
  if (!content) return null;

  return (
    <div className={`legal-markdown-root ${className}`}>
      <Markdown remarkPlugins={[remarkGfm]}>
        {content}
      </Markdown>
    </div>
  );
};

export default LegalMarkdown;
