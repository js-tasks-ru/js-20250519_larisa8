import BaseComponent from "../BaseComponent.js";

export default class RangePickerComponent extends BaseComponent {
  subElements = {};
  weekDays = [];

  constructor(props) {
    super(props);
    this.from = props.from;
    this.to = props.to;
    this.nextMonth = this.to.getMonth();
    this.currentMonth = this.nextMonth - 1;
    this.isSelection = false;
    this.year = this.to.getFullYear();
    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();
    this.createListeners();
    this.getWeekDays();
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  formatDate(date) {
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createListeners() {
    this.subElements.selector.addEventListener("click", this.handleSelectorClick, true);
    this.subElements.input.addEventListener("click", this.handleInputClick);
    document.addEventListener("click", this.handleOutsideClick, true);
  }

  handleSelectorClick = (event) => {
    const rangePickerCell = event.target.closest('.rangepicker__cell');

    if (!rangePickerCell) {
      return;
    }
    
    this.isSelection = !this.isSelection;

    if (this.isSelection) {
      this.resetSelection();

      rangePickerCell.classList.add('rangepicker__selected-from');
      
      this.from = new Date(rangePickerCell.dataset.value);
      this.to = null;
      this.year = this.from.getFullYear();
    } else {
      rangePickerCell.classList.add('rangepicker__selected-to');

      this.to = new Date(rangePickerCell.dataset.value);
      this.year = this.to.getFullYear();
      
      this.subElements.from.textContent = this.formatDate(this.from);
      this.subElements.to.textContent = this.formatDate(this.to);

      this.dispatchEvent();
      this.closeRangePicker();
    }
  }

  closeRangePicker() {
    this.isOpen = false;
    this.element.classList.remove('rangepicker_open');
  }

  handleOutsideClick = (event) => {
    const rangePickerElement = event.target.closest('.rangepicker');
    if (rangePickerElement) {
      return;
    }
    this.closeRangePicker();
  }

  addControlsHandlers() {
    const rigtControl = this.subElements.selector.querySelector('.rangepicker__selector-control-right');
    const leftControl = this.subElements.selector.querySelector('.rangepicker__selector-control-left');
    rigtControl.addEventListener("click", this.handleRightControlClick);
    leftControl.addEventListener("click", this.handleLeftControlClick);
  }

  handleInputClick = () => {
    this.isOpen = !this.isOpen;
    this.element.classList.toggle('rangepicker_open');
    this.updateCalendar();
  }

  handleLeftControlClick = () => {
    this.currentMonth -= 1;
    this.nextMonth -= 1;

    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.nextMonth = 0;
    }

    if (this.nextMonth < 0) {
      this.nextMonth = 11;
      this.currentMonth = this.nextMonth - 1;
      this.year -= 1;
    }

    this.updateCalendar();
  }

  handleRightControlClick = () => {
    this.currentMonth += 1;
    this.nextMonth += 1;

    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.nextMonth = this.currentMonth + 1;
    }

    if (this.nextMonth > 11) {
      this.currentMonth = 11;
      this.nextMonth = 0;
      this.year += 1;
    }

    this.updateCalendar();
  }

  updateCalendar() {
    this.subElements.selector.innerHTML = this.createSelectorTemplate();
    this.addControlsHandlers();
  }

  getDayStartFromStyle(date) {
    if (date.getDate() > 1) {
      return '';
    }

    const weekDayNumber = date.getDay();
    return `style="--start-from: ${weekDayNumber}"`;
  }

  createCalendarDaysTemplate(monthNumber, year) {
    const daysCount = this.getDaysInMonth(monthNumber, year);
    let dateValue = new Date(year, monthNumber, 1);
    let daysTemplate = '';

    for (let i = 1; i < daysCount + 1; i++) {
      dateValue = new Date(year, monthNumber, i);
      daysTemplate += `<button type="button" class="${this.getRangePickerCellClass(dateValue)}" data-value="${dateValue.toISOString()}" ${this.getDayStartFromStyle(dateValue)}>${i}</button>`;
    }

    return `
      <div class="rangepicker__date-grid">
        ${daysTemplate}
      </div>
    `;
  }

  getRangePickerCellClass(currentDate) {
    const cellClass = 'rangepicker__cell';
    const date = currentDate.toISOString();
    const from = this.from.toISOString();
    const to = this.to?.toISOString();

    if (date === from) {
      return `${cellClass} rangepicker__selected-from`;
    } 

    if (date === to) {
      return `${cellClass} rangepicker__selected-to`;
    }

    if (date > from && date < to) {
      return `${cellClass} rangepicker__selected-between`;
    }

    return cellClass;
  }

  resetSelection() {
    const buttons = this.subElements.selector.querySelectorAll('button');
    for (const button of buttons) {
      button.classList.remove('rangepicker__selected-from');
      button.classList.remove('rangepicker__selected-between');
      button.classList.remove('rangepicker__selected-to');
    }
  }

  getWeekDays() {
    const today = new Date();
    const dateValue = today.getDate() - today.getDay();

    let firstDay = new Date(today.setDate(dateValue + 1));

    for (let i = 0; i < 7; i++) {
      const tomorrow = new Date();
      tomorrow.setDate(firstDay.getDate() + i);
      this.weekDays.push(tomorrow.toLocaleString('ru-RU', { weekday: 'short' }));
    }
  }

  getWeekDaysTemplate() {
    return this.weekDays.map((day) => `
      <div>${day}</div>
    `).join('');
  }

  createCalendarTemplate(monthNumber, year) {
    const monthName = this.getMonthName(monthNumber);
    
    return `
      <div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime="${monthName}">${monthName}</time>
        </div>
        <div class="rangepicker__day-of-week">
          ${this.getWeekDaysTemplate()}
        </div>
        ${this.createCalendarDaysTemplate(monthNumber, year)}
      </div>
    `;
  }

  getDaysInMonth (month, year) {
    return new Date(parseInt(year), parseInt(month) + 1, 0).getDate();
  }

  getDaysInWeek () {
    return date.toLocaleString('ru-RU', {
      weekday: 'long',
    });
  }

  getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber);

    return date.toLocaleString('ru-RU', {
      month: 'long',
    });
  }

  createSelectorTemplate() {
    let currentYear = this.year;
    let nextYear = this.year;

    if (this.currentMonth == 11 && this.nextMonth == 0) {
      currentYear = this.year - 1;
      nextYear = this.year;
    }

    return `
      <div class="rangepicker__selector-arrow"></div>
        <div class="rangepicker__selector-control-left"></div>
        <div class="rangepicker__selector-control-right"></div>
        ${this.createCalendarTemplate(this.currentMonth, currentYear)}
        ${this.createCalendarTemplate(this.nextMonth, nextYear)}
      </div>
    `;
  }

  createTemplate() {
    return `
      <div class="rangepicker">
        <div class="rangepicker__input" data-element="input">
          <span data-element="from">${this.formatDate(this.from)}</span> -
          <span data-element="to">${this.formatDate(this.to)}</span>
        </div>
        <div class="rangepicker__selector" data-element="selector"></div>
      </div>
    `;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    super.destroy();
    this.destroyListeners();
    this.remove();
  }

  async render(...args) {
    super.render(...args);
    this.createListeners();
  }

  destroyListeners() {
    this.subElements.selector.removeEventListener("click", this.handleSelectorClick, true);
    this.subElements.input.removeEventListener("click", this.handleInputClick);
    document.removeEventListener("click", this.handleOutsideClick, true);
  }

  dispatchEvent() {
    document.dispatchEvent(new CustomEvent('date-select', {
      bubbles: true,
      detail: {
        from: this.from,
        to: this.to
      }
    }));
  }
}