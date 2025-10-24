import BasePage from "./BasePage.js";
import SortableTableComponent from "../components/SortableTableComponent/index.js";
import DoubleSliderComponent from "../components/DoubleSliderComponent/index.js";
import InputComponent from "../components/InputComponent/index.js";
import SelectComponent from "../components/SelectComponent/index.js";

import header from '../constants/products-header.js';
import { BACKEND_URL } from '../constants/index.js';
export default class ProductsPage extends BasePage {
  constructor(props) {
    super(props);
    
    this.productNameElement = 'productName';
    this.productNameId = 'productName';
    this.statusElement = 'status';
    this.statusId = 'status';

    this.sortableTableUrl = new URL('api/rest/products?_embed=subcategory.category', BACKEND_URL);

    this.createComponents();

    this.componentMap = {
      sortableTable: this.sortableTable,
      doubleSlider: this.doubleSlider,
      productNameInput: this.productNameInput,
      filterStatus: this.statusSelect
    };

    document.addEventListener('range-select', this.updateTableWithRange, true);
    document.addEventListener(`${this.productNameElement}-input`, this.updateTableWithTitle, true);
    document.addEventListener(`${this.statusElement}-change`, this.updateTableWithStatus, true);
  }

  updateTableWithTitle = ({ detail }) => {
    this.sortableTableUrl.searchParams.set('title_like', detail.value); 
    this.sortableTable.url = this.sortableTableUrl;
    this.sortableTable.renderTable();
  }

  updateTableWithStatus = ({ detail }) => {
    if (detail.value === '') {
      this.sortableTableUrl.searchParams.delete('status'); 
    } else {
      this.sortableTableUrl.searchParams.set('status', detail.value); 
    }
   
    this.sortableTable.url = this.sortableTableUrl;
    this.sortableTable.renderTable();
  }

  updateTableWithRange = () => {
    this.sortableTableUrl.searchParams.set('price_gte', this.doubleSlider.selected.from);
    this.sortableTableUrl.searchParams.set('price_lte', this.doubleSlider.selected.to);
    this.sortableTable.url = this.sortableTableUrl;
    this.sortableTable.renderTable();
  }

  createComponents() {
    this.createSortableTable();
    this.createDoubleSlider();
    this.createProductNameInput();
    this.createStatusSelect();
  }

  createProductNameInput() {
    this.productNameInput = new InputComponent({
      label: 'Сортировать по:',
      placeholder: 'Название товара',
      id: this.productNameId,
      elementName: this.productNameElement
    });
  }

  createStatusSelect() {
    this.statusSelect = new SelectComponent({
      label: 'Статус:',
      id: this.statusId,
      elementName: this.statusElement,
      options: [
        { value: '1', title: 'Активный'},
        { value: '0', title: 'Неактивный'},
        { value: '', title: 'Любой'},
      ]
    });
  }
    
  createSortableTable() {
    this.sortableTable = new SortableTableComponent(header, {
      url: this.sortableTableUrl,
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
            <form data-component="productForm" class="form-inline">
              <div data-component="productNameInput"></div>
              <div data-component="doubleSlider" class="form-group">
                <label class="form-label">Цена:</label>
              </div>
              <div data-component="filterStatus"></div>
            </form>
          </div>
          <div data-component="sortableTable" class="products-list__container"></div>
        </div>
      `);
  }
}