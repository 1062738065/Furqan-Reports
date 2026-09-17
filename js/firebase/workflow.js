// js/firebase/workflow.js
// مسار الاعتماد: موظفة ← مديرة الوحدة ← مديرة القسم ← إدارة التعليم

import { db } from "./config.js";
import {
  collection, doc, updateDoc, query, where, getDocs, arrayUnion, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

export const STATUS = {
  DRAFT: "draft",
  SUBMITTED: "submitted",
  UNIT_APPROVED: "unit_approved",
  DEPT_APPROVED: "dept_approved",
  APPROVED: "approved",
  RETURNED: "returned",
  REJECTED: "rejected"
};

export const STATUS_LABELS_AR = {
  draft: "مسودة",
  submitted: "بانتظار اعتماد مديرة الوحدة",
  unit_approved: "بانتظار اعتماد مديرة القسم",
  dept_approved: "بانتظار اعتماد إدارة التعليم",
  approved: "معتمد نهائيًا",
  returned: "أُعيد للتعديل",
  rejected: "مرفوض"
};

export const STATUS_FOR_ROLE = {
  unit_manager: STATUS.SUBMITTED,
  dept_manager: STATUS.UNIT_APPROVED,
  education_admin: STATUS.DEPT_APPROVED
};

export const NEXT_STATUS = {
  unit_manager: STATUS.UNIT_APPROVED,
  dept_manager: STATUS.DEPT_APPROVED,
  education_admin: STATUS.APPROVED
};

async function addHistoryEntry(reportId, entry) {
  await updateDoc(doc(db, "reports", reportId), {
    history: arrayUnion({ ...entry, at: new Date().toISOString() }),
    updatedAt: serverTimestamp()
  });
}

export async function submitForReview(reportId, profile) {
  await updateDoc(doc(db, "reports", reportId), {
    status: STATUS.SUBMITTED,
    updatedAt: serverTimestamp()
  });
  await addHistoryEntry(reportId, { action: "submit", by: profile.name || profile.email, role: profile.role, note: "" });
}

export async function approveReport(reportId, profile, note = "") {
  const nextStatus = NEXT_STATUS[profile.role];
  if (!nextStatus) throw new Error("هذا الدور لا يملك صلاحية الاعتماد");
  await updateDoc(doc(db, "reports", reportId), {
    status: nextStatus,
    updatedAt: serverTimestamp()
  });
  await addHistoryEntry(reportId, { action: "approve", by: profile.name || profile.email, role: profile.role, note });
}

export async function returnForEdit(reportId, profile, note) {
  await updateDoc(doc(db, "reports", reportId), {
    status: STATUS.RETURNED,
    updatedAt: serverTimestamp()
  });
  await addHistoryEntry(reportId, { action: "return", by: profile.name || profile.email, role: profile.role, note });
}

export async function rejectReport(reportId, profile, note) {
  await updateDoc(doc(db, "reports", reportId), {
    status: STATUS.REJECTED,
    updatedAt: serverTimestamp()
  });
  await addHistoryEntry(reportId, { action: "reject", by: profile.name || profile.email, role: profile.role, note });
}

// جلب التقارير التي تنتظر اعتماد دور معين
// (بدون orderBy لتفادي الحاجة لفهرس مركّب؛ الترتيب يتم في الكود بعد الجلب)
export async function listReportsPendingForRole(role) {
  const targetStatus = STATUS_FOR_ROLE[role];
  if (!targetStatus) return [];
  const q = query(
    collection(db, "reports"),
    where("status", "==", targetStatus)
  );
  const snap = await getDocs(q);
  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.updatedAt?.toMillis?.() || 0) - (a.updatedAt?.toMillis?.() || 0));
}
