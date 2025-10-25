import SortableList from '../SortableListComponent/index.js';
import ProductFormV1 from './ProductFormV1.js';
import escapeHtml from '../../utils/escape-html.js';


export default class ProductForm extends ProductFormV1 {
  constructor (props = { productId: null }) {
    super(props);
    this.productId = props.productId;
    this.sortableList = null;
  }

  createListeners() {
    super.createListeners();
    this.subElements.imageListContainer.addEventListener('pointerup', this.handlePointerUp); 
  }

  handlePointerUp = () => {
    const formData = new FormData(this.subElements.productForm);
    this.setProduct(this.convertFormDataToProductData(formData));
  }

  getImageList() {
    return this.product.images.map(({ url, source }, index) => {
      const element = document.createElement('li');
      
      element.className = 'products-edit__imagelist-item';
      element.innerHTML = `
        <input type="hidden" name="url" value="${escapeHtml(url)}">
        <input type="hidden" name="source" value="${escapeHtml(source)}">
        <span>
          <img src="/assets/icons/icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(url)}">
          <span>${escapeHtml(source)}</span>
        </span>
        <button type="button">
          <img src="/assets/icons/icon-trash.svg" data-index=${index} data-delete-handle="" alt="delete">
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

    this.subElements.imageListContainer.append(this.sortableList.element);
  }

  destroyListeners() {
    super.destroyListeners();
    this.subElements.imageListContainer.removeEventListener('pointerup', this.handlePointerUp); 
  }
}
