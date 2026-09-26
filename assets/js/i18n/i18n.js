/**
 * OctoKids & TIMO Math Platform - Global i18n Dictionary & Language Manager
 * Author: Antigravity AI
 * Support: Vietnamese (vi), English (en), Chinese (zh)
 */

window.OctoI18n = {
  currentLang: localStorage.getItem('octo_lang') || 'vi',

  languages: [
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'zh', label: '中文', flag: '🇨🇳' }
  ],

  dictionary: {
    vi: {
      nav: {
        home: 'Trang chủ',
        olympic: 'Toán Olympic',
        engMath: 'Toán tiếng Anh',
        iqMath: 'Toán IQ'
      },
      home: {
        heroTitle: 'CỔNG NỀN TẢNG LUYỆN THI TOÁN TIMO & GAME TƯ DUY',
        heroSubtitle: 'Luyện thi trắc nghiệm toán quốc tế dành cho mầm non & tiểu học với giao diện hiện đại, sắc nét.',
        startExamBtn: 'Vào Luyện Thi Ngay 🚀',
        editProfileTitle: 'ĐỔI TÊN & NHÂN VẬT',
        playerNameLabel: 'Tên của bé:',
        chooseAvatarLabel: 'Chọn nhân vật đại diện:',
        saveProfileBtn: 'Lưu Tùy Chỉnh',
        footer: 'OctoKids • Hệ Thống Nền TẢng Luyện Thi Toán Tư Duy & Cổng Game Giáo Dục'
      },
      curriculum: {
        foundationalTitle: 'Tư duy nền tảng',
        foundationalProgress: '✓ Đã hoàn thành nền tảng ({done}/{total})',
        reviewBtn: 'Xem lại ▾',
        collapseBtn: 'Thu gọn ▴',
        enrichmentTitle: 'Tư duy nâng cao',
        quickPracticeTitle: 'Luyện tập nhanh',
        exploreBtn: 'Khám phá',
        practiceBtn: 'Luyện tập',
        questionsCount: '{count} câu',
        step1Title: 'Hệ thống Số và Chữ số',
        step2Title: 'Phép cộng và Phép trừ',
        step3Title: 'So sánh và Thay thế',
        step4Title: 'Đo lường và Thời gian',
        cardRules: 'Bài toán Quy luật',
        cardChart: 'Biểu đồ và Phân loại',
        cardGeometry: 'Hình học và Đếm hình',
        cardBalance: 'Toán cân bằng cơ bản',
        cardLogic: 'Toán đố Logic thực tế',
        cardSubst: 'Toán tư duy thay thế',
        quickDaily: 'Daily Quiz',
        quickDailySub: 'Luyện sâu nhớ lâu',
        quickTryhard: 'Try Hard',
        quickTryhardSub: 'Ôn tập câu đã sai',
        quick10: '10 câu',
        quick10Sub: 'Ngẫu nhiên',
        quick20: '20 câu',
        quick20Sub: 'Ngẫu nhiên'
      },
      exam: {
        topic: 'CHỦ ĐỀ',
        question: 'Câu',
        zoomText: 'Thu phóng',
        readVi: 'Đọc Tiếng Việt',
        readEn: 'Read English',
        readZh: '朗读中文',
        readChoice: 'Đọc đáp án',
        viewAnswer: 'Xem đáp án',
        help: 'Trợ giúp',
        prev: 'Câu trước',
        next: 'Câu tiếp theo',
        submit: 'Nộp bài',
        pause: 'Tạm dừng',
        report: 'Báo lỗi',
        progress: 'Tiến độ bài làm',
        jumpTo: 'Đi tới câu...',
        jumpToPlaceholder: 'Nhập số câu...',
        difficulty: 'Độ khó',
        allDifficulties: 'Tất cả độ khó',
        level1: 'Level 1 - Rất dễ',
        level2: 'Level 2 - Dễ',
        level3: 'Level 3 - Vừa',
        level4: 'Level 4 - Khó',
        level5: 'Level 5 - Rất khó',
        statusLegend: 'Chú giải trạng thái',
        done: 'Đã làm',
        current: 'Đang làm',
        unanswered: 'Chưa làm',
        flagged: 'Đánh dấu Red Flag',
        examInfo: 'Thông tin bài thi',
        timeRemaining: 'Thời gian còn lại',
        mascotCheer: 'Cố lên nhé! Bạn đang làm rất tốt ✨',
        solutionTitle: 'Lời giải chi tiết',
        correctAnswerIs: 'Đáp án đúng là:',
        explanationTab: 'Giải thích chi tiết',
        audioTab: 'Giọng đọc bài giảng',
        confirmSubmitTitle: 'Xác nhận nộp bài',
        confirmSubmitDesc: 'Bạn có chắc chắn muốn nộp bài thi ngay bây giờ không?',
        unansweredWarning: 'Chú ý: Bạn còn {count} câu hỏi chưa hoàn thành!',
        cancelSubmit: 'Tiếp tục làm bài',
        confirmSubmit: 'Đồng ý nộp bài'
      },
      results: {
        congrats: 'CHÚC MỪNG BẠN ĐÃ HOÀN THÀNH BÀI THI!',
        goldMedal: 'Huy Chương Vàng 🥇',
        silverMedal: 'Huy Chương Bạc 🥈',
        bronzeMedal: 'Huy Chương Đồng 🥉',
        certificate: 'Bằng Đạt Yêu Cầu 🎗️',
        keepTrying: 'Cố Gắn Hơn Ở Lần Sau! 💪',
        yourScore: 'Điểm số đạt được',
        completionTime: 'Thời gian làm bài',
        starsEarned: 'Số sao thưởng',
        reviewAnswers: 'Xem lại bài làm',
        pedagogicalTitle: 'Báo cáo năng lực dành cho Phụ huynh / Giáo viên',
        strongPoints: 'Điểm mạnh:',
        weakPoints: 'Cần rèn luyện thêm:',
        retryExam: 'Luyện tập lại bài này',
        backHome: 'Về trang chủ'
      },
      error: {
        loadFailedTitle: 'Không Thể Nạp Dữ Liệu Đề Thi!',
        loadFailedSubtitle: 'Hệ thống không tìm thấy hoặc không thể đọc file câu hỏi',
        errorLabel: 'Chi tiết lỗi:',
        corsHintTitle: 'Nguyên nhân phổ biến:',
        corsHintFileProtocol: 'Nếu mở trực tiếp từ file://, trình duyệt sẽ chặn tải file JSON do cơ chế bảo mật CORS. Hãy mở qua Web Server (VD: Live Server trong VS Code hoặc GitHub Pages).',
        corsHintPath: 'Đường dẫn file JSON (?data=...) không chính xác hoặc tệp bị thiếu/rỗng.',
        retryBtn: 'Tải Lại Trang',
        backHomeBtn: 'Quay Về Bản Đồ'
      },
      auth: {
        loginTitle: 'TÀI KHOẢN HỌC SINH',
        loginSubtitle: 'Đăng nhập hoặc đăng ký tài khoản cho bé để lưu kết quả và huy chương:',
        tabLogin: '🔑 Đăng Nhập',
        tabRegister: '✨ Đăng Ký Mới',
        loginPhoneLabel: 'Số điện thoại của bố mẹ:',
        loginPhonePlaceholder: 'Nhập số điện thoại (VD: 0901234567)',
        loginPhoneHint: '💡 Nhập số điện thoại đã từng đăng ký để tiếp tục hành trình học của bé.',
        studentNameLabel: 'Họ và tên của bé:',
        studentNamePlaceholder: 'VD: Nguyễn Minh Khôi',
        studentAgeLabel: 'Mấy tuổi:',
        parentNameLabel: 'Họ và tên bố mẹ:',
        parentNamePlaceholder: 'VD: Nguyễn Văn Anh',
        parentPhoneLabel: 'Số điện thoại bố mẹ (dùng làm ID):',
        parentPhonePlaceholder: 'VD: 0901234567',
        avatarLabel: 'Chọn biểu tượng bé thích:',
        classesLabel: 'Chọn lớp học tham gia:',
        submitAndLoginBtn: 'Xác Nhận & Nộp Bài 📤',
        saveStudentBtn: 'Lưu Thông Tin ✨',
        loginBtn: 'Đăng Nhập Ngay 🚀',
        registerBtn: 'Tạo Tài Khoản Cho Bé 🌟',
        logoutBtn: 'Đăng xuất',
        cancelBtn: 'Để sau / Quay lại',
        notLoggedIn: 'Chưa đăng nhập',
        candidateInfo: 'Thí sinh:',
        parentInfo: 'Phụ huynh:',
        validationName: 'Vui lòng nhập họ tên của bé nhé!',
        validationAge: 'Vui lòng chọn hoặc nhập số tuổi của bé!',
        validationParent: 'Vui lòng nhập tên bố hoặc mẹ!',
        validationPhone: 'Vui lòng nhập đúng số điện thoại bố mẹ (9 - 11 chữ số)!',
        phoneNotFound: 'Số điện thoại này chưa được đăng ký! Vui lòng chuyển sang tab Đăng ký mới cho bé.',
        phoneAlreadyExists: 'Số điện thoại này đã được đăng ký! Vui lòng chuyển sang tab Đăng nhập.'
      }
    },

    en: {
      nav: {
        home: 'Home',
        olympic: 'Olympic Math',
        engMath: 'English Math',
        iqMath: 'IQ Math'
      },
      home: {
        heroTitle: 'TIMO MATH & REASONING CONTEST PRACTICE PORTAL',
        heroSubtitle: 'International math competition prep for kindergarten & primary students with crisp modern UI.',
        startExamBtn: 'Start Practice Now 🚀',
        editProfileTitle: 'EDIT NAME & AVATAR',
        playerNameLabel: 'Student Name:',
        chooseAvatarLabel: 'Choose Avatar:',
        saveProfileBtn: 'Save Settings',
        footer: 'OctoKids • Math Reasoning Contest & Educational Gaming Portal'
      },
      curriculum: {
        foundationalTitle: 'Foundational Reasoning',
        foundationalProgress: '✓ Foundational Completed ({done}/{total})',
        reviewBtn: 'Review ▾',
        collapseBtn: 'Collapse ▴',
        enrichmentTitle: 'Advanced Reasoning',
        quickPracticeTitle: 'Quick Practice',
        exploreBtn: 'Explore',
        practiceBtn: 'Practice',
        questionsCount: '{count} questions',
        step1Title: 'Number System & Digits',
        step2Title: 'Addition & Subtraction',
        step3Title: 'Comparison & Substitution',
        step4Title: 'Measurement & Time',
        cardRules: 'Pattern Problems',
        cardChart: 'Charts & Classification',
        cardGeometry: 'Geometry & Counting',
        cardBalance: 'Basic Balance Math',
        cardLogic: 'Real-world Logic Puzzles',
        cardSubst: 'Substitution Reasoning',
        quickDaily: 'Daily Quiz',
        quickDailySub: 'Deep practice for long memory',
        quickTryhard: 'Try Hard',
        quickTryhardSub: 'Review missed questions',
        quick10: '10 Questions',
        quick10Sub: 'Randomized',
        quick20: '20 Questions',
        quick20Sub: 'Randomized'
      },
      exam: {
        topic: 'TOPIC',
        question: 'Question',
        zoomText: 'Zoom text',
        readVi: 'Read Vietnamese',
        readEn: 'Read English',
        readZh: 'Read Chinese',
        readChoice: 'Listen choice',
        viewAnswer: 'Show Answer',
        help: 'Hint',
        prev: 'Previous',
        next: 'Next Question',
        submit: 'Submit Exam',
        pause: 'Pause',
        report: 'Report Error',
        progress: 'Exam Progress',
        jumpTo: 'Jump to question...',
        jumpToPlaceholder: 'Type question #...',
        difficulty: 'Difficulty',
        allDifficulties: 'All levels',
        level1: 'Level 1 - Very Easy',
        level2: 'Level 2 - Easy',
        level3: 'Level 3 - Medium',
        level4: 'Level 4 - Hard',
        level5: 'Level 5 - Very Hard',
        statusLegend: 'Legend',
        done: 'Answered',
        current: 'Current',
        unanswered: 'Unanswered',
        flagged: 'Flagged (Red)',
        examInfo: 'Exam Specs',
        timeRemaining: 'Time Remaining',
        mascotCheer: 'Keep going! You are doing awesome ✨',
        solutionTitle: 'Step-by-step Solution',
        correctAnswerIs: 'Correct Answer:',
        explanationTab: 'Detailed Explanation',
        audioTab: 'Audio Explanation',
        confirmSubmitTitle: 'Confirm Submission',
        confirmSubmitDesc: 'Are you sure you want to submit your exam now?',
        unansweredWarning: 'Warning: You still have {count} unanswered question(s)!',
        cancelSubmit: 'Continue Exam',
        confirmSubmit: 'Yes, Submit'
      },
      results: {
        congrats: 'CONGRATULATIONS ON COMPLETING THE EXAM!',
        goldMedal: 'Gold Medal 🥇',
        silverMedal: 'Silver Medal 🥈',
        bronzeMedal: 'Bronze Medal 🥉',
        certificate: 'Certificate of Merit 🎗️',
        keepTrying: 'Keep Trying Next Time! 💪',
        yourScore: 'Final Score',
        completionTime: 'Completion Time',
        starsEarned: 'Stars Earned',
        reviewAnswers: 'Review Questions',
        pedagogicalTitle: 'Pedagogical Performance Report for Parents & Teachers',
        strongPoints: 'Strong Areas:',
        weakPoints: 'Areas for Improvement:',
        retryExam: 'Retake Practice Exam',
        backHome: 'Back to Home'
      },
      error: {
        loadFailedTitle: 'Unable to Load Exam Dataset!',
        loadFailedSubtitle: 'System could not find or parse the question dataset',
        errorLabel: 'Error details:',
        corsHintTitle: 'Common causes:',
        corsHintFileProtocol: 'If opening directly via file://, browsers block JSON fetching due to CORS security policies. Please use a local Web Server (e.g. Live Server) or deploy to GitHub Pages.',
        corsHintPath: 'The JSON dataset path (?data=...) is incorrect or the file is missing/empty.',
        retryBtn: 'Reload Page',
        backHomeBtn: 'Back to Map'
      },
      auth: {
        loginTitle: 'STUDENT ACCOUNT',
        loginSubtitle: 'Log in or register an account for the student to track awards & progress:',
        tabLogin: '🔑 Log In',
        tabRegister: '✨ Register New',
        loginPhoneLabel: "Parent's Phone Number:",
        loginPhonePlaceholder: 'Enter phone number (e.g. 0901234567)',
        loginPhoneHint: '💡 Enter the registered phone number to resume practice.',
        studentNameLabel: "Student's Full Name:",
        studentNamePlaceholder: 'e.g., Alex Johnson',
        studentAgeLabel: 'Age:',
        parentNameLabel: "Parent's Full Name:",
        parentNamePlaceholder: 'e.g., David Johnson',
        parentPhoneLabel: "Parent's Phone Number (Used as ID):",
        parentPhonePlaceholder: 'e.g., 0901234567',
        avatarLabel: 'Choose favorite avatar:',
        classesLabel: 'Select enrolled classes:',
        submitAndLoginBtn: 'Confirm & Submit Exam 📤',
        saveStudentBtn: 'Save Info ✨',
        loginBtn: 'Log In Now 🚀',
        registerBtn: 'Create Student Profile 🌟',
        logoutBtn: 'Log Out',
        cancelBtn: 'Later / Back',
        notLoggedIn: 'Not logged in',
        candidateInfo: 'Candidate:',
        parentInfo: 'Parent:',
        validationName: 'Please enter student full name!',
        validationAge: 'Please select or enter age!',
        validationParent: 'Please enter parent name!',
        validationPhone: 'Please enter a valid phone number (9-11 digits)!',
        phoneNotFound: 'Phone number not found! Please switch to Register tab to create an account.',
        phoneAlreadyExists: 'Phone number already registered! Please switch to Log In tab.'
      }
    },

    zh: {
      nav: {
        home: '首页',
        olympic: '奥林匹克数学',
        engMath: '英语数学',
        iqMath: '智力数学'
      },
      home: {
        heroTitle: 'TIMO 奥数与逻辑思维模拟考试平台',
        heroSubtitle: '面向学前及小学阶段国际奥数模拟备考系统，具备高清画质与现代界面。',
        startExamBtn: '立即开始练习 🚀',
        editProfileTitle: '修改姓名与头像',
        playerNameLabel: '宝贝姓名：',
        chooseAvatarLabel: '选择代表头像：',
        saveProfileBtn: '保存设置',
        footer: 'OctoKids • 逻辑思维奥数模拟考试与教育游戏平台'
      },
      curriculum: {
        foundationalTitle: '基础思维',
        foundationalProgress: '✓ 基础阶段已完成 ({done}/{total})',
        reviewBtn: '复习 ▾',
        collapseBtn: '收起 ▴',
        enrichmentTitle: '进阶思维',
        quickPracticeTitle: '快速练习',
        exploreBtn: '探索',
        practiceBtn: '练习',
        questionsCount: '{count} 题',
        step1Title: '数与数字系统',
        step2Title: '加法与减法',
        step3Title: '比较与替换',
        step4Title: '测量与时间',
        cardRules: '规律查找题',
        cardChart: '图表与分类',
        cardGeometry: '图形与计数',
        cardBalance: '天平平衡基础',
        cardLogic: '实际应用逻辑题',
        cardSubst: '代换思维题',
        quickDaily: '每日测验',
        quickDailySub: '深度练习 记忆深刻',
        quickTryhard: '错题强化',
        quickTryhardSub: '重做做错题目',
        quick10: '10 题速练',
        quick10Sub: '随机抽题',
        quick20: '20 题速练',
        quick20Sub: '随机抽题'
      },
      exam: {
        topic: '主题',
        question: '题目',
        zoomText: '缩放字体',
        readVi: '越南语朗读',
        readEn: '英语朗读',
        readZh: '中文朗读',
        readChoice: '听选项',
        viewAnswer: '查看答案',
        help: '提示',
        prev: '上一题',
        next: '下一题',
        submit: '提交试卷',
        pause: '暂停',
        report: '报错',
        progress: '答题进度',
        jumpTo: '跳转到...',
        jumpToPlaceholder: '输入题号...',
        difficulty: '难度',
        allDifficulties: '所有难度',
        level1: '第1级 - 非常简单',
        level2: '第2级 - 简单',
        level3: '第3级 - 中等',
        level4: '第4级 - 困难',
        level5: '第5级 - 非常困难',
        statusLegend: '状态图例',
        done: '已答',
        current: '正在做',
        unanswered: '未答',
        flagged: '红旗标记',
        examInfo: '考试信息',
        timeRemaining: '剩余时间',
        mascotCheer: '加油！你做得非常棒 ✨',
        solutionTitle: '详细解析',
        correctAnswerIs: '正确答案是：',
        explanationTab: '图文解析',
        audioTab: '语音讲解',
        confirmSubmitTitle: '确认交卷',
        confirmSubmitDesc: '您确定要现在提交试卷吗？',
        unansweredWarning: '注意：您还有 {count} 道题目未完成！',
        cancelSubmit: '继续答题',
        confirmSubmit: '确认交卷'
      },
      results: {
        congrats: '恭喜您完成考试！',
        goldMedal: '金牌 🥇',
        silverMedal: '银牌 🥈',
        bronzeMedal: '铜牌 🥉',
        certificate: '合格证书 🎗️',
        keepTrying: '下次继续努力！💪',
        yourScore: '最终得分',
        completionTime: '用时',
        starsEarned: '获得星星',
        reviewAnswers: '查看错题与解析',
        pedagogicalTitle: '家长与教师教学分析报告',
        strongPoints: '优势领域:',
        weakPoints: '需要加强:',
        retryExam: '重新练习',
        backHome: '返回首页'
      },
      error: {
        loadFailedTitle: '无法加载试卷题库数据！',
        loadFailedSubtitle: '系统未找到或无法解析题目文件',
        errorLabel: '错误详情:',
        corsHintTitle: '常见原因:',
        corsHintFileProtocol: '如果直接通过 file:// 协议打开，浏览器出于 CORS 安全策略会拦截本地 JSON 请求。请通过 Web 服务器（如 Live Server）或 GitHub Pages 打开。',
        corsHintPath: 'JSON 题库文件路径 (?data=...) 不正确或文件不存在/为空。',
        retryBtn: '重新加载',
        backHomeBtn: '返回地图'
      },
      auth: {
        loginTitle: '学生账号',
        loginSubtitle: '登录或注册宝贝账号，以保存考试成绩与荣誉奖状：',
        tabLogin: '🔑 登录',
        tabRegister: '✨ 注册新账号',
        loginPhoneLabel: '家长联系电话：',
        loginPhonePlaceholder: '输入手机号（例如：0901234567）',
        loginPhoneHint: '💡 输入已登记的手机号即可继续宝贝的学习记录。',
        studentNameLabel: '宝贝姓名：',
        studentNamePlaceholder: '例如：张小明',
        studentAgeLabel: '年龄：',
        parentNameLabel: '家长姓名：',
        parentNamePlaceholder: '例如：张伟',
        parentPhoneLabel: '家长联系电话（用作账号ID）：',
        parentPhonePlaceholder: '例如：0901234567',
        avatarLabel: '选择宝贝喜爱的头像：',
        classesLabel: '选择参加的班级：',
        submitAndLoginBtn: '确认并提交试卷 📤',
        saveStudentBtn: '保存信息 ✨',
        loginBtn: '立即登录 🚀',
        registerBtn: '创建宝贝档案 🌟',
        logoutBtn: '退出登录',
        cancelBtn: '稍后 / 返回',
        notLoggedIn: '未登录',
        candidateInfo: '考生：',
        parentInfo: '家长：',
        validationName: '请填写宝贝姓名！',
        validationAge: '请选择或填写宝贝年龄！',
        validationParent: '请填写家长姓名！',
        validationPhone: '请填写正确的联系电话（9-11位数字）！',
        phoneNotFound: '未找到该手机号码！请切换到“注册”选项卡为宝贝创建账号。',
        phoneAlreadyExists: '该手机号码已注册！请切换到“登录”选项卡。'
      }
    }
  },

  /**
   * Helper to fetch translated text by key path e.g. 'exam.next'
   */
  t(key, defaultVal = '') {
    if (!key) return defaultVal;
    const keys = key.split('.');
    let res = this.dictionary[this.currentLang] || this.dictionary['vi'];
    for (const k of keys) {
      if (res && res[k] !== undefined) {
        res = res[k];
      } else {
        // Fallback to Vietnamese if missing in current language
        let fallback = this.dictionary['vi'];
        for (const fk of keys) {
          if (fallback && fallback[fk] !== undefined) {
            fallback = fallback[fk];
          } else {
            return defaultVal || key;
          }
        }
        return fallback;
      }
    }
    return res;
  },

  /**
   * Helper to set active language and update state & localStorage
   * Triggers automatic window reload so all elements re-render immediately
   */
  setLanguage(langCode) {
    if (this.dictionary[langCode]) {
      this.currentLang = langCode;
      localStorage.setItem('octo_lang', langCode);
      document.documentElement.lang = langCode;
      window.dispatchEvent(new CustomEvent('octo-lang-changed', { detail: langCode }));
      window.location.reload();
    }
  },

  /**
   * Gets translated text from a question data field that can be either:
   * 1. A multilingual object: { vi: "...", en: "...", zh: "..." }
   * 2. A plain string: "..."
   */
  getLangText(field, langCode = this.currentLang) {
    if (!field) return '';
    if (typeof field === 'object') {
      return field[langCode] || field['vi'] || field['en'] || field['zh'] || '';
    }
    return field;
  }
};

// Global shorthand helpers for window
window.t = (key, defaultVal) => window.OctoI18n.t(key, defaultVal);
window.getLangText = (field, lang) => window.OctoI18n.getLangText(field, lang);
