import { Paths } from "../data/Paths";
import type { ProductRow } from "../data/ProductRow";
import { ProductsUi } from "../ui/ProductsUi";
import { BasePage, type LoadablePage } from "./base/BasePage";

class ProductsPage extends BasePage implements LoadablePage {
  readonly path = Paths.INVENTORY;

  visit(): void {
    this.visitPath(Paths.INVENTORY);
  }

  marker(): Cypress.Chainable<JQuery> {
    return this.element(ProductsUi.INVENTORY_LIST);
  }

  products(): Cypress.Chainable<ProductRow[]> {
    return this.textsOf(ProductsUi.ITEM_NAMES).then((names) =>
      this.textsOf(ProductsUi.ITEM_PRICES).then((prices) =>
        names.map((name, index) => ({ name, price: prices[index] ?? "" })),
      ),
    );
  }

  productNames(): Cypress.Chainable<string[]> {
    return this.textsOf(ProductsUi.ITEM_NAMES);
  }

  sortBy(option: string): void {
    this.selectByVisibleText(ProductsUi.SORT_SELECT, option);
  }

  activeSort(): Cypress.Chainable<string> {
    return this.textOf(ProductsUi.ACTIVE_SORT);
  }

  addToCart(productName: string): void {
    this.click(ProductsUi.addToCartButton(productName));
  }

  addAllToCart(productNames: readonly string[]): void {
    productNames.forEach((productName) => {
      this.addToCart(productName);
    });
  }

  removeFromCart(productName: string): void {
    this.click(ProductsUi.removeButton(productName));
  }

  productButtonText(productName: string): Cypress.Chainable<string> {
    return this.textOf(ProductsUi.productButton(productName));
  }

  openDetail(productName: string): void {
    this.clickText(ProductsUi.productTitle(productName));
  }
}

export const productsPage = new ProductsPage();
