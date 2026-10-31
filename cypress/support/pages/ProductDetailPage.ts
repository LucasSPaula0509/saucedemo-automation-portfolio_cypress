import { Paths } from "../data/Paths";
import { ProductDetailUi } from "../ui/ProductDetailUi";
import { BasePage, type LoadablePage } from "./base/BasePage";

class ProductDetailPage extends BasePage implements LoadablePage {
  readonly path = Paths.PRODUCT_DETAIL;

  marker(): Cypress.Chainable<JQuery> {
    return this.element(ProductDetailUi.CONTAINER);
  }

  name(): Cypress.Chainable<string> {
    return this.textOf(ProductDetailUi.NAME);
  }

  price(): Cypress.Chainable<string> {
    return this.textOf(ProductDetailUi.PRICE);
  }

  addToCart(): void {
    this.click(ProductDetailUi.ADD_TO_CART);
  }

  backToProducts(): void {
    this.click(ProductDetailUi.BACK_TO_PRODUCTS);
  }
}

export const productDetailPage = new ProductDetailPage();
