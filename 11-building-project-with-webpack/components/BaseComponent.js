export default class BaseComponent {

    element;
    subElements = {};
    props = {};

    constructor(props) {
      this.props = props;
    }

    selectSubElements() {
      console.log('selectSubEle');
      const elements = this.element.querySelectorAll('[data-element]');

      for (const element of elements) {
        const name = element.getAttribute('data-element');
        this.subElements[name] = element;
      }
    }

    createElement(template) {
      const element = document.createElement('div');

      element.innerHTML = template;

      return element.firstElementChild;
    }

    createTemplate() {
      return `<div></div>`;
    }

    async render(container, routeParams) {
      console.log(container, routeParams);
      this.routeParams = routeParams;
      this.element = this.createElement(this.createTemplate());
      this.selectSubElements();

      container.appendChild(this.element);
    }

    destroy() {
      this.element.remove();
    }
}
