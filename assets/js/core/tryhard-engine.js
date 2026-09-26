/**
 * OCTOKIDS TRY-HARD ENGINE
 * Quản lý ngân hàng câu hỏi làm sai, đồng bộ câu sai theo từng lớp học và loại bỏ câu khi giải đúng
 */
window.CoreTryHardEngine = {
  /**
   * Lấy dữ liệu Try-Hard của học sinh cho một lớp
   */
  async getStudentTryHardData(studentId, classId) {
    const sId = (studentId || '').toString().trim().replace(/\D/g, '');
    const cId = classId || (this.getActiveClassId ? this.getActiveClassId() : window.PortalCore?.getActiveClassId?.()) || 'class-math';
    const storageKey = `octo_tryhard_${sId}_${cId}`;

    // 1. Thử đọc từ localStorage
    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) return JSON.parse(cached);
    } catch (e) {}

    // 2. Thử fetch file JSON cá nhân hóa
    const personalPaths = [
      `assets/data/tryhard/${sId}-${cId}-quick-tryhard.json`,
      `../assets/data/tryhard/${sId}-${cId}-quick-tryhard.json`
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
    const cId = classId || (this.getActiveClassId ? this.getActiveClassId() : window.PortalCore?.getActiveClassId?.()) || 'class-math';
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
    const profile = (this.getFullProfile ? this.getFullProfile(sId) : window.PortalCore?.getFullProfile?.(sId));
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
    const cId = classId || (this.getActiveClassId ? this.getActiveClassId() : window.PortalCore?.getActiveClassId?.()) || 'class-math';

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
    const cId = classId || (this.getActiveClassId ? this.getActiveClassId() : window.PortalCore?.getActiveClassId?.()) || 'class-math';

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
  }
};
