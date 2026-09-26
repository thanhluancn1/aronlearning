/**
 * OCTOKIDS CLASS MANAGER
 * Quản lý danh mục lớp học, lớp học đang kích hoạt và sự kiện chuyển lớp
 */
window.CoreClassManager = {
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
    const student = (this.getStudent ? this.getStudent() : window.PortalCore?.getStudent?.());
    if (student && student.studentId) {
      const profile = (this.getFullProfile ? this.getFullProfile(student.studentId) : window.PortalCore?.getFullProfile?.(student.studentId));
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
  }
};
