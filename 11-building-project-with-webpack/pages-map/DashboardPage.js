import ContentComponent from "../components/ContentComponent.js";
import BasePage from "./BasePage.js";
import OrdersChartComponent from "../components/OrdersChart.js";
import CounterComponent from "../components/CounterComponent.js";
import RangePickerComponent from "../components/RangePickerComponent.js";

export default class DashboardPage extends BasePage {  
    componentMap = {
      rangePicker: new RangePickerComponent({ from: new Date(), to: new Date() }),
      ordersChart: new OrdersChartComponent(),
      salesChart: new ContentComponent({ content: "salesChart" }),
      customersChart: new ContentComponent({ content: "customersChart" }),
      sortableTable: new ContentComponent({ content: "sortableTable" }),
    }


    createTemplate() {
      return (`
          <div class="dashboard">
            <div class="content__top-panel">
              <h2 class="page-title">Dashboard</h2>
              <!-- RangePicker component -->
              <div data-component="rangePicker"></div>
            </div>
            <div class="dashboard__charts">
              <!-- column-chart components -->
              <div data-component="ordersChart" class="dashboard__chart_orders"></div>
              <div data-component="salesChart" class="dashboard__chart_sales"></div>
              <div data-component="customersChart" class="dashboard__chart_customers"></div>
            </div>

            <h3 class="block-title">Best sellers</h3>

            <div data-component="sortableTable">
              <!-- sortable-table component -->
            </div>
          </div>
        `);
    }
}