/**
 * نظام توثيق الأداء — جمعية فرقان
 * الخلفية (Backend): Google Apps Script مربوط بجدول Google Sheets واحد.
 *
 * طريقة الإعداد:
 * 1) أنشئي جدول بيانات (Google Sheet) جديد فارغ.
 * 2) من القائمة: الإضافات (Extensions) → Apps Script.
 * 3) احذفي أي كود موجود في Code.gs، والصقي هذا الملف بالكامل مكانه.
 * 4) من قائمة الدوال أعلى المحرر، اختاري الدالة setup ثم اضغطي تشغيل (Run).
 *    - أول مرة سيطلب منك الموافقة على الصلاحيات (اختاري حسابك ثم "متابعة"
 *      ثم "الانتقال إلى ... (غير آمن)" ثم "السماح").
 *    - هذا ينشئ ورقتين تلقائيًا: "البيانات" و"المستخدمون".
 * 5) انشري المشروع كتطبيق ويب:
 *    Deploy → New deployment → اختاري النوع "Web app"
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    ثم اضغطي Deploy، وانسخي الرابط (Web app URL) الذي يظهر.
 * 6) الصقي هذا الرابط في ملف src/App.jsx مكان النص:
 *    PUT_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE
 * 7) في ورقة "المستخدمون"، أضيفي صفوف الحسابات الحقيقية (راجعي الأعمدة
 *    الجاهزة في الصف الأول). عمود "معرف الوحدة" يجب أن يطابق معرف الوحدة
 *    (id) في ورقة "البيانات" ← المفتاح "prs:units" (تقدرين تشوفينه من داخل
 *    النظام نفسه في "إدارة الأقسام والوحدات").
 *
 * ملاحظة أمنية: كلمات السر تُحفظ هنا كنص عادي في الجدول (نفس أسلوب نظام
 * المقاصف)، لذلك حافظي على أن مشاركة الجدول محدودة لمن تثقين بهن فقط.
 */

var DATA_SHEET_NAME = "البيانات";
var USERS_SHEET_NAME = "المستخدمون";

/* ============================= الإعداد الأولي ============================= */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var dataSheet = ss.getSheetByName(DATA_SHEET_NAME);
  if (!dataSheet) dataSheet = ss.insertSheet(DATA_SHEET_NAME);
  if (dataSheet.getLastRow() === 0) {
    dataSheet.appendRow(["المفتاح", "القيمة", "آخر تحديث"]);
    dataSheet.setFrozenRows(1);
  }

  var usersSheet = ss.getSheetByName(USERS_SHEET_NAME);
  if (!usersSheet) usersSheet = ss.insertSheet(USERS_SHEET_NAME);
  if (usersSheet.getLastRow() === 0) {
    usersSheet.appendRow(["اسم المستخدم", "كلمة السر", "الاسم", "الصلاحية", "معرف الوحدة"]);
    usersSheet.setFrozenRows(1);
    // حساب تجريبي جاهز — غيّريه أو احذفيه بعد إضافة الحسابات الحقيقية
    usersSheet.appendRow(["admin", "admin123", "مديرة النظام", "admin", ""]);
  }

  // حذف الورقة الافتراضية الفارغة "Sheet1" إن وُجدت وما زالت فارغة
  var defaultSheet = ss.getSheetByName("Sheet1") || ss.getSheetByName("Sheet 1");
  if (defaultSheet && defaultSheet.getLastRow() === 0 && ss.getSheets().length > 1) {
    ss.deleteSheet(defaultSheet);
  }
}

/* ============================= أدوات مساعدة ============================= */
function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function getDataSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(DATA_SHEET_NAME);
  if (!sheet) {
    setup();
    sheet = ss.getSheetByName(DATA_SHEET_NAME);
  }
  return sheet;
}

function getUsersSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(USERS_SHEET_NAME);
  if (!sheet) {
    setup();
    sheet = ss.getSheetByName(USERS_SHEET_NAME);
  }
  return sheet;
}

// يبحث عن رقم الصف (1-based) لمفتاح معيّن في ورقة "البيانات"، أو -1 إن لم يوجد
function findKeyRow_(sheet, key) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  var keys = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < keys.length; i++) {
    if (String(keys[i][0]) === String(key)) return i + 2;
  }
  return -1;
}

/* ============================= العمليات ============================= */
function handleGet_(key) {
  var sheet = getDataSheet_();
  var row = findKeyRow_(sheet, key);
  if (row === -1) return jsonResponse_({ ok: true, key: key, value: null });
  var value = sheet.getRange(row, 2).getValue();
  return jsonResponse_({ ok: true, key: key, value: String(value) });
}

function handleSet_(key, value) {
  var sheet = getDataSheet_();
  var row = findKeyRow_(sheet, key);
  var now = new Date();
  if (row === -1) {
    sheet.appendRow([key, value, now]);
  } else {
    sheet.getRange(row, 2, 1, 2).setValues([[value, now]]);
  }
  return jsonResponse_({ ok: true, key: key });
}

function handleDelete_(key) {
  var sheet = getDataSheet_();
  var row = findKeyRow_(sheet, key);
  if (row !== -1) sheet.deleteRow(row);
  return jsonResponse_({ ok: true, key: key, deleted: true });
}

function handleLogin_(username, password) {
  if (!username || !password) {
    return jsonResponse_({ ok: false, error: "الرجاء إدخال اسم المستخدم وكلمة السر" });
  }
  var sheet = getUsersSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return jsonResponse_({ ok: false, error: "لا يوجد حسابات بعد" });

  var rows = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var rowUser = String(row[0] || "").trim();
    var rowPass = String(row[1] || "");
    if (rowUser === String(username).trim() && rowPass === String(password)) {
      var user = {
        username: rowUser,
        name: String(row[2] || rowUser),
        role: String(row[3] || "user").trim() || "user",
        unitId: String(row[4] || "").trim(),
      };
      return jsonResponse_({ ok: true, user: user });
    }
  }
  return jsonResponse_({ ok: false, error: "اسم المستخدم أو كلمة السر غير صحيحة" });
}

/* ============================= نقاط الدخول (Web App) ============================= */
function doGet(e) {
  var params = (e && e.parameter) || {};
  var action = params.action || "ping";

  if (action === "get") return handleGet_(params.key);
  if (action === "ping") return jsonResponse_({ ok: true, message: "نظام توثيق الأداء — الخلفية تعمل" });

  return jsonResponse_({ ok: false, error: "إجراء غير معروف: " + action });
}

function doPost(e) {
  var params = {};
  try {
    params = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse_({ ok: false, error: "طلب غير صالح" });
  }

  var action = params.action;
  if (action === "get") return handleGet_(params.key);
  if (action === "set") return handleSet_(params.key, params.value);
  if (action === "delete") return handleDelete_(params.key);
  if (action === "login") return handleLogin_(params.username, params.password);

  return jsonResponse_({ ok: false, error: "إجراء غير معروف: " + action });
}
