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

  createTemplate() {
    return `
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.selected.from)}</span>
        <div data-element="inner" class="range-slider__inner">
          <span data-element="progress" class="range-slider__progress"></span>
          <span data-element="thumbLeft" class="range-slider__thumb-left"></span>
          <span data-element="thumbRight" class="range-slider__thumb-right"></span>
        </div>
        <span data-element="to">${this.formatValue(this.selected.to)}</span>
      </div>
    `;
  }

  handleDragStart = () => {
    return false;
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createListeners() {
    this.subElements.inner.ondragstart = this.handleDragStart;
    document.addEventListener('pointerdown', this.onPointerDown);
  }

  calcRangeValue (value) {
    if (!value) {
      return 0;
    }

    return Math.round(value * (this.max - this.min) / this.subElements.inner.offsetWidth);
  }

  calcPositionInPercents (newPosition) {
    return Math.round(newPosition * 100 / this.subElements.inner.offsetWidth) + '%'; 
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

    const positionInPercents = this.calcPositionInPercents(newRight);
    this.subElements.thumbRight.style.right = positionInPercents;
    this.subElements.progress.style.right = positionInPercents;

    const currentRangeValue = this.max - this.calcRangeValue(newRight);
    this.selected.to = currentRangeValue;
    this.subElements.to.textContent = this.formatValue(currentRangeValue);
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

    const positionInPercents = this.calcPositionInPercents(newLeft);
    this.subElements.thumbLeft.style.left = positionInPercents;
    this.subElements.progress.style.left = positionInPercents;

    const currentRangeValue = this.min + this.calcRangeValue(newLeft);
    this.selected.from = currentRangeValue;
    this.subElements.from.textContent = this.formatValue(currentRangeValue);
  }

  onPointerMove = (e) => {
    if (this.isThumbRightDown) {
      this.onThumbRightPointerMove(e);
    } else {
      this.onThumbLeftPointerMove(e);
    }
  }

  onPointerDown = (e) => {
    const dataElement = e.target.dataset.element;

    if (dataElement !== 'thumbRight' && dataElement !== 'thumbLeft') {
      return;
    }
    
    e.preventDefault();

    this.element.classList.add('range-slider_dragging');

    this.isThumbRightDown = dataElement === 'thumbRight';
    const thumbCoordinate = this.isThumbRightDown ? this.subElements.thumbRight.getBoundingClientRect().right : this.subElements.thumbLeft.getBoundingClientRect().left;
    this.shiftX = Math.abs(e.clientX - thumbCoordinate);

    document.addEventListener('pointerup', this.onPointerUp);
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('range-select', this.onRangeSelect);
  }

  onRangeSelect = (e) => {
    // TODO
  }

  onPointerUp = () => {    
    let event = new CustomEvent("range-select", { 
      bubbles: true,
      detail: {
        from: this.selected.from,
        to: this.selected.to
      }
    });
    this.element.dispatchEvent(event);
    
    this.element.classList.remove('range-slider_dragging');
    this.destroyListeners();
  }

  destroyListeners() {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
