/**
 * OCTOKIDS STUDENT AUTH ENGINE
 * Quản lý phiên đăng nhập, xác thực số điện thoại, đăng ký mới và lưu trữ trạng thái người chơi
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

window.CoreStudentAuth = {
  GLOBAL_STORAGE_KEY,
  STUDENT_STORAGE_KEY,
  defaultState,

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
      const activeCls = (this.getActiveClassId ? this.getActiveClassId() : window.PortalCore?.getActiveClassId?.());
      window.dispatchEvent(new CustomEvent('octo-class-changed', { detail: { classId: activeCls } }));
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
  }
};
