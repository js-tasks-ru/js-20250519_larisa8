import BasePage from "./BasePage.js";
import ChartComponent from "../components/ChartComponent/index.js";
import RangePickerComponent from "../components/RangePickerComponent/index.js";
import SortableTableComponent from "../components/SortableTableComponent/index.js";
import TooltipComponent from "../components/TooltipComponent/index.js";
import header from '../constants/bestsellers-header.js';

export default class DashboardPage extends BasePage {  
  constructor(props) {
    super(props);

    const now = new Date();
    this.to = new Date();
    this.from = new Date(now.setMonth(now.getMonth() - 1));
    
    this.createComponents();

    this.componentMap = {
      rangePicker: this.rangePicker,
      ordersChart: this.ordersChart,
      salesChart: this.salesChart,
      customersChart: this.customersChart,
      sortableTable: this.sortableTable,
    };

    const tooltip = new TooltipComponent();
    tooltip.initialize();

    document.addEventListener('date-select', this.dateSelectHandler);
  }

  createComponents() {
    this.createRangePicker();
    this.createOrdersChartComponent();
    this.createSalesChart();
    this.createCustomersChart();
    this.createSortableTable();
  }

  dateSelectHandler = ({ detail }) => {
    this.from = detail.from;
    this.to = detail.to;

    this.ordersChart.update(this.from, this.to);
    this.salesChart.update(this.from, this.to);
    this.customersChart.update(this.from, this.to);

    this.sortableTable.from = this.from;
    this.sortableTable.to = this.to;
    this.sortableTable.renderTable();
  }

  createRangePicker() {
    this.rangePicker = new RangePickerComponent({ 
      from: this.from, 
      to: this.to 
    });
  }

  createOrdersChartComponent() {
    this.ordersChart = new ChartComponent({
      url: 'api/dashboard/orders',
      range: {
        from: this.from,
        to: this.to
      },
      label: 'Заказы',
      link: '/sales'
    });
  }

  createSalesChart() {
    this.salesChart = new ChartComponent({
      url: 'api/dashboard/sales',
      range: {
        from: this.from,
        to: this.to
      },
      label: 'Продажи',
      formatHeading: data => `$${data}`
    });
  }
  
  createCustomersChart() {
    this.customersChart = new ChartComponent({
      url: 'api/dashboard/customers',
      range: {
        from: this.from,
        to: this.to
      },
      label: 'Клиенты',
    });
  }

  createSortableTable() {
    this.sortableTable = new SortableTableComponent(header, {
      url: 'api/dashboard/bestsellers',
      data: [],
      isSortLocally: true,
      sorted: {
        id: header.find(item => item.sortable).id,
        order: 'asc'
      },
      from: this.from,
      to: this.to
    });
  }

  createTemplate() {
    return (`
        <div class="dashboard">
          <div class="content__top-panel">
            <h2 class="page-title">Панель управления</h2>
            <!-- RangePicker component -->
            <div data-component="rangePicker"></div>
          </div>
          <div class="dashboard__charts">
            <!-- column-chart components -->
            <div data-component="ordersChart" class="dashboard__chart_orders"></div>
            <div data-component="salesChart" class="dashboard__chart_sales"></div>
            <div data-component="customersChart" class="dashboard__chart_customers"></div>
          </div>

          <h3 class="block-title">Лидеры продаж</h3>

          <div data-component="sortableTable">
            <!-- sortable-table component -->
          </div>
        </div>
      `);
  }
}