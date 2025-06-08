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
    const position = this.isThumbRightDown ? 'right' : 'left';
    
    let newLeft = Math.abs(e.clientX - this.shiftX - this.subElements.inner.getBoundingClientRect()[position]);
    
    if (newLeft < 0) {
      newLeft = 0;
    }
    console.log('onMouseMove', newLeft);
    
    const thumbName = this.isThumbRightDown ? 'thumbRight' : 'thumbLeft';
    let rightEdge = this.subElements.inner.offsetWidth - this.subElements[thumbName].offsetWidth;

    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }

    this.subElements[thumbName].style[position] = this.calcPositionInPercents(newLeft);
    this.subElements.progress.style[position] = this.calcPositionInPercents(newLeft);
   
    const textElement = this.isThumbRightDown ? 'to' : 'from';
    const lastRange = this.isThumbRightDown ? this.max : this.min;

    this.subElements[textElement].textContent = newLeft > 0 ? this.formatValue(Math.abs(this.selected[textElement] - this.calcRangeValue(newLeft))) : lastRange;
  }

  onMouseDown = (e) => {
    const dataElement = e.target.dataset.element;

    if (dataElement !== 'thumbRight' && dataElement !== 'thumbLeft') {
      return;
    }
    
    e.preventDefault();

    this.element.classList.add('range-slider_dragging');

    this.isThumbRightDown = dataElement === 'thumbRight';
    const thumbCoordinate = this.isThumbRightDown ? this.subElements.thumbRight.getBoundingClientRect().right : this.subElements.thumbLeft.getBoundingClientRect().left;
    this.shiftX = Math.abs(e.clientX - thumbCoordinate);

    document.addEventListener('pointerup', this.onMouseUp);
    document.addEventListener('pointermove', this.onMouseMove);
  }

  onMouseUp = () => {
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
