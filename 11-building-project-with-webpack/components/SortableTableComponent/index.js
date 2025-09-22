import fetchJson from '../../utils/fetch-json.js';
import SortableTableV2 from './SortableTableV2.js';

import { BACKEND_URL } from '../../constants/index.js';

export default class SortableTable extends SortableTableV2 {
  isScroll = true;
  isLoading = false;

  constructor(headersConfig, {
    sorted = {
      id: '',
      order: 'asc'
    },
    url = '',
    isSortLocally = false,
    pageParams = {
      start: 0,
      size: 30
    },
    from,
    to
  } = {}) {
    
    super(
      headersConfig, {
        url,
        sorted,
        isSortLocally
      }
    );

    this.url = url;
    this.controller = new AbortController();

    this.initPageParams(pageParams);
    this.init();
  }

  initPageParams({ start, size } = {}) {
    this.start = start;
    this.size = size;
    this.end = start + size;
  }

  async init() {
    if (this.isSortLocally) {
      this.data = await this.loadData();
      this.sort(this.sorted.id, this.sorted.order);
      this.displayPlaceholder();
    } else {
      this.sort(this.sorted.id, this.sorted.order);
    }
  }

  async loadData() {
    let data = [];

    if (!this.url) {
      return data;
    }

    try {
      this.showLoading();
      data = await fetchJson(this.getUrl(), { signal: this.controller.signal });
      this.hideLoading();
      return data;
    } catch (err) {
      console.error(err);
    }

    return data;
  }

  getUrl() {
    const url = new URL(this.url, BACKEND_URL);

    url.searchParams.set('_order', this.sorted.order);
    url.searchParams.set('_sort', this.sorted.fieldName);
    url.searchParams.set('_start', this.start);
    url.searchParams.set('_end', this.end);
    
    return url.href;
  }

  showLoading() {
    this.isLoading = true;
    this.displayPlaceholder();
    this.showSubElement('loading');
  }

  hideLoading() {
    this.isLoading = false;
    this.hideSubElement('loading');
  }

  showSubElement(name) {
    this.subElements[name].style.display = 'block';
  }

  hideSubElement(name) {
    this.subElements[name].style.display = 'none';
  }

  sort(fieldName, sortOrder) {
    if (!fieldName) {
      fieldName = this.config.find(item => item.sortable).id;
    }

    super.sort(fieldName, sortOrder);
    this.isScroll = true;
  }

  async sortOnServer(sortField, sortOrder) {
    let config = this.config.filter((columnConfig) => columnConfig.id === sortField);

    if (!config[0].sortable) {
      return;
    }

    this.sorted = {
      fieldName: sortField,
      order: sortOrder
    };

    await this.renderTable();
  }

  async renderTable() {
    this.data = await this.loadData();
    this.subElements.header.innerHTML = this.createTableHeaderTemplate();
    this.subElements.body.innerHTML = this.createTableBodyTemplate();
    this.displayPlaceholder();
  }

  async render(...args) {
    super.render(...args);
    this.createListeners();
  }

  displayPlaceholder() {
    if (!this.data.length && !this.isLoading) {
      this.showSubElement('emptyPlaceholder');
      this.element.classList.add('sortable-table_empty');
    } else {
      this.hideSubElement('emptyPlaceholder');
      this.element.classList.remove('sortable-table_empty');
    }
  }

  async handleScroll() {
    if (this.isSortLocally || !this.isScroll || this.isLoading) {
      return;
    }

    let { top, bottom } = document.documentElement.getBoundingClientRect();

    if (top === 0) {
      this.resetPageParams();
    }

    if (bottom > document.documentElement.clientHeight + 100) {
      return;
    }
    
    this.start = this.end;
    this.end = this.start + this.size;

    const data = await this.loadData();

    if (data.length) {
      this.data = data;
    }

    this.subElements.body.insertAdjacentHTML("beforeend", this.createTableBodyTemplate());
    
    this.isScroll = data.length > 0;

    if (!this.isScroll) {
      this.resetPageParams();
    }
  }

  resetPageParams() {
    this.start = 0;
    this.end = this.size;
  }

  abortRequest() {
    if (this.isLoading) {
      this.controller.abort();
    }
  }

  createListeners() {
    this.handleScroll = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.handleScroll);
    super.createListeners();
  }

  destroyListeners() {
    this.abortRequest();
    super.destroyListeners();
    window.removeEventListener('scroll', this.handleScroll);
  }
}
