import ContentComponent from "../components/ContentComponent.js";
import BasePage from "./BasePage.js";

export default class CategoriesPage extends BasePage {
    components = [
      new ContentComponent({ content: "content before" }),
      new ContentComponent({ content: "Categories page" }),
      new ContentComponent({ content: "content after" }),
    ];
}