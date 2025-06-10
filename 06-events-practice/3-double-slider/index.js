export default class DoubleSlider {
  subElements = {};

  constructor({
    min = 130,
    max = 150,
    selected: {
      from = min, 
      to = max 
    } = {}, 
    formatValue = value => value
  } = {}) {
    this.min = min;
    this.max = max;
    this.selected = { from, to };
    this.formatValue = formatValue;
    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();
    this.createListeners();
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  getLeftPercent() {
    const total = this.max - this.min;
    const value = this.selected.from - this.min;

    return Math.round((value / total) * 100) + '%';
  }

  getRightPercent() {
    const total = this.max - this.min;
    const value = this.max - this.selected.to;

    return Math.round((value / total) * 100) + '%';
  }

  createTemplate() {
    const leftPercent = this.getLeftPercent();
    const rightPercent = this.getRightPercent();

    return `
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.selected.from)}</span>
        <div data-element="inner" class="range-slider__inner">
          <span data-element="progress" class="range-slider__progress" style="left: ${leftPercent}; right: ${rightPercent};"></span>
          <span data-element="thumbLeft" class="range-slider__thumb-left" style="left: ${leftPercent};"></span>
          <span data-element="thumbRight" class="range-slider__thumb-right" style="right: ${rightPercent};"></span>
        </div>
        <span data-element="to">${this.formatValue(this.selected.to)}</span>
      </div>
    `;
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createListeners() {
    this.subElements.thumbLeft.addEventListener('pointerdown', this.onPointerDown);
    this.subElements.thumbRight.addEventListener('pointerdown', this.onPointerDown);
  }

  calcRangeValue (value) {
    if (!value) {
      return 0;
    }

    return Math.round(value * (this.max - this.min) / this.subElements.inner.offsetWidth);
  }

  onThumbRightPointerMove = (e) => {
    let newRight = this.subElements.inner.getBoundingClientRect().right - e.clientX - this.shiftX;

    if (newRight < 0) {
      newRight = 0;
    }

    let leftEdge = this.subElements.inner.offsetWidth - this.subElements.thumbLeft.offsetLeft;

    if (newRight > leftEdge) {
      newRight = leftEdge; 
    }

    const currentRangeValue = this.max - this.calcRangeValue(newRight);
    this.selected.to = currentRangeValue;
    this.subElements.to.textContent = this.formatValue(currentRangeValue);

    const rightPercent = this.getRightPercent();
    this.subElements.thumbRight.style.right = rightPercent;
    this.subElements.progress.style.right = rightPercent;
  }

  onThumbLeftPointerMove = (e) => {
    let newLeft = e.clientX - this.shiftX - this.subElements.inner.getBoundingClientRect().left;

    if (newLeft < 0) {
      newLeft = 0;
    }

    let rightEdge = this.subElements.thumbRight.offsetLeft;

    if (newLeft > rightEdge) {
      newLeft = rightEdge; 
    }

    const currentRangeValue = this.min + this.calcRangeValue(newLeft);
    this.selected.from = currentRangeValue;
    this.subElements.from.textContent = this.formatValue(currentRangeValue);

    const leftPercent = this.getLeftPercent();
    this.subElements.thumbLeft.style.left = leftPercent;
    this.subElements.progress.style.left = leftPercent;
  }

  onPointerMove = (e) => {
    if (this.isThumbRightDown) {
      this.onThumbRightPointerMove(e);
    } else {
      this.onThumbLeftPointerMove(e);
    }
  }

  onPointerDown = (e) => {
    this.element.classList.add('range-slider_dragging');

    this.isThumbRightDown = e.target.dataset.element === 'thumbRight';

    const thumbCoordinate = this.isThumbRightDown ? this.subElements.thumbRight.getBoundingClientRect().right : this.subElements.thumbLeft.getBoundingClientRect().left;
    this.shiftX = Math.abs(e.clientX - thumbCoordinate);

    document.addEventListener('pointerup', this.onPointerUp);
    document.addEventListener('pointermove', this.onPointerMove);
  }

  onPointerUp = () => {    
    const event = new CustomEvent("range-select", { 
      detail: {
        from: this.selected.from,
        to: this.selected.to
      }
    });

    this.element.dispatchEvent(event);
    
    this.element.classList.remove('range-slider_dragging');  

    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }

  destroyListeners() {
    this.subElements.thumbLeft.removeEventListener('pointerdown', this.onPointerDown);
    this.subElements.thumbRight.removeEventListener('pointerdown', this.onPointerDown);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}
