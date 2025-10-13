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
        <div data-element="list"></div>
      </div>
      `
    );
  }

  appendListItems() {
    return this.items.map(item => {
      const accordionComponent = new AccordionComponent({
        id: item.id,
        title: item.title,
        items: item.subcategories,
        isOpened: true
      });

      accordionComponent.render(this.subElements.list);
      this.subElements.list.append(accordionComponent.element);
    });
  }

  update() {
    this.appendListItems();
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