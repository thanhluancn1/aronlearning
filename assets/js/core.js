/**
 * HÀNH TRÌNH TOÁN HỌC TIỀN TIỂU HỌC - CORE ENGINE (SHARED)
 * Quản lý trạng thái điểm sao toàn cục, âm thanh Web Audio và Giọng đọc Đa Ngôn Ngữ.
 */

const GLOBAL_STORAGE_KEY = 'vui_hoc_toan_portal_state_v1';
const STUDENT_STORAGE_KEY = 'octo_current_student_v1';

const defaultState = {
  isLoggedIn: false,
  student: null,
  playerName: 'Chưa đăng nhập',
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
      const student = this.getStudent();
      let state = saved ? { ...defaultState, ...JSON.parse(saved) } : { ...defaultState };
      if (student) {
        state.isLoggedIn = true;
        state.student = student;
        state.playerName = student.fullName || state.playerName;
        state.avatar = student.avatar || state.avatar;
      } else {
        state.isLoggedIn = false;
        state.student = null;
        state.playerName = 'Chưa đăng nhập';
      }
      return state;
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

  // Student Auth Helpers (Phone-based ID)
  isLoggedIn() {
    const s = this.getStudent();
    return !!(s && s.studentId && s.parentPhone);
  },

  getStudent() {
    try {
      const data = localStorage.getItem(STUDENT_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Kiểm tra xem học sinh có tồn tại qua số điện thoại không (tra cứu localStorage và file JSON)
   */
  async checkStudentExists(rawPhone) {
    const phone = (rawPhone || '').toString().trim().replace(/\D/g, '');
    if (!phone || phone.length < 9) return { exists: false, error: 'Số điện thoại không hợp lệ' };

    // 1. Kiểm tra trong localStorage
    try {
      const cached = localStorage.getItem(`octo_profile_${phone}`);
      if (cached) {
        const student = JSON.parse(cached);
        return { exists: true, data: student, source: 'cache' };
      }
    } catch (e) {}

    // 2. Thử fetch file JSON tương ứng tên là phone.json
    const paths = [
      `assets/data/students/${phone}.json`,
      `../assets/data/students/${phone}.json`
    ];

    for (const p of paths) {
      try {
        const res = await fetch(p);
        if (res.ok) {
          const profile = await res.json();
          if (profile && profile.identity) {
            // Chuẩn hóa format để tương thích
            const student = {
              studentId: profile.identity.studentId || phone,
              fullName: profile.identity.fullName || '',
              age: profile.identity.age || (profile.identity.dob ? new Date().getFullYear() - new Date(profile.identity.dob).getFullYear() : 6),
              parentName: profile.identity.parent ? profile.identity.parent.name : '',
              parentPhone: profile.identity.parent ? profile.identity.parent.phone : phone,
              avatar: profile.identity.avatar || '👦',
              rawProfile: profile
            };
            // Lưu cache lại vào localStorage
            localStorage.setItem(`octo_profile_${phone}`, JSON.stringify(profile));
            return { exists: true, data: student, profile: profile, source: 'file' };
          }
        }
      } catch (err) {
        // Tiếp tục thử path khác
      }
    }

    return { exists: false };
  },

  /**
   * Đăng nhập học sinh (bằng số điện thoại hoặc dữ liệu học sinh)
   */
  login(studentData) {
    try {
      const phone = (studentData.parentPhone || studentData.studentId || '').toString().trim().replace(/\D/g, '');
      const student = {
        studentId: phone, // Số điện thoại chính là ID học sinh
        fullName: (studentData.fullName || '').trim(),
        age: studentData.age || '',
        parentName: (studentData.parentName || '').trim(),
        parentPhone: phone,
        avatar: studentData.avatar || '👦',
        loginAt: new Date().toISOString()
      };
      
      localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(student));

      const state = this.getState();
      state.isLoggedIn = true;
      state.student = student;
      state.playerName = student.fullName || phone;
      state.avatar = student.avatar;
      this.saveState(state);

      window.dispatchEvent(new CustomEvent('octo-student-changed', { detail: student }));
      return student;
    } catch (e) {
      console.error('Login failed', e);
      return null;
    }
  },

  /**
   * Đăng ký mới học sinh với ID và tên file là số điện thoại
   */
  registerNewStudent(studentData) {
    const phone = (studentData.parentPhone || '').toString().trim().replace(/\D/g, '');
    const newProfile = {
      version: "2.0.0",
      updatedAt: new Date().toISOString(),
      identity: {
        studentId: phone, // Số điện thoại là ID
        fullName: (studentData.fullName || '').trim(),
        avatar: studentData.avatar || '👦',
        age: studentData.age || 6,
        parent: {
          name: (studentData.parentName || '').trim(),
          phone: phone
        },
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString()
      },
      preferences: {
        lang: window.OctoI18n ? window.OctoI18n.currentLang : "vi",
        textZoom: 120
      },
      summaryStats: {
        totalExamsTaken: 0,
        totalQuestionsDone: 0,
        correctAnswers: 0,
        overallAccuracy: 0,
        totalTimeSpentMinutes: 0,
        streakDays: 1,
        medals: { gold: 0, silver: 0, bronze: 0 }
      },
      lastSession: null,
      progress: {},
      examHistory: [],
      mistakeBank: []
    };

    // Lưu vào hồ sơ cá nhân
    try {
      localStorage.setItem(`octo_profile_${phone}`, JSON.stringify(newProfile));
    } catch (e) {}

    // Kích hoạt đăng nhập
    return this.login({
      studentId: phone,
      fullName: newProfile.identity.fullName,
      age: newProfile.identity.age,
      parentName: newProfile.identity.parent.name,
      parentPhone: phone,
      avatar: newProfile.identity.avatar
    });
  },

  /**
   * Lấy toàn bộ hồ sơ chi tiết (đầy đủ lịch sử, câu sai, tiến độ) theo studentId (phone)
   */
  getFullProfile(studentId) {
    const sId = (studentId || (this.getStudent() ? this.getStudent().studentId : '') || '').toString().trim().replace(/\D/g, '');
    if (!sId) return null;

    try {
      const cached = localStorage.getItem(`octo_profile_${sId}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {}

    const cur = this.getStudent();
    return {
      version: "2.0.0",
      updatedAt: new Date().toISOString(),
      identity: {
        studentId: sId,
        fullName: cur ? cur.fullName : "Học sinh Octokids",
        avatar: cur ? cur.avatar : "👦",
        age: cur ? cur.age : 6,
        parent: {
          name: cur ? cur.parentName : "",
          phone: sId
        },
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString()
      },
      preferences: {
        lang: window.OctoI18n ? window.OctoI18n.currentLang : "vi",
        textZoom: 120
      },
      summaryStats: {
        totalExamsTaken: 0,
        totalQuestionsDone: 0,
        correctAnswers: 0,
        overallAccuracy: 0,
        totalTimeSpentMinutes: 0,
        streakDays: 1,
        medals: { gold: 0, silver: 0, bronze: 0 }
      },
      lastSession: null,
      progress: {},
      examHistory: [],
      mistakeBank: [],
      skillRadar: {
        logicalThinking: 80,
        arithmetic: 85,
        geometry: 80,
        combinatorics: 75,
        realWorldMath: 80
      }
    };
  },

  /**
   * Nạp và cập nhật kết quả thi vào Student Profile
   * @param {Object} resultData 
   *  - examId, examTitle, score, correctCount, totalQuestions, timeSpentSeconds, earnedMedal, wrongQuestions
   */
  recordExamResult(resultData) {
    const student = this.getStudent();
    if (!student || !student.studentId) {
      console.warn("Chưa đăng nhập, không thể nạp kết quả vào profile!");
      return null;
    }

    const sId = student.studentId;
    let profile = this.getFullProfile(sId);
    const nowIso = new Date().toISOString();

    profile.updatedAt = nowIso;
    if (profile.identity) {
      profile.identity.lastActiveAt = nowIso;
    }

    // 1. Cập nhật lastSession
    profile.lastSession = {
      examId: resultData.examId || "timo-to-hop-g1",
      examTitle: resultData.examTitle || "Luyện tập TIMO",
      mode: "practice",
      score: resultData.score,
      date: nowIso
    };

    // 2. Cập nhật summaryStats
    if (!profile.summaryStats) {
      profile.summaryStats = {
        totalExamsTaken: 0,
        totalQuestionsDone: 0,
        correctAnswers: 0,
        overallAccuracy: 0,
        totalTimeSpentMinutes: 0,
        streakDays: 1,
        medals: { gold: 0, silver: 0, bronze: 0 }
      };
    }
    const stats = profile.summaryStats;
    stats.totalExamsTaken = (stats.totalExamsTaken || 0) + 1;
    stats.totalQuestionsDone = (stats.totalQuestionsDone || 0) + (resultData.totalQuestions || 0);
    stats.correctAnswers = (stats.correctAnswers || 0) + (resultData.correctCount || 0);
    stats.overallAccuracy = stats.totalQuestionsDone > 0 
      ? Math.round((stats.correctAnswers / stats.totalQuestionsDone) * 1000) / 10 
      : 0;
    stats.totalTimeSpentMinutes = (stats.totalTimeSpentMinutes || 0) + Math.max(1, Math.round((resultData.timeSpentSeconds || 0) / 60));

    if (!stats.medals) stats.medals = { gold: 0, silver: 0, bronze: 0 };
    let medalKey = null;
    if (resultData.score >= 90) { stats.medals.gold = (stats.medals.gold || 0) + 1; medalKey = 'gold'; }
    else if (resultData.score >= 75) { stats.medals.silver = (stats.medals.silver || 0) + 1; medalKey = 'silver'; }
    else if (resultData.score >= 50) { stats.medals.bronze = (stats.medals.bronze || 0) + 1; medalKey = 'bronze'; }

    // 3. Cập nhật progress theo examId
    if (!profile.progress) profile.progress = {};
    const eId = resultData.examId || "unknown_exam";
    const prevProg = profile.progress[eId] || { explored: true, practiced: false, bestScore: 0, medal: null, attempts: 0 };
    profile.progress[eId] = {
      explored: true,
      practiced: true,
      bestScore: Math.max(prevProg.bestScore || 0, resultData.score),
      medal: medalKey || prevProg.medal,
      attempts: (prevProg.attempts || 0) + 1,
      lastAttemptAt: nowIso
    };

    // 4. Cập nhật examHistory (Lịch sử làm bài)
    if (!Array.isArray(profile.examHistory)) profile.examHistory = [];
    profile.examHistory.unshift({
      attemptId: `ATT_${Date.now()}`,
      examId: eId,
      examTitle: resultData.examTitle || eId,
      mode: "practice",
      date: nowIso,
      score: resultData.score,
      correctCount: resultData.correctCount,
      totalQuestions: resultData.totalQuestions,
      timeSpentSeconds: resultData.timeSpentSeconds,
      earnedMedal: resultData.earnedMedal
    });

    // 5. Cập nhật mistakeBank (Ngân hàng câu hỏi sai)
    if (!Array.isArray(profile.mistakeBank)) profile.mistakeBank = [];
    if (Array.isArray(resultData.wrongQuestions)) {
      resultData.wrongQuestions.forEach(wq => {
        const existing = profile.mistakeBank.find(m => m.questionId === wq.id);
        if (existing) {
          existing.missedCount = (existing.missedCount || 1) + 1;
          existing.lastWrongAnswer = wq.userAnswer;
          existing.addedAt = nowIso;
          existing.isResolved = false;
        } else {
          profile.mistakeBank.unshift({
            questionId: wq.id,
            examId: eId,
            topic: wq.topic || "Toán Tư Duy",
            missedCount: 1,
            lastWrongAnswer: wq.userAnswer,
            correctAnswer: wq.correctAnswer,
            addedAt: nowIso,
            isResolved: false
          });
        }
      });
    }

    // Lưu lại vào localStorage
    try {
      localStorage.setItem(`octo_profile_${sId}`, JSON.stringify(profile));
    } catch (e) {
      console.error("Lỗi lưu hồ sơ:", e);
    }

    // Phát sự kiện toàn cục
    window.dispatchEvent(new CustomEvent('octo-profile-updated', { detail: profile }));
    return profile;
  },

  /**
   * Tải về file profile JSON (ví dụ: 0901234567.json)
   */
  exportProfileJson(studentId) {
    const profile = this.getFullProfile(studentId);
    if (!profile) return;
    const jsonStr = JSON.stringify(profile, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profile.identity?.studentId || 'student-profile'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  logout() {
    try {
      localStorage.removeItem(STUDENT_STORAGE_KEY);
      const state = this.getState();
      state.isLoggedIn = false;
      state.student = null;
      state.playerName = 'Chưa đăng nhập';
      state.avatar = '👦';
      this.saveState(state);

      window.dispatchEvent(new CustomEvent('octo-student-changed', { detail: null }));
    } catch (e) {
      console.error('Logout failed', e);
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


