import { describe, it, expect } from 'vitest';
import { generateLegalAnalysis } from '../services/aiEngine';

describe('AI Engine Service Tests', () => {
  it('generates fallback plain English simplification when API key is unconfigured', async () => {
    const response = await generateLegalAnalysis({
      prompt: 'Simplify this',
      documentText: 'Party A shall indemnify Party B for all liquidated damages.',
      apiKey: '',
      taskType: 'simplify'
    });

    expect(response).toBeDefined();
    expect(response).toContain('Plain English');
    expect(response.toLowerCase()).toContain('liquidated damages');
  });

  it('handles scan task type correctly', async () => {
    const response = await generateLegalAnalysis({
      prompt: '',
      documentText: 'Liquidated damages of $250,000.',
      apiKey: '',
      taskType: 'scan'
    });

    expect(response).toContain('Risk Score');
  });
});
