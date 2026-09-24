/**
 * OctoKids Student Authentication & Registration Modal Module (OctoAuthModal)
 * Cửa sổ Đăng nhập / Ghi danh học sinh dùng chung cho Trang Chủ và Phân hệ Luyện thi.
 * Bắt buộc 4 trường: Tên bé, Mấy tuổi, Tên bố mẹ, Số điện thoại (kèm Avatar).
 * 100% Static Web compatible - Tự động đồng bộ với PortalCore & OctoI18n.
 */

(function () {
  'use strict';

  const OctoAuthModal = {
    modalId: 'octo-auth-modal-root',
    currentOptions: {},

    /**
     * Lấy text dịch từ i18n
     */
    t(key, fallback = '') {
      return (window.OctoI18n && typeof window.OctoI18n.t === 'function') 
        ? window.OctoI18n.t(key, fallback) 
        : fallback;
    },

    /**
     * Mở Modal Đăng nhập / Ghi danh học sinh
     * @param {Object} options 
     *  - title: Tiêu đề modal
     *  - subtitle: Phụ đề modal
     *  - submitBtnText: Text nút xác nhận
     *  - showLogout: boolean (hiển thị nút Đăng xuất nếu đã đăng nhập)
     *  - onSuccess: function(student)
     *  - onCancel: function()
     *  - onLogout: function()
     */
    open(options = {}) {
      if (window.PortalCore && typeof window.PortalCore.playPop === 'function') {
        window.PortalCore.playPop();
      }

      this.currentOptions = {
        title: options.title || this.t('auth.loginTitle', 'ĐĂNG NHẬP / GHI DANH HỌC SINH'),
        subtitle: options.subtitle || this.t('auth.loginSubtitle', 'Để lưu kết quả bài thi và chứng nhận cho bé, vui lòng hoàn tất thông tin:'),
        submitBtnText: options.submitBtnText || this.t('auth.submitAndLoginBtn', 'Xác Nhận & Tiếp Tục 📤'),
        showLogout: options.showLogout !== undefined ? options.showLogout : (window.PortalCore && window.PortalCore.isLoggedIn()),
        onSuccess: typeof options.onSuccess === 'function' ? options.onSuccess : null,
        onCancel: typeof options.onCancel === 'function' ? options.onCancel : null,
        onLogout: typeof options.onLogout === 'function' ? options.onLogout : null
      };

      const student = (window.PortalCore && typeof window.PortalCore.getStudent === 'function') 
        ? window.PortalCore.getStudent() 
        : null;

      const initialData = {
        fullName: student ? (student.fullName || '') : '',
        age: student ? (student.age || 6) : 6,
        parentName: student ? (student.parentName || '') : '',
        parentPhone: student ? (student.parentPhone || '') : '',
        avatar: student ? (student.avatar || '👦') : '👦'
      };

      this.render(initialData);
    },

    /**
     * Đóng modal
     */
    close() {
      const el = document.getElementById(this.modalId);
      if (el) {
        el.classList.add('opacity-0');
        setTimeout(() => {
          if (el.parentNode) el.parentNode.removeChild(el);
        }, 200);
      }
    },

    /**
     * Render DOM của modal
     */
    render(data) {
      // Xóa modal cũ nếu có
      let el = document.getElementById(this.modalId);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }

      const avatars = ['👦', '👧', '🐰', '🐻', '🐱', '🐶'];
      const ages = [4, 5, 6, 7, 8, 9, 10];
      const isRegistered = window.PortalCore && window.PortalCore.isLoggedIn();

      el = document.createElement('div');
      el.id = this.modalId;
      el.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto transition-opacity duration-200';

      el.innerHTML = `
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border-4 border-purple-500 shadow-2xl relative my-auto animate-pop text-left">
          
          <!-- Header -->
          <div class="text-center mb-5">
            <div class="w-16 h-16 mx-auto rounded-full bg-purple-100 text-purple-700 border-2 border-purple-300 flex items-center justify-center text-3xl font-black mb-2 animate-bounceSlow">
              🎓
            </div>
            <h3 class="text-xl font-black text-slate-900 tracking-tight">${this.currentOptions.title}</h3>
            <p class="text-xs sm:text-sm font-bold text-slate-500 mt-1 leading-relaxed">${this.currentOptions.subtitle}</p>
          </div>

          <!-- Error Alert Banner -->
          <div id="octo-auth-error-banner" class="hidden mb-4 bg-rose-50 border-2 border-rose-300 text-rose-700 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2">
            <span>⚠️</span>
            <span id="octo-auth-error-text"></span>
          </div>

          <!-- Form Fields -->
          <form id="octo-auth-form" class="space-y-4" onsubmit="event.preventDefault();">
            
            <!-- 1. Tên bé -->
            <div>
              <label class="block text-xs font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
                <span>🧒</span> <span>${this.t('auth.studentNameLabel', 'Họ và tên của bé:')}</span> <span class="text-rose-500">*</span>
              </label>
              <input type="text" 
                     id="octo-auth-name" 
                     value="${data.fullName}"
                     placeholder="${this.t('auth.studentNamePlaceholder', 'VD: Nguyễn Minh Khôi')}"
                     class="w-full bg-slate-50 border-2 border-slate-300 focus:border-purple-500 focus:bg-white rounded-2xl px-4 py-2.5 text-sm font-black text-slate-900 outline-none transition-all" />
            </div>

            <!-- 2. Mấy tuổi -->
            <div>
              <label class="block text-xs font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
                <span>🎂</span> <span>${this.t('auth.studentAgeLabel', 'Mấy tuổi:')}</span> <span class="text-rose-500">*</span>
              </label>
              <div class="flex flex-wrap gap-2 items-center" id="octo-auth-age-group">
                ${ages.map(a => `
                  <button type="button" 
                          data-age="${a}"
                          class="octo-age-btn px-3 py-1.5 rounded-xl border-2 font-black text-xs transition-all ${Number(data.age) === a ? 'bg-purple-600 text-white border-purple-600 shadow-sm' : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-purple-300'}">
                    ${a} tuổi
                  </button>
                `).join('')}
                <input type="number" 
                       id="octo-auth-age-custom" 
                       min="3" max="18" 
                       value="${ages.includes(Number(data.age)) ? '' : data.age}"
                       placeholder="Khác..."
                       class="w-20 bg-slate-50 border-2 border-slate-300 focus:border-purple-500 focus:bg-white rounded-xl px-2.5 py-1 text-xs font-black text-center text-slate-900 outline-none" />
              </div>
              <input type="hidden" id="octo-auth-age-val" value="${data.age}" />
            </div>

            <!-- 3. Tên bố mẹ -->
            <div>
              <label class="block text-xs font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
                <span>👨‍👩‍👧‍👦</span> <span>${this.t('auth.parentNameLabel', 'Họ và tên bố mẹ:')}</span> <span class="text-rose-500">*</span>
              </label>
              <input type="text" 
                     id="octo-auth-parent-name" 
                     value="${data.parentName}"
                     placeholder="${this.t('auth.parentNamePlaceholder', 'VD: Nguyễn Văn Anh')}"
                     class="w-full bg-slate-50 border-2 border-slate-300 focus:border-purple-500 focus:bg-white rounded-2xl px-4 py-2.5 text-sm font-black text-slate-900 outline-none transition-all" />
            </div>

            <!-- 4. Số điện thoại bố mẹ -->
            <div>
              <label class="block text-xs font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
                <span>📞</span> <span>${this.t('auth.parentPhoneLabel', 'Số điện thoại bố mẹ:')}</span> <span class="text-rose-500">*</span>
              </label>
              <input type="tel" 
                     id="octo-auth-phone" 
                     value="${data.parentPhone}"
                     placeholder="${this.t('auth.parentPhonePlaceholder', 'VD: 0912 345 678')}"
                     class="w-full bg-slate-50 border-2 border-slate-300 focus:border-purple-500 focus:bg-white rounded-2xl px-4 py-2.5 text-sm font-black text-slate-900 outline-none transition-all" />
            </div>

            <!-- 5. Chọn Avatar -->
            <div>
              <label class="block text-xs font-black text-slate-800 mb-1.5">
                ${this.t('auth.avatarLabel', 'Chọn biểu tượng bé thích:')}
              </label>
              <div class="flex justify-start gap-2.5" id="octo-auth-avatar-group">
                ${avatars.map(av => `
                  <button type="button" 
                          data-avatar="${av}"
                          class="octo-avatar-btn w-11 h-11 rounded-2xl text-2xl flex items-center justify-center border-2 transition-transform ${data.avatar === av ? 'border-purple-600 bg-purple-100 scale-110 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}">
                    ${av}
                  </button>
                `).join('')}
              </div>
              <input type="hidden" id="octo-auth-avatar-val" value="${data.avatar}" />
            </div>

          </form>

          <!-- Action Buttons -->
          <div class="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-slate-200 flex-wrap">
            <div>
              ${this.currentOptions.showLogout && isRegistered ? `
                <button type="button" 
                        id="octo-auth-btn-logout"
                        class="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-300 font-black px-3.5 py-2 rounded-2xl text-xs flex items-center gap-1 active:scale-95 transition-all">
                  <span>🚪</span> <span>${this.t('auth.logoutBtn', 'Đăng xuất')}</span>
                </button>
              ` : `<span></span>`}
            </div>

            <div class="flex items-center gap-2.5 ml-auto">
              <button type="button" 
                      id="octo-auth-btn-cancel"
                      class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm border border-slate-300 active:scale-95 transition-all">
                ${this.t('auth.cancelBtn', 'Để sau / Quay lại')}
              </button>
              <button type="button" 
                      id="octo-auth-btn-submit"
                      class="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black px-6 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md border border-purple-400 active:scale-95 transition-all cursor-pointer">
                ${this.currentOptions.submitBtnText}
              </button>
            </div>
          </div>

        </div>
      `;

      document.body.appendChild(el);
      this.bindEvents();
    },

    /**
     * Bắt sự kiện tương tác trong modal
     */
    bindEvents() {
      const modal = document.getElementById(this.modalId);
      if (!modal) return;

      const ageValInput = document.getElementById('octo-auth-age-val');
      const ageCustomInput = document.getElementById('octo-auth-age-custom');
      const ageButtons = modal.querySelectorAll('.octo-age-btn');

      // Sự kiện chọn nút tuổi
      ageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.getAttribute('data-age');
          ageValInput.value = val;
          ageCustomInput.value = '';
          ageButtons.forEach(b => {
            b.className = 'octo-age-btn px-3 py-1.5 rounded-xl border-2 font-black text-xs transition-all bg-slate-100 text-slate-700 border-slate-200 hover:border-purple-300';
          });
          btn.className = 'octo-age-btn px-3 py-1.5 rounded-xl border-2 font-black text-xs transition-all bg-purple-600 text-white border-purple-600 shadow-sm';
        });
      });

      // Nhập tuổi khác
      ageCustomInput.addEventListener('input', () => {
        if (ageCustomInput.value) {
          ageValInput.value = ageCustomInput.value;
          ageButtons.forEach(b => {
            b.className = 'octo-age-btn px-3 py-1.5 rounded-xl border-2 font-black text-xs transition-all bg-slate-100 text-slate-700 border-slate-200 hover:border-purple-300';
          });
        }
      });

      // Sự kiện chọn Avatar
      const avatarValInput = document.getElementById('octo-auth-avatar-val');
      const avatarButtons = modal.querySelectorAll('.octo-avatar-btn');
      avatarButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const av = btn.getAttribute('data-avatar');
          avatarValInput.value = av;
          avatarButtons.forEach(b => {
            b.className = 'octo-avatar-btn w-11 h-11 rounded-2xl text-2xl flex items-center justify-center border-2 transition-transform border-slate-200 bg-white hover:border-slate-300';
          });
          btn.className = 'octo-avatar-btn w-11 h-11 rounded-2xl text-2xl flex items-center justify-center border-2 transition-transform border-purple-600 bg-purple-100 scale-110 shadow-sm';
        });
      });

      // Nút Hủy
      const cancelBtn = document.getElementById('octo-auth-btn-cancel');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
          this.close();
          if (this.currentOptions.onCancel) {
            this.currentOptions.onCancel();
          }
        });
      }

      // Nút Đăng xuất
      const logoutBtn = document.getElementById('octo-auth-btn-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          if (window.PortalCore && typeof window.PortalCore.logout === 'function') {
            window.PortalCore.logout();
          }
          this.close();
          if (window.OctoNotify && typeof window.OctoNotify.toast === 'function') {
            window.OctoNotify.toast(this.t('auth.logoutBtn', 'Đã đăng xuất!') + ' 👋', 'info');
          }
          if (this.currentOptions.onLogout) {
            this.currentOptions.onLogout();
          }
        });
      }

      // Nút Xác nhận Submit
      const submitBtn = document.getElementById('octo-auth-btn-submit');
      if (submitBtn) {
        submitBtn.addEventListener('click', () => {
          this.processSubmit();
        });
      }

      // Enter trên input
      const inputs = modal.querySelectorAll('input');
      inputs.forEach(inp => {
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.processSubmit();
          }
        });
      });
    },

    /**
     * Hiển thị lỗi form
     */
    showError(msg) {
      const banner = document.getElementById('octo-auth-error-banner');
      const text = document.getElementById('octo-auth-error-text');
      if (banner && text) {
        text.innerText = msg;
        banner.classList.remove('hidden');
      }
    },

    /**
     * Xử lý xác thực và lưu session
     */
    processSubmit() {
      const nameInput = document.getElementById('octo-auth-name');
      const ageValInput = document.getElementById('octo-auth-age-val');
      const parentInput = document.getElementById('octo-auth-parent-name');
      const phoneInput = document.getElementById('octo-auth-phone');
      const avatarValInput = document.getElementById('octo-auth-avatar-val');

      const fullName = (nameInput ? nameInput.value : '').trim();
      const age = (ageValInput ? ageValInput.value : '').trim();
      const parentName = (parentInput ? parentInput.value : '').trim();
      const parentPhone = (phoneInput ? phoneInput.value : '').trim();
      const avatar = (avatarValInput ? avatarValInput.value : '👦') || '👦';

      // Validate 4 trường bắt buộc
      if (!fullName) {
        this.showError(this.t('auth.validationName', 'Vui lòng nhập họ tên của bé nhé!'));
        nameInput?.focus();
        return;
      }
      if (!age || isNaN(Number(age)) || Number(age) < 2) {
        this.showError(this.t('auth.validationAge', 'Vui lòng chọn hoặc nhập số tuổi của bé!'));
        return;
      }
      if (!parentName) {
        this.showError(this.t('auth.validationParent', 'Vui lòng nhập họ tên bố hoặc mẹ!'));
        parentInput?.focus();
        return;
      }
      const rawPhone = parentPhone.replace(/\D/g, '');
      if (!parentPhone || rawPhone.length < 9 || rawPhone.length > 11) {
        this.showError(this.t('auth.validationPhone', 'Vui lòng nhập đúng số điện thoại bố mẹ (9 - 11 chữ số)!'));
        phoneInput?.focus();
        return;
      }

      // Lưu qua PortalCore
      let savedStudent = null;
      if (window.PortalCore && typeof window.PortalCore.login === 'function') {
        savedStudent = window.PortalCore.login({
          fullName,
          age: Number(age),
          parentName,
          parentPhone,
          avatar
        });
      }

      this.close();

      if (window.OctoNotify && typeof window.OctoNotify.toast === 'function') {
        window.OctoNotify.toast(`Đã ghi nhận thông tin bé ${fullName}! ✨`, 'success');
      }

      if (this.currentOptions.onSuccess) {
        this.currentOptions.onSuccess(savedStudent || { fullName, age, parentName, parentPhone, avatar });
      }
    }
  };

  window.OctoAuthModal = OctoAuthModal;
})();
