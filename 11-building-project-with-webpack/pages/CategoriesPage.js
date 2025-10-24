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

    this.createListeners();
  }

  createListeners() {
    document.addEventListener('change-order', this.changeOrder);
  }

  removeListeners() {
    document.removeEventListener('change-order', this.changeOrder);
  }

  changeOrder = async ({ detail }) => {
    const categoriesIndex = this.categories.findIndex((item) => item.id === detail.id);

    if (categoriesIndex < 0) {
      return;
    }

    const newPosition = Array.from(detail.items).indexOf(detail.element);
    const oldPosition = this.categories[categoriesIndex].subcategories.findIndex((item) => item.id === detail.element.dataset.id);

    const oldElement = this.categories[categoriesIndex].subcategories[oldPosition];
    const newElement = this.categories[categoriesIndex].subcategories[newPosition];

    this.categories[categoriesIndex].subcategories[oldPosition] = newElement;
    this.categories[categoriesIndex].subcategories[newPosition] = oldElement;

    const url = new URL('/api/rest/subcategories', BACKEND_URL);

    try {
      const data = await fetchJson(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.categories)
      });
    } catch (err) {
      console.error(err);
    }
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

  destroy() {
    super.destroy();
    this.removeListeners();
  }
}