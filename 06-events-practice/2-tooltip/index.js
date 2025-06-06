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

  handlePointerOver = (e) => {
    const tooltip = e.target.dataset.tooltip;
    
    if (tooltip) {  
      this.top = `calc(${e.y}px + 7px)`;
      this.left = `calc(${e.x}px + 10px)`;
      this.render(tooltip); 
    }
  } 

  handlePointerOut = () => {
    this.remove();
  } 

  createListeners() {
    document.addEventListener('pointerover', this.handlePointerOver, true);
    document.addEventListener('pointerout', this.handlePointerOut);
  }

  destroyListeners() {
    document.removeEventListener('pointerover', this.handlePointerOver);
    document.removeEventListener('pointerout', this.handlePointerOut);
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
