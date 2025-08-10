import ContentComponent from "../components/ContentComponent.js";
import BasePage from "./BasePage.js";

export default class CategoriesPage extends BasePage {
    componentMap = {
      before: new ContentComponent({ content: "before" }),
      content: new ContentComponent({ content: "Categories page" }),
      after: new ContentComponent({ content: "after" }),
    }

    createTemplate() {
      return (`
            <div>
                <h1>Categories</h1>
                <div data-component="before"></div>
                <div data-component="content"></div>
                <div data-component="after"></div>
            </div>
        `);
    }
}