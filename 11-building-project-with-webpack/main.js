import DashboardPage from "./pages-map/DashboardPage.js";
import CategoriesPage from "./pages-map/CategoriesPage.js";
import ProductsPage from "./pages-map/ProductsPage.js";
import ProductEditPage from "./pages-map/ProductEditPage.js";
import SalesPage from "./pages-map/SalesPage.js";
import NotFoundPage from "./pages-map/NotFoundPage.js";
import BrowserRouter from "./BrowserRouter.js";

const routes = [
  {
    pathname: '/',
    page: new DashboardPage()
  },
  {
    pathname: '/categories',
    page: new CategoriesPage()
  },
  {
    pathname: '/products',
    page: new ProductsPage()
  },
  {
    pathname: '/products/add',
    page: new ProductEditPage()
  },  
  {
    pathname: '/sales',
    page: new SalesPage()
  },
  {
    pathname: /.*/,
    page: new NotFoundPage()
  }
];

const containerElement = document.getElementById('content');
const router = new BrowserRouter(containerElement, routes);

router.run();
