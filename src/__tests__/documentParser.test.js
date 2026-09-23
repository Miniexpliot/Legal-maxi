import { describe, it, expect } from 'vitest';
import { formatFileSize } from '../services/documentParser';

describe('Document Parser Utility Tests', () => {
  it('formats file sizes accurately', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(5242880)).toBe('5 MB');
  });
});
