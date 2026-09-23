import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getStoredApiKey, setStoredApiKey, redactSensitivePII, analyzeDocument } from '../services/apiClient';

describe('API Client & Dual Engine Tests', () => {
  let mockStorage = {};

  beforeEach(() => {
    mockStorage = {};
    global.window = {
      localStorage: {
        getItem: (k) => mockStorage[k] || null,
        setItem: (k, v) => { mockStorage[k] = v; },
        removeItem: (k) => { delete mockStorage[k]; },
        clear: () => { mockStorage = {}; }
      }
    };
    vi.restoreAllMocks();
  });

  it('stores and retrieves user API key correctly', () => {
    expect(getStoredApiKey()).toBe('');
    setStoredApiKey('AIzaSyCustomKey1234567890');
    expect(getStoredApiKey()).toBe('AIzaSyCustomKey1234567890');
    setStoredApiKey('');
    expect(getStoredApiKey()).toBe('');
  });

  it('redacts sensitive PII using client regex scrubber', async () => {
    const raw = "Contact alice@lawfirm.com or call 555-234-5678. SSN: 123-45-6789.";
    const result = await redactSensitivePII(raw);

    expect(result.success).toBe(true);
    expect(result.masked_text).toContain('[EMAIL_REDACTED]');
    expect(result.masked_text).toContain('[PHONE_REDACTED]');
    expect(result.masked_text).toContain('[SSN_REDACTED]');
    expect(result.masked_text).not.toContain('alice@lawfirm.com');
    expect(result.masked_text).not.toContain('123-45-6789');
  });

  it('falls back seamlessly to local engine when backend is offline', async () => {
    // Mock fetch to simulate offline backend
    global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

    const result = await analyzeDocument({
      taskType: 'simplify',
      documentText: 'Mutual NDA agreement text...',
      prompt: 'Simplify this'
    });

    expect(result.source).toBe('client-fallback');
    expect(result.content).toBeDefined();
    expect(result.content).toContain('Plain English Simplification');
  });
});
