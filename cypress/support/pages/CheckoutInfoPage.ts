import type { Customer } from "../data/Customer";
import { Paths } from "../data/Paths";
import { CheckoutInfoUi } from "../ui/CheckoutInfoUi";
import { BasePage, type LoadablePage } from "./base/BasePage";

class CheckoutInfoPage extends BasePage implements LoadablePage {
  readonly path = Paths.CHECKOUT_STEP_ONE;

  marker(): Cypress.Chainable<JQuery> {
    return this.element(CheckoutInfoUi.FIRST_NAME);
  }

  fill(customer: Customer): void {
    this.type(CheckoutInfoUi.FIRST_NAME, customer.firstName);
    this.type(CheckoutInfoUi.LAST_NAME, customer.lastName);
    this.type(CheckoutInfoUi.POSTAL_CODE, customer.postalCode);
  }

  proceed(): void {
    this.click(CheckoutInfoUi.CONTINUE);
  }

  submit(customer: Customer): void {
    this.fill(customer);
    this.proceed();
  }
}

export const checkoutInfoPage = new CheckoutInfoPage();
