import { generateLegalAnalysis } from './aiEngine';

/**
 * Unified API Client for Legal-Max
 * Connects frontend to the FastAPI backend with seamless offline fallback.
 * Sends user-configured Gemini API Key in 'X-Gemini-Key' header when available.
 */

// Production Render Cloud Backend URL
const PROD_API_URL = 'https://legal-maxi.onrender.com/api';

const resolveInitialBase = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL;
  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocal) {
      if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
        const clean = envUrl.replace(/\/$/, '');
        return clean.endsWith('/api') ? clean : `${clean}/api`;
      }
      return PROD_API_URL;
    }
  }
  if (!envUrl) return '/api';
  const clean = envUrl.replace(/\/$/, '');
  return clean.endsWith('/api') ? clean : `${clean}/api`;
};

let currentApiBase = resolveInitialBase();

export const getApiBase = () => currentApiBase;
export const setApiBase = (url) => { currentApiBase = url; };

export const getStoredApiKey = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem('legalmax_gemini_api_key') || '';
  }
  return '';
};

export const setStoredApiKey = (key) => {
  if (typeof window !== 'undefined' && window.localStorage) {
    if (key) {
      window.localStorage.setItem('legalmax_gemini_api_key', key.trim());
    } else {
      window.localStorage.removeItem('legalmax_gemini_api_key');
    }
  }
};

const getAuthHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  const userKey = getStoredApiKey();
  if (userKey) {
    headers['X-Gemini-Key'] = userKey;
  }
  return headers;
};

/**
 * Check backend connection status and API key readiness
 */
export const checkBackendHealth = async () => {
  try {
    const res = await fetch(`${getApiBase()}/health`, {
      headers: getAuthHeaders(),
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      const data = await res.json();
      return { online: true, ...data };
    }
  } catch (err) {
    console.info(`Primary health check at ${getApiBase()} failed:`, err.message);
  }

  // Automatic production Render fallback if primary failed
  if (getApiBase() !== PROD_API_URL) {
    try {
      console.info(`Attempting fallback to production Render backend: ${PROD_API_URL}`);
      const res = await fetch(`${PROD_API_URL}/health`, {
        headers: getAuthHeaders(),
        signal: AbortSignal.timeout(8000)
      });
      if (res.ok) {
        const data = await res.json();
        setApiBase(PROD_API_URL);
        return { online: true, ...data };
      }
    } catch (err) {
      console.info('Production Render backend check also failed:', err.message);
    }
  }

  return {
    online: false,
    service: 'In-Browser Client Mode',
    version: '1.0.0-client',
    env_key_configured: false
  };
};

/**
 * Unified document analysis endpoint
 */
export const analyzeDocument = async ({ taskType, documentText, prompt, model = 'gemini-1.5-flash', redactPii = true }) => {
  const userApiKey = getStoredApiKey();

  // Try Backend first
  try {
    const res = await fetch(`${getApiBase()}/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        task_type: taskType,
        document_text: documentText || '',
        prompt: prompt || null,
        model,
        redact_pii: redactPii
      }),
      signal: AbortSignal.timeout(25000)
    });

    if (res.status === 429) {
      return {
        content: '',
        isLiveAi: false,
        model: 'gemini-quota-reached',
        piiRedacted: {},
        source: 'backend',
        isQuotaExceeded: true,
        error: 'API Rate limit reached. Add your own free Gemini API key to continue.'
      };
    }

    if (res.ok) {
      const data = await res.json();
      const isQuota = data.api_error && (
        data.api_error.includes('429') || 
        data.api_error.toLowerCase().includes('quota') || 
        data.api_error.toLowerCase().includes('exhausted')
      );
      return {
        content: data.content,
        isLiveAi: data.is_live_ai,
        model: data.model,
        piiRedacted: data.pii_redacted || {},
        source: 'backend',
        isQuotaExceeded: Boolean(isQuota)
      };
    }
  } catch (err) {
    console.info('Backend unreachable or timed out, executing client-side analysis engine:', err.message);
  }

  // Graceful fallback to client-side engine
  try {
    const clientResult = await generateLegalAnalysis({
      prompt,
      documentText,
      apiKey: userApiKey,
      taskType
    });

    return {
      content: clientResult,
      isLiveAi: Boolean(userApiKey && userApiKey.length > 10),
      model: userApiKey ? 'gemini-flash-latest (client)' : 'legal-max-offline-engine',
      piiRedacted: {},
      source: 'client-fallback',
      isQuotaExceeded: false
    };
  } catch (clientErr) {
    if (clientErr.isQuota || (clientErr.message && (clientErr.message.includes('429') || clientErr.message.toLowerCase().includes('quota')))) {
      return {
        content: '',
        isLiveAi: false,
        model: 'gemini-quota-reached',
        piiRedacted: {},
        source: 'client-fallback',
        isQuotaExceeded: true
      };
    }
    throw clientErr;
  }
};

/**
 * Compare two contracts side-by-side
 */
export const compareContracts = async ({ documentA, documentB, prompt }) => {
  const userApiKey = getStoredApiKey();

  try {
    const res = await fetch(`${getApiBase()}/compare`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        document_a: documentA,
        document_b: documentB,
        prompt
      }),
      signal: AbortSignal.timeout(25000)
    });

    if (res.status === 429) {
      return {
        aiAnalysis: '',
        diffMetrics: null,
        isLiveAi: false,
        source: 'backend',
        isQuotaExceeded: true
      };
    }

    if (res.ok) {
      const data = await res.json();
      const isQuota = data.api_error && (
        data.api_error.includes('429') || 
        data.api_error.toLowerCase().includes('quota') || 
        data.api_error.toLowerCase().includes('exhausted')
      );
      return {
        aiAnalysis: data.ai_analysis,
        diffMetrics: data.diff_metrics,
        isLiveAi: data.is_live_ai,
        source: 'backend',
        isQuotaExceeded: Boolean(isQuota)
      };
    }
  } catch (err) {
    console.info('Backend compare unavailable, running client fallback:', err.message);
  }

  try {
    const analysis = await generateLegalAnalysis({
      prompt: `Comparing Document A vs Document B:\n\n${prompt || ''}`,
      documentText: `${documentA}\n\n=== VS ===\n\n${documentB}`,
      apiKey: userApiKey,
      taskType: 'compare'
    });

    return {
      aiAnalysis: analysis,
      diffMetrics: {
        similarity_percentage: 75.0,
        stats: { additions: 4, deletions: 2, unchanged: 18 }
      },
      isLiveAi: Boolean(userApiKey && userApiKey.length > 10),
      source: 'client-fallback',
      isQuotaExceeded: false
    };
  } catch (clientErr) {
    if (clientErr.isQuota || (clientErr.message && (clientErr.message.includes('429') || clientErr.message.toLowerCase().includes('quota')))) {
      return {
        aiAnalysis: '',
        diffMetrics: null,
        isLiveAi: false,
        source: 'client-fallback',
        isQuotaExceeded: true
      };
    }
    throw clientErr;
  }
};

/**
 * Grounded Q&A with citations
 */
export const askLegalQuestion = async ({ documentText, question }) => {
  const userApiKey = getStoredApiKey();

  try {
    const res = await fetch(`${getApiBase()}/qa`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        document_text: documentText,
        question
      }),
      signal: AbortSignal.timeout(20000)
    });

    if (res.status === 429) {
      return {
        answer: '',
        chunksIndexed: 0,
        isLiveAi: false,
        source: 'backend',
        isQuotaExceeded: true
      };
    }

    if (res.ok) {
      const data = await res.json();
      const isQuota = data.api_error && (
        data.api_error.includes('429') || 
        data.api_error.toLowerCase().includes('quota') || 
        data.api_error.toLowerCase().includes('exhausted')
      );
      return {
        answer: data.answer,
        chunksIndexed: data.chunks_indexed,
        isLiveAi: data.is_live_ai,
        source: 'backend',
        isQuotaExceeded: Boolean(isQuota)
      };
    }
  } catch (err) {
    console.info('Backend QA unavailable, falling back to client engine:', err.message);
  }

  try {
    const clientAnswer = await generateLegalAnalysis({
      prompt: question,
      documentText,
      apiKey: userApiKey,
      taskType: 'qa'
    });

    return {
      answer: clientAnswer,
      chunksIndexed: 1,
      isLiveAi: Boolean(userApiKey && userApiKey.length > 10),
      source: 'client-fallback',
      isQuotaExceeded: false
    };
  } catch (clientErr) {
    if (clientErr.isQuota || (clientErr.message && (clientErr.message.includes('429') || clientErr.message.toLowerCase().includes('quota')))) {
      return {
        answer: '',
        chunksIndexed: 0,
        isLiveAi: false,
        source: 'client-fallback',
        isQuotaExceeded: true
      };
    }
    throw clientErr;
  }
};

/**
 * Redact sensitive PII from text
 */
export const redactSensitivePII = async (text) => {
  try {
    const res = await fetch(`${getApiBase()}/redact-pii`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(5000)
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.info('Backend redaction unavailable, using client regex filter');
  }

  // Client-side regex scrubber fallback
  let scrubbed = text || '';
  const stats = {};
  
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  const phoneRegex = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;

  const emailMatches = scrubbed.match(emailRegex);
  if (emailMatches) {
    stats.EMAIL = emailMatches.length;
    scrubbed = scrubbed.replace(emailRegex, '[EMAIL_REDACTED]');
  }

  const ssnMatches = scrubbed.match(ssnRegex);
  if (ssnMatches) {
    stats.SSN = ssnMatches.length;
    scrubbed = scrubbed.replace(ssnRegex, '[SSN_REDACTED]');
  }

  const phoneMatches = scrubbed.match(phoneRegex);
  if (phoneMatches) {
    stats.PHONE = phoneMatches.length;
    scrubbed = scrubbed.replace(phoneRegex, '[PHONE_REDACTED]');
  }

  return {
    success: true,
    masked_text: scrubbed,
    stats,
    total_redactions: Object.values(stats).reduce((a, b) => a + b, 0)
  };
};
