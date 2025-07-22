import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

export default class Page {
  subElements = {};

  constructor() {
    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createTemplate() {
    return `
      <div class="dashboard">
        <div class="content__top-panel">
          <h2 class="page-title">Dashboard</h2>
          <!-- RangePicker component -->
          <div data-element="rangePicker"></div>
        </div>
        <div data-element="chartsRoot" class="dashboard__charts">
          <!-- column-chart components -->
          <div data-element="ordersChart" class="dashboard__chart_orders"></div>
          <div data-element="salesChart" class="dashboard__chart_sales"></div>
          <div data-element="customersChart" class="dashboard__chart_customers"></div>
        </div>

        <h3 class="block-title">Best sellers</h3>

        <div data-element="sortableTable">
          <!-- sortable-table component -->
        </div>
      </div>
    `;
  }

  createRangePicker() {
    this.rangePicker = new RangePicker({
      from: this.from,
      to: this.to
    });

    this.rangePicker.element.addEventListener('date-select', this.dateSelectHandler);
  }

  dateSelectHandler = ({ detail }) => {
    this.from = detail.from;
    this.to = detail.to;
    this.ordersChart.update(this.from, this.to);
    this.salesChart.update(this.from, this.to);
    this.customersChart.update(this.from, this.to);
    this.updateTable();
  }

  async updateTable() {
    const data = await this.sortableTable.loadData(this.sortableTable.sorted.id, this.sortableTable.sorted.order);
    this.sortableTable.renderRows(data);
  }

  createOrdersChart() {
    this.ordersChart = new ColumnChart({
      url: 'api/dashboard/orders',
      range: {
        from: this.from,
        to: this.to
      },
      label: 'orders',
      link: '#'
    });
  }

  createSalesChart() {
    this.salesChart = new ColumnChart({
      url: 'api/dashboard/sales',
      range: {
        from: this.from,
        to: this.to
      },
      label: 'sales',
      formatHeading: data => `$${data}`
    });
  }

  createCustomersChart() {
    this.customersChart = new ColumnChart({
      url: 'api/dashboard/customers',
      range: {
        from: this.from,
        to: this.to
      },
      label: 'customers',
    });
  }

  createSortableTable() {
    this.sortableTable = new SortableTable(header, {
      url: 'api/dashboard/bestsellers',
      data: [],
      sorted: {
        id: header.find(item => item.sortable).id,
        order: 'asc'
      }
    });
  }

  async render() {
    const now = new Date();
    this.to = new Date();
    this.from = new Date(now.setMonth(now.getMonth() - 1));

    this.createRangePicker();
    this.createOrdersChart();
    this.createSalesChart();
    this.createCustomersChart();
    this.createSortableTable();

    this.subElements.rangePicker.append(this.rangePicker.element);
    this.subElements.ordersChart.append(this.ordersChart.element);
    this.subElements.salesChart.append(this.salesChart.element);
    this.subElements.customersChart.append(this.customersChart.element);
    this.subElements.sortableTable.append(this.sortableTable.element);
    
    return this.element;
  }

  destroy() {
    this.remove();
  }

  remove() {
    this.element.remove();
  }
}
