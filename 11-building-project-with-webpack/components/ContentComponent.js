import BaseComponent from "./BaseComponent.js";

export default class ContentComponent extends BaseComponent {
  createTemplate() {
    return `<div>${this.props.content}</div>`;
  }
}