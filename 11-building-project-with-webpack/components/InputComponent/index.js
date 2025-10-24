import BaseComponent from "../BaseComponent.js";

export default class InputComponent extends BaseComponent {
  constructor(props) {
    super(props);
    this.label = props.label;
    this.placeholder = props.placeholder;
    this.elementName = props.elementName;
    this.id = props.id;
  }
  createTemplate() {
    return (
      `
      <div class="form-group">
        <label class="form-label">${this.label}</label>
        <input type="text" id="${this.id}" data-element="${this.elementName}" class="form-control" placeholder="${this.placeholder}">
      </div>
      `
    );
  }

  async render(...args) {
    super.render(...args);
    this.createListeners();
  }

  handleInput = (e) => {
    const event = new CustomEvent(`${this.elementName}-input`, {
      detail: {
        value: e.target.value
      }
    });
    this.element.dispatchEvent(event);
  }
  
  createListeners() {
    this.subElements[this.elementName].addEventListener("input", this.handleInput, true);
  }

  destroyListeners() {
    this.subElements[this.elementName].removeEventListener("input", this.handleInput, true);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    super.destroy();
    this.remove();
    this.destroyListeners();
  }
}