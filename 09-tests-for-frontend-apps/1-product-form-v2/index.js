import SortableList from '../2-sortable-list/index.js';
import ProductFormV1 from '../../08-forms-fetch-api-part-2/1-product-form-v1/index.js';
import escapeHtml from './utils/escape-html.js';

export default class ProductForm extends ProductFormV1 {
  constructor (productId) {
    super(productId);
    this.productId = productId;
    this.sortableList = null;
  }

  createListeners() {
    super.createListeners();
    this.subElements.imageListContainer.addEventListener('pointerup', this.handlePointerUp); 
  }

  handlePointerUp = () => {
    const formData = new FormData(this.subElements.productForm);
    this.setProduct({
      ...this.convertFormDataToProductData(formData)
    });
  }

  getImageList() {
    return this.product.images.map(({ url, source }, index) => {
      const element = document.createElement('li');
      
      element.className = 'products-edit__imagelist-item';
      element.innerHTML = `
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
      `;

      return element;
    });
  }

  createImageListTemplate() {
    if (this.sortableList) {
      this.sortableList.destroy();
    }

    this.sortableList = new SortableList({
      items: this.getImageList()
    });

    return this.sortableList.element.outerHTML;
  }

  destroyListeners() {
    super.destroyListeners();
    this.subElements.imageListContainer.removeEventListener('pointerup', this.handlePointerUp); 
  }
}
