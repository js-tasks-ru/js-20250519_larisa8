import ContentComponent from "../components/ContentComponent.js";
import BasePage from "./BasePage.js";

export default class SalesPage extends BasePage {
    components = [
      new ContentComponent({ content: "content before" }),
      new ContentComponent({ content: "Sales page" }),
      new ContentComponent({ content: "content after" }),
    ];
}