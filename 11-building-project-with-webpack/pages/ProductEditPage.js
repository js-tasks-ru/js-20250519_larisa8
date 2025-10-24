import BasePage from "./BasePage.js";
import ProductForm from "../components/ProductFormComponent/index.js";

export default class ProductEditPage extends BasePage {
  constructor(props) {
    super(props);

    this.createComponents();

    this.componentMap = {
      productForm: this.productForm
    };
  }

  createComponents() {
    this.createProductForm();
  }

  createProductForm() {    
    this.productForm = new ProductForm();
  }

  createTemplate() {
    return (`
        <div class="products-edit">
          <div class="content__top-panel">
            <h1 class="page-title">
              <a href="/products" class="link">Товары</a> / ${this.title}
            </h1>
          </div>
          <div data-component="productForm" class="content-box"></div>
        </div>
      `);
  }
}