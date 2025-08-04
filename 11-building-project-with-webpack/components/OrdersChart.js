import ColumnChart from "../../07-async-code-fetch-api-part-1/1-column-chart/index.js";
import BaseComponent from "./BaseComponent.js";

export default class OrdersChartComponent extends BaseComponent {
  constructor() {
    super();
    const now = new Date();
    this.to = new Date();
    this.from = new Date(now.setMonth(now.getMonth() - 1));
  }

  createTemplate() {
    this.rangePicker = new ColumnChart({
      url: 'api/dashboard/orders',
      range: {
        from: this.from,
        to: this.to
      },
      label: 'orders',
      link: '#'
    });

    return this.rangePicker.element.outerHTML;
  }
}