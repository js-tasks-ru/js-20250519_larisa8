import BaseComponent from "../BaseComponent.js";
import SortableListComponent from "../SortableListComponent";

export default class AccordionComponent extends BaseComponent {
  constructor(props) {
    super(props);
    this.id = props.id;
    this.title = props.title;
    this.items = props.items;
    this.isOpened = props.isOpened;
  }

  createTemplate() {
    return (
      `
      <div>
        <div class="${this.createAccordionClasses()}" data-element="categoryContainer" data-id="${this.id}">
          <div class="category__header">${this.title}</div>
          <div class="category__body">
            <div class="subcategory-list" data-element="subcategoryList">
            </div>
          </div>
        </div>
      </div>
      `
    );
  }

  createAccordionClasses () {
    return this.isOpened ? 'category category_open' : 'category';
  }

  addSubcategoryList() {
    const sortableListComponent = new SortableListComponent({
      items: this.items.map(({ id, title, count }) => {
        const element = document.createElement('li');
        element.classList.add('categories__sortable-list-item');
        element.setAttribute('data-grab-handle', '');
        element.setAttribute('data-id', id);

        element.innerHTML = `
          <strong>${title}</strong>
          <span>
            <b>${count} products</b>
          </span>
        `;

        return element;
      })
    });

    this.subElements.subcategoryList.append(sortableListComponent.element);
  }

  async render(...args) {
    super.render(...args);
    this.addSubcategoryList();
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