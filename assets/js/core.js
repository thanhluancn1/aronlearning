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

  // Available classes metadata
  availableClasses: [
    { id: 'class-math', name: { vi: 'Toán Quốc Tế TIMO', en: 'TIMO International Math', zh: 'TIMO 国际奥数' }, icon: '📐' },
    { id: 'class-english', name: { vi: 'Toán Tiếng Anh HKIMO', en: 'HKIMO English Math', zh: 'HKIMO 英语奥数' }, icon: '🇬🇧' },
    { id: 'class-default', name: { vi: 'Lớp Cơ Bản Mặc Định', en: 'Default Foundation Class', zh: '基础默认班级' }, icon: '🌱' }
  ],

  /**
   * Lấy ID lớp đang kích hoạt (activeClassId)
   */
  getActiveClassId() {
    const saved = localStorage.getItem('octo_active_class');
    const student = this.getStudent();
    if (student && student.studentId) {
      const profile = this.getFullProfile(student.studentId);
      const studentClasses = (profile && profile.identity && Array.isArray(profile.identity.classes)) 
        ? profile.identity.classes 
        : (student.classes || []);
      if (studentClasses.length > 0) {
        if (saved && studentClasses.includes(saved)) {
          return saved;
        }
        return studentClasses[0];
      }
    }
    return saved || 'class-math';
  },

  /**
   * Đổi lớp đang kích hoạt và phát sự kiện toàn cục octo-class-changed
   */
  setActiveClassId(classId) {
    if (!classId) return;
    localStorage.setItem('octo_active_class', classId);
    window.dispatchEvent(new CustomEvent('octo-class-changed', { detail: { classId } }));
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
        const profile = JSON.parse(cached);
        const student = {
          studentId: profile.identity.studentId || phone,
          fullName: profile.identity.fullName || '',
          age: profile.identity.age || (profile.identity.dob ? new Date().getFullYear() - new Date(profile.identity.dob).getFullYear() : 6),
          parentName: profile.identity.parent_name || '',
          parentPhone: profile.identity.parent_phone || phone,
          parentEmail: profile.identity.parent_email || '',
          avatar: profile.identity.avatar || '👦',
          classes: profile.identity.classes || ['class-math'],
          rawProfile: profile
        };
        return { exists: true, data: student, profile: profile, source: 'cache' };
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
            const student = {
              studentId: profile.identity.studentId || phone,
              fullName: profile.identity.fullName || '',
              age: profile.identity.age || (profile.identity.dob ? new Date().getFullYear() - new Date(profile.identity.dob).getFullYear() : 6),
              parentName: profile.identity.parent_name || '',
              parentPhone: profile.identity.parent_phone || phone,
              parentEmail: profile.identity.parent_email || '',
              avatar: profile.identity.avatar || '👦',
              classes: profile.identity.classes || ['class-math'],
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
      const phone = (studentData.parentPhone || studentData.parent_phone || studentData.studentId || '').toString().trim().replace(/\D/g, '');
      const rawClasses = studentData.classes || 
        (studentData.rawProfile && studentData.rawProfile.identity && studentData.rawProfile.identity.classes) || 
        ['class-math'];

      const student = {
        studentId: phone, // Số điện thoại chính là ID học sinh
        fullName: (studentData.fullName || '').trim(),
        age: studentData.age || '',
        parentName: (studentData.parentName || studentData.parent_name || '').trim(),
        parentPhone: phone,
        parentEmail: (studentData.parentEmail || studentData.parent_email || '').trim(),
        avatar: studentData.avatar || '👦',
        classes: rawClasses,
        loginAt: new Date().toISOString()
      };
      
      localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(student));

      // Đảm bảo activeClass nằm trong danh sách lớp của học sinh
      const curActive = localStorage.getItem('octo_active_class');
      if (!curActive || !rawClasses.includes(curActive)) {
        if (rawClasses.length > 0) {
          localStorage.setItem('octo_active_class', rawClasses[0]);
        }
      }

      const state = this.getState();
      state.isLoggedIn = true;
      state.student = student;
      state.playerName = student.fullName || phone;
      state.avatar = student.avatar;
      this.saveState(state);

      window.dispatchEvent(new CustomEvent('octo-student-changed', { detail: student }));
      window.dispatchEvent(new CustomEvent('octo-class-changed', { detail: { classId: this.getActiveClassId() } }));
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
    const phone = (studentData.parentPhone || studentData.parent_phone || '').toString().trim().replace(/\D/g, '');
    let enrolledClasses = studentData.classes;
    if (!Array.isArray(enrolledClasses) || enrolledClasses.length === 0) {
      enrolledClasses = ['class-default'];
    }

    const nowIso = new Date().toISOString();
    const newProfile = {
      version: "2.2.0",
      updatedAt: nowIso,
      identity: {
        studentId: phone, // Số điện thoại là ID
        fullName: (studentData.fullName || '').trim(),
        avatar: studentData.avatar || '👦',
        age: studentData.age || 6,
        parent_name: (studentData.parentName || studentData.parent_name || '').trim(),
        parent_phone: phone,
        parent_email: (studentData.parentEmail || studentData.parent_email || '').trim(),
        lang: window.OctoI18n ? window.OctoI18n.currentLang : "vi",
        textZoom: 120,
        classes: enrolledClasses,
        createdAt: nowIso,
        lastActiveAt: nowIso
      },
      summaryStats: {
        totalExamsTaken: 0,
        totalQuestionsDone: 0,
        correctAnswers: 0,
        overallAccuracy: 0,
        totalTimeSpentMinutes: 0,
        medal_gold: 0,
        medal_silver: 0,
        medal_bronze: 0,
        date: nowIso
      },
      skillRadar: {
        logicalThinking: 70,
        arithmetic: 75,
        geometry: 70,
        combinatorics: 60,
        realWorldMath: 70,
        date: nowIso
      }
    };

    // Khởi tạo từng mảng lớp học trong profile
    enrolledClasses.forEach(clsId => {
      const tryHardId = `${phone}-${clsId}-quick-tryhard`;
      newProfile[clsId] = [
        {
          examId: tryHardId,
          status: "processing",
          explored: false,
          practiced: false,
          score: null,
          medal: null,
          attempts: 0,
          totalQuestions: 0,
          correctCount: 0,
          timeSpentSeconds: 0,
          date: nowIso
        }
      ];

      // Khởi tạo Try-Hard rỗng trong cache nếu chưa có
      const defaultTryHardObj = {
        examConfig: {
          id: tryHardId,
          title: {
            vi: `Toán - Ôn Tập Câu Đã Sai`,
            en: `Missed Questions Review`,
            zh: `错题攻坚`
          },
          grade: 1,
          totalQuestions: 0,
          timeLimitMinutes: 15,
          passingScore: 80
        },
        questions: []
      };
      try {
        if (!localStorage.getItem(`octo_tryhard_${phone}_${clsId}`)) {
          localStorage.setItem(`octo_tryhard_${phone}_${clsId}`, JSON.stringify(defaultTryHardObj));
        }
      } catch (e) {}
    });

    // Lưu vào hồ sơ cá nhân
    try {
      localStorage.setItem(`octo_profile_${phone}`, JSON.stringify(newProfile));
    } catch (e) {}

    // Kích hoạt đăng nhập
    return this.login({
      studentId: phone,
      fullName: newProfile.identity.fullName,
      age: newProfile.identity.age,
      parentName: newProfile.identity.parent_name,
      parentPhone: phone,
      parentEmail: newProfile.identity.parent_email,
      avatar: newProfile.identity.avatar,
      classes: enrolledClasses
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
        const parsed = JSON.parse(cached);
        // Tương thích ngược: nếu profile cũ có examList dạng object thì chuyển đổi
        if (parsed.identity && !parsed.identity.classes) {
          parsed.identity.classes = ['class-math'];
        }
        if (parsed.examList && !parsed['class-math']) {
          const list = Array.isArray(parsed.examList) ? parsed.examList : Object.values(parsed.examList);
          parsed['class-math'] = list;
        }
        return parsed;
      }
    } catch (e) {}

    const cur = this.getStudent();
    const defaultClasses = (cur && cur.classes && Array.isArray(cur.classes)) ? cur.classes : ['class-math'];
    const nowIso = new Date().toISOString();
    const defaultProfile = {
      version: "2.2.0",
      updatedAt: nowIso,
      identity: {
        studentId: sId,
        fullName: cur ? cur.fullName : "Học sinh Octokids",
        avatar: cur ? cur.avatar : "👦",
        age: cur ? cur.age : 6,
        parent_name: cur ? (cur.parentName || cur.parent_name || "") : "",
        parent_phone: sId,
        parent_email: cur ? (cur.parentEmail || cur.parent_email || "") : "",
        lang: window.OctoI18n ? window.OctoI18n.currentLang : "vi",
        textZoom: 120,
        classes: defaultClasses,
        createdAt: nowIso,
        lastActiveAt: nowIso
      },
      summaryStats: {
        totalExamsTaken: 0,
        totalQuestionsDone: 0,
        correctAnswers: 0,
        overallAccuracy: 0,
        totalTimeSpentMinutes: 0,
        medal_gold: 0,
        medal_silver: 0,
        medal_bronze: 0,
        date: nowIso
      },
      skillRadar: {
        logicalThinking: 80,
        arithmetic: 85,
        geometry: 80,
        combinatorics: 75,
        realWorldMath: 80,
        date: nowIso
      }
    };

    defaultClasses.forEach(clsId => {
      defaultProfile[clsId] = [
        {
          examId: `${sId}-${clsId}-quick-tryhard`,
          status: "processing",
          explored: false,
          practiced: false,
          score: null,
          medal: null,
          attempts: 0,
          totalQuestions: 0,
          correctCount: 0,
          timeSpentSeconds: 0,
          date: nowIso
        }
      ];
    });

    return defaultProfile;
  },

  /**
   * Ghi nhận khi học sinh bấm Khám phá hoặc Luyện tập 1 bài thi
   * Mặc định nếu practiced = false thì status luôn là 'processing'
   */
  recordExamStart(examId, mode = 'practice', classId = null) {
    const student = this.getStudent();
    if (!student || !student.studentId || !examId) return null;
    const sId = student.studentId;
    let profile = this.getFullProfile(sId);
    if (!profile) return null;

    const targetClassId = classId || this.getActiveClassId() || 'class-math';
    if (!profile[targetClassId] || !Array.isArray(profile[targetClassId])) {
      profile[targetClassId] = [];
    }

    const tryHardId = `${sId}-${targetClassId}-quick-tryhard`;
    let thItem = profile[targetClassId].find(item => item.examId === tryHardId || item.examId.includes('quick-tryhard'));
    if (!thItem) {
      profile[targetClassId].unshift({
        examId: tryHardId,
        status: 'processing',
        explored: false,
        practiced: false,
        score: null,
        medal: null,
        attempts: 0,
        totalQuestions: 0,
        correctCount: 0,
        timeSpentSeconds: 0,
        date: new Date().toISOString()
      });
    }

    const nowIso = new Date().toISOString();
    let examItem = profile[targetClassId].find(item => item.examId === examId);

    if (!examItem) {
      examItem = {
        examId: examId,
        status: 'processing', // practiced = false nên luôn là processing
        explored: true,
        practiced: false,
        score: null,
        medal: null,
        attempts: 0,
        totalQuestions: 0,
        correctCount: null,
        timeSpentSeconds: 0,
        date: nowIso
      };
      profile[targetClassId].push(examItem);
    } else {
      examItem.explored = true;
      examItem.date = nowIso;
      // Quy tắc bắt buộc: Nếu practiced = false thì luôn có status là processing
      if (!examItem.practiced) {
        examItem.status = 'processing';
      }
    }

    profile.updatedAt = nowIso;
    if (profile.identity) profile.identity.lastActiveAt = nowIso;

    try {
      localStorage.setItem(`octo_profile_${sId}`, JSON.stringify(profile));
    } catch (e) {
      console.error("Lỗi lưu hồ sơ:", e);
    }

    window.dispatchEvent(new CustomEvent('octo-profile-updated', { detail: profile }));
    return examItem;
  },

  /**
   * Lấy trạng thái của một examId trong lớp hiện tại hoặc lớp chỉ định
   */
  getExamStatus(examId, classId = null) {
    const student = this.getStudent();
    if (!student || !student.studentId || !examId) return null;
    const profile = this.getFullProfile(student.studentId);
    if (!profile) return null;

    const targetClassId = classId || this.getActiveClassId() || 'class-math';
    const classList = profile[targetClassId];
    if (Array.isArray(classList)) {
      return classList.find(item => item.examId === examId) || null;
    }
    if (profile.examList && profile.examList[examId]) {
      return profile.examList[examId];
    }
    return null;
  },

  /**
   * Nạp và cập nhật kết quả thi vào Student Profile theo lớp
   */
  async recordExamResult(resultData, classId = null) {
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

    const targetClassId = classId || resultData.classId || this.getActiveClassId() || 'class-math';
    if (!profile[targetClassId] || !Array.isArray(profile[targetClassId])) {
      profile[targetClassId] = [];
    }

    const tryHardId = `${sId}-${targetClassId}-quick-tryhard`;
    let thItem = profile[targetClassId].find(item => item.examId === tryHardId || item.examId.includes('quick-tryhard'));
    if (!thItem) {
      profile[targetClassId].unshift({
        examId: tryHardId,
        status: 'processing',
        explored: false,
        practiced: false,
        score: null,
        medal: null,
        attempts: 0,
        totalQuestions: 0,
        correctCount: 0,
        timeSpentSeconds: 0,
        date: nowIso
      });
    }

    const eId = resultData.examId || "unknown_exam";
    let examItem = profile[targetClassId].find(item => item.examId === eId);

    let medalKey = null;
    if (resultData.score >= 90) medalKey = 'gold';
    else if (resultData.score >= 75) medalKey = 'silver';
    else if (resultData.score >= 50) medalKey = 'bronze';

    if (!examItem) {
      examItem = {
        examId: eId,
        status: 'completed',
        explored: true,
        practiced: true,
        score: resultData.score,
        medal: medalKey,
        attempts: 1,
        totalQuestions: resultData.totalQuestions || 0,
        correctCount: resultData.correctCount || 0,
        timeSpentSeconds: resultData.timeSpentSeconds || 0,
        date: nowIso
      };
      profile[targetClassId].push(examItem);
    } else {
      const bestScore = (examItem.score !== null && examItem.score !== undefined)
        ? Math.max(examItem.score, resultData.score)
        : resultData.score;
      examItem.status = 'completed';
      examItem.explored = true;
      examItem.practiced = true;
      examItem.score = bestScore;
      if (medalKey) examItem.medal = medalKey;
      examItem.attempts = (examItem.attempts || 0) + 1;
      examItem.totalQuestions = resultData.totalQuestions || examItem.totalQuestions || 0;
      if (resultData.correctCount !== undefined) examItem.correctCount = resultData.correctCount;
      examItem.timeSpentSeconds = (examItem.timeSpentSeconds || 0) + (resultData.timeSpentSeconds || 0);
      examItem.date = nowIso;
    }

    // 2. Cập nhật summaryStats
    if (!profile.summaryStats) {
      profile.summaryStats = {
        totalExamsTaken: 0,
        totalQuestionsDone: 0,
        correctAnswers: 0,
        overallAccuracy: 0,
        totalTimeSpentMinutes: 0,
        medal_gold: 0,
        medal_silver: 0,
        medal_bronze: 0,
        date: nowIso
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
    stats.date = nowIso;

    if (medalKey === 'gold') stats.medal_gold = (stats.medal_gold || 0) + 1;
    else if (medalKey === 'silver') stats.medal_silver = (stats.medal_silver || 0) + 1;
    else if (medalKey === 'bronze') stats.medal_bronze = (stats.medal_bronze || 0) + 1;

    // 3. Xử lý câu sai Try-Hard
    const isTryHardExam = eId.includes('quick-tryhard');
    if (!isTryHardExam) {
      // Nếu bài bình thường có câu sai ➔ Nạp vào Try-Hard của lớp này
      if (resultData.wrongQuestions && resultData.wrongQuestions.length > 0) {
        await this.addWrongQuestionsToTryHard(sId, targetClassId, resultData.wrongQuestions, {
          examId: eId,
          examTitle: resultData.examTitle
        });
      }
    } else {
      // Nếu đang làm bài Try-Hard ➔ Loại bỏ những câu đã làm đúng ra khỏi danh sách
      if (resultData.correctQuestionIds && resultData.correctQuestionIds.length > 0) {
        await this.removeResolvedTryHardQuestions(sId, targetClassId, resultData.correctQuestionIds);
      }
    }

    // 4. Lưu lại vào localStorage
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
   * Lấy dữ liệu Try-Hard của học sinh cho một lớp
   */
  async getStudentTryHardData(studentId, classId) {
    const sId = (studentId || '').toString().trim().replace(/\D/g, '');
    const cId = classId || this.getActiveClassId() || 'class-math';
    const storageKey = `octo_tryhard_${sId}_${cId}`;

    // 1. Thử đọc từ localStorage
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) return JSON.parse(cached);
    } catch (e) {}

    // 2. Thử fetch file JSON cá nhân hóa
    const personalPaths = [
      `assets/data/${sId}-${cId}-quick-tryhard.json`,
      `../assets/data/${sId}-${cId}-quick-tryhard.json`
    ];
    for (const p of personalPaths) {
      try {
        const res = await fetch(p);
        if (res.ok) {
          const data = await res.json();
          if (data && data.examConfig) {
            localStorage.setItem(storageKey, JSON.stringify(data));
            return data;
          }
        }
      } catch (e) {}
    }

    // 3. Fallback mặc định rỗng
    const fallbackObj = {
      examConfig: {
        id: `${sId}-${cId}-quick-tryhard`,
        title: {
          vi: "Toán - Ôn Tập Câu Đã Sai",
          en: "Missed Questions Review",
          zh: "错题攻坚"
        },
        grade: 1,
        totalQuestions: 0,
        timeLimitMinutes: 15,
        passingScore: 80
      },
      questions: []
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(fallbackObj));
    } catch (e) {}
    return fallbackObj;
  },

  /**
   * Lưu dữ liệu Try-Hard của học sinh cho một lớp
   */
  saveStudentTryHardData(studentId, classId, tryHardData) {
    const sId = (studentId || '').toString().trim().replace(/\D/g, '');
    const cId = classId || this.getActiveClassId() || 'class-math';
    const storageKey = `octo_tryhard_${sId}_${cId}`;

    if (tryHardData && tryHardData.examConfig) {
      tryHardData.examConfig.totalQuestions = (tryHardData.questions || []).length;
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify(tryHardData));
    } catch (e) {
      console.error("Lỗi lưu dữ liệu TryHard:", e);
    }

    // Cập nhật số câu trong profile[classId]
    const profile = this.getFullProfile(sId);
    if (profile && Array.isArray(profile[cId])) {
      const tryHardId = `${sId}-${cId}-quick-tryhard`;
      const thItem = profile[cId].find(item => item.examId === tryHardId || item.examId.includes('quick-tryhard'));
      if (thItem) {
        thItem.totalQuestions = (tryHardData.questions || []).length;
        localStorage.setItem(`octo_profile_${sId}`, JSON.stringify(profile));
        window.dispatchEvent(new CustomEvent('octo-profile-updated', { detail: profile }));
      }
    }
  },

  /**
   * Thêm câu hỏi làm sai vào file/dữ liệu Try-Hard của học sinh trong lớp
   */
  async addWrongQuestionsToTryHard(studentId, classId, wrongQuestions, examMeta = {}) {
    if (!studentId || !wrongQuestions || wrongQuestions.length === 0) return;
    const sId = studentId.toString().trim().replace(/\D/g, '');
    const cId = classId || this.getActiveClassId() || 'class-math';

    const tryHardData = await this.getStudentTryHardData(sId, cId);
    if (!tryHardData.questions) tryHardData.questions = [];

    wrongQuestions.forEach(wq => {
      const qObj = wq.question || wq;
      const qKey = qObj.uniqueKey || `${examMeta.examId || 'ex'}_${qObj.id}`;
      const existingIdx = tryHardData.questions.findIndex(q => (q.uniqueKey && q.uniqueKey === qKey) || q.id === qObj.id);

      if (existingIdx === -1) {
        const cloned = JSON.parse(JSON.stringify(qObj));
        cloned.uniqueKey = qKey;
        cloned.sourceExamId = examMeta.examId || '';
        cloned.addedAt = new Date().toISOString();
        tryHardData.questions.push(cloned);
      }
    });

    this.saveStudentTryHardData(sId, cId, tryHardData);
  },

  /**
   * Xóa các câu đã làm đúng khỏi dữ liệu Try-Hard của học sinh
   */
  async removeResolvedTryHardQuestions(studentId, classId, correctQuestionIds) {
    if (!studentId || !correctQuestionIds || correctQuestionIds.length === 0) return;
    const sId = studentId.toString().trim().replace(/\D/g, '');
    const cId = classId || this.getActiveClassId() || 'class-math';

    const tryHardData = await this.getStudentTryHardData(sId, cId);
    if (!tryHardData.questions || tryHardData.questions.length === 0) return;

    const initialLen = tryHardData.questions.length;
    tryHardData.questions = tryHardData.questions.filter(q => {
      const match = correctQuestionIds.includes(q.id) || (q.uniqueKey && correctQuestionIds.includes(q.uniqueKey));
      return !match;
    });

    if (tryHardData.questions.length !== initialLen) {
      this.saveStudentTryHardData(sId, cId, tryHardData);
    }
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


