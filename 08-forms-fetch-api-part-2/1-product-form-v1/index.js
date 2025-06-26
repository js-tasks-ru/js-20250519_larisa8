import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const IMGUR_URL = 'https://api.imgur.com';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  subElements = {};

  constructor (productId) {
    this.productId = productId;
    this.isEdit = this.productId;
    this.fileElements = [];
    this.setProduct();
  }

  setProduct (data = {
    title: '',
    description: '',
    images: [],
    subcategory: '',
    price: 100,
    discount: 0,
    quantity: 1,
    status: 1
  }) {
    this.product = {
      ...data
    };
  }

  async render () {
    await this.getCategories();
    await this.getProductById();
    this.element = this.createElement(this.createTemplate());
    this.selectSubElements();
    this.createListeners();
    return this.element;
  }

  async getCategories() {
    try {
      const url = new URL('/api/rest/categories', BACKEND_URL);
      url.searchParams.set('_sort', 'weight');
      url.searchParams.set('_refs', 'subcategory');

      this.categories = await fetchJson(url);
    } catch (err) {
      console.error(err);
    }
  }

  async getProductById() {
    if (!this.isEdit) {
      return;
    }

    try {
      const url = new URL('api/rest/products', BACKEND_URL);
      url.searchParams.set('id', this.productId);

      const [product] = await fetchJson(url);
      this.setProduct(product);
    } catch (err) {
      console.error(err);
    }
  }

  createElement(template) {
    const element = document.createElement('div');
    element.innerHTML = template;
    return element.firstElementChild;
  }

  createTemplate() {
    const { title, description, price, discount, quantity } = this.product;
    return `
      <div class="product-form">
        <form data-element="productForm" class="form-grid">
          <div class="form-group form-group__half_left">
            <fieldset>
              <label class="form-label">Название товара</label>
              <input id="title" required="" type="text" name="title" class="form-control" placeholder="Название товара" value="${escapeHtml(title)}">
            </fieldset>
          </div>
          <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea id="description" required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара">${escapeHtml(description)}</textarea>
          </div>
          <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
              <div data-element="imageListContainer">
                ${this.createImageListTemplate()}
              </div>
              <button type="button" name="uploadImageButton" class="button-primary-outline"><span>Загрузить</span></button>
          </div>
          <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select id="subcategory" class="form-control" name="subcategory">
              ${this.createCategoryOptionsTemplate()}
            </select>
          </div>
          <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
              <label class="form-label">Цена ($)</label>
              <input id="price" required="" type="number" name="price" class="form-control" placeholder="100" value="${escapeHtml(price.toString())}">
            </fieldset>
            <fieldset>
              <label class="form-label">Скидка ($)</label>
              <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0" value="${escapeHtml(discount.toString())}">
            </fieldset>
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1" value="${escapeHtml(quantity.toString())}">
          </div>
          <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select id="status" class="form-control" name="status">
              ${this.createStatusOptionsTemplate()}
            </select>
          </div>
          <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
              ${this.getButtonText()}
            </button>
          </div>
        </form>
      </div>
    `;
  }

  createImageListTemplate() {
    const imageList = this.product.images.map(({ url, source }, index) => `
      <li class="products-edit__imagelist-item sortable-list__item" style="">
        <input type="hidden" name="url" value="${escapeHtml(url)}">
        <input type="hidden" name="source" value="${escapeHtml(source)}">
        <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(url)}">
          <span>${escapeHtml(source)}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-index=${index} data-delete-handle="" alt="delete">
        </button>
      </li>
    `);
    
    return `
      <ul class="sortable-list">
      ${imageList.join('')}
      </ul>
    `;
  }

  createCategoryOptionsTemplate() {
    this.categoriesMap = new Map();
    this.categories.map((category) => category.subcategories.map((subcategory) => this.categoriesMap.set(subcategory.id, `${category.title} > ${subcategory.title}`, subcategory.id)));
    return this.getOptionsTemplate(Array.from(this.categoriesMap), this.product.subcategory);
  }

  getOptionsTemplate(options, selected) {
    return options.map(([key, value]) => {
      const isSelected = key == selected ? 'selected' : '';
      return `<option ${isSelected} value="${escapeHtml(key)}">${escapeHtml(value)}</option>`;
    }).join('');
  }

  createStatusOptionsTemplate() {
    const statuses = {
      '0': 'Неактивен',
      '1': 'Активен'
    };
    return this.getOptionsTemplate(Object.entries(statuses), this.product.status);
  }

  getButtonText() {
    return this.isEdit ? 'Сохранить товар' : 'Добавить товар';
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createListeners() {
    this.subElements.productForm.onsubmit = this.handleSubmit;
    this.subElements.productForm.elements.uploadImageButton.onclick = this.handleUploadImageButtonClick;
    this.subElements.imageListContainer.onclick = this.handleImageListContainerClick;
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.save();
  }

  async save() {
    try {
      const formData = new FormData(this.subElements.productForm);

      if (this.isEdit) {
        formData.append('productId', this.productId);
      }

      await fetchJson(new URL('api/rest/products', BACKEND_URL), {
        method: this.isEdit ? 'PATCH' : 'PUT',
        body: formData
      });

      const data = Object.fromEntries(formData.entries());
      this.setProduct(data);
    } catch (err) {
      console.error(err);
    } finally {
      this.dispatchProductEvent();
    }
  }

  dispatchProductEvent() {
    const eventType = this.isEdit ? 'updated' : 'saved';
    const event = new CustomEvent(`product-${eventType}`, {
      detail: { product: this.product }
    });
    this.element.dispatchEvent(event);
  }

  handleUploadImageButtonClick = () => {
    const element = this.createElement('<input type="file" accept="image/*" hidden>');
    element.onchange = this.handleUploadImageInputChange;
    this.fileElements.push(element);
    document.body.append(element);
    element.click();
  }

  handleUploadImageInputChange = async () => {
    try {
      const formData = new FormData();
      const lastIndex = this.fileElements.length - 1;

      const file = this.fileElements[lastIndex].files[0];
      formData.append("image", file, file.name);
      formData.append("type", "image");

      const { data } = await fetchJson(new URL('3/image', IMGUR_URL), {
        method: 'POST',
        headers: {
          'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
        },
        body: formData,
        redirect: 'follow'
      });

      const url = new URL(data.link);

      this.product.images.push({
        source: url.pathname.slice(1),
        url: data.link
      });

      this.subElements.imageListContainer.innerHTML = this.createImageListTemplate();
    } catch (error) {
      console.error(error);
    } 
  }

  handleImageListContainerClick = (event) => {
    const dataset = event.target.dataset;

    if (dataset.deleteHandle !== '') {
      return;
    }

    this.product.images.splice(dataset.index, 1);
    this.subElements.imageListContainer.innerHTML = this.createImageListTemplate();
  }

  remove() {
    this.element.remove();
  }

  removeFileElements() {
    this.fileElements.forEach((element) => element.remove());
  }

  destroyListeners() {
    this.subElements.productForm.onsubmit = null;
    this.subElements.productForm.elements.uploadImageButton.onclick = null;
    this.subElements.imageListContainer.onclick = null;
  }

  destroy() {
    this.destroyListeners();
    this.remove();
    this.removeFileElements();
  }
}
