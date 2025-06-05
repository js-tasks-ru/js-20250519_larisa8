export default class SortableTable {
  subElements = {};

  constructor(config = [], data = []) {
    this.config = config;
    this.data = data;
    this.sorted = {
      fieldName: '',
      order: ''
    };
    this.element = this.createElement(this.template());
    this.selectSubElements();
  }

  createElement(template) {
    const element = document.createElement('div');

    element.innerHTML = template;
    
    return element.firstElementChild;
  }

  sort(fieldName, order) {
    let config = this.config.filter((columnConfig) => columnConfig.id === fieldName);

    if (!config.length) {
      return;
    }

    const { sortable, sortType } = config[0];

    if (!sortable) {
      return;
    }

    this.sorted = {
      fieldName,
      order
    };

    this.sortByType(sortType);

    this.subElements['header'].innerHTML = this.createTableHeaderTemplate();
    this.subElements['body'].innerHTML = this.createTableBodyTemplate();
  }

  sortByType(type) {
    const { fieldName, order } = this.sorted;
    const direction = (order === 'desc') ? -1 : 1;

    switch (type) {
    case 'string': {
      this.sortStrings(fieldName, direction);
      break;
    }
    case 'number': {
      this.sortNumbers(fieldName, direction);
      break;
    }
    default: return;
    }
  }

  sortNumbers(fieldName, direction) {
    this.data.sort((item1, item2) => direction * (item1[fieldName] - item2[fieldName]));
  }

  sortStrings(fieldName, direction) {
    const locales = ['ru', 'en'];
    const options = { caseFirst: 'upper' };
    this.data.sort((item1, item2) => direction * item1[fieldName].localeCompare(item2[fieldName], locales, options));
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  getSortOrder(field) {
    return field === this.sorted.fieldName ? this.sorted.order : '';
  }

  createTableHeaderTemplate() {
    return this.config.map(columnConfig => (
      `<div class="sortable-table__cell" data-id="${columnConfig['id']}" data-order="${this.getSortOrder(columnConfig['id'])}" data-sortable="${columnConfig['sortable']}">
          <span>${columnConfig['title']}</span>
          <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>
      </div>`
    )).join('');
  }

  createTableBodyCellTemplate(product, columnConfig) {
    const fieldId = columnConfig['id'];
    const fieldData = product[fieldId];

    if (columnConfig.template) {
      return columnConfig.template(fieldData);
    }

    return `<div class="sortable-table__cell">${fieldData}</div>`;
  }

  createTableBodyRowTemplate(product) {
    return `
        <a href="/products/${product.id}" class="sortable-table__row">
            ${this.config.map(columnConfig => this.createTableBodyCellTemplate(product, columnConfig)).join('')}
        </a>
    `;
  }
  
  createTableBodyTemplate() {
    return this.data.map(product => (
      this.createTableBodyRowTemplate(product)
    )).join('');
  }

  template() {
    return `
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.createTableHeaderTemplate()}
            </div>
            <div data-element="body" class="sortable-table__body">
                ${this.createTableBodyTemplate()}
            </div>
            <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
            <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                <div>
                    <p>No products satisfies your filter criteria</p>
                    <button type="button" class="button-primary-outline">Reset all filters</button>
                </div>
            </div>
        </div>
    `;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

