import BasePage from "./BasePage.js";
import SortableTableComponent from "../components/SortableTableComponent/index.js";
import DoubleSliderComponent from "../components/DoubleSliderComponent/index.js";

import header from '../constants/products-header.js';
import { BACKEND_URL } from '../constants/index.js';
export default class ProductsPage extends BasePage {
  constructor(props) {
    super(props);
    
    this.createComponents();
    this.componentMap = {
      sortableTable: this.sortableTable,
      doubleSlider: this.doubleSlider
    };

    document.addEventListener('range-select', this.updateTable, true);
  }

  updateTable = () => {
    const url = new URL(this.sortableTable.url, BACKEND_URL);
    const { filterName, filterStatus } = this.componentElements;

    if (filterName.value) {
      url.searchParams.set('title_like', filterName.value); 
    }
    
    url.searchParams.set('price_gte', this.doubleSlider.selected.from);
    url.searchParams.set('price_lte', this.doubleSlider.selected.to);
    
    if (filterStatus.value) {
      url.searchParams.set('status', filterStatus.value);
    }

    this.sortableTable.url = url;
    this.sortableTable.renderTable();
  }

  createComponents() {
    this.createSortableTable();
    this.createDoubleSlider();
  }
    
  createSortableTable() {
    this.sortableTable = new SortableTableComponent(header, {
      url: 'api/rest/products?_embed=subcategory.category',
      data: [],
      isSortLocally: false,
      sorted: {
        id: header.find(item => item.sortable).id,
        order: 'asc'
      }
    });
  }

  createDoubleSlider() {
    this.doubleSlider = new DoubleSliderComponent({
      min: 0,
      max: 4000,
      formatValue: value => `$${value}`
    });
  }

  createTemplate() {
    return (`
        <div class="products-list">
          <div class="content__top-panel">
            <h1 class="page-title">Товары</h1>
            <a href="/products/add" class="button-primary">Добавить товар</a>
          </div>
          <div class="content-box content-box_small">
            <form class="form-inline">
              <div class="form-group">
                <label class="form-label">Сортировать по:</label>
                <input type="text" data-component="filterName" class="form-control" placeholder="Название товара">
              </div>
              <div data-component="doubleSlider" class="form-group">
                <label class="form-label">Цена:</label>
              </div>
              <div class="form-group">
                <label class="form-label">Статус:</label>
                <select class="form-control" data-component="filterStatus">
                  <option value="" selected="">Любой</option>
                  <option value="1">Активный</option>
                  <option value="0">Неактивный</option>
                </select>
              </div>
            </form>
          </div>
          <div data-component="sortableTable" class="products-list__container"></div>
        </div>
      `);
  }
}