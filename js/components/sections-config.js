// js/components/sections-config.js
// تعريف موحّد لأقسام النموذج الخمسة عشر - تُستخدم في لوحة التحكم والتنقل والتقارير

export const SECTIONS = [
  {
    key: "basic-data",
    title: "البيانات الأساسية",
    desc: "الجهة، الفترة، بيانات معدة التقرير",
    icon: "fa-id-card",
    page: "pages/basic-data.html",
    repeatable: false
  },
  {
    key: "goals",
    title: "الأهداف والمستهدفات",
    desc: "الأهداف الاستراتيجية والتشغيلية ومستوى تحققها",
    icon: "fa-bullseye",
    page: "pages/goals.html",
    repeatable: false
  },
  {
    key: "indicators",
    title: "مؤشرات الأداء",
    desc: "إضافة وتتبع مؤشرات الوحدة وحالتها",
    icon: "fa-chart-line",
    page: "pages/indicators.html",
    repeatable: true
  },
  {
    key: "programs",
    title: "الأعمال والبرامج",
    desc: "البرامج والأنشطة المنفذة ومستوى إنجازها",
    icon: "fa-diagram-project",
    page: "pages/programs.html",
    repeatable: true
  },
  {
    key: "measurement-tools",
    title: "أدوات القياس",
    desc: "الاستبانات والاختبارات وأدوات القياس المستخدمة",
    icon: "fa-ruler-combined",
    page: "pages/measurement-tools.html",
    repeatable: true
  },
  {
    key: "results-analysis",
    title: "تحليل النتائج",
    desc: "أبرز النتائج الإيجابية والمقارنة بالفترة السابقة",
    icon: "fa-magnifying-glass-chart",
    page: "pages/results-analysis.html",
    repeatable: false
  },
  {
    key: "strengths",
    title: "نقاط القوة",
    desc: "حتى خمس نقاط قوة رئيسة مع أدلتها",
    icon: "fa-shield-heart",
    page: "pages/strengths.html",
    repeatable: true,
    maxItems: 5
  },
  {
    key: "difficulties",
    title: "الصعوبات والتحديات",
    desc: "الصعوبات ومستواها ونطاقها والإجراءات المتخذة",
    icon: "fa-triangle-exclamation",
    page: "pages/difficulties.html",
    repeatable: true
  },
  {
    key: "improvement-opportunities",
    title: "فرص التحسين",
    desc: "الفجوات بين الوضع الحالي والمرغوب وخطط سدها",
    icon: "fa-arrow-trend-up",
    page: "pages/improvement-opportunities.html",
    repeatable: true
  },
  {
    key: "initiatives",
    title: "المبادرات والممارسات النوعية",
    desc: "المبادرات الجديدة والممارسات القابلة للتعميم",
    icon: "fa-lightbulb",
    page: "pages/initiatives.html",
    repeatable: true
  },
  {
    key: "impact-stories",
    title: "الأثر وقصص النجاح",
    desc: "قصص الأثر الموثقة قبل وبعد التدخل",
    icon: "fa-star",
    page: "pages/impact-stories.html",
    repeatable: true
  },
  {
    key: "recommendations",
    title: "التوصيات",
    desc: "توصيات مبنية على النتائج مع الأولوية والجهة المسؤولة",
    icon: "fa-list-check",
    page: "pages/recommendations.html",
    repeatable: true
  },
  {
    key: "next-period-plan",
    title: "خطة الفترة القادمة",
    desc: "من ثلاثة إلى خمسة أعمال رئيسة للفترة القادمة",
    icon: "fa-calendar-days",
    page: "pages/next-period-plan.html",
    repeatable: true,
    minItems: 3,
    maxItems: 5
  },
  {
    key: "evidence",
    title: "الشواهد والمرفقات",
    desc: "الملفات والروابط الداعمة مع درجة السرية",
    icon: "fa-paperclip",
    page: "pages/evidence.html",
    repeatable: true
  },
  {
    key: "review-approval",
    title: "المراجعة والاعتماد",
    desc: "قائمة التحقق، حالة الإرسال، ومسار الاعتماد",
    icon: "fa-signature",
    page: "pages/review-approval.html",
    repeatable: false
  }
];
