import { describe, it, expect } from 'vitest';
import { sanitizeText, validateApiKey, sanitizeFilename, truncateText } from '../utils/security';

describe('Security Utility Tests', () => {
  it('sanitizes HTML tags to prevent XSS attacks', () => {
    const dangerousInput = '<script>alert("XSS")</script>';
    const cleanOutput = sanitizeText(dangerousInput);
    expect(cleanOutput).not.toContain('<script>');
    expect(cleanOutput).toContain('&lt;script&gt;');
  });

  it('validates Gemini API key format', () => {
    expect(validateApiKey('AIzaSyDummyTestKey12345')).toBe(true);
    expect(validateApiKey('short')).toBe(false);
    expect(validateApiKey('')).toBe(false);
    expect(validateApiKey(null)).toBe(false);
  });

  it('sanitizes file names safely', () => {
    const badFilename = 'my_contract<script>.pdf';
    const cleanFilename = sanitizeFilename(badFilename);
    expect(cleanFilename).toBe('my_contract_script_.pdf');
  });

  it('truncates extremely long text for model token safety', () => {
    const longText = 'A'.repeat(60000);
    const truncated = truncateText(longText, 50000);
    expect(truncated.length).toBeLessThan(60000);
    expect(truncated).toContain('[Text Truncated for token limit]');
  });
});
