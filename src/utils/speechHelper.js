/**
 * Natural Speech Synthesis Service for Legal-Max
 * Replaces legacy mechanical speech with modern natural human voices and professional cadence.
 */

class NaturalSpeechService {
  constructor() {
    this.voices = [];
    this.selectedVoice = null;
    this.isSpeaking = false;
    this.initVoices();
  }

  initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const pickBestVoice = () => {
      this.voices = window.speechSynthesis.getVoices();
      if (!this.voices || this.voices.length === 0) return;

      // Priority ranking: Neural / Natural voices -> Google/Apple premium voices -> Standard clean English
      const voicePreferences = [
        v => v.name.includes('Natural') && v.lang.startsWith('en'),
        v => v.name.includes('Neural') && v.lang.startsWith('en'),
        v => (v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Ava') || v.name.includes('Jenny') || v.name.includes('Guy')) && v.lang.startsWith('en'),
        v => v.lang === 'en-US' && !v.name.includes('David'), // David is often the old robotic 8kHz voice
        v => v.lang === 'en-GB',
        v => v.lang.startsWith('en')
      ];

      for (const matcher of voicePreferences) {
        const found = this.voices.find(matcher);
        if (found) {
          this.selectedVoice = found;
          break;
        }
      }

      if (!this.selectedVoice && this.voices.length > 0) {
        this.selectedVoice = this.voices[0];
      }
    };

    pickBestVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = pickBestVoice;
    }
  }

  speak({ text, onStart, onEnd, onError }) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onError) onError('Speech synthesis is not supported on this browser.');
      return;
    }

    this.stop();

    if (!this.selectedVoice || this.voices.length === 0) {
      this.initVoices();
    }

    // Clean markdown headings, bullet symbols, and brackets
    const cleanText = (text || '')
      .replace(/[#*`_\[\]()~>]/g, '')
      .replace(/(\n|\r)+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    // Prepare executive briefing chunk
    const preview = cleanText.length > 1200 
      ? cleanText.substring(0, 1200) + '... Audio briefing completed. See on-screen document for full breakdown.' 
      : cleanText;

    const utterance = new SpeechSynthesisUtterance(preview);
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    }

    // Natural human conversational pacing
    utterance.rate = 0.98; // Natural, unhurried cadence
    utterance.pitch = 1.0;  // Standard neutral pitch
    utterance.volume = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      console.warn('Speech synthesis ended:', e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }
}

export const speechService = new NaturalSpeechService();
