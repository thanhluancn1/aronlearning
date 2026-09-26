/**
 * OCTOKIDS STUDENT PROFILE & EXAM PROGRESS STORE
 * Quản lý hồ sơ học sinh phẳng, lưu điểm thi, cập nhật tiến độ, tính toán huy chương và xuất file JSON
 */
window.CoreStudentProfile = {
  /**
   * Lấy toàn bộ hồ sơ chi tiết (đầy đủ lịch sử, câu sai, tiến độ) theo studentId (phone)
   */
  getFullProfile(studentId) {
    const sId = (studentId || (this.getStudent ? this.getStudent()?.studentId : window.PortalCore?.getStudent?.()?.studentId) || '').toString().trim().replace(/\D/g, '');
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

    const cur = (this.getStudent ? this.getStudent() : window.PortalCore?.getStudent?.());
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
    const student = (this.getStudent ? this.getStudent() : window.PortalCore?.getStudent?.());
    if (!student || !student.studentId || !examId) return null;
    const sId = student.studentId;
    let profile = this.getFullProfile(sId);
    if (!profile) return null;

    const targetClassId = classId || (this.getActiveClassId ? this.getActiveClassId() : window.PortalCore?.getActiveClassId?.()) || 'class-math';
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
    const student = (this.getStudent ? this.getStudent() : window.PortalCore?.getStudent?.());
    if (!student || !student.studentId || !examId) return null;
    const profile = this.getFullProfile(student.studentId);
    if (!profile) return null;

    const targetClassId = classId || (this.getActiveClassId ? this.getActiveClassId() : window.PortalCore?.getActiveClassId?.()) || 'class-math';
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
    const student = (this.getStudent ? this.getStudent() : window.PortalCore?.getStudent?.());
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

    const targetClassId = classId || resultData.classId || (this.getActiveClassId ? this.getActiveClassId() : window.PortalCore?.getActiveClassId?.()) || 'class-math';
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
    const tryHardEngine = this.addWrongQuestionsToTryHard ? this : window.PortalCore;

    if (!isTryHardExam) {
      // Nếu bài bình thường có câu sai ➔ Nạp vào Try-Hard của lớp này
      if (resultData.wrongQuestions && resultData.wrongQuestions.length > 0 && tryHardEngine?.addWrongQuestionsToTryHard) {
        await tryHardEngine.addWrongQuestionsToTryHard(sId, targetClassId, resultData.wrongQuestions, {
          examId: eId,
          examTitle: resultData.examTitle
        });
      }
    } else {
      // Nếu đang làm bài Try-Hard ➔ Loại bỏ những câu đã làm đúng ra khỏi danh sách
      if (resultData.correctQuestionIds && resultData.correctQuestionIds.length > 0 && tryHardEngine?.removeResolvedTryHardQuestions) {
        await tryHardEngine.removeResolvedTryHardQuestions(sId, targetClassId, resultData.correctQuestionIds);
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

  // Add Stars globally
  addStars(count = 1) {
    const auth = this.getState ? this : window.PortalCore;
    const state = auth.getState();
    state.stars += count;
    auth.saveState(state);
    return state.stars;
  }
};
