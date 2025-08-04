import ContentComponent from "../components/ContentComponent.js";
import BasePage from "./BasePage.js";

export default class NotFoundPage extends BasePage {
    components = [
      new ContentComponent({ content: "Not found page" })
    ];
}