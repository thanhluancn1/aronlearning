/**
 * HÀNH TRÌNH TOÁN HỌC TIỀN TIỂU HỌC - PORTAL CORE ENGINE (FACADE)
 * Hợp nhất các module lõi: CoreStudentAuth, CoreClassManager, CoreStudentProfile, CoreTryHardEngine, CoreAudio
 */

window.PortalCore = window.PortalCore || {};

// Merge tất cả các module vào window.PortalCore để bảo toàn 100% tính tương thích cho toàn bộ dự án
if (window.CoreStudentAuth) Object.assign(window.PortalCore, window.CoreStudentAuth);
if (window.CoreClassManager) Object.assign(window.PortalCore, window.CoreClassManager);
if (window.CoreStudentProfile) Object.assign(window.PortalCore, window.CoreStudentProfile);
if (window.CoreTryHardEngine) Object.assign(window.PortalCore, window.CoreTryHardEngine);
if (window.CoreAudio) Object.assign(window.PortalCore, window.CoreAudio);

// Cung cấp namespace từng module con để dễ dàng gọi riêng khi cần
window.PortalCore.Auth = window.CoreStudentAuth;
window.PortalCore.Classes = window.CoreClassManager;
window.PortalCore.Profile = window.CoreStudentProfile;
window.PortalCore.TryHard = window.CoreTryHardEngine;
window.PortalCore.Audio = window.CoreAudio;
