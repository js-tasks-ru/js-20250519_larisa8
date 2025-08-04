import ContentComponent from "../components/ContentComponent.js";
import BasePage from "./BasePage.js";

export default class ProductEditPage extends BasePage {
    components = [
      new ContentComponent({ content: "content before" }),
      new ContentComponent({ content: "ProductEdit page" }),
      new ContentComponent({ content: "content after" }),
    ];
}