/**
 * OCTOKIDS AUDIO & SPEECH ENGINE
 * Quản lý Web Audio API và Web Speech API (Đa ngôn ngữ vi-VN, en-US, zh-CN)
 */
window.CoreAudio = {
  audioCtx: null,

  initAudio() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
  },

  playPop() {
    const isMuted = window.PortalCore?.getState()?.isMuted ?? false;
    if (isMuted) return;
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
    const isMuted = window.PortalCore?.getState()?.isMuted ?? false;
    if (isMuted) return;
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
    const isMuted = window.PortalCore?.getState()?.isMuted ?? false;
    if (isMuted) return;

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
