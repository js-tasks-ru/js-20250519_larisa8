import BasePage from './BasePage.js';
import AccordionListComponent from '../components/AccordionListComponent/index.js';
import { BACKEND_URL } from '../constants/index.js';
import fetchJson from '../utils/fetch-json.js';

export default class CategoriesPage extends BasePage {
  constructor(props) {
    super(props);

    this.categories = [];
    this.getCategories();
    
    this.accordionListComponent = new AccordionListComponent({
      items: this.categories
    });

    this.componentMap = {
      accordionListComponent: this.accordionListComponent
    };
  }

  async getCategories() {    
    const url = new URL('/api/rest/categories', BACKEND_URL);
    url.searchParams.set('_sort', 'weight');
    url.searchParams.set('_refs', 'subcategory');

    try {
      this.categories = await fetchJson(url);

      this.accordionListComponent.items = this.categories;

      if (this.accordionListComponent.element) {
        this.accordionListComponent.render(this.accordionListComponent.element);
      }

    } catch (err) {
      console.error(err);
    }
  }

  createTemplate() {
    return (`
            <div class="categories">
              <div class="content__top-panel">
                <h1 class="page-title">Категории товаров</h1>
              </div>
              <p>Подкатегории можно перетаскивать, меняя их порядок внутри своей категории.</p>
              <div data-component="accordionListComponent"></div>
            </div>
        `);
  }
}