import BasePage from "./BasePage.js";

export default class NotFoundPage extends BasePage {
  createTemplate() {
    return (`
            <div>
                <h1>Ops</h1>
                <div>Not found page</div>
            </div>
        `);
  }
}