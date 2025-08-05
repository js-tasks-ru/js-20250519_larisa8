import BaseComponent from "./BaseComponent.js";

export default class CounterComponent extends BaseComponent {

    counter = 0;

    constructor(props) {
      super(props);

      this.counter = props.counter;
    }

    handleButtonIncrementClick = () => {
      this.counter += 1;
      this.subElements.input.value = this.counter;
    }

    handleButtonDecrementClick = () => {
      this.counter -= 1;
      this.subElements.input.value = this.counter;
    }

    createEventListeners() {
      this.subElements.increment.addEventListener('click', this.handleButtonIncrementClick);
      this.subElements.decrement.addEventListener('click', this.handleButtonDecrementClick);
    }

    destroyEventListeners() {
      this.subElements.increment.removeEventListener('click', this.handleButtonIncrementClick);
      this.subElements.decrement.removeEventListener('click', this.handleButtonDecrementClick);
    }

    createTemplate() {
      return `
            <div>
                <button data-element="decrement">-</button>
                <input data-element="input" type="text" value="${this.counter}" />
                <button data-element="increment">+</button>
            </div>
        `;
    }

    render(...args) {
      super.render(...args);
      this.createEventListeners();
    }

    destroy() {
      super.destroy();
      this.destroyEventListeners();
    }
}