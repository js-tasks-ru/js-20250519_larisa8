export default class BrowserRouter {
    routes = [];

    constructor(container, routes) {
      this.container = container;
      this.routes = routes;
    }

    extractRouteParams(route, pathname) {
      if (route.pathname instanceof RegExp) {
        const result = pathname.match(route.pathname);

        if (result) {
          return result.slice(1);
        }
      }
      return [];
    }

    processPathname(pathname) {
      for (const route of this.routes) {
        const shouldUseRoute = route.pathname instanceof RegExp
          ? route.pathname.test(pathname)
          : route.pathname === pathname;

        if (shouldUseRoute) {
          if (this.lastRoute) {
            this.lastRoute.page.destroy();
          }
          const routeParams = this.extractRouteParams(route, pathname);
          route.page.render(this.container, routeParams, route.title);
          this.lastRoute = route;
          history.pushState(null, '', pathname);
          return;
        }
      }
    }

    handleClickWindow = (e) => {
      const linkElement = e.target.closest('a');

      if (!linkElement) {
        return;
      }

      e.preventDefault();

      const url = new URL(linkElement.href);

      this.processPathname(url.pathname);
    }

    run() {
      const pathname = window.location.pathname;

      this.processPathname(pathname);

      document.addEventListener('click', this.handleClickWindow);
    }

    destroy() {
      document.removeEventListener('click', this.handleClickWindow);
    }
}
