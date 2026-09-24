# Project Guidelines & Tech Stack (Dự án Game Giáo Dục & Nền Tảng Luyện Thi Toán TIMO)

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

1. **Giao Diện & Cấu Trúc (HTML5 & Tailwind CSS v3)**
   - Sử dụng **Tailwind CSS v3 (nhúng qua CDN)** kết hợp CSS custom kế thừa chuẩn thiết kế **Octokids Design System**.
   - Phông chữ chủ đạo: **Be Vietnam Pro** & **Inter** (Google Fonts) được tinh chỉnh chống mờ (`-webkit-font-smoothing: antialiased`) giúp chữ và ký hiệu toán học hiển thị **siêu sắc nét, đậm đà**.
   - Bố cục **Full Màn Hình (Full-Width Fluid Layout `w-full px-4 sm:px-8`)** mở rộng 100% diện tích hiển thị trên các loại màn hình máy tính và máy tính bảng.
   - Màu sắc sinh động, viền bo tròn lớn (`rounded-2xl`, `rounded-3xl`), thẻ đổ bóng nhẹ (`shadow-sm`, `shadow-md`), mã hóa màu sắc (Color-coding) chuẩn UX/UI giáo dục.
   - Không cần cài đặt Node.js hay chạy lệnh build CSS.

2. **Logic & Quản Lý Trạng Thái (Alpine.js v3 & OctoI18n Engine)**
   - Sử dụng **Alpine.js (v3 nhúng qua CDN)** xử lý trạng thái linh hoạt (reactive state: `x-data`, `x-show`, `@click`, `x-for`).
   - Tích hợp **OctoI18n Engine (`assets/js/i18n.js`)** cho bộ từ điển đa ngôn ngữ giao diện (🇻🇳 Tiếng Việt, 🇬🇧 English, 🇨🇳 中文) lưu trữ bền vững qua `localStorage('octo_lang')`.
   - Cấu trúc code nhẹ nhàng, sạch sẽ, lưu tiến độ bài thi tự động.

3. **Âm Thanh & Giọng Đọc (Web Audio API & Speech Synthesis)**
   - Sử dụng **Web Audio API** tạo hiệu ứng âm thanh nổ bong bóng, ting đếm cá, pháo hoa mừng chiến thắng.
   - Sử dụng **Web Speech API (`vi-VN`, `en-US`, `zh-CN`)** hoặc file MP3 chất lượng cao để đọc đề bài, phát âm từng tùy chọn đáp án A-F và phát lời giải chi tiết theo ngôn ngữ đang chọn.

4. **Hệ Thống Thông Báo & Màn Hình Báo Lỗi Tái Sử Dụng (OctoNotify Module `assets/js/notification.js`)**
   - Cung cấp API dùng chung cho toàn bộ các trang: Màn hình báo lỗi (`renderErrorCard`, `showErrorScreen`), Toast thông báo nổi đa trạng thái (`toast`), Hộp thoại cảnh báo/xác nhận (`alert`, `confirm`).
   - Tương thích 100% Web Tĩnh, tự động đồng bộ đa ngôn ngữ qua `OctoI18n` và âm thanh qua `PortalCore`.

---

## 🌐 Kiến Trúc Đa Ngôn Ngữ (i18n Architecture)

1. **Phân Tách Từ Điển Hệ Thống & Dữ Liệu Đề Thi**:
   - **`assets/js/i18n.js`**: Quản lý từ điển nhãn tĩnh hệ thống (UI Buttons, Headers, Timer, Modals, Mascot Cheer).
   - **`assets/data/*.json`**: Các bộ đề thi Toán TIMO / HKIMO chứa dữ liệu câu hỏi đa ngôn ngữ `{ "vi": "...", "en": "...", "zh": "..." }`.
2. **Language Switcher Dropdown**:
   - Menu lựa chọn ngôn ngữ có cờ quốc gia trên Header (`🇻🇳 Tiếng Việt`, `🇬🇧 English`, `🇨🇳 中文`).
   - Phản ứng tức thì qua sự kiện `octo-lang-changed` và hàm helper `t(key)` / `getLangText(field, lang)`.

---

## 🎨 Chuẩn Thiết Kế Giao Diện Octokids (Octokids UI/UX Palette & Layout System)

1. **Bố Cục Full Màn Hình 2 Cột (Main 75% - Sidebar 25%)**:
   - **Thanh Topbar**: Breadcrumb lộ trình (`← Toán TIMO > Luyện Tập > Tổ hợp`), Đồng hồ đếm ngược `🕐`, Nút `⏸ Tạm dừng`, Nút `🚩 Báo lỗi` và Nút `Nộp bài` nổi bật.
   - **Thẻ Câu Hỏi (Main Card)**:
     - Badge số câu (`Câu X`), Thẻ chủ đề màu tím (`TỔ HỢP`), Nút Zoom font/ảnh (`- 120% +`), Hàng nút đọc giọng nói `🔊 Đọc TV` / `🔊 Read Eng`, Nút `✅ Xem đáp án` và `💡 Trợ giúp`.
     - Đề bài Tiếng Việt & Tiếng Anh sắc nét, Khối hình ảnh/Emoji Grid minh họa (`visual-box`).
     - Các nút đáp án trắc nghiệm (Choices A-F) mang huy hiệu màu sắc riêng biệt (Blue, Purple, Green, Orange) có nút phát âm thanh `🔊` riêng từng đáp án.
     - Thanh điều hướng cuối thẻ: `← Câu trước` và `Câu tiếp theo →`.
   - **Thanh Trạng Thái Bên Phải (Sidebar)**:
     - Tiến độ bài làm (`0/50 câu`) với thanh progress mượt mà.
     - Bảng số thứ tự câu hỏi (Grid 5 cột) kèm Chú giải màu (*Màu Xanh - Đã làm*, *Màu Cam - Đang làm*, *Màu Trắng - Chưa làm*, *Lá cờ Red Flag - Đánh dấu*).
     - Bộ lọc Nhảy câu nhanh (`Đi tới câu...`) & Bộ lọc Độ khó (`Rất dễ` ➔ `Rất khó`).
     - Phân trang bảng câu hỏi (`‹ Trang 1/3 ›`).
     - Thẻ Thông Tin Bài Thi & Thẻ Linh Vật Động Viên ("Cố lên nhé! Bạn đang làm rất tốt.").

---

## 🚀 Nguyên Tắc Triển Khai (Deployment Rules)

- **100% Static Web (Web Tĩnh)**: Toàn bộ dự án chạy trực tiếp bằng cách nhấp đôi file `index.html` hoặc upload lên GitHub Pages / Vercel / Netlify mà không cần server backend.
- **Tối ưu trải nghiệm Luyện thi & Tiền Tiểu Học**:
  - Hỗ trợ dữ liệu JSON linh hoạt (từ 2 đến 6 lựa chọn đáp án, ảnh minh họa, lời giải chi tiết, đa ngôn ngữ).
  - Tích hợp hệ thống điểm Ngôi Sao ⭐, Huy Chương (🥇 Vàng, 🥈 Bạc, 🥉 Đồng) và Bảng đánh giá cho Phụ huynh / Giáo viên.

---

## ⛔ NGUYÊN TẮC BẮT BUỘC: 100% DATA GỐC - TUYỆT ĐỐI KHÔNG DÙNG INIT / FALLBACK / HARDCODED DATA (FAIL-FAST POLICY)

- **CẤM TUYỆT ĐỐI**: Không bao giờ được phép để dữ liệu mẫu giả định (hardcoded/fallback/init mock data) trong mã nguồn HTML/JS (kể cả trong `Alpine.data()` hay biến toàn cục) để che giấu lỗi kết nối dữ liệu.
- **100% SỬ DỤNG DỮ LIỆU GỐC TỪ JSON**: Toàn bộ dữ liệu đề thi, danh mục chương trình học, bài thi nổi bật... BẮT BUỘC phải được nạp thuần động từ các tệp JSON gốc (`assets/data/exams-index.json`, `assets/data/*.json`).
- **BÁO LỖI NGAY LẬP TỨC (FAIL-FAST ERROR STATE)**: Nếu không tải được tệp dữ liệu (do lỗi mạng, lỗi CORS khi mở bằng file://, sai đường dẫn, hoặc JSON hỏng), hệ thống **BẮT BUỘC BÁO LỖI NGAY LẬP TỨC** bằng màn hình báo lỗi trực quan (`OctoNotify.renderErrorCard` / `loadError = true`), hiển thị rõ nguyên nhân và nút Thử lại / Về trang chủ.
- **NGHIÊM CẤM TÁI PHẠM**: Mọi trang trong dự án (cả Trang Chủ `index.html`, Phân hệ thi `modules/luyen-thi-trac-nghiem.html`, và các module mở rộng sau này) đều phải tuân thủ nghiêm ngặt nguyên tắc này.

---

## 🔒 Quy Tắc Thay Đổi & Xác Nhận Với User (Strict Confirmation Rules)

- **TUÂN THỦ TUYỆT ĐỐI**: Mỗi khi sửa đổi hoặc xóa bỏ bất kỳ tính năng, giao diện, logic nào có nguy cơ ảnh hưởng đến các phần đã hoàn thành/chốt trong Checklist dưới đây:
  1. **BẮT BUỘC** đối chiếu với **Checklist Các Tính Năng Đã Hoàn Thành** trước khi thực hiện bất kỳ thao tác sửa/xóa nào.
  2. Phải cân nhắc kỹ lưỡng tác động side-effect lên các tính năng đã chốt.
  3. **BẮT BUỘC** hỏi ý kiến và chờ USER xác nhận (confirm) trước khi tiến hành thực thi.
  4. **TUYỆT ĐỐI KHÔNG TỰ Ý SỬA/XÓA** các phần đã chốt nếu chưa có sự đồng ý của USER.

---

## 📋 Checklist Các Tính Năng Đã Hoàn Thành & Đã Chốt (Approved Features Checklist)

- [x] **1. Đổi Mới Kiến Trúc & Công Nghệ Nền Tảng (Core Stack)**
  - Web Tĩnh 100% Static (`index.html`, `modules/luyen-thi-trac-nghiem.html`).
  - Tailwind CSS v3 (CDN) + Custom Octokids UI/UX Design System (`Be Vietnam Pro` & `Inter` fonts, `rounded-3xl`, color-coding).
  - Alpine.js v3 (CDN) reactive state management.
  - Web Audio API (hiệu ứng âm thanh Pop & Win/Success).
  - Web Speech API (giọng đọc đa ngôn ngữ `vi-VN`, `en-US`, `zh-CN` cho câu hỏi, tùy chọn đáp án A-F & lời giải).
  - Nạp dữ liệu đề thi thuần động qua tệp JSON (đã loại bỏ fallback dataset mặc định theo yêu cầu; kích hoạt cơ chế báo lỗi trực quan Error State khi nạp thất bại).

- [x] **2. Hệ Thống Đa Ngôn Ngữ (OctoI18n Engine)**
  - Từ điển tĩnh `assets/js/i18n.js` hỗ trợ 3 ngôn ngữ (🇻🇳 Tiếng Việt, 🇬🇧 English, 🇨🇳 中文).
  - Dropdown chuyển ngôn ngữ tức thì qua event `octo-lang-changed` & `localStorage('octo_lang')`.
  - Hỗ trợ dữ liệu đề thi đa ngôn ngữ dạng JSON (`assets/data/*.json`).

- [x] **3. Engine Toàn Cục & Hồ Sơ Người Chơi (`assets/js/core.js`)**
  - Quản lý điểm Ngôi Sao ⭐ toàn cục (`localStorage`).
  - Quản lý trạng thái âm thanh Bật/Tắt (`isMuted`).
  - Hồ sơ người chơi (Tên & Avatar đại diện) thay đổi qua Modal.
  - (Đã loại bỏ tính năng Nhãn dán Sticker theo yêu cầu của người dùng).

- [x] **4. Trang Chủ / Bản Đồ Luyện Thi (`index.html`)**
  - Header Topbar (Avatar, Dropdown ngôn ngữ).
  - Thẻ người chơi cho phép chỉnh sửa tên & avatar.
  - (Đã loại bỏ hiển thị Điểm sao ⭐ và Nút âm thanh trên Navbar Header theo yêu cầu của người dùng).

- [x] **5. Phân Hệ Đấu Trường Luyện Thi Trắc Nghiệm Toán TIMO (`modules/luyen-thi-trac-nghiem.html`)**
  - **Topbar**: Breadcrumb lộ trình, Đồng hồ đếm ngược `🕐`, Nút `⏸ Tạm dừng`, Nút `🚩 Báo lỗi`, Nút `Nộp bài`.
  - **Thẻ Câu Hỏi Main Card**:
    - Badge thứ tự câu (`Câu X`), Thẻ chủ đề màu tím (`TỔ HỢP`).
    - Nút Zoom font/hình ảnh (`- 120% +`).
    - Nút đọc giọng nói đa ngôn ngữ câu hỏi (`🔊 Đọc TV` / `🔊 Read Eng`).
    - Nút `✅ Xem đáp án` & `💡 Trợ giúp` (hiển thị Lời giải chi tiết & Đáp án đúng).
    - Khối minh họa: Hỗ trợ linh hoạt `emojiGrid` (`emojis`/`items`) & Hình ảnh minh họa `image`.
    - Nút đáp án trắc nghiệm A-F nhiều màu sắc (Blue, Purple, Green, Orange...) có nút phát âm `🔊` riêng từng đáp án.
    - Điều hướng `← Câu trước` và `Câu tiếp theo →`.
  - **Thanh Trạng Thái Sidebar**:
    - Tiến độ bài làm (`x/y câu`) với progress bar mượt mà.
    - Bảng ma trận 5 cột chọn nhanh câu hỏi (Phân màu: *Xanh = Đã làm*, *Cam = Đang làm*, *Trắng = Chưa làm*, *Lá cờ Red Flag 🚩 = Báo lỗi/Đánh dấu*).
    - Bộ lọc Nhảy câu nhanh (`Go`) & Bộ lọc Độ khó bài thi (`Tất cả` ➔ `Mức 1 đến 5`).
    - Phân trang ma trận câu hỏi (`‹ Trang x/y ›`).
    - Thẻ Thông tin bài thi & Thẻ Linh vật Bạch tuộc 🐙 động viên.
  - **Hệ Thống Modals**:
    - Modal Tạm dừng bài thi ⏸.
    - Modal Báo lỗi câu hỏi 🚩.
    - Modal Xác nhận nộp bài (báo số câu chưa làm).
    - Modal Kết quả: Điểm số %, Số câu đúng/tổng số, Huy chương (🥇 Vàng, 🥈 Bạc, 🥉 Đồng, 🎗️ Bằng khen), Cộng sao ⭐ và Hiệu ứng pháo hoa Confetti Canvas.

- [x] **6. Nâng Cấp Giao Diện Chương Trình Học Octokids Curriculum trên Trang Chủ (`index.html`)**
  - **Phân Khu 1: Tư duy nền tảng (`ok-curriculum-section` Foundational Path)**:
    - Thẻ Panel Card với icon "🌱 Tư duy nền tảng".
    - Lộ trình Stepper cuộn ngang mượt mà với nút `‹` và `›` hiển thị trực quan không bị che khuất.
    - Các bước học: *1. Số & Chữ số*, *2. Phép cộng & Phép trừ*, *3. So sánh & Thay thế*, *4. Đo lường & Thời gian*. Có nút `Khám phá` và `Luyện tập`.
  - **Phân Khu 2: Tư duy nâng cao (`ok-curriculum-section` Enrichment Grid)**:
    - Lưới 6 thẻ bài học nhiều màu sắc: 🟩 *Bài toán Quy luật*, 🟧 *Biểu đồ & Phân loại*, 🟦 *Hình học & Đếm hình*, 🟪 *Toán cân bằng*, 🌸 *Logic thực tế*, 🪸 *Tư duy thay thế*. Mỗi thẻ có nút `Khám phá` & `Luyện tập`.
  - **Phân Khu 3: Luyện tập nhanh (`ok-quick-mini-grid` Quick Practice)**:
    - 4 ô luyện nhanh phương pháp Spiral Practice: 🟣 **Daily Quiz**, 🔵 **Try Hard**, 🟢 **10 câu**, 🟠 **20 câu**.
  - **Bảo tồn toàn bộ tính năng gốc**: Header Topbar, Nút Âm thanh, Điểm Sao ⭐, Modal Đổi tên/Avatar.

- [x] **7. Module Thông Báo & Báo Lỗi Dùng Chung (`assets/js/notification.js`)**
  - Màn hình báo lỗi Error State Card chuẩn thiết kế Octokids (icon ⚠️ pulse, chi tiết lỗi, hướng dẫn CORS/đường dẫn, nút Tải lại & Về bản đồ).
  - Toast thông báo nổi tự động ẩn (`OctoNotify.toast`) kèm hiệu ứng âm thanh Web Audio API.
  - Hộp thoại cảnh báo (`OctoNotify.alert`, `OctoNotify.confirm`).
  - Đã tích hợp tái sử dụng trên cả `index.html` và `modules/luyen-thi-trac-nghiem.html`.

- [x] **8. Kiến Trúc Hướng Dữ Liệu & Nạp Động Đề Thi (Data-Driven Architecture)**
  - Tệp danh mục trung tâm `assets/data/exams-index.json` quản lý toàn bộ cấu trúc: Đấu trường nổi bật (`featuredExams`), 4 bước Stepper nền tảng (`foundational`), 6 thẻ tư duy mở rộng (`enrichment`), 4 ô luyện nhanh (`quickPractice`).
  - Hệ thống dữ liệu đề thi JSON chuẩn hóa (`assets/data/*.json`) độc lập, hỗ trợ đa ngôn ngữ (`vi`, `en`, `zh`), emoji visual grid và giải thích chi tiết.
  - Trang chủ `index.html` nạp dữ liệu động từ `exams-index.json` qua Alpine.js, hỗ trợ fallback dữ liệu an toàn khi chạy offline qua giao thức `file://`.
  - Mọi nút bấm trên Trang Chủ tự động tạo liên kết động chuẩn: `modules/luyen-thi-trac-nghiem.html?exam={id}&data={dataFile}`.

- [x] **9. Module Đăng Nhập / Ghi Danh Học Sinh Dùng Chung (`assets/js/auth-modal.js`) & Cơ Chế Gated Login Khi Nộp Bài**
  - **Module tái sử dụng độc lập (`OctoAuthModal`)**: Quản lý cửa sổ Đăng nhập / Ghi danh học sinh dùng chung trên cả Trang Chủ `index.html` và Phân hệ thi `modules/luyen-thi-trac-nghiem.html`.
  - **4 Thông tin bắt buộc chuẩn hóa**: Tên của bé (`fullName`), Mấy tuổi (`age`), Tên bố mẹ (`parentName`), Số điện thoại phụ huynh (`parentPhone`) kèm Chọn Avatar đại diện (👦, 👧, 🐰, 🐻, 🐱, 🐶).
  - **Trải nghiệm duyệt tự do (Frictionless Practice)**: Học sinh và phụ huynh vào Trang chủ xem danh mục, chọn bài và làm bài trắc nghiệm hoàn toàn bình thường mà không bị chặn cổng đăng nhập trước.
  - **Bắt buộc đăng nhập khi nộp bài (Gated Submission)**: Khi bấm "Nộp bài", nếu chưa đăng nhập thì hệ thống tự động hiển thị cửa sổ ghi danh; sau khi hoàn tất xác nhận, hệ thống tự động nộp bài và tính điểm ngay mà không làm mất bài làm của bé.
  - **Đồng bộ toàn cục**: Tích hợp với `PortalCore.login` / `logout`, phát sự kiện `octo-student-changed` cập nhật tức thì Header Topbar ở mọi trang.
  - **Hiển thị thông tin thí sinh trong Modal Kết Quả**: Hiển thị trang trọng thẻ Thí sinh (`Tên bé, Tuổi, Tên bố mẹ, SĐT`) kèm huy chương và điểm số.

---

## 📊 Định Hướng Kiến Trúc Mở Rộng: Google Sheet CMS & Jamstack Sync (Dành Cho 1.000+ Người Dùng)

- **Mục tiêu**: Người ra đề biên soạn đề thi trực tiếp trên Google Sheet, ứng dụng Web Tĩnh (Static Web trên GitHub Pages / Vercel) tự động hiển thị và vận hành mượt mà cho 1.000+ người dùng.
- **Kiến trúc Chiều Lấy Đề Thi (Input - Sheet ➔ Web)**:
  - **Mô hình PUSH JSON Tĩnh (Khuyên dùng)**: Người ra đề bấm nút *"Xuất Đề Thi"* trên Google Sheet ➔ Google Apps Script tự động biên dịch dữ liệu câu hỏi thành file JSON (vd `assets/data/timo-to-hop-g1.json`) và đẩy Commit trực tiếp lên GitHub Repository qua **GitHub REST API**.
  - **Tốc độ & Hiệu năng**: Web App trên GitHub Pages chỉ nạp file JSON tĩnh trực tiếp từ CDN với tốc độ siêu tốc **20ms - 50ms**, chịu tải 100.000+ học sinh cùng lúc mà không lo nghẽn hay chạm trần quota của Google.
- **Kiến trúc Chiều Nộp & Lưu Điểm Thi (Output - Web ➔ Sheet)**:
  - **Nộp bài ngầm (Async Submit)**: Khi học sinh bấm nộp bài, Web App tính điểm và hiển thị màn hình ăn mừng lập tức (**0s**), đồng thời cho chạy ngầm lệnh POST gửi kết quả về Google Sheet / Google Form Endpoint.
  - **Bảo toàn dữ liệu (LocalStorage Backup)**: Nếu đường truyền nghẽn, điểm số tự động lưu vào `localStorage` máy học sinh và tự động thử lại (Retry) khi rảnh mạng.




