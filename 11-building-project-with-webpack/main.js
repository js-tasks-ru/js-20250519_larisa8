import DashboardPage from "./pages/DashboardPage.js";
import CategoriesPage from "./pages/CategoriesPage.js";
import ProductsPage from "./pages/ProductsPage.js";
import ProductEditPage from "./pages/ProductEditPage.js";
import SalesPage from "./pages/SalesPage.js";
import NotFoundPage from "./pages/NotFoundPage.js";
import BrowserRouter from "./BrowserRouter.js";

const routes = [
  {
    title: 'Панель управления',
    pathname: '/',
    page: new DashboardPage()
  },
  {
    title: 'Категории товаров',
    pathname: '/categories',
    page: new CategoriesPage()
  },
  {
    title: 'Товары',
    pathname: '/products',
    page: new ProductsPage()
  },
  {
    title: 'Добавить',
    pathname: '/products/add',
    page: new ProductEditPage()
  },  
  {
    title: 'Редактировать',
    pathname: /\/products\/(.[\w-]+)/i,
    page: new ProductEditPage()
  },
  {
    title: 'Продажи',
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

const sidebarToggle = document.querySelector('.sidebar__toggler');
sidebarToggle.onclick = () => document.body.classList.toggle('is-collapsed-sidebar');

router.run();
