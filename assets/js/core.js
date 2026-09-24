/**
 * HÀNH TRÌNH TOÁN HỌC TIỀN TIỂU HỌC - CORE ENGINE (SHARED)
 * Quản lý trạng thái điểm sao toàn cục, âm thanh Web Audio và Giọng đọc Đa Ngôn Ngữ.
 */

const GLOBAL_STORAGE_KEY = 'vui_hoc_toan_portal_state_v1';

const defaultState = {
  playerName: 'Bé Giỏi Giang',
  avatar: '👦',
  stars: 0,
  isMuted: false,
  completedModules: []
};

// Global Store Helper
window.PortalCore = {
  // Load state from localStorage
  getState() {
    try {
      const saved = localStorage.getItem(GLOBAL_STORAGE_KEY);
      return saved ? { ...defaultState, ...JSON.parse(saved) } : { ...defaultState };
    } catch (e) {
      return { ...defaultState };
    }
  },

  // Save state to localStorage
  saveState(state) {
    try {
      localStorage.setItem(GLOBAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Save state failed', e);
    }
  },

  // Add Stars globally
  addStars(count = 1) {
    const state = this.getState();
    state.stars += count;
    this.saveState(state);
    return state.stars;
  },

  // Sound Engine (Web Audio API)
  audioCtx: null,
  initAudio() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
  },

  playPop() {
    const state = this.getState();
    if (state.isMuted) return;
    this.initAudio();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(750, this.audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.08);
  },

  playSuccess() {
    const state = this.getState();
    if (state.isMuted) return;
    this.initAudio();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, i) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = f;
      const st = this.audioCtx.currentTime + i * 0.09;
      gain.gain.setValueAtTime(0.3, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.35);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(st);
      osc.stop(st + 0.35);
    });
  },

  // Web Speech Synthesis (Giọng đọc Đa ngôn ngữ chuẩn vi-VN, en-US, zh-CN)
  speak(text, langCode = 'vi-VN') {
    const state = this.getState();
    if (state.isMuted) return;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const voices = window.speechSynthesis.getVoices();
      
      const langPrefix = langCode.split('-')[0].toLowerCase();
      const targetVoice = voices.find(v => 
        v.lang.toLowerCase().includes(langPrefix) && 
        (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Online') || v.name.includes('Google'))
      ) || voices.find(v => v.lang.toLowerCase().includes(langPrefix));

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      if (targetVoice) utterance.voice = targetVoice;

      window.speechSynthesis.speak(utterance);
    }
  }
};


