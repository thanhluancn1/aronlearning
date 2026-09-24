/**
 * OctoKids Student Authentication & Registration Modal Module (OctoAuthModal)
 * Cửa sổ Đăng nhập / Đăng ký học sinh dùng chung cho Trang Chủ và Phân hệ Luyện thi.
 * - Đăng nhập: Bằng số điện thoại bố mẹ (studentId = phone, tải profile từ file JSON hoặc localStorage).
 * - Đăng ký: Tạo mới đầy đủ 4 thông tin (Tên bé, Tuổi, Tên bố mẹ, SĐT) và kiểm tra trùng trước khi tạo.
 * 100% Static Web compatible - Tự động đồng bộ với PortalCore & OctoI18n.
 */

(function () {
  'use strict';

  const OctoAuthModal = {
    modalId: 'octo-auth-modal-root',
    activeTab: 'login', // 'login' | 'register'
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
     * Mở Modal Đăng nhập / Đăng ký học sinh
     * @param {Object} options 
     *  - initialTab: 'login' | 'register' (mặc định 'login')
     *  - title: Tiêu đề modal
     *  - subtitle: Phụ đề modal
     *  - submitBtnText: Text nút xác nhận đăng ký/nộp bài
     *  - showLogout: boolean (hiển thị nút Đăng xuất nếu đã đăng nhập)
     *  - onSuccess: function(student)
     *  - onCancel: function()
     *  - onLogout: function()
     */
    open(options = {}) {
      if (window.PortalCore && typeof window.PortalCore.playPop === 'function') {
        window.PortalCore.playPop();
      }

      const isRegistered = window.PortalCore && window.PortalCore.isLoggedIn();

      this.activeTab = options.initialTab || (isRegistered ? 'register' : 'login');
      this.currentOptions = {
        title: options.title || this.t('auth.loginTitle', 'TÀI KHOẢN HỌC SINH'),
        subtitle: options.subtitle || this.t('auth.loginSubtitle', 'Đăng nhập hoặc đăng ký tài khoản cho bé để lưu kết quả và huy chương:'),
        submitBtnText: options.submitBtnText || this.t('auth.registerBtn', 'Tạo Tài Khoản Cho Bé 🌟'),
        showLogout: options.showLogout !== undefined ? options.showLogout : isRegistered,
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
        parentPhone: student ? (student.parentPhone || student.studentId || '') : '',
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
     * Chuyển đổi giữa 2 tab
     */
    switchTab(tabName) {
      if (window.PortalCore && typeof window.PortalCore.playPop === 'function') {
        window.PortalCore.playPop();
      }
      this.activeTab = tabName;
      this.hideError();

      const tabLoginBtn = document.getElementById('octo-tab-login-btn');
      const tabRegisterBtn = document.getElementById('octo-tab-register-btn');
      const panelLogin = document.getElementById('octo-panel-login');
      const panelRegister = document.getElementById('octo-panel-register');

      if (tabName === 'login') {
        tabLoginBtn?.classList.add('bg-white', 'text-purple-700', 'shadow-sm');
        tabLoginBtn?.classList.remove('text-slate-600');
        tabRegisterBtn?.classList.remove('bg-white', 'text-purple-700', 'shadow-sm');
        tabRegisterBtn?.classList.add('text-slate-600');

        panelLogin?.classList.remove('hidden');
        panelRegister?.classList.add('hidden');
        document.getElementById('octo-login-phone')?.focus();
      } else {
        tabRegisterBtn?.classList.add('bg-white', 'text-purple-700', 'shadow-sm');
        tabRegisterBtn?.classList.remove('text-slate-600');
        tabLoginBtn?.classList.remove('bg-white', 'text-purple-700', 'shadow-sm');
        tabLoginBtn?.classList.add('text-slate-600');

        panelRegister?.classList.remove('hidden');
        panelLogin?.classList.add('hidden');
        document.getElementById('octo-register-name')?.focus();
      }
    },

    /**
     * Render DOM của modal
     */
    render(data) {
      let el = document.getElementById(this.modalId);
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }

      const avatars = ['👦', '👧', '🐰', '🐻', '🐱', '🐶'];
      const ages = [4, 5, 6, 7, 8, 9, 10];
      const isRegistered = window.PortalCore && window.PortalCore.isLoggedIn();

      el = document.createElement('div');
      el.id = this.modalId;
      el.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto transition-opacity duration-200';

      el.innerHTML = `
        <div class="bg-white rounded-3xl p-5 sm:p-7 max-w-lg w-full border-4 border-purple-500 shadow-2xl relative my-auto animate-pop text-left max-h-[95vh] flex flex-col justify-between overflow-y-auto">
          
          <div>
            <!-- Header -->
            <div class="text-center mb-4">
              <div class="w-14 h-14 mx-auto rounded-full bg-purple-100 text-purple-700 border-2 border-purple-300 flex items-center justify-center text-3xl font-black mb-2 animate-bounceSlow">
                🎓
              </div>
              <h3 class="text-xl font-black text-slate-900 tracking-tight">${this.currentOptions.title}</h3>
              <p class="text-xs font-bold text-slate-500 mt-1 leading-relaxed">${this.currentOptions.subtitle}</p>
            </div>

            <!-- Tab Switcher (Đăng Nhập vs Đăng Ký) -->
            <div class="flex bg-slate-100 p-1.5 rounded-2xl mb-4 border border-slate-200">
              <button type="button" 
                      id="octo-tab-login-btn"
                      class="flex-1 py-2 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer ${this.activeTab === 'login' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-purple-600'}">
                ${this.t('auth.tabLogin', '🔑 Đăng Nhập')}
              </button>
              <button type="button" 
                      id="octo-tab-register-btn"
                      class="flex-1 py-2 text-xs sm:text-sm font-black rounded-xl transition-all cursor-pointer ${this.activeTab === 'register' ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-600 hover:text-purple-600'}">
                ${this.t('auth.tabRegister', '✨ Đăng Ký Mới')}
              </button>
            </div>

            <!-- Error / Warning Alert Banner -->
            <div id="octo-auth-error-banner" class="hidden mb-4 bg-rose-50 border-2 border-rose-300 text-rose-700 px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-2">
              <span>⚠️</span>
              <span id="octo-auth-error-text" class="flex-1"></span>
            </div>

            <!-- TAB 1: FORM ĐĂNG NHẬP (Bằng Số Điện Thoại) -->
            <div id="octo-panel-login" class="${this.activeTab === 'login' ? '' : 'hidden'} space-y-4">
              <div>
                <label class="block text-xs font-black text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <span>📞</span> <span>${this.t('auth.loginPhoneLabel', 'Số điện thoại của bố mẹ:')}</span> <span class="text-rose-500">*</span>
                </label>
                <div class="relative">
                  <input type="tel" 
                         id="octo-login-phone" 
                         value="${data.parentPhone}"
                         placeholder="${this.t('auth.loginPhonePlaceholder', 'Nhập số điện thoại (VD: 0901234567)')}"
                         class="w-full bg-slate-50 border-2 border-slate-300 focus:border-purple-500 focus:bg-white rounded-2xl px-4 py-3 text-base font-black text-slate-900 outline-none transition-all tracking-wider" />
                </div>
                <p class="text-[11px] font-bold text-slate-500 mt-2 leading-relaxed">
                  ${this.t('auth.loginPhoneHint', '💡 Nhập số điện thoại đã từng đăng ký để tiếp tục hành trình học của bé.')}
                </p>
              </div>

              <!-- Nút Đăng Nhập -->
              <div class="pt-2">
                <button type="button" 
                        id="octo-btn-do-login"
                        class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black py-3 rounded-2xl text-sm shadow-md border border-purple-400 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2">
                  <span>${this.t('auth.loginBtn', 'Đăng Nhập Ngay 🚀')}</span>
                </button>
              </div>
            </div>

            <!-- TAB 2: FORM ĐĂNG KÝ (Đầy đủ 4 thông tin) -->
            <div id="octo-panel-register" class="${this.activeTab === 'register' ? '' : 'hidden'} space-y-3.5">
              
              <!-- 1. Tên bé -->
              <div>
                <label class="block text-xs font-black text-slate-800 mb-1 flex items-center gap-1.5">
                  <span>🧒</span> <span>${this.t('auth.studentNameLabel', 'Họ và tên của bé:')}</span> <span class="text-rose-500">*</span>
                </label>
                <input type="text" 
                       id="octo-register-name" 
                       value="${data.fullName}"
                       placeholder="${this.t('auth.studentNamePlaceholder', 'VD: Nguyễn Minh Khôi')}"
                       class="w-full bg-slate-50 border-2 border-slate-300 focus:border-purple-500 focus:bg-white rounded-2xl px-4 py-2 text-sm font-black text-slate-900 outline-none transition-all" />
              </div>

              <!-- 2. Mấy tuổi -->
              <div>
                <label class="block text-xs font-black text-slate-800 mb-1 flex items-center gap-1.5">
                  <span>🎂</span> <span>${this.t('auth.studentAgeLabel', 'Mấy tuổi:')}</span> <span class="text-rose-500">*</span>
                </label>
                <div class="flex flex-wrap gap-1.5 items-center" id="octo-register-age-group">
                  ${ages.map(a => `
                    <button type="button" 
                            data-age="${a}"
                            class="octo-age-btn px-2.5 py-1 rounded-xl border-2 font-black text-xs transition-all ${Number(data.age) === a ? 'bg-purple-600 text-white border-purple-600 shadow-sm' : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-purple-300'}">
                      ${a} tuổi
                    </button>
                  `).join('')}
                  <input type="number" 
                         id="octo-register-age-custom" 
                         min="3" max="18" 
                         value="${ages.includes(Number(data.age)) ? '' : data.age}"
                         placeholder="Khác..."
                         class="w-16 bg-slate-50 border-2 border-slate-300 focus:border-purple-500 focus:bg-white rounded-xl px-2 py-1 text-xs font-black text-center text-slate-900 outline-none" />
                </div>
                <input type="hidden" id="octo-register-age-val" value="${data.age}" />
              </div>

              <!-- 3. Tên bố mẹ -->
              <div>
                <label class="block text-xs font-black text-slate-800 mb-1 flex items-center gap-1.5">
                  <span>👨‍👩‍👧‍👦</span> <span>${this.t('auth.parentNameLabel', 'Họ và tên bố mẹ:')}</span> <span class="text-rose-500">*</span>
                </label>
                <input type="text" 
                       id="octo-register-parent-name" 
                       value="${data.parentName}"
                       placeholder="${this.t('auth.parentNamePlaceholder', 'VD: Nguyễn Văn Anh')}"
                       class="w-full bg-slate-50 border-2 border-slate-300 focus:border-purple-500 focus:bg-white rounded-2xl px-4 py-2 text-sm font-black text-slate-900 outline-none transition-all" />
              </div>

              <!-- 4. Số điện thoại bố mẹ (Dùng làm ID) -->
              <div>
                <label class="block text-xs font-black text-slate-800 mb-1 flex items-center gap-1.5">
                  <span>📞</span> <span>${this.t('auth.parentPhoneLabel', 'Số điện thoại bố mẹ (dùng làm ID):')}</span> <span class="text-rose-500">*</span>
                </label>
                <input type="tel" 
                       id="octo-register-phone" 
                       value="${data.parentPhone}"
                       placeholder="${this.t('auth.parentPhonePlaceholder', 'VD: 0901234567')}"
                       class="w-full bg-slate-50 border-2 border-slate-300 focus:border-purple-500 focus:bg-white rounded-2xl px-4 py-2 text-sm font-black text-slate-900 outline-none transition-all" />
              </div>

              <!-- 5. Chọn Avatar -->
              <div>
                <label class="block text-xs font-black text-slate-800 mb-1">
                  ${this.t('auth.avatarLabel', 'Chọn biểu tượng bé thích:')}
                </label>
                <div class="flex justify-start gap-2" id="octo-register-avatar-group">
                  ${avatars.map(av => `
                    <button type="button" 
                            data-avatar="${av}"
                            class="octo-avatar-btn w-10 h-10 rounded-2xl text-xl flex items-center justify-center border-2 transition-transform ${data.avatar === av ? 'border-purple-600 bg-purple-100 scale-110 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}">
                      ${av}
                    </button>
                  `).join('')}
                </div>
                <input type="hidden" id="octo-register-avatar-val" value="${data.avatar}" />
              </div>

              <!-- Nút Đăng Ký -->
              <div class="pt-2">
                <button type="button" 
                        id="octo-btn-do-register"
                        class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black py-3 rounded-2xl text-sm shadow-md border border-purple-400 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2">
                  <span>${this.currentOptions.submitBtnText}</span>
                </button>
              </div>

            </div>

          </div>

          <!-- Bottom Footer Bar (Nút Tải JSON, Đăng xuất và Hủy) -->
          <div class="flex items-center justify-between gap-2 mt-5 pt-3 border-t border-slate-200 flex-wrap">
            <div class="flex items-center gap-2">
              ${this.currentOptions.showLogout && isRegistered ? `
                <button type="button" 
                        id="octo-auth-btn-download-json"
                        class="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 border border-emerald-300 font-black px-3 py-1.5 rounded-2xl text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                        title="Tải tệp dữ liệu cá nhân của bé">
                  <span>📥</span> <span>Xuất .json</span>
                </button>
                <button type="button" 
                        id="octo-auth-btn-logout"
                        class="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-300 font-black px-3 py-1.5 rounded-2xl text-xs flex items-center gap-1 active:scale-95 transition-all cursor-pointer">
                  <span>🚪</span> <span>${this.t('auth.logoutBtn', 'Đăng xuất')}</span>
                </button>
              ` : `<span></span>`}
            </div>

            <button type="button" 
                    id="octo-auth-btn-cancel"
                    class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-black px-4 py-2 rounded-2xl text-xs sm:text-sm border border-slate-300 active:scale-95 transition-all cursor-pointer">
              ${this.t('auth.cancelBtn', 'Để sau / Quay lại')}
            </button>
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

      // Tab switcher clicks
      document.getElementById('octo-tab-login-btn')?.addEventListener('click', () => this.switchTab('login'));
      document.getElementById('octo-tab-register-btn')?.addEventListener('click', () => this.switchTab('register'));

      // Xử lý nút tuổi
      const ageValInput = document.getElementById('octo-register-age-val');
      const ageCustomInput = document.getElementById('octo-register-age-custom');
      const ageButtons = modal.querySelectorAll('.octo-age-btn');

      ageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const val = btn.getAttribute('data-age');
          if (ageValInput) ageValInput.value = val;
          if (ageCustomInput) ageCustomInput.value = '';
          ageButtons.forEach(b => {
            b.className = 'octo-age-btn px-2.5 py-1 rounded-xl border-2 font-black text-xs transition-all bg-slate-100 text-slate-700 border-slate-200 hover:border-purple-300';
          });
          btn.className = 'octo-age-btn px-2.5 py-1 rounded-xl border-2 font-black text-xs transition-all bg-purple-600 text-white border-purple-600 shadow-sm';
        });
      });

      ageCustomInput?.addEventListener('input', () => {
        if (ageCustomInput.value && ageValInput) {
          ageValInput.value = ageCustomInput.value;
          ageButtons.forEach(b => {
            b.className = 'octo-age-btn px-2.5 py-1 rounded-xl border-2 font-black text-xs transition-all bg-slate-100 text-slate-700 border-slate-200 hover:border-purple-300';
          });
        }
      });

      // Xử lý nút Avatar
      const avatarValInput = document.getElementById('octo-register-avatar-val');
      const avatarButtons = modal.querySelectorAll('.octo-avatar-btn');
      avatarButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const av = btn.getAttribute('data-avatar');
          if (avatarValInput) avatarValInput.value = av;
          avatarButtons.forEach(b => {
            b.className = 'octo-avatar-btn w-10 h-10 rounded-2xl text-xl flex items-center justify-center border-2 transition-transform border-slate-200 bg-white hover:border-slate-300';
          });
          btn.className = 'octo-avatar-btn w-10 h-10 rounded-2xl text-xl flex items-center justify-center border-2 transition-transform border-purple-600 bg-purple-100 scale-110 shadow-sm';
        });
      });

      // Nút Hủy
      document.getElementById('octo-auth-btn-cancel')?.addEventListener('click', () => {
        this.close();
        if (this.currentOptions.onCancel) {
          this.currentOptions.onCancel();
        }
      });

      // Nút Tải File JSON Hồ Sơ
      document.getElementById('octo-auth-btn-download-json')?.addEventListener('click', () => {
        const student = window.PortalCore ? window.PortalCore.getStudent() : null;
        if (student && student.studentId && window.PortalCore) {
          window.PortalCore.exportProfileJson(student.studentId);
          if (window.OctoNotify) {
            window.OctoNotify.toast(`Đang xuất file hồ sơ ${student.studentId}.json... 📥`, 'success');
          }
        }
      });

      // Nút Đăng xuất
      document.getElementById('octo-auth-btn-logout')?.addEventListener('click', () => {
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

      // Nút Xử lý Đăng Nhập
      document.getElementById('octo-btn-do-login')?.addEventListener('click', () => {
        this.processLogin();
      });

      // Enter trên input đăng nhập
      document.getElementById('octo-login-phone')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.processLogin();
        }
      });

      // Nút Xử lý Đăng Ký
      document.getElementById('octo-btn-do-register')?.addEventListener('click', () => {
        this.processRegister();
      });

      // Enter trên các input đăng ký
      modal.querySelectorAll('#octo-panel-register input').forEach(inp => {
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.processRegister();
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
     * Ẩn thông báo lỗi
     */
    hideError() {
      const banner = document.getElementById('octo-auth-error-banner');
      if (banner) {
        banner.classList.add('hidden');
      }
    },

    /**
     * XỬ LÝ ĐĂNG NHẬP BẰNG SỐ ĐIỆN THOẠI
     */
    async processLogin() {
      this.hideError();
      const phoneInput = document.getElementById('octo-login-phone');
      const rawPhone = phoneInput ? phoneInput.value : '';
      const phone = rawPhone.trim().replace(/\D/g, '');

      if (!phone || phone.length < 9 || phone.length > 11) {
        this.showError(this.t('auth.validationPhone', 'Vui lòng nhập đúng số điện thoại bố mẹ (9 - 11 chữ số)!'));
        phoneInput?.focus();
        return;
      }

      // Đổi text nút sang trạng thái đang kiểm tra
      const btn = document.getElementById('octo-btn-do-login');
      const oldHtml = btn ? btn.innerHTML : '';
      if (btn) {
        btn.innerHTML = `<span>⏳ Đang kiểm tra số điện thoại...</span>`;
        btn.disabled = true;
      }

      try {
        // Kiểm tra xem số điện thoại (tên file JSON hoặc localStorage) có tồn tại không
        const check = await window.PortalCore.checkStudentExists(phone);

        if (check.exists && check.data) {
          // Tồn tại -> Nạp và kích hoạt đăng nhập
          const student = check.data;
          window.PortalCore.login({
            studentId: phone,
            fullName: student.fullName,
            age: student.age,
            parentName: student.parentName,
            parentPhone: phone,
            avatar: student.avatar || '👦'
          });

          this.close();

          if (window.OctoNotify && typeof window.OctoNotify.toast === 'function') {
            window.OctoNotify.toast(`Chào mừng bé ${student.fullName || 'Học sinh'} đã đăng nhập! 🎉`, 'success');
          }

          if (this.currentOptions.onSuccess) {
            this.currentOptions.onSuccess(student);
          }
        } else {
          // Không tồn tại -> Báo lỗi và gợi ý chuyển sang tab Đăng Ký
          this.showError(`Số điện thoại "${phone}" chưa được đăng ký! Hãy bấm vào tab "✨ Đăng Ký Mới" phía trên để tạo tài khoản cho bé nhé.`);
          if (btn) {
            btn.innerHTML = oldHtml;
            btn.disabled = false;
          }
        }
      } catch (err) {
        console.error('Login check error:', err);
        this.showError('Có lỗi xảy ra khi kiểm tra tài khoản. Vui lòng thử lại!');
        if (btn) {
          btn.innerHTML = oldHtml;
          btn.disabled = false;
        }
      }
    },

    /**
     * XỬ LÝ ĐĂNG KÝ HỌC SINH MỚI
     */
    async processRegister() {
      this.hideError();
      const nameInput = document.getElementById('octo-register-name');
      const ageValInput = document.getElementById('octo-register-age-val');
      const parentInput = document.getElementById('octo-register-parent-name');
      const phoneInput = document.getElementById('octo-register-phone');
      const avatarValInput = document.getElementById('octo-register-avatar-val');

      const fullName = (nameInput ? nameInput.value : '').trim();
      const age = (ageValInput ? ageValInput.value : '').trim();
      const parentName = (parentInput ? parentInput.value : '').trim();
      const rawPhone = (phoneInput ? phoneInput.value : '').trim();
      const phone = rawPhone.replace(/\D/g, '');
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
      if (!phone || phone.length < 9 || phone.length > 11) {
        this.showError(this.t('auth.validationPhone', 'Vui lòng nhập đúng số điện thoại bố mẹ (9 - 11 chữ số)!'));
        phoneInput?.focus();
        return;
      }

      // Đổi text nút sang trạng thái đang kiểm tra
      const btn = document.getElementById('octo-btn-do-register');
      const oldHtml = btn ? btn.innerHTML : '';
      if (btn) {
        btn.innerHTML = `<span>⏳ Đang kiểm tra số điện thoại...</span>`;
        btn.disabled = true;
      }

      try {
        // Kiểm tra xem số điện thoại (tên file JSON hoặc localStorage) đã tồn tại chưa
        const check = await window.PortalCore.checkStudentExists(phone);

        if (check.exists) {
          // Đã tồn tại -> Báo lỗi trùng lặp và yêu cầu chuyển sang tab Đăng Nhập
          this.showError(`Số điện thoại "${phone}" đã được đăng ký trước đó! Vui lòng chuyển sang tab "🔑 Đăng Nhập" để vào tài khoản.`);
          if (btn) {
            btn.innerHTML = oldHtml;
            btn.disabled = false;
          }
          return;
        }

        // Chưa tồn tại -> Tạo mới hồ sơ với ID và tên file là số điện thoại
        const newStudent = window.PortalCore.registerNewStudent({
          fullName,
          age: Number(age),
          parentName,
          parentPhone: phone,
          avatar
        });

        this.close();

        if (window.OctoNotify && typeof window.OctoNotify.toast === 'function') {
          window.OctoNotify.toast(`Đã tạo tài khoản thành công cho bé ${fullName}! 🎉`, 'success');
        }

        if (this.currentOptions.onSuccess) {
          this.currentOptions.onSuccess(newStudent);
        }
      } catch (err) {
        console.error('Register check error:', err);
        this.showError('Có lỗi xảy ra khi tạo tài khoản. Vui lòng thử lại!');
        if (btn) {
          btn.innerHTML = oldHtml;
          btn.disabled = false;
        }
      }
    }
  };

  window.OctoAuthModal = OctoAuthModal;
})();
