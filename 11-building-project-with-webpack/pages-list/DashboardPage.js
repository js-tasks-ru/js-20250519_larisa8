import ContentComponent from "../components/ContentComponent.js";
import BasePage from "./BasePage.js";

export default class DashboardPage extends BasePage {
    components = [
      new ContentComponent({ content: "content before" }),
      new ContentComponent({ content: "Dashboard page" }),
      new ContentComponent({ content: "content after" }),
    ];
}