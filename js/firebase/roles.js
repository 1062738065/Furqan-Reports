// js/firebase/roles.js
// تعريف الأدوار والصلاحيات في النظام

export const ROLES = {
  EMPLOYEE: "employee",                 // الموظفة
  UNIT_OFFICER: "unit_officer",         // مسؤولة الوحدة
  UNIT_MANAGER: "unit_manager",         // مديرة الوحدة
  DEPT_MANAGER: "dept_manager",         // مديرة القسم
  EDUCATION_ADMIN: "education_admin"    // إدارة التعليم
};

export const ROLE_LABELS = {
  [ROLES.EMPLOYEE]: "موظفة",
  [ROLES.UNIT_OFFICER]: "مسؤولة الوحدة",
  [ROLES.UNIT_MANAGER]: "مديرة الوحدة",
  [ROLES.DEPT_MANAGER]: "مديرة القسم",
  [ROLES.EDUCATION_ADMIN]: "إدارة التعليم"
};

// كل دور يفتح على الشاشة التالية بعد الدخول
export const ROLE_LANDING_PAGE = {
  [ROLES.EMPLOYEE]: "dashboard.html",
  [ROLES.UNIT_OFFICER]: "dashboard.html",
  [ROLES.UNIT_MANAGER]: "pages/unit-review.html",
  [ROLES.DEPT_MANAGER]: "pages/department-review.html",
  [ROLES.EDUCATION_ADMIN]: "pages/admin-dashboard.html"
};

// صلاحيات كل دور فيما يخص مسار الاعتماد
export const CAN_APPROVE = {
  [ROLES.EMPLOYEE]: false,
  [ROLES.UNIT_OFFICER]: false,
  [ROLES.UNIT_MANAGER]: true,   // تراجع صحة الأرقام والشواهد لتقارير الوحدة
  [ROLES.DEPT_MANAGER]: true,   // تعتمد أبرز النتائج والتوصيات لتقارير القسم
  [ROLES.EDUCATION_ADMIN]: true // تعتمد التقرير النهائي
};

export function getUserRole(userDoc) {
  return userDoc?.role || ROLES.EMPLOYEE;
}

export function roleLabel(role) {
  return ROLE_LABELS[role] || role;
}
