// js/components/topbar.js
// شريط علوي مشترك بين جميع صفحات النظام: يعرض اسم المستخدمة ودورها وزر خروج

import { logout, roleLabel } from "../auth.js";

export function renderTopbar(profile, options = {}) {
  const mount = document.getElementById("topbar-mount");
  if (!mount) return;

  const homeHref = options.homeHref || "../dashboard.html";

  mount.innerHTML = `
    <div class="topbar">
      <a href="${homeHref}" class="brand">
        <span class="gold-dot"></span>
        نظام توثيق الأداء - فرقان
      </a>
      <div class="d-flex align-items-center gap-2">
        <div class="user-chip">
          <i class="fa-regular fa-user"></i>
          <span>${profile.name || profile.email || ""}</span>
          <span class="role-label">· ${roleLabel(profile.role)}</span>
        </div>
        <button class="btn-logout" id="logoutBtn">
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
          خروج
        </button>
      </div>
    </div>
  `;

  document.getElementById("logoutBtn").addEventListener("click", logout);
}
