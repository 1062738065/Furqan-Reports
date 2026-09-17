/* =============================== الاتصال بالخلفية (Google Sheets عبر Apps Script) =============================== */
// نفس رابط النظام الحالي — إذا احتجتِ تغييره مستقبلاً، بدّليه هنا فقط.
const REPORTS_API_URL = "https://script.google.com/macros/s/AKfycbxYuT0E3McP55Y58VC0jQNqG8HsB0st2de47NfQlDLFL5QjclO-C5AhYuL_mFf1QA/exec";

// نفس أسلوب نظام المقاصف: نرسل الطلب بصيغة نص عادي (text/plain) بدل JSON
// عشان نتفادى طلب OPTIONS المسبق (CORS preflight) اللي Google Apps Script
// ما يقدر يرد عليه.
async function callApi(action, payload) {
  payload = payload || {};
  try {
    const res = await fetch(REPORTS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(Object.assign({ action: action }, payload)),
    });
    if (!res.ok) return { ok: false, error: "فشل الاتصال بالخادم" };
    return await res.json();
  } catch (e) {
    console.error("خطأ في الاتصال:", e);
    return { ok: false, error: "تعذر الاتصال بالإنترنت، تأكدي من الشبكة" };
  }
}

/* =============================== قراءة/كتابة مفاتيح بيانات النظام =============================== */
// نفس المفاتيح المستخدمة في نسخة React (prs:units, prs:departments...) عمدًا،
// عشان أي بيانات محفوظة سابقًا في نفس جدول قوقل شيت تستمر تظهر بدون أي تحويل.
async function getData(key, fallback) {
  const res = await callApi("get", { key: key });
  if (res && res.ok && res.value != null) {
    try { return JSON.parse(res.value); } catch (e) { return fallback; }
  }
  return fallback;
}
async function setData(key, value) {
  return callApi("set", { key: key, value: JSON.stringify(value) });
}

const KEYS = {
  DEPARTMENTS: "prs:departments",
  UNITS: "prs:units",
  INDICATOR_DEFS: "prs:indicator-definitions",
  GOALS_DEFS: "prs:goals-definitions",
  report: function (unitId) { return "prs:report:" + unitId; },
};

/* =============================== الجلسة (تسجيل الدخول) =============================== */
const SESSION_KEY = "prs:session";
function saveSession(user) { localStorage.setItem(SESSION_KEY, JSON.stringify(user)); }
function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function clearSession() { localStorage.removeItem(SESSION_KEY); }

// تُستدعى في أعلى كل صفحة محمية. requiredRole اختياري ("admin" أو "user").
function requireSession(requiredRole) {
  const user = getSession();
  if (!user) {
    window.location.href = "index.html";
    return null;
  }
  if (requiredRole && user.role !== requiredRole) {
    window.location.href = user.role === "admin" ? "dashboard.html" : "unit.html";
    return null;
  }
  return user;
}
function logout() {
  clearSession();
  window.location.href = "index.html";
}

/* =============================== أدوات واجهة عامة =============================== */
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  const showing = input.type === "text";
  input.type = showing ? "password" : "text";
  btn.textContent = showing ? "🙈" : "👁️";
}

function showToast(message) {
  let el = document.getElementById("prs-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "prs-toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(el._timer);
  el._timer = setTimeout(function () { el.classList.remove("show"); }, 2600);
}

function uid(prefix) {
  return (prefix || "id") + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}

function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
