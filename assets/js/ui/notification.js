/**
 * OctoKids Notification & Error Presentation Module (OctoNotify)
 * Tái sử dụng thông báo, toast, modal và màn hình báo lỗi chuẩn Octokids Design System.
 * 100% Static Web compatible - Hoạt động độc lập hoặc tích hợp cùng Alpine.js.
 */

(function () {
  'use strict';

  const OctoNotify = {
    /**
     * Tạo markup HTML cho Màn hình báo lỗi dữ liệu (Error State Card)
     * Thích hợp cho lỗi không tải được JSON đề thi, lỗi kết nối, v.v.
     */
    renderErrorCard(options = {}) {
      const {
        title = (window.OctoI18n ? window.OctoI18n.t('error.loadFailedTitle', 'Không Thể Nạp Dữ Liệu Đề Thi!') : 'Không Thể Nạp Dữ Liệu Đề Thi!'),
        subtitle = (window.OctoI18n ? window.OctoI18n.t('error.loadFailedSubtitle', 'Hệ thống không tìm thấy hoặc không thể đọc file câu hỏi') : 'Hệ thống không tìm thấy hoặc không thể đọc file câu hỏi'),
        error = 'Không có thông tin chi tiết',
        retryFnName = 'window.location.reload()',
        backUrl = '../index.html'
      } = options;

      const t = (key, fallback) => (window.OctoI18n ? window.OctoI18n.t(key, fallback) : fallback);

      return `
        <div class="w-full max-w-2xl mx-auto my-6 bg-white border-2 border-rose-300 rounded-3xl p-6 sm:p-10 shadow-xl text-center">
          <div class="w-20 h-20 mx-auto mb-4 rounded-3xl bg-rose-100 border-2 border-rose-300 flex items-center justify-center text-4xl shadow-inner animate-pulse">
            ⚠️
          </div>
          <h2 class="text-2xl font-black text-rose-700 mb-2">${title}</h2>
          <p class="text-xs text-slate-500 font-bold mb-4">${subtitle}</p>
          
          <div class="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs font-bold text-rose-900 mb-6 text-left space-y-2">
            <div class="flex items-start gap-2">
              <span class="text-rose-600 font-black shrink-0">${t('error.errorLabel', 'Chi tiết lỗi:')}</span>
              <span class="font-mono text-[11px] text-rose-800 break-all">${error}</span>
            </div>
            <div class="border-t border-rose-200 pt-2 text-[11px] text-slate-600 font-medium leading-relaxed">
              <b class="text-slate-800 font-black">${t('error.corsHintTitle', 'Nguyên nhân phổ biến:')}</b>
              <ul class="list-disc pl-4 mt-1 space-y-1">
                <li>${t('error.corsHintFileProtocol', 'Nếu mở trực tiếp từ file://, trình duyệt sẽ chặn tải file JSON do cơ chế bảo mật CORS. Hãy mở qua Web Server (VD: Live Server trong VS Code hoặc GitHub Pages).')}</li>
                <li>${t('error.corsHintPath', 'Đường dẫn file JSON (?data=...) không chính xác hoặc tệp bị thiếu/rỗng.')}</li>
              </ul>
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-3">
            <button onclick="${retryFnName}" 
                    class="bg-rose-600 hover:bg-rose-700 text-white font-black px-6 py-3 rounded-2xl shadow-md active:scale-95 transition-all text-sm flex items-center gap-2 cursor-pointer">
              <span>🔄</span> <span>${t('error.retryBtn', 'Tải Lại Trang')}</span>
            </button>
            <a href="${backUrl}" 
               class="bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-3 rounded-2xl shadow-md active:scale-95 transition-all text-sm flex items-center gap-2">
              <span>🗺️</span> <span>${t('error.backHomeBtn', 'Quay Về Bản Đồ')}</span>
            </a>
          </div>
        </div>
      `;
    },

    /**
     * Gắn trực tiếp Màn hình lỗi vào một DOM Element hoặc CSS selector
     */
    showErrorScreen(target, options = {}) {
      const container = typeof target === 'string' ? document.querySelector(target) : target;
      if (!container) return;
      container.innerHTML = this.renderErrorCard(options);
    },

    /**
     * Hiển thị thông báo Toast nhanh góc màn hình (tự động biến mất)
     * type: 'success' | 'error' | 'warning' | 'info'
     */
    toast(message, type = 'info', duration = 3000) {
      if (window.PortalCore && typeof window.PortalCore.playPop === 'function') {
        window.PortalCore.playPop();
      }

      let container = document.getElementById('octo-toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'octo-toast-container';
        container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none';
        document.body.appendChild(container);
      }

      const styles = {
        success: { bg: 'bg-emerald-600 text-white border-emerald-500', icon: '✅' },
        error: { bg: 'bg-rose-600 text-white border-rose-500', icon: '❌' },
        warning: { bg: 'bg-amber-500 text-amber-950 border-amber-400', icon: '⚠️' },
        info: { bg: 'bg-purple-600 text-white border-purple-500', icon: '💡' }
      };

      const theme = styles[type] || styles.info;

      const toast = document.createElement('div');
      toast.className = `${theme.bg} border-2 px-4 py-3 rounded-2xl shadow-xl font-bold text-xs sm:text-sm flex items-center gap-2.5 pointer-events-auto transition-all duration-300 transform translate-y-4 opacity-0`;
      toast.innerHTML = `
        <span class="text-base shrink-0">${theme.icon}</span>
        <span class="leading-tight">${message}</span>
      `;

      container.appendChild(toast);

      // Trigger animation
      requestAnimationFrame(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
      });

      // Auto dismiss
      setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-4', 'opacity-0');
        setTimeout(() => {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
      }, duration);
    },

    /**
     * Hiển thị Hộp thoại Cảnh báo Modal (Alert)
     */
    alert(title, message, type = 'info') {
      return new Promise((resolve) => {
        if (window.PortalCore && typeof window.PortalCore.playPop === 'function') {
          window.PortalCore.playPop();
        }

        const icons = {
          success: '🎉',
          error: '⚠️',
          warning: '❓',
          info: '💡'
        };

        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-200';
        overlay.innerHTML = `
          <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border-4 border-purple-400 shadow-2xl text-center transform scale-95 transition-transform duration-200">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-purple-100 border-2 border-purple-300 text-purple-700 flex items-center justify-center text-3xl mb-3 shadow-inner">
              ${icons[type] || '💡'}
            </div>
            <h3 class="text-lg font-black text-slate-900 mb-2">${title}</h3>
            <p class="text-xs sm:text-sm font-bold text-slate-600 mb-5 leading-relaxed">${message}</p>
            <button id="octo-alert-btn" class="bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-2.5 rounded-2xl text-sm shadow-md cursor-pointer active:scale-95 transition-all">
              Đồng ý
            </button>
          </div>
        `;

        document.body.appendChild(overlay);

        const btn = overlay.querySelector('#octo-alert-btn');
        btn.focus();
        btn.addEventListener('click', () => {
          document.body.removeChild(overlay);
          resolve(true);
        });
      });
    },

    /**
     * Hiển thị Hộp thoại Xác nhận Modal (Confirm)
     */
    confirm(title, message, options = {}) {
      const { confirmText = 'Xác nhận', cancelText = 'Hủy bỏ', type = 'warning' } = options;

      return new Promise((resolve) => {
        if (window.PortalCore && typeof window.PortalCore.playPop === 'function') {
          window.PortalCore.playPop();
        }

        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-200';
        overlay.innerHTML = `
          <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border-4 border-amber-400 shadow-2xl text-center transform scale-95 transition-transform duration-200">
            <div class="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-600 border-2 border-amber-400 flex items-center justify-center text-3xl font-black mb-3">
              ❓
            </div>
            <h3 class="text-lg sm:text-xl font-black text-slate-900 mb-2">${title}</h3>
            <p class="text-xs sm:text-sm font-bold text-slate-600 mb-5 leading-relaxed">${message}</p>
            <div class="flex justify-center gap-3">
              <button id="octo-confirm-cancel" class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-black px-5 py-2.5 rounded-2xl text-xs sm:text-sm border border-slate-300 cursor-pointer active:scale-95">
                ${cancelText}
              </button>
              <button id="octo-confirm-ok" class="bg-purple-600 hover:bg-purple-700 text-white font-black px-5 py-2.5 rounded-2xl text-xs sm:text-sm shadow-md cursor-pointer active:scale-95">
                ${confirmText}
              </button>
            </div>
          </div>
        `;

        document.body.appendChild(overlay);

        const okBtn = overlay.querySelector('#octo-confirm-ok');
        const cancelBtn = overlay.querySelector('#octo-confirm-cancel');

        const cleanUp = (result) => {
          if (overlay.parentNode) document.body.removeChild(overlay);
          resolve(result);
        };

        okBtn.addEventListener('click', () => cleanUp(true));
        cancelBtn.addEventListener('click', () => cleanUp(false));
      });
    }
  };

  // Expose to window
  window.OctoNotify = OctoNotify;
})();
