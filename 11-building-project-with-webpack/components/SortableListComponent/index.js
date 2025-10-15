import BaseComponent from "../BaseComponent.js";

export default class SortableList extends BaseComponent {
  constructor(props) {
    super(props);
    this.id = props.id;
    this.items = props.items;
    this.element = this.createList();
    this.dragElement = null;
    this.currentDroppable = null;
    this.isDragging = false;
    this.createListeners();
  }

  createListeners() {
    document.addEventListener('pointerdown', this.handlePointerDown, { 
      bubbles: true,
      which: 1
    });
  }

  deleteItem = (element) => {
    const itemElement = element.closest('.sortable-list__item');

    itemElement.remove();
    this.items = this.element.children;
  }

  handlePointerDown = (event) => {
    if (!this.element.contains(event.target.closest('.sortable-list__item'))) {
      return;
    }

    if (event.target.dataset.deleteHandle === '') {
      this.deleteItem(event.target);
    }

    if (event.target.dataset.grabHandle !== '') {
      return;
    }

    let dragElement = event.target.closest('.sortable-list__item');
    
    if (!dragElement) {
      return;
    }

    event.preventDefault();

    dragElement.ondragstart = function() {
      return false;
    };
    
    this.dragElement = dragElement.cloneNode(true);
    
    this.startDrag(dragElement, event.clientX, event.clientY);

    const placeholder = this.createPlaceHolder({ width: dragElement.offsetWidth, height: dragElement.offsetHeight });
    dragElement.replaceWith(placeholder);
  }

  startDrag(element, clientX, clientY) {
    if (this.isDragging) {
      return;
    }

    this.isDragging = true;

    document.addEventListener('pointermove', this.handlePointerMove);
    this.dragElement.addEventListener('pointerup', this.handlePointerUp);

    this.shiftX = clientX - element.getBoundingClientRect().left;
    this.shiftY = clientY - element.getBoundingClientRect().top;

    this.dragElement.style.width = element.offsetWidth + 'px';
    this.dragElement.style.height = element.offsetHeight + 'px';
    this.dragElement.classList.add('sortable-list__item_dragging');
    
    this.element.append(this.dragElement);

    this.moveAt(clientX, clientY);
  }

  handlePointerMove = (event) => {
    this.moveAt(event.clientX, event.clientY);

    this.dragElement.style.display = 'none';
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    this.dragElement.style.display = '';

    if (!elemBelow) {
      return;
    }
  
    let droppableBelow = elemBelow.closest('.sortable-list__item');

    if (!this.element.contains(droppableBelow)) {
      return;
    }

    if (this.currentDroppable == droppableBelow) {
      return;
    }

    this.currentDroppable = droppableBelow;

    if (this.currentDroppable) {
      this.enterDroppable();
    }
  }

  replacePlaceHolder(node) {
    const placeholder = document.querySelector('.sortable-list__placeholder');
    placeholder.replaceWith(node);
  }

  enterDroppable() {
    const cloneNode = this.currentDroppable.cloneNode(true);
    this.replacePlaceHolder(cloneNode);

    const placeholder = this.createPlaceHolder({ width: this.currentDroppable.offsetWidth, height: this.currentDroppable.offsetHeight });
    this.currentDroppable.replaceWith(placeholder);
  }

  moveAt(clientX, clientY) {
    this.dragElement.style.left = clientX - this.shiftX + 'px';
    this.dragElement.style.top = clientY - this.shiftY + 'px';
  }

  handlePointerUp = () => {
    this.finishDrag();
  }

  finishDrag() {
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;

    this.dragElement.classList.remove('sortable-list__item_dragging');
    this.dragElement.style = null;

    this.replacePlaceHolder(this.dragElement);

    this.items = this.element.children;

    this.dispatchEvent();

    document.removeEventListener('pointermove', this.handlePointerMove);
    this.dragElement.removeEventListener('pointerup', this.handlePointerUp);
  }

  createList() {
    const list = document.createElement('ul');
    list.classList.add('sortable-list');

    this.items.map((item) => {
      item.classList.add('sortable-list__item');

      list.append(item);
    });
    
    return list;
  }

  createPlaceHolder({ width, height }) {
    const element = document.createElement('div');
    element.classList.add('sortable-list__placeholder');
    element.style.width = width + 'px';
    element.style.height = height + 'px';
    return element;
  }

  dispatchEvent() {
    document.dispatchEvent(new CustomEvent('change-order', {
      bubbles: true,
      detail: {
        id: this.id,
        items: this.items,
        element: this.dragElement
      }
    }));
  }

  destroyListeners() {
    document.removeEventListener('pointerdown', this.handlePointerDown, { 
      bubbles: true,
      which: 1
    });
  }

  destroy() {
    super.destroy();
    this.remove();
    this.destroyListeners();
  }

  remove() {
    this.element.remove();
  }
}