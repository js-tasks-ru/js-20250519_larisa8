import ContentComponent from "../components/ContentComponent.js";
import BasePage from "./BasePage.js";

export default class ProductsPage extends BasePage {
    components = [
      new ContentComponent({ content: "content before" }),
      new ContentComponent({ content: "Products page" }),
      new ContentComponent({ content: "content after" }),
    ];
}