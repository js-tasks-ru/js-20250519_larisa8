import BaseComponent from "../BaseComponent.js";

export default class InputComponent extends BaseComponent {
  constructor(props) {
    super(props);
    this.label = props.label;
    this.placeholder = props.placeholder;
    this.elementName = props.elementName;
    this.id = props.id;
    this.options = props.options;
  }
  createTemplate() {
    return (
      `
      <div class="form-group">
        <label class="form-label">${this.label}</label>
        <select id="${this.id}" class="form-control" data-element="${this.elementName}">
          ${this.createOptionsTemplate()}
        </select>
      </div>
      `
    );
  }

  createOptionsTemplate() {
    return this.options
    .map(({ title, value }) => `<option value="${value}" selected="">${title}</option>`)
    .join('');
  }

  async render(...args) {
    super.render(...args);
    this.createListeners();
  }

  handleChange = (e) => {
    const event = new CustomEvent(`${this.elementName}-change`, {
      detail: {
        value: e.target.value
      }
    });
    this.element.dispatchEvent(event);
  }
  
  createListeners() {
    this.subElements[this.elementName].addEventListener("change", this.handleChange, true);
  }

  destroyListeners() {
    this.subElements[this.elementName].removeEventListener("change", this.handleChange, true);
  }

  destroy() {
    super.destroy();
    super.remove();
    this.destroyListeners();
  }
}