export default class BasePage {
    components = [];

    render(container, routeParams) {
      for (const component of this.components) {
        component.render(container, routeParams);
      }
    }

    destroy() {
      for (const component of this.components) {
        component.destroy();
      }
    }
}

