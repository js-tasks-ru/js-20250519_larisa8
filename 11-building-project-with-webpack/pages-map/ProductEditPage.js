import ContentComponent from "../components/ContentComponent.js";
import BasePage from "./BasePage.js";

export default class ProductEditPage extends BasePage {
    componentMap = {
      before: new ContentComponent({ content: "before" }),
      content: new ContentComponent({ content: "Product edit page" }),
      after: new ContentComponent({ content: "after" }),
    }

    createTemplate() {
      return (`
            <div>
                <h1>Product edit</h1>
                <div data-component="before"></div>
                <div data-component="content"></div>
                <div data-component="after"></div>
            </div>
        `);
    }
}