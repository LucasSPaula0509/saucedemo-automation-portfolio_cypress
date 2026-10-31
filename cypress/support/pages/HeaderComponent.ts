import { HeaderUi } from "../ui/HeaderUi";
import { BasePage } from "./base/BasePage";

class HeaderComponent extends BasePage {
  cartBadgeText(): Cypress.Chainable<string> {
    return this.textOf(HeaderUi.CART_BADGE);
  }

  /** Contador do carrinho; o step valida presença ou ausência com retry. */
  cartBadge(): Cypress.Chainable<JQuery> {
    return this.element(HeaderUi.CART_BADGE);
  }

  openCart(): void {
    this.click(HeaderUi.CART_LINK);
  }

  pageTitle(): Cypress.Chainable<string> {
    return this.textOf(HeaderUi.PAGE_TITLE);
  }
}

export const header = new HeaderComponent();
