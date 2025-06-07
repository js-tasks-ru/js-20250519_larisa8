class Tooltip {
  static #instance;

  constructor () {
    if (Tooltip.#instance) {
      return Tooltip.#instance;
    }
    Tooltip.#instance = this;
  }

  initialize () {
    this.element = this.createElement(this.createTemplate());
    this.createListeners();
  }

  render(text) {
    this.element.textContent = text;
    this.element.style.top = this.top;
    this.element.style.left = this.left;
    document.body.append(this.element);
  }


  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    return `
      <div class="tooltip"></div>
    `;
  }

  showTooltip = (e) => {
    const tooltip = e.target.dataset.tooltip;
    
    if (tooltip) {  
      this.top = `calc(${e.y}px + 7px)`;
      this.left = `calc(${e.x}px + 10px)`;
      this.render(tooltip); 
    }
  }

  hideTooltip = (e) => {
    const tooltip = e.target.dataset.tooltip;

    if (tooltip) {  
      this.remove();
    }
  }

  createListeners() {
    document.addEventListener('pointermove', this.showTooltip);
    document.addEventListener('pointerover', this.showTooltip);
    document.addEventListener('pointerout', this.hideTooltip);
  }

  destroyListeners() {
    document.removeEventListener('pointermove', this.showTooltip);
    document.removeEventListener('pointerover', this.showTooltip);
    document.removeEventListener('pointerout', this.hideTooltip);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.destroyListeners();
  }
}

export default Tooltip;
