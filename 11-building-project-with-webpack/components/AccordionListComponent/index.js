import BaseComponent from "../BaseComponent.js";
import AccordionComponent from "../AccordionComponent";

export default class AccordionListComponent extends BaseComponent {
  constructor(props) {
    super(props);
    this.items = props.items;
  }

  createTemplate() {
    return (
      `
      <div>
        <div data-element="list">
          ${this.createListTemplate()}
        </div>
      </div>
      `
    );
  }

  getItemsProps() {
    return this.items.map(item => {
      return {
        title: item.title,
        items: item.subcategories
      };
    });
  }

  createListTemplate() {
    return this.getItemsProps()
    .map(({ title, items }) => {
      const accordionComponent = new AccordionComponent({
        title,
        items
      });

      accordionComponent.render(this.subElements.list);
      return accordionComponent.element.outerHTML;
    })
    .join('');
  }

  update() {
    this.subElements.list.innerHTML = this.createListTemplate();
  }

  async render(...args) {
    super.render(...args);
    this.createListeners();
  }

  createListeners() {
    this.subElements.list.addEventListener("pointerdown", this.handlePointerDown);
  }

  destroyListeners() {
    this.subElements.list.removeEventListener("pointerdown", this.handlePointerDown);
  }

  handlePointerDown = (event) => {
    const header = event.target.closest('.category__header');
    
    if (!header) {
      return;
    }

    header.parentNode.classList.toggle('category_open');
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