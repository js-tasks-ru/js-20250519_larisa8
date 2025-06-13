import fetchJson from './utils/fetch-json.js';
import ColumnChartV1 from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart extends ColumnChartV1 {
  subElements = {};

  constructor ({
    url = '',
    range: {
      from = '',
      to = ''
    } = {},
    label = '',
    link = '',
    formatHeading = (value) => value
  } = {}) {
    super({
      label,
      link,
      formatHeading
    });
    this.url = url;
    this.from = from;
    this.to = to;
    this.loading = false;

    this.selectSubElements();
    this.update(from, to);
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  getUrl () {
    const url = new URL(BACKEND_URL);
    url.pathname = this.url;
    url.searchParams.set('from', this.from);
    url.searchParams.set('to', this.to);

    return url.href;
  }

  updateChartClasses () {
    if (this.loading) {
      this.element.classList.add('column-chart_loading');
    } else {
      this.element.classList.remove('column-chart_loading');
    }
  }

  updateLoading (state) {
    this.loading = state;
    this.updateChartClasses();
  }

  calculateValue () {
    return this.data.reduce((acc, current) => acc + current, 0);
  }

  updateHeader () {
    this.value = this.calculateValue();
    this.subElements.header.innerHTML = this.value;
  }

  async update(from, to) {
    let data = [];
    
    this.from = from.toISOString();
    this.to = to.toISOString();

    try {
      this.updateLoading(true);

      data = await fetchJson(this.getUrl());

      super.update(Object.values(data));
      this.updateHeader();

      this.updateLoading(false);
    } catch (err) {
      console.error(err);
    }

    return data;
  }
}
