export default class SortableList {
  constructor({ items }) {
    this.items = items;
    this.element = this.createList();
    this.dragElement = null;
    this.currentDroppable = null;
    this.isDragging = false;
    this.createListeners();
  }

  createListeners() {
    document.addEventListener('pointerdown', this.handlePointerDown, true);
  }

  deleteItem = (element) => {
    const itemElement = element.closest('.sortable-list__item');
    const listElement = document.querySelector('.sortable-list');
    itemElement.remove();
    this.items = listElement.children;
  }

  handlePointerDown = (event) => {
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
    
    const listElement = document.querySelector('.sortable-list');
    listElement.append(this.dragElement);

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

    const listElement = document.querySelector('.sortable-list');
    this.items = listElement.children;

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

  destroyListeners() {
    document.removeEventListener('pointerdown', this.handlePointerDown, true);
  }

  destroy() {
    this.destroyListeners();
    this.remove();
  }

  remove() {
    this.element.remove();
  }
}