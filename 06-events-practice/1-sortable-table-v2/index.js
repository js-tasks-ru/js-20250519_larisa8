import SortableTableV1 from '../../05-dom-document-loading/2-sortable-table-v1/index.js';
export default class SortableTable extends SortableTableV1 {

  constructor(config = [], { 
    data = [], 
    sorted: { 
      id = '', 
      order = '' 
    }, 
    isSortLocally = true 
  } = {}) {
    super(config, data);
    this.sorted = {
      fieldName: id,
      order
    };
    this.isSortLocally = isSortLocally;
    this.createListeners();
    this.sort(id, order);
  }

  handleHeaderCellClick = (e) => {
    const cellElement = e.target.closest('.sortable-table__cell');

    if (!cellElement) {
      return;
    }

    const sortField = cellElement.dataset.id;
    let sortOrder = cellElement.dataset.order === 'desc' ? 'asc' : 'desc';

    this.sort(sortField, sortOrder);
  }

  sortOnClient(sortField, sortOrder) {
    super.sort(sortField, sortOrder);
  }

  sort(sortField, sortOrder) {
    if (this.isSortLocally) { 
      this.sortOnClient(sortField, sortOrder);
    } else {
      this.sortOnServer();
    }
  }

  sortOnServer() {
    // TODO
    return;
  }

  createListeners() {
    this.subElements.header.addEventListener('click', this.handleHeaderCellClick);
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroyListeners() {
    this.subElements.header.removeEventListener('click', this.handleHeaderCellClick);
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderCellClick);
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
  }
}