// js/ai-config.js
// مفتاح Anthropic API المستخدم في صفحة "التحليل الذكي" (pages/ai-analysis.html)
//
// للحصول على مفتاح: افتحي https://console.anthropic.com ← API Keys ← Create Key
//
// ⚠️ تنبيه أمني: وضع المفتاح هنا يجعله ظاهرًا لأي شخص يفتح الموقع (كود الواجهة الأمامية).
// هذا مقبول لأداة داخلية محدودة الاستخدام بين موظفات الجمعية، لكن للاستخدام الأوسع
// يُفضّل مستقبلًا نقل هذا الاستدعاء إلى خادم وسيط (Cloud Function) بدل الاتصال المباشر من المتصفح.

export const ANTHROPIC_API_KEY = "PASTE_YOUR_ANTHROPIC_API_KEY_HERE";
