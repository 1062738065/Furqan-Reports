// js/components/form-helpers.js
// دوال مساعدة مشتركة للنماذج: عداد الأحرف، إظهار/إخفاء الحقول الشرطية، إشعار الحفظ

// تفعيل عداد أحرف على textarea مع حد أقصى
export function bindCharCounter(textareaId, counterId, maxChars) {
  const el = document.getElementById(textareaId);
  const counter = document.getElementById(counterId);
  if (!el || !counter) return;

  function update() {
    const len = el.value.length;
    counter.textContent = `${len} / ${maxChars} حرف`;
    counter.classList.toggle("text-danger", len > maxChars);
  }
  el.addEventListener("input", update);
  update();
}

// ربط قائمة منسدلة بقيمة "أخرى" تُظهر حقل نص عند اختيارها
export function bindOtherOption(selectId, otherWrapId, otherValue = "أخرى") {
  const select = document.getElementById(selectId);
  const wrap = document.getElementById(otherWrapId);
  if (!select || !wrap) return;

  function toggle() {
    const isOther = select.value === otherValue;
    wrap.classList.toggle("d-none", !isOther);
    const input = wrap.querySelector("input, textarea");
    if (input) input.required = isOther;
  }
  select.addEventListener("change", toggle);
  toggle();
}

// إظهار/إخفاء قسم كامل بناءً على قيمة عنصر آخر
export function bindConditionalSection(triggerId, sectionId, showWhen) {
  const trigger = document.getElementById(triggerId);
  const section = document.getElementById(sectionId);
  if (!trigger || !section) return;

  function toggle() {
    const val = trigger.type === "checkbox" ? trigger.checked : trigger.value;
    const shouldShow = Array.isArray(showWhen) ? showWhen.includes(val) : val === showWhen;
    section.classList.toggle("d-none", !shouldShow);
  }
  trigger.addEventListener("change", toggle);
  toggle();
}

// شريط إشعار صغير أعلى الصفحة يظهر عند الحفظ
export function showSaveToast(message = "تم الحفظ", isError = false) {
  let toast = document.getElementById("saveToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "saveToast";
    toast.style.cssText = `
      position: fixed; top: 78px; left: 50%; transform: translateX(-50%);
      padding: 10px 22px; border-radius: 10px; font-size: 0.88rem; font-weight: 700;
      z-index: 2000; box-shadow: 0 6px 20px rgba(0,0,0,0.15); transition: opacity .3s;
    `;
    document.body.appendChild(toast);
  }
  toast.style.background = isError ? "#fdecea" : "#e8f6ee";
  toast.style.color = isError ? "#c0392b" : "#1e8e5a";
  toast.textContent = message;
  toast.style.opacity = "1";
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = "0"; }, 2200);
}

// حالة المؤشر التلقائية بناءً على المستهدف والمتحقق والاتجاه
export function computeIndicatorStatus(baseline, target, actual, direction) {
  if (actual === null || actual === undefined || actual === "" || isNaN(actual)) {
    return "none";
  }
  actual = Number(actual);
  target = Number(target);
  if (isNaN(target)) return "none";

  let ratio;
  if (direction === "asc") {
    ratio = target === 0 ? (actual >= 0 ? 1 : 0) : actual / target;
  } else if (direction === "desc") {
    ratio = actual === 0 ? 1 : target / actual;
  } else {
    // ضمن نطاق محدد: نعتبر المطابقة التامة هي الأفضل
    ratio = target === 0 ? 1 : 1 - Math.abs(actual - target) / Math.max(target, 1);
  }

  if (ratio >= 1) return "done";
  if (ratio >= 0.9) return "near";
  if (ratio >= 0.7) return "warn";
  return "fail";
}

export const STATUS_LABELS = {
  done: "🟢 متحقق",
  near: "🟡 قريب من المستهدف",
  warn: "🟠 يحتاج تدخلًا",
  fail: "🔴 متعثر",
  none: "⚪ لا توجد بيانات"
};

export function renderStatusPill(statusKey) {
  return `<span class="status-pill ${statusKey}">${STATUS_LABELS[statusKey]}</span>`;
}
