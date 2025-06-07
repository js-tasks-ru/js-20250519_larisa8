export default class DoubleSlider {
  subElements = {};

  constructor({
    min = 0,
    max = 100,
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

  handleDragStart = (e) => {
    return false;
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createListeners() {
    this.subElements.inner.ondragstart = this.handleDragStart;

    // this.subElements.thumbLeft.onmousedown = this.onMouseDown;

    document.addEventListener('pointerdown', this.onMouseDown);
  }

  calcRangeValue (value) {
    const unit = Math.floor(this.subElements.inner.offsetWidth / this.max);
    const rangeValue = unit !== 0 ? Math.floor(value / unit) : 0;
    return rangeValue > this.max ? this.max : rangeValue;
  }

  calcPositionInPercents (newPosition) {
    return Math.round(newPosition * 100 / this.subElements.inner.offsetWidth) + '%'; 
  }

  onMouseMove = (e) => {
    console.log('onMouseMove', e.clientX);
    let newLeft = e.clientX - this.shiftX - this.subElements.inner.getBoundingClientRect().left;

    if (newLeft < 0) {
      newLeft = 0;
    }

    let rightEdge = this.subElements.inner.offsetWidth - this.subElements.thumbLeft.offsetWidth;
    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    this.subElements.thumbLeft.style.left = this.calcPositionInPercents(newLeft);
    this.subElements.progress.style.left = this.calcPositionInPercents(newLeft);
   
    this.subElements.from.textContent = newLeft > 0 ? this.formatValue(this.selected.from + this.calcRangeValue(newLeft)) : this.min;
  }

  onMouseDown = (e) => {
   
    const dataElement = e.target.dataset.element;
    
    if (dataElement === 'thumbLeft') { 
      console.log('onMouseDown');
      e.preventDefault();

      this.element.classList.add('range-slider_dragging');
      this.shiftX = e.clientX - this.subElements.thumbLeft.getBoundingClientRect().left;

      document.addEventListener('pointerup', this.onMouseUp);
      document.addEventListener('pointermove', this.onMouseMove);
    }
  }

  onMouseUp = (e) => {
    this.destroyListeners();
    this.element.classList.remove('range-slider_dragging');
  }

  destroyListeners() {
    document.removeEventListener('pointermove', this.onMouseMove);
    document.removeEventListener('pointerup', this.onMouseUp);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
