export default class NotificationMessage {
  static lastShown;

  constructor(message, {
    duration = 1000,
    type = 'success'
  } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;
    this.element = this.createElement(this.createTemplate());
  }

  getDurationStyleValue() {
    return `${Math.floor(this.duration / 1000)}s`;
  }

  createTemplate() {
    return `
    <div class="notification ${this.type}" style="--value:${this.getDurationStyleValue()}">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>
    </div>
    `;
  }

  createElement(template) {
    const element = document.createElement('div');

    element.innerHTML = template;
    
    return element.firstElementChild;
  }

  show(target) {
    if (!target) {
      target = document.body;
    }

    if (NotificationMessage.lastShown) {
      NotificationMessage.lastShown.hide();
    }
    
    NotificationMessage.lastShown = this;

    target.append(this.element);
    
    this.timerId = setTimeout(() => { 
      this.hide();
    }, this.duration);
  }

  hide() {
    this.destroy();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    clearTimeout(this.timerId);
  }
}
