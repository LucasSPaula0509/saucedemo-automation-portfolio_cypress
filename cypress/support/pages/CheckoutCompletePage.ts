import { Paths } from "../data/Paths";
import { CheckoutCompleteUi } from "../ui/CheckoutCompleteUi";
import { BasePage, type LoadablePage } from "./base/BasePage";

class CheckoutCompletePage extends BasePage implements LoadablePage {
  readonly path = Paths.CHECKOUT_COMPLETE;

  marker(): Cypress.Chainable<JQuery> {
    return this.element(CheckoutCompleteUi.COMPLETE_HEADER);
  }

  confirmationMessage(): Cypress.Chainable<string> {
    return this.textOf(CheckoutCompleteUi.COMPLETE_HEADER);
  }
}

export const checkoutCompletePage = new CheckoutCompletePage();
