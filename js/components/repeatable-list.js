// js/components/repeatable-list.js
// محرك عام للأقسام القابلة للتكرار (زر + إضافة): مؤشرات، برامج، أدوات قياس،
// نقاط قوة، صعوبات، فرص تحسين، مبادرات، قصص أثر، توصيات، شواهد...
//
// الاستخدام: كل صفحة تمرر renderItem(item, index) الذي يبني HTML للبطاقة،
// وتربط الحقول عبر data-field="اسم_الحقل" (والمحرك يقرأها تلقائيًا بالتفويض
// event delegation) دون الحاجة لإعادة رسم كامل القائمة عند كل حرف يُكتب.

export class RepeatableList {
  /**
   * @param {Object} opts
   * @param {HTMLElement} opts.container - العنصر الذي تُعرض بداخله البطاقات
   * @param {Function} opts.itemFactory - تُرجع كائن عنصر جديد فارغ
   * @param {Function} opts.renderItem - (item, index) => HTML string للبطاقة
   * @param {Function} [opts.onAfterRender] - (item, index, cardEl) => تُستدعى بعد كل رسم لبطاقة (لربط منطق شرطي إضافي)
   * @param {number} [opts.maxItems]
   * @param {number} [opts.minItems]
   * @param {string} [opts.itemLabel] - اسم العنصر المستخدم في رسائل التنبيه
   */
  constructor(opts) {
    this.container = opts.container;
    this.itemFactory = opts.itemFactory;
    this.renderItem = opts.renderItem;
    this.onAfterRender = opts.onAfterRender || (() => {});
    this.maxItems = opts.maxItems || Infinity;
    this.minItems = opts.minItems || 0;
    this.itemLabel = opts.itemLabel || "عنصر";
    this.items = [];

    // تفويض الأحداث: أي input/select/textarea داخل الحاوية له data-field يُحدّث العنصر مباشرة
    this.container.addEventListener("input", (e) => this._handleFieldEvent(e));
    this.container.addEventListener("change", (e) => this._handleFieldEvent(e));
    this.container.addEventListener("click", (e) => this._handleClick(e));
  }

  setItems(items) {
    this.items = items && items.length ? items : [];
    this.render();
  }

  getItems() {
    return this.items;
  }

  addItem(initial = {}) {
    if (this.items.length >= this.maxItems) {
      alert(`لا يمكن إضافة أكثر من ${this.maxItems} من (${this.itemLabel}).`);
      return;
    }
    this.items.push({ ...this.itemFactory(), ...initial });
    this.render();
  }

  removeItem(index) {
    if (this.items.length <= this.minItems && this.minItems > 0) {
      alert(`يلزم إبقاء ${this.minItems} على الأقل من (${this.itemLabel}).`);
      return;
    }
    this.items.splice(index, 1);
    this.render();
  }

  render() {
    if (this.items.length === 0) {
      this.container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-inbox"></i>
          <p>لا يوجد عناصر بعد. اضغطي على زر الإضافة أدناه.</p>
        </div>`;
      return;
    }
    this.container.innerHTML = this.items
      .map((item, i) => this.renderItem(item, i))
      .join("");

    this.items.forEach((item, i) => {
      const card = this.container.querySelector(`[data-item-index="${i}"]`);
      if (card) this.onAfterRender(item, i, card);
    });
  }

  _handleFieldEvent(e) {
    const field = e.target.getAttribute("data-field");
    if (!field) return;
    const card = e.target.closest("[data-item-index]");
    if (!card) return;
    const index = Number(card.getAttribute("data-item-index"));
    const item = this.items[index];
    if (!item) return;

    if (e.target.type === "checkbox") {
      if (e.target.hasAttribute("data-multi")) {
        const arrField = field;
        if (!Array.isArray(item[arrField])) item[arrField] = [];
        const val = e.target.value;
        if (e.target.checked) {
          if (!item[arrField].includes(val)) item[arrField].push(val);
        } else {
          item[arrField] = item[arrField].filter(v => v !== val);
        }
      } else {
        item[field] = e.target.checked;
      }
    } else {
      item[field] = e.target.value;
    }

    // استدعاء onAfterRender مجددًا للسماح بتحديث حسابات مشتقة (كحالة المؤشر) دون إعادة رسم كاملة
    this.onAfterRender(item, index, this.container.querySelector(`[data-item-index="${index}"]`));
  }

  _handleClick(e) {
    const removeBtn = e.target.closest("[data-action='remove-item']");
    if (removeBtn) {
      const card = removeBtn.closest("[data-item-index]");
      const index = Number(card.getAttribute("data-item-index"));
      this.removeItem(index);
    }
  }
}
