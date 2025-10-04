
import BasePage from "./BasePage.js";
import RangePickerComponent from "../components/RangePickerComponent/index.js";
import SortableTableComponent from "../components/SortableTableComponent/index.js";
import header from '../constants/orders-headers.js';
import { BACKEND_URL } from '../constants/index.js';

export default class SalesPage extends BasePage {
  constructor(props) {
    super(props);
    
    const now = new Date();
    this.to = new Date();
    this.from = new Date(now.setMonth(now.getMonth() - 1));
        
    this.createComponents();
    
    this.componentMap = {
      rangePicker: this.rangePicker,
      sortableTable: this.sortableTable,
    };
    
    document.addEventListener('date-select', this.dateSelectHandler);
  }

  createComponents() {
    this.createRangePicker();
    this.createSortableTable();
  }
  
  dateSelectHandler = ({ detail }) => {
    this.from = detail.from;
    this.to = detail.to;

    const url = new URL(this.sortableTable.url, BACKEND_URL);
    url.searchParams.set('createdAt_gte', this.from.toISOString());
    url.searchParams.set('createdAt_lte', this.to.toISOString());
    this.sortableTable.url = url;
        
    this.sortableTable.renderTable();
  }


  createRangePicker() {
    this.rangePicker = new RangePickerComponent({ 
      from: this.from, 
      to: this.to 
    });
  }

  createSortableTable() {
    this.sortableTable = new SortableTableComponent(header, {
      url: `/api/rest/orders?createdAt_gte=${this.from.toISOString()}&createdAt_lte=${this.to.toISOString()}`,
      data: [],
      isSortLocally: false,
      sorted: {
        id: header.find(item => item.sortable).id,
        order: 'asc'
      }
    });
  }

  createTemplate() {
    return (`
          <div class="sales full-height flex-column">
            <div class="content__top-panel">
              <h1 class="page-title">Продажи</h1>
              <div data-component="rangePicker"></div>
            </div>
            <div class="full-height flex-column">
              <div data-component="sortableTable"></div>
            </div>
          </div>
    `);
  }
}